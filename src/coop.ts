import type { RealtimeClient, RealtimeValue } from '@photonengine/realtime-core';
import type { Save } from './campaign';
import { applyPatch, makePatch, packPose, readPose, readWorldPart, serializeWorld } from './coop-wire';
import type { Pose } from './coop-wire';

const events={hello:1,world:2,ack:3,pose:4,action:5,closing:6,result:7} as const;
const MAX_CHUNKS_PER_PEER=2;
const roomOptions={isVisible:false,maxPlayers:4,emptyRoomTtlMs:0,playerTtlMs:0};
type World = ReturnType<typeof serializeWorld>;
type WorldVersion = { revision:number; blocks:World };
type Send = WorldVersion & { chunks:Uint8Array[]; sent:number; at:number };
type Peer = { confirmed?:WorldVersion; send?:Send };
type Receive = { revision:number; total:number; parts:Uint8Array[] };
type Callbacks = {
  capture:()=>Save; checkpoint:(save:Save)=>void; ended:(message:string)=>void;
  action:(actor:number,pose:Pose,value:unknown)=>string|undefined; departed:(actor:number)=>void; pose:(actor:number,pose:Pose)=>void; notice:(message:string)=>void;
};
export type Launch = { mode:'host'|'join'; appId:string; region:string; code:string };

export async function connectRoom(launch:Launch, callbacks:Callbacks) {
  const [{createRealtimeClient},{default:wasmUrl}]=await Promise.all([
    import('@photonengine/realtime-core'),import('@photonengine/realtime-core/realtimecore.wasm?url'),
  ]);
  const client=await createRealtimeClient({
    appId:launch.appId,appVersion:'clearcut-coop-1',protocol:'wss',regionSelection:'select',
    useAlternativePorts:true,disconnectTimeoutMs:15000,wasm:{url:wasmUrl},
  });
  let timer=0;
  const join=async()=>{
    const regions=client.availableRegions();
    const connected=client.connect();
    // Either operation can reject first while the other is still pending.
    void connected.catch(()=>{});
    const available=await Promise.race([regions,connected.then(()=>regions)]);
    const region=available.find(({code})=>code===launch.region)?.code;
    if(!region)throw Error(`Photon does not offer region "${launch.region}" for this app. Available: ${available.map(r=>r.code).join(', ')}.`);
    await client.selectRegion(region);
    await connected;
    const name=`clearcut-${launch.code}`;
    return launch.mode==='host'?client.createRoom(name,roomOptions):client.joinRoom(name);
  };
  try {
    const room=await Promise.race([join(),new Promise<never>((_,reject)=>{
      timer=window.setTimeout(()=>reject(Error('Photon connection timed out. Check the App ID, region and network, then try again.')),22000);
    })]);
    return new CoopRoom(client,launch,room.masterClientNumber,callbacks);
  } catch(error) {
    client.dispose();
    const code=error&&typeof error==='object'&&'code' in error?error.code:undefined;
    if(code==='roomNotFound')throw Error('Room not found. Check the code and region, or open the room from a saved campaign.');
    if(code==='roomFull')throw Error('This room already has four players.');
    if(code==='roomAlreadyExists')throw Error('This room is already open. Use Join room to play in it.');
    throw error;
  } finally { window.clearTimeout(timer); }
}

export class CoopRoom {
  readonly poses=new Map<number,Pose>();
  readonly isHost:boolean;
  private readonly peers=new Map<number,Peer>();
  private readonly number:number;
  private readonly timer:number;
  private revision=0;
  private checkpoint?:WorldVersion;
  private receiving?:Receive;
  private closed=false;
  private closing=false;
  private lastWorld=0;
  private lastPose=0;
  private lastTraffic=Date.now();
  private lastHello=0;
  private ready=false;

  constructor(private client:RealtimeClient, readonly launch:Launch, private host:number, private callbacks:Callbacks) {
    this.number=client.localPlayer.number;
    this.isHost=launch.mode==='host';
    this.ready=this.isHost;
    client.onEventRange(events.hello,events.result,({code,senderNumber,data})=>this.receive(code,senderNumber,data));
    client.on('playerLeft',({playerNumber})=>{
      this.peers.delete(playerNumber);this.poses.delete(playerNumber);this.callbacks.departed(playerNumber);
      if(playerNumber===this.host)this.ended('The host left. Reopen the last room checkpoint from Saved rooms.');
    });
    client.on('masterClientChanged',({newMasterNumber})=>{
      if(newMasterNumber!==this.host)this.ended('The host disconnected. Reopen the last room checkpoint from Saved rooms.');
    });
    client.on('roomLeft',()=>this.ended('You left the Photon room.'));
    client.on('disconnected',()=>this.ended('Disconnected from Photon. Rejoin or reopen a saved room.'));
    this.timer=window.setInterval(()=>this.pump(),100);
  }

  get count() {return this.closed||!this.client.isInRoom?0:this.client.room?.playerCount??0;}
  private send(code:number,value:RealtimeValue,target?:number) {
    return !this.closed&&this.client.isInRoom&&this.client.sendEvent(code,value,{reliable:code!==events.pose,targetPlayers:target===undefined?undefined:[target]});
  }

  pose(pose:Pose, now:number) {
    if(this.ready&&now-this.lastPose>=125&&this.count>1) {
      this.lastPose=now;
      this.send(events.pose,packPose(pose));
    }
  }

  action(pose:Pose,action:RealtimeValue) {
    if(this.ready&&!this.isHost)this.send(events.action,[packPose(pose),action],this.host);
  }

  private receive(code:number,sender:number,data:RealtimeValue) {
    if(this.closed||sender===this.number)return;
    if(code===events.pose) {
      const p=readPose(data);
      if(p){this.poses.set(sender,p);this.callbacks.pose(sender,p);}
      return;
    }
    if(this.isHost) {
      if(code===events.hello&&!this.closing) {
        this.peers.set(sender,{});
      } else if(code===events.ack) {
        const peer=this.peers.get(sender);
        if(peer?.send&&peer.send.revision===data) {
          const {revision,blocks}=peer.send;
          peer.confirmed={revision,blocks};peer.send=undefined;
        }
      } else if(code===events.action&&!this.closing&&this.peers.get(sender)?.confirmed&&Array.isArray(data)&&data.length===2) {
        const pose=readPose(data[0]);
        if(!pose)return;
        const result=this.callbacks.action(sender,pose,data[1]);
        if(result)this.send(events.result,result,sender);
      }
      return;
    }
    if(sender!==this.host)return;
    if(code===events.result&&typeof data==='string'&&data.length<200)this.callbacks.notice(data);
    if(code===events.closing)this.ended('The host closed the room. Your latest synced checkpoint is in Saved rooms.');
    if(code!==events.world)return;
    const part=readWorldPart(data);
    if(!part||part.revision<=(this.checkpoint?.revision??0))return;
    this.lastTraffic=Date.now();
    if(part.index===0)this.receiving={revision:part.revision,total:part.total,parts:[]};
    const transfer=this.receiving;
    if(!transfer||part.revision!==transfer.revision||part.total!==transfer.total||part.index!==transfer.parts.length)return;
    transfer.parts.push(part.bytes);
    if(transfer.total!==transfer.parts.length)return;
    this.receiving=undefined;
    try {
      const {blocks,save}=applyPatch(transfer.parts,this.checkpoint?.blocks,this.checkpoint?.revision??0);
      this.callbacks.checkpoint(save);
      this.checkpoint={blocks,revision:transfer.revision};
      this.ready=true;
      this.send(events.ack,transfer.revision,this.host);
    } catch {
      this.checkpoint=undefined;
      this.lastHello=Date.now();
      this.send(events.hello,null,this.host);
    }
  }

  private queueWorld(now:number, force=false) {
    for(const peer of this.peers.values()) {
      if(peer.send&&now-peer.send.at>90000){peer.send=undefined;peer.confirmed=undefined;}
    }
    const waiting=[...this.peers.values()].filter(peer=>!peer.send&&(force||!peer.confirmed||now-this.lastWorld>=4000));
    if(!waiting.length)return;
    const blocks=serializeWorld(this.callbacks.capture());
    const revision=++this.revision;
    const byBase=new Map<number,Uint8Array[]>();
    for(const peer of waiting) {
      const base=peer.confirmed?.revision??0;
      let chunks=byBase.get(base);
      if(!chunks){chunks=makePatch(blocks,peer.confirmed?.blocks,base);byBase.set(base,chunks);}
      peer.send={revision,blocks,chunks,sent:0,at:now};
    }
    this.lastWorld=now;
  }

  private pump() {
    if(this.closed)return;
    const now=Date.now();
    if(!this.isHost) {
      if(!this.ready&&now-this.lastTraffic>25000) this.ended('No checkpoint arrived from the host. Check that the host is in the room and try again.');
      else if(!this.checkpoint&&!this.receiving&&now-this.lastHello>6000){
        this.lastHello=now;
        this.send(events.hello,null,this.host);
      }
      return;
    }
    try {
      if(!this.closing)this.queueWorld(now);
      for(const [actor,peer] of this.peers) {
        let remaining=MAX_CHUNKS_PER_PEER;
        const transfer=peer.send;
        if(!transfer)continue;
        while(remaining&&transfer.sent<transfer.chunks.length) {
          const i=transfer.sent;
          if(!this.send(events.world,[transfer.revision,i,transfer.chunks.length,transfer.chunks[i]],actor))break;
          transfer.sent++;
          remaining--;
        }
      }
    } catch(error) { this.ended(error instanceof Error?error.message:'The room checkpoint could not be sent.'); }
  }

  private ended(message:string) {
    if(this.closed)return;
    this.dispose();
    this.callbacks.ended(message);
  }

  private dispose() {
    if(this.closed)return;
    this.closed=true;
    window.clearInterval(this.timer);
    queueMicrotask(()=>this.client.dispose());
  }

  async leave() {
    if(this.closed||this.closing)return;
    this.closing=true;
    try {
      if(this.isHost) {
        // Complete earlier transfers before basing a final update on their acknowledgements.
        const deadline=Date.now()+5000;
        const settle=async()=>{while(!this.closed&&Date.now()<deadline&&[...this.peers.values()].some(p=>p.send))
          await new Promise(resolve=>setTimeout(resolve,100));};
        await settle();
        if(!this.closed){this.queueWorld(Date.now(),true);await settle();}
        this.send(events.closing,null);
      }
      if(!this.closed) await Promise.race([this.client.disconnect(),new Promise(resolve=>setTimeout(resolve,1500))]);
    } catch { /* The room may already have disconnected. */ }
    finally { this.dispose(); }
  }
}

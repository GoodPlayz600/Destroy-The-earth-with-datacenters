import assert from 'node:assert/strict';
import test from 'node:test';
import { Campaign } from '../src/campaign';
import { applyPatch, makePatch, newCode, packPose, readPose, readRoomBackup, readWorldPart, roomBackup, serializeWorld, validCode } from '../src/coop-wire';
import { CrewWork } from '../src/coop-field';
import { CoopRoom } from '../src/coop';
import { indexAt, treesIn } from '../src/land';
import type { RealtimeClient } from '@photonengine/realtime-core';

test('multiplayer checkpoints round-trip big fields and apply only changed blocks',()=>{
  const g=new Campaign(20831);
  for(let i=0;i<4096;i++)g.getSoil(i);
  const first=g.snapshot();
  const initial=serializeWorld(first);
  const full=makePatch(initial);
  assert.ok(full.length>1);
  const restored=applyPatch(full,undefined,0);
  assert.deepEqual(restored.save,first);
  g.getSoil(2000).moisture=.44;
  g.cash=750;
  const later=g.snapshot();
  const update=makePatch(serializeWorld(later),initial,1);
  assert.ok(update.length<full.length);
  assert.deepEqual(applyPatch(update,restored.blocks,1).save,later);
  assert.throws(()=>applyPatch(update,restored.blocks,4),/sequence/);
  assert.deepEqual(applyPatch(makePatch(serializeWorld(new Campaign(20831).snapshot()),initial,1),restored.blocks,1).save.soil,[]);
  assert.ok(readWorldPart([1,0,full.length,full[0]]));
  assert.equal(readWorldPart([1,0,2,new Uint8Array(4)]),undefined);
});

test('room backups carry the Photon region and room code with a validated campaign',()=>{
  const code=newCode();
  assert.ok(validCode(code));
  const save=new Campaign().snapshot();
  const backup=roomBackup(code,'us',save);
  assert.deepEqual(readRoomBackup(backup),{code,region:'us',save});
  assert.throws(()=>readRoomBackup({...backup,region:'us / eu'}),/multiplayer backup/);
  assert.throws(()=>readRoomBackup({...backup,save:{...save,cash:Infinity}}));
  const pose={x:1,z:2,yaw:21,pitch:.5,lift:0};
  assert.ok(readPose(packPose(pose)));
  assert.equal(readPose([Infinity,0,0,0,0]),undefined);
});

test('guest field actions use campaign rules, update the room and reject distant targets',()=>{
  const g=new Campaign();
  const standing=treesIn(g.seed,indexAt(0,-6)).find(t=>t.z===-6)!;
  let fells=0;
  const crew=new CrewWork(()=>g,()=>{fells++;},()=>fells>0,()=>undefined);
  const operator={x:0,z:-3.8,yaw:0,pitch:0,lift:0};
  crew.run(2,{...operator,x:400},['swing',standing.id],0);
  assert.equal(g.stats.hits,0);
  for(let i=1;i<=30;i++){
    g.stamina=100;
    crew.run(3,operator,['swing',standing.id],i*800);
  }
  assert.equal(fells,1);
  const log={id:g.nextId++,x:0,z:0,y:1,q:[0,0,0,1] as [number,number,number,number],kind:0,length:1,kilograms:3,units:1,moisture:.5,quality:.8};
  g.logs.set(log.id,log);
  const ash=g.sites.find(site=>site.kind==='fire')!;
  const carrier={x:0,z:0,yaw:0,pitch:0,lift:0};
  assert.match(crew.run(4,carrier,['grab',log.id],100)??'',/grabbed/);
  assert.match(crew.run(5,carrier,['grab',log.id],100)??'',/unavailable/);
  const drop={...carrier,x:ash.x,z:ash.z+1.65};
  assert.match(crew.run(4,drop,['drop',null],600)??'',/delivered/);
  assert.equal(g.logs.has(log.id),false);
  assert.equal(ash.jobs.length,1);
});

test('two room clients exchange snapshots, actions, final save and host departure',async()=>{
  const timers=new Set<()=>void>();
  const original=globalThis.window;
  // Run the network state machine against isolated room clients with an ordered local event queue.
  globalThis.window={
    setInterval:(fn:()=>void)=>{timers.add(fn);return fn;},clearInterval:(fn:()=>void)=>timers.delete(fn),
  } as unknown as Window & typeof globalThis;
  const clients=new Map<number,FakePhoton>();
  const network:Array<()=>void>=[];
  class FakePhoton {
    isInRoom=true;
    room={playerCount:2};
    localPlayer:{number:number};
    private events=new Map<string,(arg:never)=>void>();
    private custom?: (arg:{code:number;senderNumber:number;data:unknown})=>void;
    constructor(private number:number){this.localPlayer={number};clients.set(number,this);}
    on(name:string,handler:(arg:never)=>void){this.events.set(name,handler);}
    onEventRange(_first:number,_last:number,handler:typeof this.custom){this.custom=handler;}
    sendEvent(code:number,data:unknown,{targetPlayers}: {targetPlayers?:number[]}){
      for(const [actor,other]of clients)if(actor!==this.number&&(!targetPlayers||targetPlayers.includes(actor))){
        const packet=structuredClone({code,senderNumber:this.number,data});
        network.push(()=>other.custom?.(packet));
      }
      return this.isInRoom;
    }
    disconnect(){this.dispose();return Promise.resolve();}
    dispose(){this.isInRoom=false;clients.delete(this.number);}
  }
  const flush=()=>{
    for(const timer of timers)timer();
    while(network.length)network.shift()!();
  };
  try {
    const hostGame=new Campaign();
    let guestSave:ReturnType<Campaign['snapshot']>|undefined;
    let applied=0, ended='';
    const config={appId:'test-app',region:'us',code:'ABCDEFGHIJ'};
    const callbacks={capture:()=>hostGame.snapshot(),checkpoint:()=>{},action:()=>{applied++;hostGame.cash+=19;return 'accepted';},
      departed:()=>{},pose:()=>{},notice:()=>{},ended:()=>{}};
    const host=new CoopRoom(new FakePhoton(1) as unknown as RealtimeClient,{...config,mode:'host'},1,callbacks);
    const guest=new CoopRoom(new FakePhoton(2) as unknown as RealtimeClient,{...config,mode:'join'},1,{
      ...callbacks,checkpoint:save=>{guestSave=save;},ended:message=>{ended=message;},
    });
    flush();flush();
    assert.equal(guestSave?.seed,hostGame.seed);
    const pose={x:0,z:0,yaw:0,pitch:0,lift:0};
    guest.pose(pose,200);
    guest.action(pose,['swing',1]);
    flush();
    assert.deepEqual(host.poses.get(2),pose);
    assert.equal(applied,1);
    const exit=host.leave();
    flush();
    await new Promise(resolve=>setTimeout(resolve,105));
    flush();
    await exit;
    flush();
    assert.equal(guestSave?.cash,19);
    assert.match(ended,/host closed/);
  } finally {globalThis.window=original;}
});

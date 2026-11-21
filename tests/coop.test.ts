import assert from 'node:assert/strict';
import test from 'node:test';
import { Campaign } from '../src/campaign';
import { applyPatch, makePatch, newCode, packPose, readPose, readRoomBackup, readWorldPart, roomBackup, serializeWorld, validCode } from '../src/coop-wire';
import { campaignControl, lotKey } from '../src/campaign-controls';
import { allPermissions } from '../src/room-permissions';
import { fieldChanges, readField } from '../src/coop-field-wire';
import { CoopRoom } from '../src/coop';
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

test('campaign menu operations use shared rules for money, site access, and inventory',()=>{
  const game=new Campaign();
  const at={x:0,z:0};
  assert.equal(campaignControl(game,'upgrade',['01-01'],at),false);
  game.cash=800;
  assert.equal(campaignControl(game,'upgrade',['01-01'],at),true);
  const balance=game.cash;
  assert.equal(campaignControl(game,'upgrade',['01-01'],at),false);
  assert.equal(game.cash,balance);
  const marker=game.sites.find(site=>site.kind==='market')!;
  const lot={good:'timber' as const,quantity:2,quality:.8,moisture:.2};
  game.stock.push(lot);
  const args=[marker.id,...lotKey(game.stock,lot),false];
  assert.equal(campaignControl(game,'sell',args,at),false);
  assert.equal(campaignControl(game,'sell',args,marker),true);
  assert.equal(lot.quantity,1);
  assert.equal(campaignControl(game,'sell',args,marker),false);
});

test('nearby timber updates include fresh positions and delivery tombstones between checkpoints',()=>{
  const game=new Campaign();
  const log={id:game.nextId++,x:0,z:2,y:1,q:[0,0,0,1] as [number,number,number,number],kind:0,length:1,kilograms:3,units:1,moisture:.5,quality:.8};
  game.logs.set(log.id,log);
  const track={known:new Map<number,string>(),next:0}, at={x:0,z:0};
  assert.deepEqual(readField(JSON.stringify(fieldChanges(game.logs,at,1,track)))?.logs,[log]);
  assert.deepEqual(fieldChanges(game.logs,at,2,track).logs,[]);
  log.z=2.567;
  assert.equal(fieldChanges(game.logs,at,3,track).logs[0].z,2.57);
  game.logs.delete(log.id);
  assert.deepEqual(fieldChanges(game.logs,at,4,track).gone,[log.id]);
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
    room={playerCount:3,players:[{number:1},{number:2},{number:3}]};
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
    let applied=0, advanced=0, ended='';
    const config={appId:'test-app',region:'us',code:'ABCDEFGHIJ'};
    const callbacks={capture:()=>hostGame.snapshot(),advance:(dt:number)=>{advanced+=dt;},checkpoint:()=>{},action:()=>{applied++;hostGame.cash+=19;return 'accepted';},
      departed:()=>{},pose:()=>{},notice:()=>{},ended:()=>{}};
    const host=new CoopRoom(new FakePhoton(1) as unknown as RealtimeClient,{...config,mode:'host'},1,{
      ...callbacks,action:(actor)=>host.allowed('field',actor)?callbacks.action():'Restricted',
    });
    const guest=new CoopRoom(new FakePhoton(2) as unknown as RealtimeClient,{...config,mode:'join'},1,{
      ...callbacks,checkpoint:save=>{guestSave=save;},ended:message=>{ended=message;},
    });
    const second=new CoopRoom(new FakePhoton(3) as unknown as RealtimeClient,{...config,mode:'join'},1,callbacks);
    flush();flush();
    assert.deepEqual(host.players.map(p=>p.permissions),[allPermissions,allPermissions,allPermissions]);
    assert.equal(guest.allowed('field'),true);
    guest.setPermission(2,'field',false);
    flush();
    assert.equal(host.allowed('field',2),true);
    host.setPermission(2,'field',false);
    flush();
    assert.equal(guest.allowed('field'),false);
    assert.equal(guest.allowed('trade'),true);
    assert.equal(second.allowed('field'),true);
    assert.equal(guestSave?.seed,hostGame.seed);
    const pose={x:0,z:0,yaw:0,pitch:0,lift:0};
    guest.pose(pose,200);
    guest.action(pose,['swing',1]);
    flush();
    assert.equal(applied,0);
    host.setPlayerPermissions(2,allPermissions);
    flush();
    guest.action(pose,['swing',1]);
    flush();
    assert.deepEqual(host.poses.get(2),pose);
    assert.equal(applied,1);
    assert.ok(advanced>=0);
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

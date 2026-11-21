import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './style.css';
import { Vector3 } from 'three';
import { CELL, SIZE, TOTAL, facilities, recipes, species, tools, vehicles, vehicleTypes } from './catalog';
import type { Facility, Tool, VehicleType } from './catalog';
import { Campaign, cargoMass, freightVehicles, stackMass, takesLogs, trailerGap, waterSites } from './campaign';
import type { Challenge, Log, Ride, Save, Site } from './campaign';
import { clamp, distance, indexAt, treesIn, treesPerCell } from './land';
import type { Point, Tree } from './land';
import { Scene, initializePhysics, rocksAt } from './scene';
import type { Rock } from './scene';
import { Sound } from './sound';
import { downloadSave, listArchives, loadCampaign, readPreferences, saveCampaign, validateSave, writePreferences, saveRoomCheckpoint, downloadJson } from './storage';
import type { Archive, Binding } from './storage';
import { UI } from './ui';
import type { Hint, Page } from './ui';
import { connectRoom } from './coop';
import type { CoopRoom, Launch } from './coop';
import { placementAt, treeAim } from './coop-field';
import { CoopLobby } from './coop-lobby';
import { coopSlot, roomBackup } from './coop-wire';
import type { Pose } from './coop-wire';
import { campaignControl, campaignPermissions } from './campaign-controls';
import type { CampaignCommand, CommandArgs } from './campaign-controls';
import type { RoomPermission } from './room-permissions';
import { roomPermissions } from './room-permissions';
import { HostMenu } from './host-menu';
import type { FieldPacket } from './coop-field-wire';
import type { RealtimeValue } from '@photonengine/realtime-core';

const canvas=document.querySelector<HTMLCanvasElement>('#world')!;
const root=document.querySelector<HTMLDivElement>('#ui')!;
const onTouch='ontouchstart' in window && matchMedia('(pointer: coarse)').matches;
const prefs=readPreferences();
if(onTouch){
  try{if(!localStorage.getItem('clearcut.preferences'))prefs.quality='low';}catch{}
}
let game=new Campaign();
const height=(x:number,z:number)=>game.ground(x,z);
let scene:Scene;
let room:CoopRoom|undefined;
let solo:Campaign|undefined;
let roomCheckpoint:Save|undefined;
const liveLogs=new Map<number,{at:number;log?:Log}>();
const liveFelled=new Map<number,number>();
let hostSaveAge=0;
let joining: {resolve:()=>void; reject:(error:Error)=>void}|undefined;
let leaving=false;
const guest=()=>Boolean(room&&!room.isHost);
type Held = {log:Log;mode:'hand'|'rope'|'lift'|'winch'};
type Operator = {
  pose:Pose; seen:number; lastAction:number; ride?:Ride; held?:Held; alt:boolean;
  steering:number; lastSteering:number; lastSwing:number; reverse:boolean;
  blade:number; cutter:number; earth:number;
};
const operators=new Map<number,Operator>();
let currentOperator:number|undefined;
let hostRide:Ride|undefined,hostHeld:Held|undefined;
let guestRideId:string|undefined;
let pendingSteering=0,lastSteeringSent=0;
const liveRides=new Map<string,{at:number;ride:Ride}>();
const sound=new Sound();
let page:Page|undefined;
let started=false;
let atMenu=true;
let hasSave=false;
let startedBefore=false;
let saveLabel='';
let saveError='';
let selectedSite:Site|undefined;
let ride:Ride|undefined;
let selectedBuild:Facility|undefined;
let waypoint:Point|undefined;
let survey:{point:Point;age:number}|undefined;
let selectedVehicle:VehicleType|undefined;
let held:Held|undefined;
let recording:Binding|undefined;
let dragging=false;
let using=false;
let buttonAlt=false;
let touchLook:{id:number;x:number;y:number}|undefined;
let swing=0, swingPeriod=.32, reverse=false, vY=0, airborne=0, stride=0, dropTime=0, saveAge=0, victoryAge=-1;
let toastDelay=0,bladeCycle=0,cutterCycle=0,earthCycle=0;
let lastHarvest=0;
let archives:Archive[]=[];
let latestSave:Promise<unknown>=Promise.resolve();
let inputs=new Set<string>();
const hasLock=()=>document.pointerLockElement===canvas;
const active=()=>started&&!atMenu&&!page&&!leaving&&!lobby.open&&!hostMenu.dialog.open;
const touchLabels:Partial<Record<Binding,string>>={interact:'Grab',drop:'Drop',jump:'Jump',ride:'Drive',load:'Cargo',rope:'Rope'};
const key=(binding:Binding)=>onTouch&&touchLabels[binding]?touchLabels[binding]!:
  prefs.bindings[binding].replace(/^Key|^Digit/g,'');
const pose=()=>({...game.player,lift:airborne});
const show=(message:string)=>{
  if(currentOperator!==undefined)room?.tell(currentOperator,message);
  else ui.notice(message);
};
const can=(action:RoomPermission)=>room?.allowed(action,currentOperator)??true;
const reject=(action:RoomPermission)=>show(roomPermissions[action]+' is disabled by the host.');

const ui=new UI(root,{
  game:()=>game,prefs,open,begin,resume,menu:mainMenu,multiplayer:()=>showLobby(),inRoom:()=>Boolean(room),can,command:runCampaignCommand,hosting:()=>Boolean(room?.isHost),hostMenu:()=>{if(room?.isHost)hostMenu.show(room);},refresh:()=>{if(page)ui.show(page);void persist();},
  save:()=>{void persist(true);},download:()=>{if(room){exportRoom();return;}downloadSave(game.snapshot());show('Campaign exported');},restore:(file)=>{void importFile(file);},
  archives:()=>archives, restoreArchive:(slot)=>{void restoreArchive(slot);},
  applySettings, binding:(id)=>{recording=id;ui.recording(id);},
  build:(f)=>{selectedBuild=f;selectedVehicle=undefined;resume();},
  ride:(v)=>{selectedVehicle=v;selectedBuild=undefined;resume();},
  waypoint:(p)=>{waypoint={x:p.x,z:p.z};show('Survey point marked');resume();},
  survey:(point)=>{survey={point,age:0};resume();},
  site:()=>selectedSite,touch:handleTouch,fullscreen:()=>{
    if(document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(()=>show('Fullscreen is unavailable in this browser'));
  },
});
const lobby=new CoopLobby(root);
const hostMenu=new HostMenu(root);

function showLobby(message='') {
  if(!scene)return;
  if(active())open('pause');
  lobby.show({
    launch:launchRoom,canCopy:()=>hasSave,
    live:()=>room&&started&&!atMenu?{...room.launch,host:room.isHost,count:room.count}:undefined,
    leave:()=>void leaveRoom(),save:()=>void persist(true),download:exportRoom,
  },message);
}
function exportRoom() {
  if(!room)return;
  const {code,region}=room.launch;
  const save=room.isHost?game.snapshot():roomCheckpoint;
  if(!save){show('Wait for the room checkpoint first.');return;}
  downloadJson(roomBackup(code,region,save),`clearcut-room-${code}.json`);
  show('Room backup exported');
}
function endRoom(message:string) {
  const session=room;
  if(!session)return;
  const pending=joining;
  joining=undefined;
  void persist();
  operators.clear();hostMenu.dialog.close();
  room=undefined;
  roomCheckpoint=undefined;
  liveFelled.clear();liveLogs.clear();
  guestRideId=undefined;liveRides.clear();pendingSteering=0;
  leaving=false;
  scene.replica=false;
  scene.syncPlayers(undefined,0);
  if(solo)resetSession(solo);
  solo=undefined;
  started=false;atMenu=true;page=undefined;
  if(hasLock())document.exitPointerLock();
  saveLabel='';
  ui.showMenu(hasSave,saveError);
  if(pending)pending.reject(Error(message));
  else showLobby(message);
}
async function leaveRoom() {
  const session=room;
  if(!session||leaving)return;
  leaving=true;
  await persist(true);
  await session.leave();
  if(room===session)endRoom('Your room checkpoint is available under Saved rooms.');
}
function runCampaignCommand(command:CampaignCommand,args:CommandArgs) {
  if(!can(campaignPermissions[command])){reject(campaignPermissions[command]);return;}
  if(guest())room?.action(pose(),['menu',command,...args]);
  else {
    if(!campaignControl(game,command,args,game.player,vehicleOccupied,logHeld))show('Action unavailable. Check requirements and try again.');
    if(page)ui.refreshLive(page);
    void persist();
  }
}

function vehicleOccupied(id:string) {
  const occupiedByHost=currentOperator===undefined?ride:hostRide;
  return occupiedByHost?.id===id||[...operators].some(([actor,state])=>actor!==currentOperator&&state.ride?.id===id);
}

function logHeld(id:number) {
  const heldByHost=currentOperator===undefined?held:hostHeld;
  return heldByHost?.log.id===id||[...operators].some(([actor,state])=>actor!==currentOperator&&state.held?.log.id===id);
}

const driveKeys=['forward','back','left','right'] as const;
function observeOperator(actor:number,at:Pose) {
  const now=performance.now();
  let state=operators.get(actor);
  if(state){
    if(!state.ride&&distance(at,state.pose)>3+Math.min(3,(now-state.seen)/1000)*24)return;
    if(!state.ride)state.pose=at;
    state.seen=now;
  }else {
    state={pose:at,seen:now,lastAction:-Infinity,alt:false,steering:0,lastSteering:0,lastSwing:-Infinity,reverse:false,blade:0,cutter:0,earth:0};
    operators.set(actor,state);
  }
  return state;
}

// Execute field controls on the host with the requesting player's equipment,
// position, and input. Restore the host controls before the next event or frame.
function asOperator(actor:number,state:Operator,work:()=>void) {
  const saved={player:game.player,ride,held,inputs,using,buttonAlt,airborne,reverse,swing,swingPeriod,dropTime,bladeCycle,cutterCycle,earthCycle};
  currentOperator=actor;hostRide=ride;hostHeld=held;
  game.player=state.pose;ride=state.ride;held=state.held;
  if(held&&!game.logs.has(held.log.id))held=undefined;
  inputs=new Set(driveKeys.filter((_,i)=>state.steering&(1<<i)));
  using=Boolean(state.steering&16);buttonAlt=state.alt;
  airborne=state.pose.lift;reverse=state.reverse;swing=0;
  bladeCycle=state.blade;cutterCycle=state.cutter;earthCycle=state.earth;
  try{work();}
  finally{
    state.ride=ride;state.held=held;state.reverse=reverse;state.pose.lift=airborne;
    state.blade=bladeCycle;state.cutter=cutterCycle;state.earth=earthCycle;
    ({ride,held,inputs,using,buttonAlt,airborne,reverse,swing,swingPeriod,dropTime,bladeCycle,cutterCycle,earthCycle}=saved);
    game.player=saved.player;currentOperator=undefined;hostRide=undefined;hostHeld=undefined;
  }
}

function handleOperator(actor:number,at:Pose,data:unknown):string|undefined {
  if(!Array.isArray(data)||typeof data[0]!=='string'||data.length>18)return;
  const state=observeOperator(actor,at);
  if(!state)return;
  const [type,a,b]=data;
  const now=performance.now();
  if(type==='steer'){
    if(!Number.isInteger(a)||a<0||a>31||!canFor('vehicles',actor))return;
    state.steering=a;state.lastSteering=now;return;
  }
  if(!(type==='field'&&a==='release')&&now-state.lastAction<45)return;
  state.lastAction=now;
  if(type==='menu'){
    if(typeof a!=='string'||!Object.hasOwn(campaignPermissions,a))return;
    const command=a as CampaignCommand,permission=campaignPermissions[command];
    if(!canFor(permission,actor))return roomPermissions[permission]+' is disabled by the host.';
    const values=data.slice(2);
    if(!values.every(v=>typeof v==='string'&&v.length<=1400||typeof v==='number'&&Number.isFinite(v)||typeof v==='boolean'||v===null))return;
    const ok=campaignControl(game,command,values,state.pose,vehicleOccupied,logHeld);
    return ok?'Campaign updated.':'Action unavailable. Check requirements and try again.';
  }
  if(type==='build'||type==='vehicle'){
    if(!canFor('build',actor))return roomPermissions.build+' is disabled by the host.';
    if(typeof a!=='string'||!Object.hasOwn(type==='build'?facilities:vehicles,a)||state.ride)return;
    let result:string|undefined;
    asOperator(actor,state,()=>{
      if(type==='build'){
        const kind=a as Facility;
        const point=placementAt(game.player,kind);
        result=game.siteIssue(kind,point)||undefined;
        if(!result&&game.build(kind,point))result=facilities[kind].name+' installed.';
      }else {
        const kind=a as VehicleType;
        result=game.acquireRide(kind,placementAt(game.player))?vehicles[kind].name+' delivered.':'Vehicle requirements or funds are missing.';
      }
    });
    return result;
  }
  if(type!=='field'||typeof a!=='string'||typeof b!=='boolean')return;
  const permission=fieldPermission(a,state.ride);
  if(a!=='release'&&permission&&!canFor(permission,actor))return roomPermissions[permission]+' is disabled by the host.';
  state.alt=b;
  if(a==='swing'){
    if(state.ride||now-state.lastSwing<game.swingTime*1000-35)return;
    state.lastSwing=now;
    asOperator(actor,state,()=>swingTool());
  }else if(['interact','rope','lift','drop','ride','load','probe','hitch','release'].includes(a)){
    asOperator(actor,state,()=>{
      if(a==='release'){if(held?.mode==='hand')release();}
      else if(a==='interact'&&held?.mode==='hand')release();
      else {
        const wasHolding=Boolean(held);
        useFieldAction(a);
        if(held&&!wasHolding)show(held.mode==='hand'?'Log grabbed. Release Interact or press Drop to deliver.':'Log attached. Press Drop to deliver.');
      }
    });

  }
}
const canFor=(key:RoomPermission,actor:number)=>room?.allowed(key,actor)??true;

function tickOperators(now:number,dt:number){
  for(const [actor,state] of operators){
    if(now-state.seen>4000||state.ride&&!game.rides.includes(state.ride)){
      state.ride=undefined;state.held=undefined;state.steering=0;continue;
    }
    if(state.ride){
      if(now-state.lastSteering>450)state.steering=0;
      asOperator(actor,state,()=>movement(dt));
    }
    if(state.held){
      const {log,mode}=state.held;
      if(!game.logs.has(log.id)||log.cargo||log.carrier){state.held=undefined;continue;}
      const {x,z,yaw}=state.pose;
      const reach=mode==='winch'?-3:mode==='rope'?3.3:mode==='lift'?1.25:1.65;
      const blend=Math.min(1,dt*9);
      log.x+=(clamp(x-Math.sin(yaw)*reach,-SIZE/2+.7,SIZE/2-.7)-log.x)*blend;
      log.z+=(clamp(z-Math.cos(yaw)*reach,-SIZE/2+.7,SIZE/2-.7)-log.z)*blend;
      log.y=height(log.x,log.z)+(mode==='lift'?.89:.44);
    }
  }
}
function captureOperators(){
  const states=[{id:room!.actorNumber,pose:pose(),ride,held:undefined as Held|undefined},
    ...[...operators].map(([id,state])=>({id,pose:state.pose,ride:state.ride,held:state.held}))];
  return JSON.stringify({clock:game.clock,states:states.map(state=>({
    id:state.id,pose:state.pose,ride:state.ride,held:state.held&&{id:state.held.log.id,mode:state.held.mode}
  }))});
}
function applyOperators(value:string){
  if(!guest()||!room)return;
  try{
    const data=JSON.parse(value) as {clock:number;states:{id:number;pose:Pose;ride?:Ride;held?:{id:number;mode:Held['mode']}}[]};
    if(!Number.isFinite(data.clock)||!Array.isArray(data.states)||data.states.length>4)return;
    for(const state of data.states){
      if(!Number.isInteger(state.id)||!state.pose||![state.pose.x,state.pose.z,state.pose.yaw].every(Number.isFinite))continue;
      if(state.ride&&Object.hasOwn(vehicles,state.ride.kind)&&[state.ride.x,state.ride.z,state.ride.yaw].every(Number.isFinite)){
        liveRides.set(state.ride.id,{at:data.clock,ride:state.ride});
        const index=game.rides.findIndex(r=>r.id===state.ride!.id);
        if(index>=0)game.rides[index]=state.ride;
      }
      if(state.id!==room.actorNumber){if(state.ride)room.poses.set(state.id,state.pose);continue;}
      const wasDriving=Boolean(guestRideId);
      guestRideId=state.ride?.id;
      ride=state.ride;
      if(ride)Object.assign(game.player,{x:ride.x,z:ride.z,yaw:ride.yaw});
      else if(wasDriving)Object.assign(game.player,state.pose);
      const log=state.held&&game.logs.get(state.held.id);
      held=log&&state.held?{log,mode:state.held.mode}:undefined;
    }
  }catch { /* A malformed or stale player update does not replace the checkpoint. */ }
}
function applyField(packet:FieldPacket) {
  if(!guest()||packet.clock<(roomCheckpoint?.clock??0))return;
  for(const id of packet.gone){liveLogs.set(id,{at:packet.clock});game.logs.delete(id);}
  for(const log of packet.logs){liveLogs.set(log.id,{at:packet.clock,log});game.logs.set(log.id,log);}
}
function advanceRoom(seconds:number) {
  if(!room?.isHost||atMenu||leaving||seconds<=0)return;
  const p=game.player;
  tickOperators(performance.now(),seconds);
  for(let remaining=seconds;remaining>0;){
    const dt=Math.min(remaining,.12);
    remaining-=dt;
    const sprinting=active()&&inputs.has('sprint')&&['forward','back','left','right'].some(input=>inputs.has(input));
    game.tick(dt,!sprinting,held?.log.id);
    scene.stepShared(dt,p,p.yaw,held);
  }
  if(!held&&dropTime===0)deliverLooseLogs(p);
  hostSaveAge+=seconds;
  if(hostSaveAge>=8){hostSaveAge=0;void persist();}
}
function deliverLooseLogs(p:Point) {
  for(const log of game.logs.values()){
    if(log.cargo||log.carrier||logHeld(log.id)||distance(log,p)>16)continue;
    if(game.sites.some(site=>site.kind==='fire'&&distance(log,site)<1.15&&game.acceptLog(site,log))){
      void persist();
      break;
    }
  }
}
function receiveRoomSave(save:Save) {
  if(!room||room.isHost)return;
  const first=Boolean(joining);
  if(!first&&save.seed!==game.seed)throw Error('Unexpected campaign seed.');
  const next=Campaign.restore(save);
  roomCheckpoint=save;
  if(first) {
    next.player={...save.player};
    next.player.x=clamp(next.player.x+1.6,-SIZE/2+.7,SIZE/2-.7);
    resetSession(next);
    started=true;atMenu=false;
    sound.start(prefs.volume);
    page=undefined;ui.showPlay();
    joining?.resolve();
    joining=undefined;
  } else {
    next.player=game.player;
    next.landRevision=game.landRevision+1;
    next.terrainRevision=game.terrainRevision+1;
    for(const [id,update] of liveLogs){
      if(update.at<save.clock){liveLogs.delete(id);continue;}
      if(update.log)next.logs.set(id,update.log);
      else next.logs.delete(id);
    }
    for(const [id,clock] of liveFelled){
      if(clock<save.clock){liveFelled.delete(id);continue;}
      next.removed.add(id);
    }
    for(const id of next.removed)if(!game.removed.has(id))scene.finishReplicaFall(id);
    const changed=game.cash!==next.cash||game.ownedUpgrades.size!==next.ownedUpgrades.size
      ||game.prototypes.size!==next.prototypes.size||game.tool!==next.tool;
    const siteId=selectedSite?.id;
    for(const [id,current] of liveRides){
      if(current.at<save.clock){liveRides.delete(id);continue;}
      const index=next.rides.findIndex(r=>r.id===id);
      if(index>=0)next.rides[index]=current.ride;
    }
    if(guestRideId)ride=next.rides.find(r=>r.id===guestRideId);
    if(held){
      const log=next.logs.get(held.log.id);
      held=log?{log,mode:held.mode}:undefined;
    }
    game=next;scene.game=next;
    if(siteId)selectedSite=next.sites.find(site=>site.id===siteId);
    if(page&&(page==='site'||page==='journal'||changed&&['map','upgrades','build','inventory'].includes(page)))ui.refreshLive(page);
  }
  if(first)void persist();
}
async function launchRoom(config:Launch,source:'new'|'solo'|'saved') {
  if(room||!atMenu)throw Error('Return to the main menu before opening a room.');
  const saved=source==='saved'?await loadCampaign(coopSlot(config.region,config.code)):undefined;
  if(source==='saved'&&!saved)throw Error('This room checkpoint could not be loaded.');
  const hosted=config.mode==='host'?(saved||source==='solo'?Campaign.restore(structuredClone(saved??game.snapshot())):
    new Campaign(crypto.getRandomValues(new Uint32Array(1))[0]%2147483647)):undefined;
  solo=game;
  try {
    room=await connectRoom(config,{
      capture:()=>game.snapshot(),checkpoint:receiveRoomSave,advance:advanceRoom,
      fieldSource:()=>({clock:game.clock,logs:game.logs,origin:game.player}),field:applyField,
      fall:(id,from,wedge)=>{
        if(!Number.isInteger(id)||id<0||id>=treesPerCell*TOTAL||game.removed.has(id))return;
        const tree=treesIn(game.seed,Math.floor(id/treesPerCell)).find(tree=>tree.id===id);
        if(tree&&distance(tree,game.player)<75)scene.startFall(tree,from,wedge);
      },
      landed:(id,clock)=>{
        if(!Number.isInteger(id)||id<0||id>=treesPerCell*TOTAL)return;
        liveFelled.set(id,clock);
        game.removed.add(id);
        game.treeDamage.delete(id);
        scene.finishReplicaFall(id);
      },
      ended:message=>{if(!leaving)endRoom(message);},
      action:handleOperator,
      departed:actor=>operators.delete(actor),
      pose:(actor,at)=>{if(room?.isHost)observeOperator(actor,at);},
      roster:()=>{if(hostMenu.dialog.open)hostMenu.refresh();},
      playerStates:captureOperators,applyPlayerStates:applyOperators,
      permissions:(actor,mask)=>{
        if(room?.isHost){
          const state=operators.get(actor);
          if(state&&!canFor('vehicles',actor)){state.ride=undefined;state.steering=0;}
          if(state&&!canFor('field',actor))state.held=undefined;
        }else if(room&&mask>=0){
          if(page)ui.refreshLive(page);
          show('The host updated your gameplay permissions.');
        }
      },
      notice:message=>{if(message)show(message);},
    });
  } catch(error) {solo=undefined;throw error;}
  saveAge=0;hostSaveAge=0;
  scene.replica=guest();
  if(hosted) {
    resetSession(hosted);
    started=true;atMenu=false;page=undefined;
    sound.start(prefs.volume);
    ui.showPlay();
    await persist();
  } else {
    lobby.message('Receiving the host’s campaign checkpoint…');
    await new Promise<void>((resolve,reject)=>{joining={resolve,reject};});
  }
}
function collapseControls() {
  inputs.clear();using=false;buttonAlt=false;dragging=false;
  if(guest()){
    room?.action(pose(),['steer',0]);lastSteeringSent=0;pendingSteering=0;
    if(!prefs.sticky)room?.action(pose(),['field','release',false]);
  }else if(held?.mode==='hand'&&!prefs.sticky)release();
}
function open(target:Page) {
  if(!scene) return;
  if(active()) collapseControls();
  page=target;
  if(hasLock()) document.exitPointerLock();
  ui.show(target);
  if(target==='settings')void refreshArchives();
}
function pointerUnavailable() {
  if(!active()||prefs.look!=='pointer'||toastDelay>performance.now())return;
  toastDelay=performance.now()+3500;
  show('Pointer lock unavailable · hold right mouse to look, or choose drag look in Settings');
}
function acquirePointer() {
  if(prefs.look!=='pointer'||onTouch||hasLock()) return;
  if(!canvas.requestPointerLock){pointerUnavailable();return;}
  try {
    const request=canvas.requestPointerLock() as Promise<void>|undefined;
    request?.catch(pointerUnavailable);
  } catch { pointerUnavailable(); }
}
document.addEventListener('pointerlockerror',pointerUnavailable);

function resume() {
  recording=undefined;
  page=undefined;
  if(atMenu) { ui.showMenu(hasSave,saveError);return; }
  ui.showPlay();
  canvas.focus({preventScroll:true});
  if(!hasLock()) acquirePointer();
}
function mainMenu() {
  if(room){void leaveRoom();return;}
  void persist();
  collapseControls();atMenu=true;page=undefined;
  if(hasLock())document.exitPointerLock();
  ui.showMenu(hasSave);
}
function applySettings() {
  writePreferences(prefs);
  document.documentElement.style.setProperty('--ui-scale',String(prefs.scale));
  scene?.setQuality(prefs.quality);
  sound.volume(prefs.volume);
}
function resetSession(next:Campaign) {
  game=next;scene.replace(next);held=undefined;ride=undefined;waypoint=undefined;selectedSite=undefined;
  selectedBuild=undefined;selectedVehicle=undefined;survey=undefined;airborne=0;vY=0;swing=0;victoryAge=game.won?-2:-1;lastHarvest=game.stats.harvest;
  collapseControls();
}
function begin(kind:'resume'|'new'|'plus',challenge:Challenge='standard') {
  if(room)return;
  if(kind!=='resume') {
    if(hasSave||startedBefore) {
      const current=structuredClone(game.snapshot());
      latestSave=latestSave.catch(()=>{}).then(()=>saveCampaign(current,`archive-${current.seed}-${Date.now()}`));
    }
    const next=new Campaign(kind==='plus'?(game.seed+10739)%2147483647:crypto.getRandomValues(new Uint32Array(1))[0]%2147483647,kind==='plus'?game.challenge:challenge);
    resetSession(next);
  }
  started=true;startedBefore=true;atMenu=false;hasSave=true;
  sound.start(prefs.volume);
  resume();
  void persist();
}
function persist(announce=false) {
  if(currentOperator!==undefined)return Promise.resolve();
  const session=room;
  if(!session&&!startedBefore) return Promise.resolve();
  const source=session&&!session.isHost?roomCheckpoint:game.snapshot();
  if(!source)return Promise.resolve();
  const current=structuredClone(source);
  const slot=session&&coopSlot(session.launch.region,session.launch.code);
  latestSave=latestSave.catch(()=>{}).then(()=>slot?saveRoomCheckpoint(current,slot):saveCampaign(current)).then(()=>{
    if(room===session)saveLabel=session?'CHECKPOINT SAVED':'SAVED LOCALLY';
    if(announce)show(session?'Room checkpoint saved':'Campaign saved');
  }).catch(()=>{
    if(room===session)saveLabel='SAVE FAILED';
    if(announce)show('Could not save locally. Export your campaign in Settings.');
  });
  return latestSave;
}
async function refreshArchives() {
  try {
    const previous=archives.map(x=>x.slot).join();
    archives=await listArchives();
    if(page==='settings'&&!recording&&previous!==archives.map(x=>x.slot).join())ui.show('settings');
  } catch { /* A local-storage failure does not close the settings panel. */ }
}
async function replaceFromBackup(save:Save) {
  if(room)throw Error('Import solo backups from the main menu. Multiplayer backups use Saved rooms.');
  await latestSave;
  if(startedBefore) {
    const current=structuredClone(game.snapshot());
    await saveCampaign(current,`before-import-${Date.now()}`);
  }
  await saveCampaign(save);
  resetSession(Campaign.restore(save));
  hasSave=true;startedBefore=true;
  await refreshArchives();
  if(atMenu) resume();
}
async function importFile(file:File) {
  try {
    if(file.size>60*1024*1024) throw Error('Save file is too large.');
    await replaceFromBackup(validateSave(JSON.parse(await file.text())));
    show('Campaign imported');
  } catch(error) { show(error instanceof Error?error.message:'Could not import campaign'); }
}
async function restoreArchive(slot:string) {
  try {
    const save=await loadCampaign(slot);
    if(!save)throw Error('Archived campaign is unavailable.');
    await replaceFromBackup(save);
    show('Archived campaign restored');
  } catch(error) {show(error instanceof Error?error.message:'Could not restore archived campaign');}
}

function look(dx:number,dy:number) {
  if(!active()||survey)return;
  const angle=.0022*prefs.sensitivity;
  game.player.yaw-=dx*angle;
  game.player.pitch=clamp(game.player.pitch-dy*angle,-1.54,1.54);
}
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{
  if(!active())return;
  if(e.pointerType==='touch') { touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);return; }
  if(e.button===0) {
    if(prefs.look==='pointer'&&!hasLock()) acquirePointer();
    using=true;
    swingTool();
  } else if(e.button===2) { dragging=true;buttonAlt=true; }
});
canvas.addEventListener('pointermove',e=>{
  if(!touchLook||touchLook.id!==e.pointerId)return;
  look((e.clientX-touchLook.x)*1.65,(e.clientY-touchLook.y)*1.65);
  touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};
});
document.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'&&(hasLock()||dragging))look(e.movementX,e.movementY);});
document.addEventListener('pointerup',e=>{
  if(e.pointerType==='touch'){if(touchLook?.id===e.pointerId)touchLook=undefined;return;}
  if(e.button===0)using=false;
  if(e.button===2){dragging=false;buttonAlt=false;}
});
document.addEventListener('pointercancel',()=>{touchLook=undefined;using=false;dragging=false;});
document.addEventListener('pointerlockchange',()=>{
  if(!hasLock()) {
    using=false;
    if(active()&&!onTouch&&prefs.look==='pointer'&&toastDelay<performance.now()){
      toastDelay=performance.now()+4000;
      show('Click the world to recapture the cursor');
    }
  }
});
window.addEventListener('blur',collapseControls);
document.addEventListener('visibilitychange',()=>{if(document.hidden){collapseControls();void persist();}});
window.addEventListener('pagehide',()=>{void persist();});
window.addEventListener('resize',()=>scene?.resize());

function nearLog(range=3,cargoBed?:Point) {
  let closest:Log|undefined,best=range;
  for(const log of game.logs.values()) {
    if(log.cargo||log.carrier||logHeld(log.id))continue;
    const p=scene.logPosition(log,game.player,range);
    if(!p)continue;
    const d=distance(game.player,p);
    if(d<=best&&(!cargoBed||scene.logPosition(log,cargoBed,range))){best=d;closest=log;}
  }
  return closest;
}
function nearSite(range=4.1) {
  let pick:Site|undefined,best=range;
  for(const site of game.sites) {
    const d=distance(site,game.player);
    if(d<best){best=d;pick=site;}
  }
  return pick;
}
function nearRide(towVehicle=false) {
  let closest:Ride|undefined,reach=3.1;
  for(const vehicle of game.rides) {
    if(towVehicle&&vehicleTypes[vehicle.kind].trailer)continue;
    const gap=distance(vehicle,game.player);
    if(gap<reach){closest=vehicle;reach=gap;}
  }
  return closest;
}
function fieldTrees(){
  if(currentOperator===undefined)return scene.visibleTrees;
  const {x,z}=game.player, trees:Tree[]=[];
  for(let row=Math.floor((z-20)/CELL)*CELL;row<=z+20;row+=CELL)
    for(let col=Math.floor((x-20)/CELL)*CELL;col<=x+20;col+=CELL){
      const cell=indexAt(col,row);
      if(cell>=0)trees.push(...treesIn(game.seed,cell));
    }
  return trees;
}
function fieldRocks(){
  return currentOperator===undefined?scene.visibleRocks:rocksAt(game,game.player,tools.breaker.range);
}

function treeTarget(reach=tools[game.tool].range) {
  const p=pose();
  let chosen:Tree|undefined, closest=reach;
  for(const tree of fieldTrees()) {
    if(!game.isStanding(tree)||scene.isFalling(tree))continue;
    const depth=treeAim(game,p,tree,closest);
    if(depth!==undefined){closest=depth;chosen=tree;}
  }
  return chosen;
}

function stumpTarget() {
  const p=game.player;
  return fieldTrees().filter(t=>game.removed.has(t.id)&&!game.groundStumps.has(t.id)&&distance(t,p)<3.7)
    .sort((a,b)=>distance(a,p)-distance(b,p))[0];
}

function rockTarget() {
  const p=game.player, origin=height(p.x,p.z)+1.64+airborne;
  const x=-Math.sin(p.yaw),z=-Math.cos(p.yaw);
  let pick:Rock|undefined,closest=tools.breaker.range;
  for(const rock of fieldRocks()){
    const dx=rock.x-p.x,dz=rock.z-p.z,along=dx*x+dz*z;
    if(along<.2||along>closest||Math.hypot(dx-along*x,dz-along*z)>rock.size+.23)continue;
    const actual=origin+Math.tan(p.pitch)*along;
    if(Math.abs(actual-(height(rock.x,rock.z)+.19))>rock.size*.59+.28)continue;
    closest=along;
    pick=rock;
  }
  return pick;
}

function letGo() { held=undefined;dropTime=.45; }
function release() {
  if(!held)return;
  const log=held.log;
  letGo();
  for(const s of game.sites) {
    const sink=takesLogs(s.kind);
    if(sink&&game.acceptLog(s,log)) {
      show(s.kind==='fire'?'Log accepted · burn in progress':'Timber delivered to '+facilities[s.kind].name);
      void persist();
      return;
    }
  }
}
function interact() {
  if(ride)return;
  if(held&&prefs.sticky){release();return;}
  const log=nearLog();
  if(log){
    if(log.kilograms>game.mods.dragMass){show('Load too heavy · cut into sections or use a vehicle');return;}
    held={log,mode:'hand'};
    sound.select();
    return;
  }
  const site=nearSite();
  if(site&&currentOperator===undefined){ selectedSite=site;open('site'); }
}
function attach(mode:'rope'|'lift') {
  if(held){release();return;}
  const useWinch=mode==='rope'&&Boolean(ride)&&(game.mods.winch||ride?.kind==='tractor'&&ride.attachment==='tow');
  if(mode==='rope'&&!useWinch&&!game.mods.rope){show('Install Twine Bundle to tether a log');return;}
  if(mode==='lift'&&!game.mods.liftLogs){show('Install Lift Technique to lift logs');return;}
  const log=nearLog(useWinch?12:mode==='rope'?game.mods.ropeRange:1.8);
  if(!log)return;
  const slots=mode==='lift'?game.mods.carrySlots:1;
  if(log.kilograms>(useWinch?420:mode==='rope'?game.mods.ropeMass:game.mods.liftMass*slots)){show('Load too heavy');return;}
  held={log,mode:useWinch?'winch':mode};
  sound.select();
}

function toggleRide() {
  if(ride) {
    game.player.x=clamp(ride.x+Math.cos(ride.yaw)*1.55,-SIZE/2+.6,SIZE/2-.6);
    game.player.z=clamp(ride.z-Math.sin(ride.yaw)*1.55,-SIZE/2+.6,SIZE/2-.6);
    if(held?.mode==='winch')release();
    ride=undefined;
    return;
  }
  const nearest=nearRide();
  if(nearest&&vehicleOccupied(nearest.id)){show('That vehicle already has a driver');return;}
  if(!nearest){show('Move closer to a vehicle');return;}
  if(game.sites.some(s=>s.dedicatedRide===nearest.id)){show('This vehicle is assigned to autonomous dispatch');return;}
  if(vehicleTypes[nearest.kind].trailer){show('Couple the trailer from a nearby tow vehicle');return;}
  if(vehicles[nearest.kind].motor && (nearest.fuel<=0||nearest.wear>=100)) {
    if(!game.refuel(nearest)){show('Vehicle needs $18 for service');return;}
  }
  release();
  ride=nearest;game.player.yaw=ride.yaw;
}
function moveCargo() {
  const towing=ride??nearRide();
  if(!towing){show('Move closer to a vehicle');return;}
  if(freightVehicles.includes(towing.kind)){
    const stations=game.sites.filter(s=>distance(towing,s)<6.5).sort((a,b)=>distance(towing,a)-distance(towing,b));
    const unloading=Boolean(towing.freight)&&(buttonAlt||ride!==undefined);
    const station=stations.find(s=>game.freightBed(towing,s,unloading)>0);
    if(station||!['forkliftPro','flatbed'].includes(towing.kind)){
      show(station?(unloading?'Freight delivered':'Loaded '+towing.freight?.quantity+' units'):'No compatible nearby loading station');
      return;
    }
  }
  if(towing.kind==='waterCart'){
    const station=game.sites.filter(s=>waterSites.includes(s.kind)&&distance(towing,s)<5.5).sort((a,b)=>distance(towing,a)-distance(towing,b))[0];
    const unload=Boolean(towing.water)&&((station?.water??0)<30||buttonAlt);
    const volume=station?game.waterCargo(towing,station,unload):0;
    show(volume?`${unload?'Delivered':'Loaded'} ${Math.round(volume)} L · tank ${Math.round(towing.water??0)} L`:'Move within reach of a pump or reservoir');
    return;
  }
  const trailer=game.rides.find(v=>v.hitch===towing.id);
  const v=trailer??towing, def=vehicleTypes[v.kind];
  const reach=def.forks?5.8:4.1;
  const nearby=held?.log??nearLog(reach,v);
  const load=[...game.logs.values()].filter(l=>l.cargo===v.id);
  const canLoad=!ride||def.forks||held?.mode==='winch';
  if(nearby&&!nearby.cargo&&!nearby.carrier&&canLoad&&!(buttonAlt&&load.length&&game.mods.liftBed)) {
    if(!scene.logPosition(nearby,v,reach)){show('Bring the log closer to the cargo bed');return;}
    const max=def.capacity*(v.kind==='cart'?game.mods.cartCapacity:v.kind==='pickup'||v.kind==='towPickup'?game.mods.stakes:1);
    if(cargoMass(load,v.id)+nearby.kilograms>max){show('Cargo bed is over capacity');return;}
    const maxLength=def.trailer||['flatbed','heavyTruck'].includes(v.kind)?19:v.kind==='truck'?13:v.kind==='pickup'||v.kind==='towPickup'?7:def.forks?9:4.1;
    if(nearby.length>maxLength){show('Log is too long for this bed · section it first');return;}
    letGo();nearby.cargo=v.id;
    show('Trunk secured in '+(def.trailer?'the trailer':def.forks?'the grapple':'the cargo bed'));
  } else if(load.length) {
    const discharge=buttonAlt&&game.mods.liftBed?load.slice(-1):load;
    let moved=0;
    for(const [n,log] of discharge.entries()) {
      log.cargo=undefined;
      log.x=clamp(v.x+Math.cos(v.yaw)*(1.7+n*.26),-SIZE/2+.55,SIZE/2-.55);
      log.z=clamp(v.z-Math.sin(v.yaw)*(1.7+n*.26),-SIZE/2+.55,SIZE/2-.55);
      log.y=height(log.x,log.z)+.52+n*.23;
      if(game.sites.some(s=>game.acceptLog(s,log)))moved++;
    }
    show(moved?`Cargo unloaded · ${moved} received by stations`:'Cargo unloaded onto the ground');
  } else show('No cargo nearby');
}
function pushOrCut() {
  if(held){release();return;}
  const log=nearLog();
  if(!log)return;
  const p=game.player;
  if(buttonAlt&&game.tool!=='knife'&&log.units>=2) {
    if(game.cutLog(log.id,{x:log.x+Math.cos(p.yaw)*1.3,z:log.z-Math.sin(p.yaw)*1.3},game.mods.crosscut?(p.pitch<-.32?.33:.67):.5))show('Trunk cut into two usable sections');
  } else scene.shove(log,p.yaw);
}
function fieldPermission(action:string,currentRide?:Ride):RoomPermission|undefined {
  if(['ride','load','hitch'].includes(action)||currentRide&&['rope','drop','swing'].includes(action))return 'vehicles';
  if(action==='probe')return 'research';
  if(['interact','rope','lift','drop','swing'].includes(action))return 'field';
}
function onAction(a:string,pressed:boolean) {
  if(!pressed){
    inputs.delete(a);
    if(a==='interact'&&!prefs.sticky){
      if(guest())room?.action(pose(),['field','release',false]);
      else if(held?.mode==='hand')release();
    }
    return;
  }
  if(!active()||inputs.has(a))return;
  inputs.add(a);
  if(guest()){
    if(a==='interact'&&!ride&&!held&&(!can('field')||!nearLog())){
      const site=nearSite();
      if(site){selectedSite=site;open('site');}
      return;
    }
    const permission=fieldPermission(a,ride);
    if(permission){
      if(!can(permission)){reject(permission);return;}
      if(a==='probe')useFieldAction(a);
      else room?.action(pose(),['field',a,buttonAlt]);
      return;
    }
  }
  useFieldAction(a);
}
function useFieldAction(a:string) {
  switch(a) {
    case 'interact':interact();break;
    case 'drop':
      if(ride?.kind==='tractor'&&buttonAlt){ride.attachment=ride.attachment==='tow'?'saw':'tow';show('Tractor attachment · '+ride.attachment);}
      else pushOrCut();
      break;
    case 'rope':attach('rope');break;
    case 'lift':attach('lift');break;
    case 'ride':toggleRide();break;
    case 'load':
      if(ride&&vehicleTypes[ride.kind].forks&&game.mods.grapple&&buttonAlt){
        const wood=Array.from(game.logs.values()).find(log=>log.cargo===ride!.id);
        if(wood){wood.roll=((wood.roll??0)+Math.PI*.5)%(Math.PI*2);show('Grapple rotated the attached load');break;}
      }
      moveCargo();break;
    case 'probe': {
      if(!game.mods.probe){show('Install the Soil Moisture Probe in Upgrades');break;}
      const p=game.player,i=indexAt(p.x-Math.sin(p.yaw)*5,p.z-Math.cos(p.yaw)*5);
      if(i<0)break;
      const soil=game.soil.get(i);
      show(`Cell ${i} · moisture ${((soil?.moisture??.68)*100).toFixed(1)}% · groundwater ${((soil?.groundwater??.85)*100).toFixed(1)}%`);
      break;
    }
    case 'hitch': {
      const towing=ride??nearRide(true);
      if(!towing||!game.toggleTrailer(towing))show('Requires hitch research and an eligible nearby trailer');
      else show(game.rides.some(v=>v.hitch===towing.id)?'Trailer coupled':'Trailer released');
      break;
    }
    case 'inventory': case 'tool':open('inventory');break;
    case 'map': case 'journal': case 'build': case 'upgrades':open(a);break;
    case 'jump':if(airborne===0&&!ride)vY=5.2;break;
  }
}
function handleTouch(k:string,pressed:boolean) {
  if(k==='swing') {
    using=pressed;
    if(pressed)swingTool();
  } else onAction(k,pressed);
}
function findBinding(code:string) { return (Object.keys(prefs.bindings) as Binding[]).find(k=>prefs.bindings[k]===code); }
window.addEventListener('keydown',e=>{
  if(lobby.open||hostMenu.dialog.open)return;
  if(recording){
    e.preventDefault();
    if(e.code!=='Escape'){
      const old=prefs.bindings[recording],collision=findBinding(e.code);
      if(collision&&collision!==recording)prefs.bindings[collision]=old;
      prefs.bindings[recording]=e.code;
    }
    recording=undefined;applySettings();ui.recording();return;
  }
  if(e.code==='Escape') {
    if(page){e.preventDefault();resume();}
    else if(survey){survey=undefined;}
    else if(selectedBuild||selectedVehicle){selectedBuild=undefined;selectedVehicle=undefined;}
    else if(started&&!atMenu){e.preventDefault();open('pause');}
    return;
  }
  if((e.target as HTMLElement).matches('input, select, button')&&e.code==='Space'&&!active())return;
  const bind=findBinding(e.code);
  if(bind&&active()){
    e.preventDefault();if(!e.repeat)onAction(bind,true);
  }
  if(e.code==='KeyT'&&active()){
    const site=nearSite();
    if(site){selectedSite=site;open('site');}
  }
});
window.addEventListener('keyup',e=>{const bind=findBinding(e.code);if(bind)onAction(bind,false);});

function placement() {return placementAt(game.player,selectedBuild);}
function swingTool() {
  if(ride)return;
  if(currentOperator===undefined&&(!active()||swing>0||survey))return;
  if(guest()){
    const permission=selectedBuild||selectedVehicle?'build':'field';
    if(!can(permission)){using=false;reject(permission);return;}
    if(selectedBuild||selectedVehicle){
      const command:RealtimeValue=selectedBuild?['build',selectedBuild]:['vehicle',selectedVehicle!];
      room?.action(pose(),command);
      selectedBuild=undefined;selectedVehicle=undefined;using=false;
    }else{
      swingPeriod=game.swingTime;swing=swingPeriod;reverse=!reverse;
      room?.action(pose(),['field','swing',buttonAlt]);
      sound.swing(game.tool==='knife',Boolean(treeTarget()));
    }
    return;
  }
  if(currentOperator===undefined&&(selectedBuild||selectedVehicle)){
    using=false;
    const point=placement();
    const built=selectedBuild?game.build(selectedBuild,point):game.acquireRide(selectedVehicle!,point);
    if(built){selectedBuild=undefined;selectedVehicle=undefined;void persist();}
    return;
  }
  swingPeriod=game.swingTime;swing=swingPeriod;reverse=!reverse;
  if(game.tool==='brush'||game.tool==='grinder'||game.tool==='mulcher'){
    const p=game.player;
    let complete=false;
    if(game.tool==='grinder'){const stump=stumpTarget();complete=Boolean(stump&&game.grind(stump));}
    else if(game.tool==='mulcher'){
      const wood=nearLog(3.1);
      if(wood)complete=game.mulch(wood);
      if(!complete){
        const small=treeTarget();
        if(small&&small.kind===0){
          const result=game.hit(small,reverse);
          if(result.felled)scene.startFall(small,p);
          complete=result.damage>0;
        }
      }
    } else complete=game.clearBrush({x:p.x-Math.sin(p.yaw)*2.5,z:p.z-Math.cos(p.yaw)*2.5});
    sound.swing(false,complete);
    if(complete)scene.impact(new Vector3(p.x-Math.sin(p.yaw)*2.2,height(p.x,p.z)+.43,p.z-Math.cos(p.yaw)*2.2),'dust',9);
    return;
  }
  if(game.tool==='breaker'){
    const rock=rockTarget();
    const broken=rock&&game.breakRock(rock.id,rock);
    sound.swing(false,Boolean(broken));
    if(broken)scene.impact(new Vector3(rock.x,height(rock.x,rock.z)+.35,rock.z),'dust',12);
    return;
  }
  const target=treeTarget();
  if(!target){sound.swing(game.tool==='knife',false);return;}
  const result=game.hit(target,reverse);
  if(!result.damage){if(game.battery<5&&game.tool!=='knife'&&game.tool!=='axe'&&game.tool!=='saw'&&toastDelay<performance.now()){toastDelay=performance.now()+3000;show('Tool power depleted · service equipment from the tool bag');}return;}
  sound.swing(game.tool==='knife',true);
  scene.scuff(target,result.ratio,game.player);
  scene.impact(new Vector3(target.x,height(target.x,target.z)+1.33,target.z),'wood',game.tool==='knife'?6:13);
  if(result.felled)scene.startFall(target,game.player,game.mods.wedges&&buttonAlt?(reverse?.58:-.58):0);
}
function movement(dt:number) {
  const p=game.player;
  const ahead=Number(inputs.has('forward'))-Number(inputs.has('back'));
  const sideways=Number(inputs.has('right'))-Number(inputs.has('left'));
  if(ride) {
    const def=vehicleTypes[ride.kind], trailer=game.rides.find(v=>v.hitch===ride!.id);
    const totalMass=(ride.water??0)+(ride.freight?stackMass(ride.freight):0)+cargoMass(game.logs.values(),ride.id)+(trailer?85+cargoMass(game.logs.values(),trailer.id):0);
    const mass=totalMass, terrain=game.soil.get(indexAt(ride.x,ride.z));
    if(def.motor&&(ride.fuel<=0||ride.wear>=100)||trailer&&(trailer.hitchReady??0)>game.clock)return;
    p.yaw-=sideways*dt*(def.motor?1.22:1.88)*(game.mods.articulation&&def.motor?1.22:1);
    const mud=terrain&&terrain.moisture>.79 ? 1-.31*game.mods.traction : 1;
    const rough=Math.abs(height(ride.x+1.6,ride.z)-height(ride.x,ride.z-1.6));
    const ground=1-Math.min(.28,rough*.34)*game.mods.suspension;
    const onRoad=game.sites.some(site=>(['road','pavedRoad','serviceRoad'].includes(site.kind))&&distance(site,ride!)<2.8);
    const speed=def.speed*(1-clamp(mass/Math.max(1,def.capacity||210),0,1)*.47)*(ride.kind==='sled'?game.mods.sledSpeed:1)*mud*ground*(onRoad?1.19:1);
    const movement=dt*speed*ahead*(ahead<0?.48:1);
    const nx=clamp(ride.x-Math.sin(p.yaw)*movement,-SIZE/2+.7,SIZE/2-.7),nz=clamp(ride.z-Math.cos(p.yaw)*movement,-SIZE/2+.7,SIZE/2-.7);
    const next={x:nx,z:nz}, traveled=distance(ride,next), gap=trailerGap(ride);
    const behind=trailer&&traveled>0?{
      x:trailer.x+(nx+Math.sin(p.yaw)*gap-trailer.x)*Math.min(1,dt*4),
      z:trailer.z+(nz+Math.cos(p.yaw)*gap-trailer.z)*Math.min(1,dt*4),
    }:undefined;
    const obstacle=fieldTrees().find(t=>game.isStanding(t)&&distance(t,next)<species[t.kind].radius*t.scale+.69);
    const blockedTrailer=behind&&trailer&&(Math.max(Math.abs(behind.x),Math.abs(behind.z))>SIZE/2-.7
      ||fieldTrees().some(t=>game.isStanding(t)&&distance(t,behind)<species[t.kind].radius*t.scale+1.1
        &&distance(t,behind)<distance(t,trailer)));
    const canMove=!obstacle&&!blockedTrailer;
    if(canMove){
      ride.x=nx;ride.z=nz;
    } else if(obstacle&&['dozer','trackDozer','skid'].includes(ride.kind)){
      if(!scene.isFalling(obstacle))scene.startFall(obstacle,p);
    }
    ride.yaw=p.yaw;p.x=ride.x;p.z=ride.z;
    if(trailer&&behind&&canMove){
      const follow=Math.min(1,dt*4);
      Object.assign(trailer,behind);
      const angle=Math.atan2(ride.x-trailer.x,ride.z-trailer.z)+Math.PI;
      trailer.yaw+=Math.atan2(Math.sin(angle-trailer.yaw),Math.cos(angle-trailer.yaw))*follow;
    }
    if(using&&['tractor','treeHarvester','giantRig'].includes(ride.kind)&&ride.attachment!=='tow'){
      cutterCycle+=dt;
      if(cutterCycle>=.62){
        const radius=ride.kind==='giantRig'?8:game.mods.harvesterHead?6.7:5.4;
        const aimed={x:ride.x-Math.sin(p.yaw)*2.6,z:ride.z-Math.cos(p.yaw)*2.6};
        const eligible=fieldTrees().filter(t=>game.isStanding(t)&&!scene.isFalling(t)&&distance(t,aimed)<radius)
          .sort((a,b)=>distance(a,aimed)-distance(b,aimed)).slice(0,ride.kind==='giantRig'?4:1);
        for(const tree of eligible){
          const hit=game.harvesterHit(tree,ride);
          scene.scuff(tree,hit.ratio,ride);
          scene.impact(new Vector3(tree.x,height(tree.x,tree.z)+1,tree.z),'wood',12);
          if(hit.felled)scene.startFall(tree,ride,0,true);
        }
        if(eligible.length)sound.swing(false,true);
        cutterCycle=0;
      }
    } else cutterCycle=0;
    if(ride.kind==='paver'&&using&&ahead>0&&
      !game.sites.some(site=>['road','pavedRoad','serviceRoad'].includes(site.kind)&&distance(site,ride!)<4))
      game.paveAt({x:ride.x,z:ride.z});
    if(ride.kind==='roller'&&ahead)game.compactGround({x:ride.x,z:ride.z},dt);
    if(ride.kind==='trackDozer'&&ahead){
      const wood=nearLog(2.75);
      if(wood)scene.shove(wood,p.yaw);
    }
    if(using&&['scoopLoader','excavator','shear','demolisher'].includes(ride.kind)){
      earthCycle+=dt;
      if(earthCycle>=.76){
        const work={x:p.x-Math.sin(p.yaw)*3.1,z:p.z-Math.cos(p.yaw)*3.1};
        if(ride.kind==='excavator'||ride.kind==='scoopLoader'){
          if(game.excavate(work,ride))scene.impact(new Vector3(work.x,height(work.x,work.z)+.3,work.z),'dust',15);
        }else if(ride.kind==='shear'){
          const tree=fieldTrees().find(t=>t.kind<=1&&game.isStanding(t)&&!scene.isFalling(t)&&distance(t,work)<2.8);
          if(tree&&ride.fuel>=2){ride.fuel-=2;scene.startFall(tree,p,0,true);sound.swing(false,true);}
        }else{
          const ruin=game.sites.find(s=>s.kind==='ruin'&&distance(s,work)<3.4);
          if(ruin&&game.demolish(ruin,ride))scene.impact(new Vector3(ruin.x,height(ruin.x,ruin.z)+1.1,ruin.z),'dust',20);
        }
        earthCycle=0;
      }
    }else earthCycle=0;
    if((ride.kind==='dozer'||ride.kind==='trackDozer')&&using&&ahead>=0) {
      bladeCycle+=dt;
      if(bladeCycle>=.24) {
        const blade={x:ride.x-Math.sin(p.yaw)*1.4,z:ride.z-Math.cos(p.yaw)*1.4};
        if(game.stripGround(blade,bladeCycle)) {
          ride.fuel=Math.max(0,ride.fuel-bladeCycle*.8);
          scene.impact(new Vector3(blade.x,height(blade.x,blade.z)+.21,blade.z),'dust',4);
        }
        bladeCycle=0;
      }
    } else bladeCycle=0;
    if(def.motor&&canMove&&traveled>0){
      ride.fuel=Math.max(0,ride.fuel-dt*(.24+mass/Math.max(1,def.capacity||210)*.19)*game.mods.fleetEfficiency);
      ride.wear=Math.min(100,ride.wear+dt*.10);
    }
    if(canMove)game.stats.miles+=traveled/1609.344;
    return;
  }
  if(vY!==0||airborne!==0){
    vY-=dt*13.8;airborne+=vY*dt;
    if(airborne<0){airborne=0;vY=0;}
  }
  if(!ahead&&!sideways){stride+=(Math.round(stride/Math.PI)*Math.PI-stride)*dt*5;return;}
  const sprint=inputs.has('sprint')&&!held&&game.stamina>12;
  const base=(sprint?7.3*game.mods.sprint:4.65*game.mods.walk)*game.mods.athlete;
  const load=held ? (held.mode==='rope'?.82:.67)*Math.max(.52,1-held.log.kilograms/210) : 1;
  const soil=game.soil.get(indexAt(p.x,p.z)), mud=soil&&soil.moisture>.79 ? 1-.24*game.mods.mud : 1;
  if(sprint)game.stamina=Math.max(0,game.stamina-dt*14);
  const speed=dt*base*load*mud/Math.max(1,Math.hypot(ahead,sideways));
  const next={
    x:clamp(p.x+(-Math.sin(p.yaw)*ahead+Math.cos(p.yaw)*sideways)*speed,-SIZE/2+.62,SIZE/2-.62),
    z:clamp(p.z+(-Math.cos(p.yaw)*ahead-Math.sin(p.yaw)*sideways)*speed,-SIZE/2+.62,SIZE/2-.62),
  };
  for(const t of fieldTrees()){
    const minimum=species[t.kind].radius*t.scale+.27,d=distance(t,next);
    if(d>=minimum||!game.isStanding(t)||d<.0001)continue;
    next.x=t.x+(next.x-t.x)*minimum/d;next.z=t.z+(next.z-t.z)*minimum/d;
  }
  const h=height(next.x,next.z)-height(p.x,p.z);
  if(h<.52+airborne) { p.x=next.x;p.z=next.z; }
  const last=Math.floor(stride/.86);
  stride+=dt*(sprint?9:held?4:5.8);
  if(last!==Math.floor(stride/.86)&&airborne===0)sound.step(Boolean(held));
}
function targetHint():{hint?:Hint;point?:Point} {
  const t=treeTarget(),log=nearLog(2.75),site=nearSite(3.6),v=nearRide(),p=game.player;
  if(ride) {
    const trailer=game.rides.find(v=>v.hitch===ride!.id);
    const mass=cargoMass(game.logs.values(),trailer?.id??ride.id);
    const load=ride.freight?`${ride.freight.quantity} units`:ride.kind==='waterCart'?`${Math.round(ride.water??0)} L`:`${Math.round(mass)} kg`;
    const extras=['dozer','trackDozer','scoopLoader','excavator','shear','demolisher'].includes(ride.kind)?' · Swing to operate attachment':
      trailer?(trailer.hitchReady??0)>game.clock?' · Coupling trailer':' · '+key('hitch')+' detach':game.mods.winch?' · '+key('rope')+' winch':'';
    return {hint:{key:key('ride'),title:vehicles[ride.kind].name,detail:`${load} aboard · ${key('load')} cargo${extras}`}};
  }
  if(held){
    const destination=game.sites.find(s=>distance(held!.log,s)<facilities[s.kind].size+.80&&takesLogs(s.kind));
    if(destination)return {point:destination,hint:{key:held.mode==='hand'?key('interact'):key('drop'),title:facilities[destination.kind].name,
      detail:destination.kind==='fire'&&game.mods.scale?`Release to deliver · estimated $${game.fireValue(held.log)}`:'Release the log here to deliver'}};
    return {};
  }
  if(log) {
    const canRope=game.mods.rope&&log.kilograms<=game.mods.ropeMass;
    const manual=log.kilograms<=game.mods.dragMass?'Hold to grab and drag':'Too heavy to drag by hand';
    return {point:log,hint:{key:key('interact'),title:log.part==='branch'?'Cut branches':'Felled '+species[log.kind].name.toLowerCase(),
      detail:`${Math.round(log.kilograms)} kg · ${manual}${canRope?' · '+key('rope')+' tether':''}`}};
  }
  if(game.tool==='grinder'){
    const stump=stumpTarget();
    if(stump)return {point:stump,hint:{key:onTouch?'SWING':'LMB',title:'Persistent stump',detail:'Grind it into usable chips'}};
  }
  const rock=game.tool==='breaker'?rockTarget():undefined;
  if(rock)return {point:rock,hint:{key:onTouch?'SWING':'LMB',title:'Surface aggregate',detail:'Break this rock and collect material'}};
  if(t&&game.tool!=='breaker') {
    const damaged=game.treeDamage.get(t.id)??0;
    return {point:t,hint:{key:onTouch?'SWING':'LMB',title:species[t.kind].name,detail:damaged?'Keep cutting the trunk':'Aim at the trunk · hold swing',bar:damaged/(species[t.kind].health*t.scale)}};
  }
  if(v)return {point:v,hint:{key:key('ride'),title:vehicles[v.kind].name,detail:`Drive · ${key('load')} load or unload`}};
  if(site)return {point:site,hint:{key:key('interact'),title:facilities[site.kind].name,detail:site.kind==='fire'?'Drag timber into the stone ring · release to burn':site.status}};
  if(waypoint)return {hint:{title:'Survey marker',detail:Math.round(distance(waypoint,p))+' m'}};
  return {};
}

let before=performance.now();
function frame(now:number) {
  const dt=clamp((now-before)/1000,0,.14);before=now;
  const playing=active(), p=game.player;
  if(room&&!atMenu){
    room.pose(pose(),now);
    if(guest()&&ride&&can('vehicles')&&now-lastSteeringSent>=80){
      const steering=playing?driveKeys.reduce((bits,key,i)=>inputs.has(key)?bits|(1<<i):bits,using?16:0):0;
      if(steering||steering!==pendingSteering){
        room.action(pose(),['steer',steering]);
        pendingSteering=steering;lastSteeringSent=now;
      }
    }
    if(guest()&&!playing){saveAge+=dt;if(saveAge>=8){saveAge=0;void persist();}}
  }
  scene.syncPlayers(room?.poses,dt);
  if(playing&&victoryAge<0){
    swing=Math.max(0,swing-dt);
    dropTime=Math.max(0,dropTime-dt);
    if(survey){
      survey.age+=dt;
      if(survey.age>=7){survey=undefined;show('Survey drone returned');}
    }else{
      if(!guest()||!ride)movement(dt);
      if(using&&!ride)swingTool();
    }
    if(!room)game.tick(dt,!inputs.has('sprint')||(!inputs.has('forward')&&!inputs.has('right')&&!inputs.has('left')&&!inputs.has('back')),held?.log.id);
    if(held&&(!game.logs.has(held.log.id)||distance(held.log,p)>Math.max(held.mode==='winch'?17:8,held.log.length+4)))letGo();
    if(!room&&!held&&dropTime===0)deliverLooseLogs(p);
    if(!room||guest()){saveAge+=dt;if(saveAge>=8){saveAge=0;void persist();}}
    if(waypoint&&distance(p,waypoint)<2.4){waypoint=undefined;show('Survey marker reached');}
  }
  if(playing&&game.won&&game.completionTime>game.clock-3&&victoryAge===-1){victoryAge=0;sound.finish();void persist();}
  if(victoryAge>=0){
    victoryAge+=dt;
    if(victoryAge>=11){victoryAge=-2;open('victory');}
  }
  if(game.stats.harvest>lastHarvest){lastHarvest=game.stats.harvest;sound.fall();void persist();}
  for(const notice of game.notices.splice(0)){show(notice);if(notice.startsWith('+$'))sound.cash();}
  const land=game.soil.get(indexAt(p.x,p.z));
  const targeting=atMenu||page||victoryAge>=0?{}:survey?{hint:{title:'Aerial survey',detail:'Esc to return to the field'}}:targetHint();
  const aimed=selectedBuild?facilities[selectedBuild].name:selectedVehicle?vehicles[selectedVehicle].name:undefined;
  const point=aimed?placement():undefined;
  const problem=selectedBuild&&point?game.siteIssue(selectedBuild,point):'';
  const orientation=['N','NE','E','SE','S','SW','W','NW'];
  const scale=(Math.round(-p.yaw/(Math.PI/4))%8+8)%8;
  if(!atMenu)ui.update({x:p.x,z:p.z,stage:land?.stage??0,held:held?species[held.log.kind].name:undefined,ride:ride?vehicles[ride.kind].name:undefined,
    rideDetail:ride?(vehicles[ride.kind].motor?`${Math.round(ride.fuel)}% fuel · ${Math.round(ride.wear)}% wear`:'Manual transport'):undefined,
    hint:targeting.hint,running:playing,direction:`${orientation[scale]}  /  ${Math.round(p.x)} E  ${Math.round(-p.z)} N`,elapsed:game.clock,waypoint,aimedBuild:aimed,
    buildIssue:problem,saved:room?`${room.isHost?'HOST':'PLAYER '+room.actorNumber} · ${room.count}/4 · ${saveLabel||'SYNCING'}`:saveLabel,touch:onTouch});
  sound.ambient(game.clock,game.rain,(land?.stage??0)<3,Boolean(ride&&vehicles[ride.kind].motor),playing);
  scene.render({dt,at:p,y:height(p.x,p.z)+(ride?1.89:1.64)+airborne,yaw:p.yaw,pitch:p.pitch,menu:atMenu,active:playing&&victoryAge<0&&!survey,shared:Boolean(room?.isHost),survey,
    swing:swing>0?1-swing/swingPeriod:0,reverse,reduced:prefs.reduced,stride,held,target:targeting.point,drive:ride,
    build:point?{point,valid:!problem,size:selectedBuild?facilities[selectedBuild].size:1.9}:undefined,
    waypoint,flyover:victoryAge>=0?victoryAge:undefined});
  requestAnimationFrame(frame);
}

async function boot() {
  let saved:Save|undefined;
  try { saved=await loadCampaign(); }
  catch { saveError='The last local save could not be loaded. You can import a backup from Settings.'; }
  if(saved) {
    game=Campaign.restore(saved);hasSave=true;startedBefore=true;victoryAge=game.won?-2:-1;lastHarvest=game.stats.harvest;
    if(prefs.offline&&!game.won) {
      const seconds=Math.max(0,Math.min(300,Math.floor((Date.now()-saved.savedAt)/1000)));
      const startCash=game.cash,startingDesert=game.desertCount;
      for(let i=0;i<seconds;i++)game.tick(1);
      game.notices.length=0;
      if(seconds>=5)saveError=`Offline simulation ran for ${seconds}s · +$${game.cash-startCash} · ${game.desertCount-startingDesert} new desert cells.`;
    }
  }
  try {
    await initializePhysics();
    scene=new Scene(canvas,game);
    scene.remotelyHeld=id=>[...operators.values()].some(state=>state.held?.log.id===id);
    scene.onFall=(id,from,wedge)=>room?.fallen(id,from,wedge);
    scene.onLanded=id=>room?.landed(id,game.clock);
    applySettings();
    ui.showMenu(hasSave,saveError);
    if(new URLSearchParams(location.search).has('room'))showLobby();
    if(import.meta.env.DEV&&new URLSearchParams(location.search).has('review')) {
      Object.defineProperty(window,'clearcutReview',{value:()=>structuredClone({...game.snapshot(),observed:{airborne,look:prefs.look}}),configurable:false});
    }
    requestAnimationFrame(frame);
  } catch(error) {
    console.error(error);
    ui.fatal('Project Clearcut needs WebGL 2 with hardware acceleration enabled.');
  }
}
void boot();

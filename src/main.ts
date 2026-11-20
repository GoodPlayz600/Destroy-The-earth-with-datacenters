import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './style.css';
import { Vector3 } from 'three';
import { SIZE, facilities, recipes, species, tools, vehicles } from './catalog';
import type { Facility, Tool, VehicleType } from './catalog';
import { Campaign, cargoMass } from './campaign';
import type { Log, Ride, Save, Site } from './campaign';
import { clamp, distance, height, indexAt } from './land';
import type { Point, Tree } from './land';
import { Scene, initializePhysics } from './scene';
import { Sound } from './sound';
import { downloadSave, loadCampaign, readPreferences, saveCampaign, validateSave, writePreferences } from './storage';
import type { Binding } from './storage';
import { UI } from './ui';
import type { Hint, Page } from './ui';

const canvas=document.querySelector<HTMLCanvasElement>('#world')!;
const root=document.querySelector<HTMLDivElement>('#ui')!;
const prefs=readPreferences();
let game=new Campaign();
let scene:Scene;
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
let selectedVehicle:VehicleType|undefined;
let held: {log:Log;mode:'hand'|'rope'|'lift'}|undefined;
let recording:Binding|undefined;
let dragging=false;
let using=false;
let buttonAlt=false;
let touchLook:{id:number;x:number;y:number}|undefined;
let swing=0, swingPeriod=.32, reverse=false, vY=0, airborne=0, stride=0, dropTime=0, saveAge=0, victoryAge=-1;
let toastDelay=0,bladeCycle=0;
let lastHarvest=0;
let latestSave:Promise<unknown>=Promise.resolve();
const inputs=new Set<string>();
const onTouch='ontouchstart' in window && matchMedia('(pointer: coarse)').matches;
const hasLock=()=>document.pointerLockElement===canvas;
const active=()=>started&&!atMenu&&!page;
const key=(binding:Binding)=>prefs.bindings[binding].replace(/^Key|^Digit/g,'');
const forward=new Vector3();
const head=new Vector3();
const show=(message:string)=>ui.notice(message);

const ui=new UI(root,{
  game:()=>game,prefs,open,begin,resume,menu:mainMenu,refresh:()=>{if(page)ui.show(page);void persist();},
  save:()=>{void persist(true);},download:()=>{downloadSave(game.snapshot());show('Campaign exported');},restore:(file)=>{void importFile(file);},
  applySettings, binding:(id)=>{recording=id;ui.recording(id);},
  build:(f)=>{selectedBuild=f;selectedVehicle=undefined;resume();},
  ride:(v)=>{selectedVehicle=v;selectedBuild=undefined;resume();},
  waypoint:(p)=>{waypoint={x:p.x,z:p.z};show('Survey point marked');resume();},
  site:()=>selectedSite,touch:handleTouch,fullscreen:()=>{
    if(document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen().catch(()=>show('Fullscreen is unavailable in this browser'));
  },
});
function collapseControls() {
  inputs.clear();using=false;buttonAlt=false;dragging=false;
  if(held?.mode==='hand'&&!prefs.sticky) release();
}
function open(target:Page) {
  if(!scene) return;
  if(active()) collapseControls();
  page=target;
  if(hasLock()) document.exitPointerLock();
  ui.show(target);
}
function acquirePointer() {
  if(prefs.look!=='pointer'||onTouch||hasLock()||!canvas.requestPointerLock) return;
  try {
    const request=canvas.requestPointerLock() as Promise<void>|undefined;
    request?.catch(()=>{if(prefs.look==='pointer')show('Click the world to capture the cursor, or choose drag look in Settings');});
  } catch { show('Pointer lock unavailable. Use right-mouse drag to look around.'); }
}
function resume() {
  recording=undefined;
  page=undefined;
  if(atMenu) { ui.showMenu(hasSave,saveError);return; }
  ui.showPlay();
  canvas.focus({preventScroll:true});
  if(!hasLock()) acquirePointer();
}
function mainMenu() {
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
  selectedBuild=undefined;selectedVehicle=undefined;airborne=0;vY=0;swing=0;victoryAge=game.won?-2:-1;lastHarvest=game.stats.harvest;
  collapseControls();
}
function begin(kind:'resume'|'new'|'plus') {
  if(kind!=='resume') {
    if(hasSave||startedBefore) {
      const current=structuredClone(game.snapshot());
      latestSave=latestSave.catch(()=>{}).then(()=>saveCampaign(current,`archive-${current.seed}-${Date.now()}`));
    }
    const next=new Campaign(kind==='plus'?(game.seed+10739)%2147483647:crypto.getRandomValues(new Uint32Array(1))[0]%2147483647);
    resetSession(next);
  }
  started=true;startedBefore=true;atMenu=false;hasSave=true;
  sound.start(prefs.volume);
  resume();
  void persist();
}
function persist(announce=false) {
  if(!startedBefore) return Promise.resolve();
  const current=structuredClone(game.snapshot());
  latestSave=latestSave.catch(()=>{}).then(()=>saveCampaign(current)).then(()=>{
    saveLabel='SAVED LOCALLY';
    if(announce)show('Campaign saved');
  }).catch(()=>{
    saveLabel='SAVE FAILED';
    if(announce)show('Could not save locally. Export your campaign in Settings.');
  });
  return latestSave;
}
async function importFile(file:File) {
  try {
    if(file.size>60*1024*1024) throw Error('Save file is too large.');
    const save=validateSave(JSON.parse(await file.text()));
    if(startedBefore) {
      const previous=structuredClone(game.snapshot());
      await saveCampaign(previous,`before-import-${Date.now()}`);
    }
    await saveCampaign(save);
    resetSession(Campaign.restore(save));
    hasSave=true;startedBefore=true;
    show('Campaign imported');
    if(atMenu) resume();
  } catch(error) { show(error instanceof Error?error.message:'Could not import campaign'); }
}

function look(dx:number,dy:number) {
  if(!active())return;
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

function nearLog(range=3) {
  let closest:Log|undefined,best=range;
  for(const log of game.logs.values()) {
    if(log.cargo||log.carrier)continue;
    const p=scene.logPosition(log,game.player,range);
    if(!p)continue;
    const d=distance(game.player,p);
    if(d<=best){best=d;closest=log;}
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
function nearRide() { return game.rides.find(v=>distance(v,game.player)<3.1); }
function treeTarget(reach=tools[game.tool].range) {
  const p=game.player, eye=height(p.x,p.z)+1.64+airborne;
  head.set(p.x,eye,p.z);
  forward.set(-Math.sin(p.yaw)*Math.cos(p.pitch),Math.sin(p.pitch),-Math.cos(p.yaw)*Math.cos(p.pitch));
  if(Math.abs(p.pitch)>1.40)return;
  let chosen:Tree|undefined, closest=reach;
  for(const tree of scene.visibleTrees) {
    if(!game.isStanding(tree)||scene.isFalling(tree))continue;
    const s=species[tree.kind], r=s.radius*tree.scale+(game.mods.forestryMastery?.19:.095);
    if(distance(p,tree)>reach+.9)continue;
    const along=((tree.x-p.x)*forward.x+(tree.z-p.z)*forward.z)/(forward.x**2+forward.z**2);
    if(along<.22||along>closest)continue;
    const y=eye+forward.y*along;
    const width=Math.hypot(p.x+along*forward.x-tree.x,p.z+along*forward.z-tree.z);
    if(width>r||y<height(tree.x,tree.z)+.21||y>height(tree.x,tree.z)+s.height*tree.scale*.84)continue;
    closest=along;chosen=tree;
  }
  return chosen;
}

function letGo() { held=undefined;dropTime=.45; }
function release() {
  if(!held)return;
  const log=held.log;
  letGo();
  for(const s of game.sites) {
    const sink=s.kind==='fire'||s.kind==='market'||s.kind==='depot'||['bench','mill','chipper','charcoal'].includes(s.kind);
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
  if(site){ selectedSite=site;open('site'); }
}
function attach(mode:'rope'|'lift') {
  if(held){release();return;}
  if(mode==='rope'&&!game.mods.rope){show('Install Twine Bundle to tether a log');return;}
  if(mode==='lift'&&!game.mods.liftLogs){show('Install Lift Technique to lift logs');return;}
  const log=nearLog(mode==='rope'?game.mods.ropeRange:1.8);
  if(!log)return;
  const slots=mode==='lift'?game.mods.carrySlots:1;
  if(log.kilograms>(mode==='rope'?game.mods.ropeMass:game.mods.liftMass*slots)){show('Load too heavy');return;}
  held={log,mode};
  sound.select();
}
function toggleRide() {
  if(ride) {
    game.player.x=clamp(ride.x+Math.cos(ride.yaw)*1.55,-SIZE/2+.6,SIZE/2-.6);
    game.player.z=clamp(ride.z-Math.sin(ride.yaw)*1.55,-SIZE/2+.6,SIZE/2-.6);
    ride=undefined;
    return;
  }
  const nearest=nearRide();
  if(!nearest){show('Move closer to a vehicle');return;}
  if(vehicles[nearest.kind].motor && (nearest.fuel<=0||nearest.wear>=100)) {
    if(!game.refuel(nearest)){show('Vehicle needs $18 for service');return;}
  }
  release();
  ride=nearest;game.player.yaw=ride.yaw;
}
function moveCargo() {
  const v=ride??nearRide();
  if(!v){show('Move closer to a vehicle');return;}
  const nearby=held?.log??nearLog(4.1);
  const load=[...game.logs.values()].filter(l=>l.cargo===v.id);
  if(nearby&&!nearby.cargo&&!ride) {
    const max=vehicles[v.kind].capacity*(v.kind==='cart'?game.mods.cartCapacity:1);
    if(cargoMass(load,v.id)+nearby.kilograms>max){show('Cargo bed is over capacity');return;}
    if(nearby.length>(v.kind==='truck'?13:v.kind==='pickup'?7:4.1)){show('Log is too long for this bed · section it first');return;}
    letGo();nearby.cargo=v.id;
    show('Trunk secured in cargo bed');
  } else if(load.length) {
    let moved=0;
    for(const [n,log] of load.entries()) {
      log.cargo=undefined;
      log.x=clamp(v.x+Math.cos(v.yaw)*(1.7+n*.26),-SIZE/2+.55,SIZE/2-.55);
      log.z=clamp(v.z-Math.sin(v.yaw)*(1.7+n*.26),-SIZE/2+.55,SIZE/2-.55);
      log.y=height(log.x,log.z)+.52+n*.23;
      const s=game.sites.find(s=>game.acceptLog(s,log));
      if(s)moved++;
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
function onAction(a:string,pressed:boolean) {
  if(!pressed){
    inputs.delete(a);
    if(a==='interact'&&held?.mode==='hand'&&!prefs.sticky)release();
    return;
  }
  if(!active()||inputs.has(a))return;
  inputs.add(a);
  switch(a) {
    case 'interact':interact();break;
    case 'drop':pushOrCut();break;
    case 'rope':attach('rope');break;
    case 'lift':attach('lift');break;
    case 'ride':toggleRide();break;
    case 'load':moveCargo();break;
    case 'inventory': case 'tool':open('inventory');break;
    case 'map': case 'journal': case 'build': case 'upgrades':open(a);break;
    case 'jump':if(airborne===0&&!ride)vY=5.2;break;
  }
}
function handleTouch(k:string,pressed:boolean) {
  if(k==='swing')using=pressed;
  else onAction(k,pressed);
}
function findBinding(code:string) { return (Object.keys(prefs.bindings) as Binding[]).find(k=>prefs.bindings[k]===code); }
window.addEventListener('keydown',e=>{
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

function placement() {
  const p=game.player;
  const base=clamp(4.7+Math.max(0,-p.pitch)*-.7,3.7,5.4);
  const range=base+(selectedBuild?facilities[selectedBuild].size*.53:0);
  return {x:Math.round((p.x-Math.sin(p.yaw)*range)*2)/2,z:Math.round((p.z-Math.cos(p.yaw)*range)*2)/2};
}
function swingTool() {
  if(ride)return;
  if(!active()||swing>0)return;
  if(selectedBuild||selectedVehicle){
    using=false;
    const point=placement();
    const built=selectedBuild?game.build(selectedBuild,point):game.acquireRide(selectedVehicle!,point);
    if(built){selectedBuild=undefined;selectedVehicle=undefined;void persist();}
    return;
  }
  swingPeriod=game.swingTime;swing=swingPeriod;reverse=!reverse;
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
    const def=vehicles[ride.kind], mass=cargoMass(game.logs.values(),ride.id), terrain=game.soil.get(indexAt(ride.x,ride.z));
    if(def.motor&&(ride.fuel<=0||ride.wear>=100))return;
    p.yaw-=sideways*dt*(def.motor?1.22:1.88);
    const speed=def.speed*(1-clamp(mass/def.capacity,0,1)*.47)*(ride.kind==='sled'?game.mods.sledSpeed:1)*(terrain?.moisture&&terrain.moisture>.83?.82:1);
    const movement=dt*speed*ahead*(ahead<0?.48:1);
    const nx=clamp(ride.x-Math.sin(p.yaw)*movement,-SIZE/2+.7,SIZE/2-.7),nz=clamp(ride.z-Math.cos(p.yaw)*movement,-SIZE/2+.7,SIZE/2-.7);
    const obstacle=scene.visibleTrees.find(t=>game.isStanding(t)&&distance(t,{x:nx,z:nz})<species[t.kind].radius*t.scale+.69);
    if(!obstacle){
      ride.x=nx;ride.z=nz;
    } else if(ride.kind==='dozer'||ride.kind==='skid'){
      if(!scene.isFalling(obstacle))scene.startFall(obstacle,p);
    }
    ride.yaw=p.yaw;p.x=ride.x;p.z=ride.z;
    if(ride.kind==='dozer'&&using&&ahead>=0) {
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
    if(def.motor&&ahead){
      ride.fuel=Math.max(0,ride.fuel-dt*(.24+mass/def.capacity*.19));
      ride.wear=Math.min(100,ride.wear+dt*.10);
    }
    game.stats.miles+=Math.abs(movement)/1609.344;
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
  for(const t of scene.visibleTrees){
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
  if(ride)return { hint:{key:key('ride'),title:vehicles[ride.kind].name,detail:`${Math.floor(ride.fuel)}% fuel · ${Math.round(cargoMass(game.logs.values(),ride.id))} kg · ${key('load')} unload${ride.kind==='dozer'?' · Swing to strip soil':''}`}};
  if(held){
    const destination=game.sites.find(s=>distance(held!.log,s)<facilities[s.kind].size+.80&&['fire','market','depot','bench','mill','chipper','charcoal'].includes(s.kind));
    if(destination)return {point:destination,hint:{key:held.mode==='hand'?key('interact'):key('drop'),title:facilities[destination.kind].name,
      detail:destination.kind==='fire'&&game.mods.scale?`Release to deliver · estimated $${game.fireValue(held.log)}`:'Release the log here to deliver'}};
    return {};
  }
  if(log) return {point:log,hint:{key:key('interact'),title:'Felled '+species[log.kind].name.toLowerCase(),detail:`${Math.round(log.kilograms)} kg · ${log.kilograms>game.mods.dragMass?'Too heavy to drag':'Hold to grab and drag'}`}};
  if(t) {
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
  if(playing&&victoryAge<0){
    swing=Math.max(0,swing-dt);
    dropTime=Math.max(0,dropTime-dt);
    movement(dt);
    if(using)swingTool();
    game.tick(dt,!inputs.has('sprint')||(!inputs.has('forward')&&!inputs.has('right')&&!inputs.has('left')&&!inputs.has('back')),held?.log.id);
    if(held&&(!game.logs.has(held.log.id)||distance(held.log,p)>Math.max(8,held.log.length+4)))letGo();
    if(!held&&dropTime===0) {
      for(const l of game.logs.values()) {
        if(l.cargo||l.carrier||distance(l,p)>16)continue;
        if(game.sites.some(s=>s.kind==='fire'&&distance(l,s)<1.15&&game.acceptLog(s,l))) { void persist();break; }
      }
    }
    saveAge+=dt;
    if(saveAge>=8){saveAge=0;void persist();}
    if(waypoint&&distance(p,waypoint)<2.4){waypoint=undefined;show('Survey marker reached');}
  }
  if(playing&&game.won&&game.completionTime>game.clock-1&&victoryAge===-1){victoryAge=0;sound.finish();void persist();}
  if(victoryAge>=0){
    victoryAge+=dt;
    if(victoryAge>=11){victoryAge=-2;open('victory');}
  }
  if(game.stats.harvest>lastHarvest){lastHarvest=game.stats.harvest;sound.fall();void persist();}
  for(const notice of game.notices.splice(0)){show(notice);if(notice.startsWith('+$'))sound.cash();}
  const land=game.soil.get(indexAt(p.x,p.z));
  const targeting=atMenu||page||victoryAge>=0?{}:targetHint();
  const aimed=selectedBuild?facilities[selectedBuild].name:selectedVehicle?vehicles[selectedVehicle].name:undefined;
  const point=aimed?placement():undefined;
  const problem=selectedBuild&&point?game.siteIssue(selectedBuild,point):'';
  const orientation=['N','NE','E','SE','S','SW','W','NW'];
  const scale=(Math.round(-p.yaw/(Math.PI/4))%8+8)%8;
  if(!atMenu)ui.update({x:p.x,z:p.z,stage:land?.stage??0,held:held?species[held.log.kind].name:undefined,ride:ride?vehicles[ride.kind].name:undefined,
    hint:targeting.hint,running:playing,direction:`${orientation[scale]}  /  ${Math.round(p.x)} E  ${Math.round(-p.z)} N`,elapsed:game.clock,waypoint,aimedBuild:aimed,
    buildIssue:problem,saved:saveLabel,touch:onTouch});
  sound.ambient(game.clock,game.rain,(land?.stage??0)<3,Boolean(ride&&vehicles[ride.kind].motor),playing);
  scene.render({dt,at:p,y:height(p.x,p.z)+(ride?1.89:1.64)+airborne,yaw:p.yaw,pitch:p.pitch,menu:atMenu,active:playing&&victoryAge<0,
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
    applySettings();
    ui.showMenu(hasSave,saveError);
    if(import.meta.env.DEV&&new URLSearchParams(location.search).has('review')) {
      Object.defineProperty(window,'clearcutReview',{value:()=>structuredClone(game.snapshot()),configurable:false});
    }
    requestAnimationFrame(frame);
  } catch(error) {
    console.error(error);
    ui.fatal('Project Clearcut needs WebGL 2 with hardware acceleration enabled.');
  }
}
void boot();

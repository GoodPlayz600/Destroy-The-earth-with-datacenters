import { CELLS, DISTRICTS, TOTAL, facilities, goods, species, tools, vehicles } from './catalog';
import { VERSION } from './campaign';
import type { Save } from './campaign';
import { indexAt } from './land';
import { upgradesById } from './upgrades';

export const bindingOptions = {
  forward: ['Forward','KeyW'], back: ['Back','KeyS'], left: ['Strafe left','KeyA'], right: ['Strafe right','KeyD'],
  sprint: ['Sprint','ShiftLeft'], jump: ['Jump','Space'], interact: ['Interact / hold to drag','KeyE'],
  drop: ['Drop, push or cut log','KeyG'], rope: ['Attach / detach rope','KeyR'], tool: ['Equipment','KeyQ'],
  inventory: ['Inventory','Tab'], build: ['Construction','KeyB'], map: ['Survey map','KeyM'],
  upgrades: ['Upgrades','KeyU'], journal: ['Journal','KeyJ'], ride: ['Drive / leave vehicle','KeyF'],
  load: ['Load / unload cargo','KeyL'], lift: ['Lift log','KeyC'],
};
export type Binding = keyof typeof bindingOptions;
export type Preferences = {
  quality:'low'|'medium'|'high'; volume:number; sensitivity:number; scale:number; sticky:boolean; reduced:boolean;
  look:'pointer'|'drag'; bindings:Record<Binding,string>; offline:boolean;
};
export const defaults:Preferences = {
  quality:'medium',volume:.58,sensitivity:1,scale:1,sticky:false,reduced:false,look:'pointer',offline:false,
  bindings:Object.fromEntries(Object.entries(bindingOptions).map(([k,v])=>[k,v[1]])) as Preferences['bindings'],
};
export function readPreferences(): Preferences {
  try {
    const saved=JSON.parse(localStorage.getItem('clearcut.preferences')??'{}') as Partial<Preferences>;
    const values={...defaults,...saved,bindings:{...defaults.bindings,...saved.bindings}};
    values.volume=Number.isFinite(values.volume)?Math.max(0,Math.min(1,values.volume)):defaults.volume;
    values.scale=Number.isFinite(values.scale)?Math.max(.8,Math.min(1.25,values.scale)):defaults.scale;
    values.sensitivity=Number.isFinite(values.sensitivity)?Math.max(.25,Math.min(2,values.sensitivity)):defaults.sensitivity;
    if(!['low','medium','high'].includes(values.quality)) values.quality=defaults.quality;
    if(!['pointer','drag'].includes(values.look)) values.look=defaults.look;
    return values;
  } catch { return structuredClone(defaults); }
}
export function writePreferences(options:Preferences) {
  try { localStorage.setItem('clearcut.preferences',JSON.stringify(options)); } catch { /* Keep settings for this session. */ }
}

const object=(x:unknown):x is Record<string,unknown> => x!==null && typeof x==='object' && !Array.isArray(x);
const numeric=(x:unknown,low=-Infinity,high=Infinity):x is number => typeof x==='number'&&Number.isFinite(x)&&x>=low&&x<=high;
const integer=(x:unknown,low=0,high=Number.MAX_SAFE_INTEGER):x is number => numeric(x,low,high)&&Number.isInteger(x);
const key=(x:unknown, options:object): x is string=>typeof x==='string'&&Object.hasOwn(options,x);
const rows=(x:unknown,maximum:number,verify:(entry:unknown)=>boolean):x is unknown[]=>Array.isArray(x)&&x.length<=maximum&&x.every(verify);
const flag=(x:unknown)=>typeof x==='boolean';
const identifier=(x:unknown)=>typeof x==='string'&&/^[sv][1-9]\d*$/.test(x)&&x.length<18;
const text=(x:unknown)=>typeof x==='string'&&x.length<400;
const coordinate=(x:Record<string,unknown>)=>numeric(x.x)&&numeric(x.z)&&indexAt(x.x,x.z)>=0;
const lot=(x:unknown)=>object(x)&&key(x.good,goods)&&integer(x.quantity,1,260)&&numeric(x.quality,0,1)&&numeric(x.moisture,0,1);
const job=(x:unknown)=>object(x)&&key(x.good,goods)&&integer(x.quantity,0,260)&&numeric(x.quality,0,1)&&numeric(x.moisture,0,1)&&numeric(x.remaining,-100000,3600)&&(x.payout===undefined||integer(x.payout));
const soilFields=['vegetation','moisture','groundwater','fertility','heat','pollution','erosion','substrate'];
const treeId=(x:unknown)=>integer(x,0,TOTAL*6-1);
const distinct=(values: unknown[])=>new Set(values).size===values.length;

export function validateSave(data:unknown): Save {
  if(!object(data)||data.version!==VERSION) throw Error('Unsupported save format or version.');
  const s=data;
  const valid=integer(s.seed,0,2**31-1)&&numeric(s.clock,0)&&integer(s.cash)&&integer(s.savedAt)
    &&object(s.player)&&coordinate(s.player)&&numeric(s.player.yaw)&&numeric(s.player.pitch,-1.6,1.6)
    &&key(s.tool,tools)&&numeric(s.wear,0,150)&&numeric(s.battery,0,100)&&flag(s.won)&&numeric(s.completionTime,0)&&integer(s.nextId,3)
    &&(s.toolWear===undefined||(object(s.toolWear)&&Object.entries(s.toolWear).every(([k,v])=>key(k,tools)&&numeric(v,0,150))))
    &&rows(s.treeDamage,TOTAL*6,x=>Array.isArray(x)&&x.length===2&&treeId(x[0])&&numeric(x[1],0,500))
    &&rows(s.removed,TOTAL*6,treeId)&&distinct(s.removed as unknown[])
    &&rows(s.soil,TOTAL,x=>Array.isArray(x)&&x.length===2&&integer(x[0],0,TOTAL-1)&&object(x[1])
      &&soilFields.every(field=>numeric(x[1][field],0,1))&&integer(x[1].stage,0,6)&&numeric(x[1].stable,0)&&numeric(x[1].lastTick,0)&&numeric(x[1].clearedFor,0))
    &&rows(s.logs,30000,x=>object(x)&&integer(x.id,1)&&coordinate(x)&&numeric(x.y,-40,80)&&rows(x.q,4,y=>numeric(y,-1.001,1.001))&&x.q.length===4
      &&Math.abs(Math.hypot(...x.q as number[])-1)<.01&&integer(x.kind,0,species.length-1)&&numeric(x.length,.05,40)&&numeric(x.kilograms,.1,1000)
      &&integer(x.units,1,20)&&numeric(x.quality,0,1)&&numeric(x.moisture,0,1)&&(x.cargo===undefined||identifier(x.cargo))&&(x.carrier===undefined||identifier(x.carrier)))
    &&rows(s.sites,20000,x=>object(x)&&identifier(x.id)&&key(x.kind,facilities)&&coordinate(x)&&rows(x.input,260,lot)&&rows(x.output,260,lot)
      &&rows(x.jobs,8,job)&&flag(x.on)&&numeric(x.fuel,0,100)&&text(x.status)&&(x.link===undefined||identifier(x.link))
      &&(x.mode===undefined||x.mode==='sell'||x.mode==='charcoal')
      &&(x.haul===undefined||(object(x.haul)&&coordinate(x.haul)&&identifier(x.haul.target)
        &&(x.haul.log===undefined||integer(x.haul.log,1))&&text(x.haul.status)&&['waiting','pickup','delivery','return'].includes(String(x.haul.phase)))))
    &&rows(s.rides,10000,x=>object(x)&&identifier(x.id)&&key(x.kind,vehicles)&&coordinate(x)&&numeric(x.fuel,0,100)&&numeric(x.wear,0,100)&&numeric(x.yaw))
    &&rows(s.stock,150,lot)&&rows(s.ownedTools,Object.keys(tools).length,x=>key(x,tools))&&(s.ownedTools as unknown[]).includes(s.tool)
    &&rows(s.ownedUpgrades,288,x=>typeof x==='string'&&upgradesById.get(x)?.implemented===true)&&distinct(s.ownedUpgrades as unknown[])
    &&rows(s.districts,DISTRICTS**2,x=>integer(x,0,DISTRICTS**2-1))&&distinct(s.districts as unknown[])
    &&rows(s.ledger,150,x=>object(x)&&numeric(x.date,0)&&text(x.note)&&numeric(x.amount))
    &&rows(s.contracts,25,x=>object(x)&&key(x.good,goods)&&integer(x.quantity,1,60)&&numeric(x.deadline,0)&&integer(x.payout)&&flag(x.done)&&flag(x.failed))
    &&rows(s.projects,DISTRICTS**2,x=>object(x)&&['watershed','quarry','thermal'].includes(String(x.kind))&&integer(x.district,0,DISTRICTS**2-1)&&numeric(x.phase,0))
    &&rows(s.achievements,30,text)&&object(s.stats)&&['hits','harvest','fire','sold','produced','earned','spent','miles'].every(k=>numeric((s.stats as Record<string,unknown>)[k],0));
  if(!valid) throw Error('This save contains invalid campaign data.');
  const checked=s as unknown as Save;
  const rides=new Set(checked.rides.map(x=>x.id)), sites=new Set(checked.sites.map(x=>x.id));
  if(rides.size!==checked.rides.length||sites.size!==checked.sites.length
    ||!distinct(checked.logs.map(l=>l.id))||!distinct(checked.soil.map(([i])=>i))||!distinct(checked.projects.map(p=>p.district))
    ||checked.logs.some(log=>log.cargo&&!rides.has(log.cargo)||log.carrier&&!sites.has(log.carrier))
    ||checked.sites.some(site=>site.link&&!sites.has(site.link)||site.haul&&!sites.has(site.haul.target))
    ||[...checked.logs.map(l=>l.id),...Array.from(rides,x=>Number(x.slice(1))),...Array.from(sites,x=>Number(x.slice(1)))].some(i=>i>=checked.nextId)) {
    throw Error('This save contains invalid object references.');
  }
  return checked;
}

let db:Promise<IDBDatabase> | undefined;
function database() {
  if(!db) db=new Promise((resolve,reject)=>{
    const request=indexedDB.open('project-clearcut',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('campaigns');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
  return db;
}
export async function loadCampaign() {
  const storage=await database();
  return new Promise<Save|undefined>((resolve,reject)=>{
    const read=storage.transaction('campaigns').objectStore('campaigns').get('active');
    read.onsuccess=()=>{
      try { resolve(read.result===undefined?undefined:validateSave(read.result)); } catch(error) { reject(error); }
    };
    read.onerror=()=>reject(read.error);
  });
}
export async function saveCampaign(save:Save, slot='active') {
  const storage=await database();
  return new Promise<void>((resolve,reject)=>{
    const tx=storage.transaction('campaigns','readwrite');
    tx.objectStore('campaigns').put(save,slot);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error);
  });
}
export function downloadSave(save:Save) {
  const link=document.createElement('a');
  link.download=`clearcut-${save.seed}.json`;
  const url=URL.createObjectURL(new Blob([JSON.stringify(save)],{type:'application/json'}));
  link.href=url;
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
}

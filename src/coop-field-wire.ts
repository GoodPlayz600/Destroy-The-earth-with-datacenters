import type { Log } from './campaign';
import { SIZE } from './catalog';
import type { Point } from './land';
import { distance } from './land';

export type FieldPacket={clock:number; logs:Log[]; gone:number[]};
export type FieldTrack={known:Map<number,string>; next:number};
const logLimit=36;
const digits=(value:number)=>Math.round(value*100)/100;

export function fieldChanges(logs:ReadonlyMap<number,Log>, at:Point, clock:number, track:FieldTrack):FieldPacket {
  const gone:number[]=[],changed:Log[]=[];
  for(const id of track.known.keys())if(!logs.has(id)){
    track.known.delete(id);
    gone.push(id);
  }
  const nearby: {log:Log;distance:number}[]=[];
  for(const log of logs.values()){
    const gap=distance(at,log);
    if(gap<=44)nearby.push({log,distance:gap});
  }
  nearby.sort((a,b)=>a.distance-b.distance);
  const recent=new Set<number>();
  for(const {log} of nearby.slice(0,logLimit)){
    recent.add(log.id);
    const pose={...log,x:digits(log.x),y:digits(log.y),z:digits(log.z)};
    const stamp=JSON.stringify(pose);
    if(stamp!==track.known.get(log.id)){track.known.set(log.id,stamp);changed.push(pose);}
  }
  for(const id of track.known.keys())if(!recent.has(id))track.known.delete(id);
  return {clock,logs:changed,gone};
}

export function readField(value:unknown):FieldPacket|undefined {
  if(typeof value!=='string'||value.length>20000)return;
  try {
    const data=JSON.parse(value) as FieldPacket;
    if(!Number.isFinite(data.clock)||data.clock<0||!Array.isArray(data.logs)||data.logs.length>logLimit
      ||!Array.isArray(data.gone)||data.gone.length>logLimit||!data.gone.every(id=>Number.isSafeInteger(id)&&id>0))return;
    if(data.logs.some(log=>!log||!Number.isSafeInteger(log.id)||log.id<1
      ||![log.x,log.z,log.y,log.length,log.kilograms,log.units,log.kind,log.quality,log.moisture].every(Number.isFinite)
      ||Math.abs(log.x)>=SIZE/2||Math.abs(log.z)>=SIZE/2||!Array.isArray(log.q)||log.q.length!==4
      ||!log.q.every(Number.isFinite)||!Number.isInteger(log.kind)||log.kind<0||log.kind>3))return;
    return data;
  } catch { return; }
}

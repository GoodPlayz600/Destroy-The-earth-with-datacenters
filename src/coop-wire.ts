import { gzipSync, Gunzip, strFromU8, strToU8 } from 'fflate';
import type { Save } from './campaign';
import { SIZE } from './catalog';
import { validateSave } from './storage';

export type Pose = { x:number; z:number; yaw:number; pitch:number; lift:number };
export const roomCode = (value:string) => value.trim().toUpperCase();
export const validCode = (value:string) => /^[A-Z2-9]{10}$/.test(value);
export const validRegion = (value:string) => /^[a-z0-9-]{2,16}$/.test(value);
export const coopSlot = (region:string, code:string) => `coop-${region}-${code}`;
export function newCode() {
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(10)),n=>alphabet[n%32]).join('');
}

export function readPose(value:unknown):Pose|undefined {
  if(!Array.isArray(value)||value.length!==5||!value.every(Number.isFinite)) return;
  const [x,z,yaw,pitch,lift]=value as number[];
  if(Math.abs(x)>=SIZE/2||Math.abs(z)>=SIZE/2||Math.abs(yaw)>Math.PI+.001||Math.abs(pitch)>1.55||lift<0||lift>6)return;
  return {x,z,yaw,pitch,lift};
}
export function packPose(pose:Pose) {
  const {x,z,yaw,pitch,lift}=pose;
  return [x,z,Math.atan2(Math.sin(yaw),Math.cos(yaw)),pitch,lift];
}

type Blocks = Record<string,string[]>;
const BLOCK_SIZE=128;
export function serializeWorld(save:Save):Blocks {
  const blocks:Blocks={};
  for(const [key, value] of Object.entries(save)) {
    if(Array.isArray(value)&&value.length>BLOCK_SIZE) {
      blocks[key]=['array'];
      for(let i=0;i<value.length;i+=BLOCK_SIZE) blocks[key].push(JSON.stringify(value.slice(i,i+BLOCK_SIZE)));
    } else blocks[key]=[JSON.stringify(value)];
  }
  return blocks;
}

type FieldPatch = [key:string, length:number, changes:[index:number,value:string][]];
type Patch = { base:number; fields:FieldPatch[] };
const MAX_WORLD=60*1024*1024;
const MAX_COMPRESSED=20*1024*1024;
const CHUNK=8192;
export const maxWorldParts=Math.ceil(MAX_COMPRESSED/CHUNK);

export function makePatch(world:Blocks, previous?:Blocks, base=0) {
  const fields:FieldPatch[]=[];
  for (const [key, blocks] of Object.entries(world)) {
    const old=previous?.[key];
    const changes:FieldPatch[2]=[];
    blocks.forEach((block,i)=>{ if(block!==old?.[i])changes.push([i,block]); });
    if(changes.length||old?.length!==blocks.length) fields.push([key,blocks.length,changes]);
  }
  const bytes=gzipSync(strToU8(JSON.stringify({base,fields} satisfies Patch)),{level:3});
  if(bytes.length>MAX_COMPRESSED) throw Error('This campaign checkpoint exceeds the multiplayer transfer limit.');
  return Array.from({length:Math.ceil(bytes.length/CHUNK)},(_,i)=>bytes.subarray(i*CHUNK,(i+1)*CHUNK));
}

export function readWorldPart(value:unknown) {
  if(!Array.isArray(value)||value.length!==4)return;
  const [revision,index,total,bytes]=value;
  if(!Number.isSafeInteger(revision)||revision<1||!Number.isInteger(index)||index<0||index>=total
    ||!Number.isInteger(total)||total<1||total>maxWorldParts||!(bytes instanceof Uint8Array)
    ||bytes.length<1||bytes.length>CHUNK||index<total-1&&bytes.length!==CHUNK)return;
  return {revision:revision as number,index:index as number,total:total as number,bytes};
}

export function applyPatch(parts:Uint8Array[], previous:Blocks|undefined, revision:number) {
  let size=0;
  const raw:Uint8Array[]=[];
  const inflate=new Gunzip((data)=>{
    size+=data.length;
    if(size>MAX_WORLD) throw Error('Multiplayer checkpoint is too large.');
    raw.push(data);
  });
  parts.forEach((part,i)=>inflate.push(part,i===parts.length-1));
  const output=new Uint8Array(size);
  for(let offset=0,i=0;i<raw.length;i++) { output.set(raw[i],offset);offset+=raw[i].length; }
  const patch=JSON.parse(strFromU8(output)) as Patch;
  if((patch.base!==0&&(!previous||patch.base!==revision))||!Array.isArray(patch.fields)||patch.fields.length>70)
    throw Error('Multiplayer checkpoint arrived out of sequence.');
  const blocks:Blocks=Object.assign(Object.create(null),patch.base===0?undefined:previous);
  for(const [key,length,changes] of patch.fields) {
    if(!/^[a-z][a-zA-Z]{1,24}$/.test(key)||!Number.isInteger(length)||length<1||length>10000||!Array.isArray(changes)||changes.length>length)
      throw Error('Invalid multiplayer checkpoint field.');
    const chunks=blocks[key]?.slice(0,length)??[];
    chunks.length=length;
    for(const [i,block] of changes) {
      if(!Number.isInteger(i)||i<0||i>=length||typeof block!=='string')throw Error('Invalid multiplayer checkpoint block.');
      chunks[i]=block;
    }
    if(Array.from(chunks).some(block=>block===undefined))throw Error('Incomplete multiplayer checkpoint.');
    blocks[key]=chunks;
  }
  const save=Object.fromEntries(Object.entries(blocks).map(([key,chunks])=>[
    key,chunks[0]==='array'?chunks.slice(1).flatMap(chunk=>JSON.parse(chunk) as unknown[]):JSON.parse(chunks[0])
  ]));
  return {blocks,save:validateSave(save)};
}

export function roomBackup(code:string,region:string,save:Save) {
  return {format:'clearcut-coop-1',code,region,save};
}
export function readRoomBackup(value:unknown) {
  if(typeof value!=='object'||!value)throw Error('Choose a Clearcut multiplayer backup.');
  const {format,code,region,save}=value as Partial<ReturnType<typeof roomBackup>>;
  if(format!=='clearcut-coop-1'||typeof code!=='string'||!validCode(code)||typeof region!=='string'||!validRegion(region))
    throw Error('Choose a Clearcut multiplayer backup.');
  return {code,region,save:validateSave(save)};
}

import { CELL, CELLS, DISTRICT, DISTRICT_CELLS, DISTRICTS, SIZE, TOTAL } from './catalog';

export function hash(seed: number, x: number, z: number) {
  let n = Math.imul(x + seed, 374761393) + Math.imul(z - seed, 668265263) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}
export const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.z - b.z);
export type Point = { x: number; z: number };
export const indexAt = (x: number, z: number) => {
  const a = Math.floor((x + SIZE / 2) / CELL), b = Math.floor((z + SIZE / 2) / CELL);
  return a >= 0 && a < CELLS && b >= 0 && b < CELLS ? b * CELLS + a : -1;
};
export const cellPoint = (i: number): Point => ({ x: (i % CELLS) * CELL - SIZE / 2 + CELL / 2, z: Math.floor(i / CELLS) * CELL - SIZE / 2 + CELL / 2 });
export const districtAt = (i: number) => Math.floor(i % CELLS / DISTRICT) + Math.floor(i / CELLS / DISTRICT) * DISTRICTS;
export function districtCell(district:number,offset:number) {
  const x=(district%DISTRICTS)*DISTRICT+offset%DISTRICT;
  const z=Math.floor(district/DISTRICTS)*DISTRICT+Math.floor(offset/DISTRICT);
  return z*CELLS+x;
}
export const homeDistrict = districtAt(indexAt(0, 0));
export const districtName = (i: number) => `${String.fromCharCode(65 + i % DISTRICTS)}${Math.floor(i / DISTRICTS) + 1}`;
export const districtCenter = (i: number): Point => cellPoint((i % DISTRICTS * DISTRICT + DISTRICT / 2) + (Math.floor(i / DISTRICTS) * DISTRICT + DISTRICT / 2) * CELLS);
export const stages = ['Jungle', 'Cleared', 'Plains', 'Degraded grassland', 'Dry scrub', 'Barren', 'Desert'];
export const stageColors = ['#526344', '#6d6446', '#829055', '#8f854d', '#9c8355', '#a58c65', '#c7a779'];
export const soilColors = ['#4b5739', '#796646', '#829659', '#a09556', '#aa8e59', '#a68a67', '#d2ad77'];

export function height(x: number, z: number) {
  const distance = Math.hypot(x, z), edge = clamp((distance - 13) / 36);
  const relief = Math.sin(x * .043) * Math.cos(z * .041) * 2.25
    + Math.sin(x * .013 + z * .009) * 4.2 + Math.cos(z * .014 - x * .018) * 3.7
    + Math.sin((x + z) * .084) * .47;
  return relief * edge;
}
export type Tree = Point & { id: number; kind: number; scale: number; rotation: number };
const startingTrees: Point[] = [{ x: 0, z: -6 }, { x: -2.7, z: -9.8 }, { x: 3.6, z: -8 }, { x: -4.2, z: -13.2 }, { x: 6.4, z: -13 }, { x: 1.3, z: -14 }];
const startCells = new Set(startingTrees.map(p => indexAt(p.x,p.z)));
export const treesPerCell = 6;

export function treesIn(seed: number, i: number): Tree[] {
  const center = cellPoint(i);
  const list: Tree[] = [];
  if (startCells.has(i)) {
    startingTrees.forEach((point, n) => {
      if (indexAt(point.x,point.z) === i) list.push({ ...point, id: i * treesPerCell + n, kind: n === 5 ? 1 : 0, scale: .86 + n * .04, rotation: n * 2.4 });
    });
    return list;
  }
  for (let n = 0; n < treesPerCell; n++) {
    const id = i * treesPerCell + n;
    const x = center.x + (hash(seed, id, 1) - .5) * 14;
    const z = center.z + (hash(seed, id, 2) - .5) * 14;
    if (x > -14 && x < 15 && z > -14 && z < 15) continue;
    const roll = hash(seed, id, 3);
    list.push({ id, x, z, kind: roll < .36 ? 0 : roll < .71 ? 1 : roll < .90 ? 2 : 3, rotation: roll * 24, scale: .78 + hash(seed, id, 4) * .62 });
  }
  return list;
}

export type Soil = {
  vegetation: number; moisture: number; groundwater: number; fertility: number;
  heat: number; pollution: number; erosion: number; substrate: number;
  stable: number; stage: number; clearedFor: number; lastTick: number;
};
export const defaultSoil = (): Soil => ({ vegetation: 1, moisture: .68, groundwater: .85, fertility: .9, heat: .12, pollution: 0, erosion: 0, substrate: 0, stable: 0, stage: 0, clearedFor: 0, lastTick: 0 });
export const desertRules = { vegetation: .03, moisture: .12, groundwater: .18, fertility: .22, heat: .76, substrate: .7, stabilization: 60 };
export const showsGroundCracks=(soil:Soil)=>soil.stage>=5&&soil.erosion>=.49;
export type Pressure = { clearing: number; drainage: number; removal: number; heat: number; grazing: number; pollution: number; runoff?: number };
export const noPressure = (): Pressure => ({ clearing: 0, drainage: 0, removal: 0, heat: 0, grazing: 0, pollution: 0 });

export function meetsDesert(s: Soil) {
  return s.vegetation <= desertRules.vegetation && s.moisture <= desertRules.moisture
    && (s.groundwater <= desertRules.groundwater || s.fertility <= desertRules.fertility || s.heat >= desertRules.heat)
    && s.substrate >= desertRules.substrate;
}
export type Blocker='vegetation'|'moisture'|'ground'|'substrate'|'time';
export function blockers(s:Soil):Blocker[] {
  const needs:Blocker[]=[];
  if(s.vegetation>desertRules.vegetation)needs.push('vegetation');
  if(s.moisture>desertRules.moisture)needs.push('moisture');
  if(s.groundwater>desertRules.groundwater&&s.fertility>desertRules.fertility&&s.heat<desertRules.heat)needs.push('ground');
  if(s.substrate<desertRules.substrate)needs.push('substrate');
  if(!needs.length&&s.stable<desertRules.stabilization)needs.push('time');
  return needs;
}

export function desertified(s: Soil) {
  return s.stable >= desertRules.stabilization && meetsDesert(s);
}

export function applyLand(s: Soil, p: Pressure, seconds: number, rain: number, standing: number, tick: number) {
  const oldStage = s.stage;
  const hadCracks=showsGroundCracks(s);
  const irreversible = s.substrate >= .85 && s.fertility <= .24;
  const stressed = p.clearing || p.grazing || p.removal || p.heat || p.drainage;
  s.groundwater = clamp(s.groundwater + seconds * (rain * .00035 * (irreversible ? 0 : 1) - p.drainage * .0028 - p.removal * .0005));
  s.heat = clamp(s.heat + seconds * (p.heat * .007 - (s.heat - .12) * .0017));
  s.moisture = clamp(s.moisture + seconds * (
    rain * .002 * (irreversible ? .03 : 1) + (s.groundwater - s.moisture) * .0012
    - (p.runoff??0)*.0044 - p.drainage * .0029 - p.heat * .0044 - p.removal * .0021 - (irreversible ? .0015 : 0)
  ));
  s.fertility = clamp(s.fertility - seconds * (p.removal * .005 + p.grazing * .0029 + p.heat * .0017));
  s.erosion = clamp(s.erosion + seconds * (p.removal * .008 + p.grazing * .003 + Math.max(0, .23 - s.moisture) * .008));
  s.pollution = clamp(s.pollution + seconds * (p.pollution * .002 - s.pollution * .00016));
  s.substrate = clamp(s.substrate + seconds * (p.removal * .006 + (1 - s.vegetation) * Math.max(0, .2 - s.moisture) * .022));
  const vegetationLimit = standing > .03 ? standing : 0;
  s.vegetation = clamp(s.vegetation + seconds * (
    (stressed || irreversible || s.groundwater < .18 ? 0 : s.moisture * s.fertility * .00013)
    - p.clearing * .008 - p.grazing * .007 - p.removal * .008 - p.heat * .004 - p.drainage * .002
  ), 0, vegetationLimit);
  if (s.vegetation <= .13) s.clearedFor += seconds;
  if (meetsDesert(s) && (irreversible || stressed || s.groundwater <= .18)) s.stable += seconds;
  else s.stable = 0;
  s.stage = desertified(s) ? 6 : s.vegetation > .13 ? 0 : s.clearedFor < 16 ? 1
    : s.substrate > .55 && s.moisture < .21 ? 5 : s.moisture < .30 ? 4
    : s.moisture < .49 || s.fertility < .52 ? 3 : 2;
  s.lastTick = tick;
  return s.stage !== oldStage || showsGroundCracks(s)!==hadCracks;
}

export function conversionLabel(count: number) {
  return coverageLabel(count,TOTAL);
}
export function coverageLabel(count:number,total=DISTRICT_CELLS) {
  return (count===total?100:Math.floor(10000*count/total)/100).toFixed(2);
}

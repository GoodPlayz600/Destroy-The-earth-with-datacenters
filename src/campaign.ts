import { CELL, DISTRICT, DISTRICT_CELLS, DISTRICTS, SIZE, TOTAL, facilities, goods, recipes, species, tools, vehicles, vehicleTypes } from './catalog';
import type { Facility, Good, Recipe, Stack, Tool, VehicleType } from './catalog';
import { applyLand, blockers, cellPoint, clamp, defaultSoil, desertified, distance, districtAt, districtCell, hash, height, homeDistrict, indexAt, irreversibleSoil, noPressure, treesIn } from './land';
import type { Blocker, Point, Pressure, Soil, Tree } from './land';
import { quests } from './quests';
import type { QuestId } from './quests';
import { forestryUnlocks, modifiers, upgradeFacility, upgradesById } from './upgrades';

export const VERSION = 1;
export type Challenge='standard'|'noCompute'|'leanPower';
export type Log = Point & { id: number; y: number; q: [number, number, number, number]; kind: number; length: number; kilograms: number; units: number; moisture: number; quality: number; cargo?: string; carrier?: string; part?:'branch'; roll?:number };
export type Haul = Point & { target: string; alternate?:string; due?:number; log?: number; phase: 'waiting'|'pickup'|'delivery'|'return'; status: string; };
export const buyerSite=(kind:Facility)=>['market','timberBuyer','specialistBuyer','tradeHub'].includes(kind);
export const storageSite = (kind:Facility) => kind==='depot'||kind==='railDepot'||kind==='dronePad'||['fuelSilo','urbanBlock','stackRack','sortGate','loadingHopper','warehouse','picker','robotSorter','logisticsHub','loadingPad','roadDepot','railTerminal','intermodal','autoGarage','shippingHub','recycler'].includes(kind);
export type ClimateSample={time:number;desert:number;moisture:number;heat:number};
export type CleanupJob={cell:number;crew:string;travel:number};
export type Prototype='edge'|'motor';
export type Shipment = { mode:'rail'|'air'|'road'; returning?:boolean; load:Stack; target:string; path:Point[]; duration:number; elapsed:number; };
type Batch = Stack & { remaining: number; payout?: number; offcut?: number; residue?:Good };
export const mills: Facility[] = ['bench','bandsaw','mill','speedMill','millComplex'];
export const biomassSites:Facility[]=['biopower','cogeneration','wastePower'];
export const lineKinds:Facility[]=['belt','poweredBelt','rollerIntake','rail','road','serviceRoad','pavedRoad'];
export const freightVehicles:VehicleType[]=['oreTruck','mixer','palletJack','forkliftPro','deliveryVan','regionalTruck','flatbed','scoopLoader'];
export const fuelGood=(good:Good)=>['chips','driedChips','briquettes','pellets','charcoal','wastePaper'].includes(good);
const paperLines:Facility[]=['paper','reelPress','rollFinish','exportPaper','corrugator'];
const pulpLines:Facility[]=['screenedPulper','bulkPulp'];
export const computeSites:Facility[]=['serverRack','serverHall','data','hyperscale'];
export const utilityNodes:Facility[]=['substation','pole','transformer','backbone'];
export const waterPumps:Facility[]=['handPump','pump','borePump','pumpStation','deepPump'];
export const waterStores:Facility[]=['tank','coolTower','tankFarm'];
export const waterSites:Facility[]=[...waterPumps,...waterStores];
export const waterPipes:Facility[]=['pipe','flowPipe'];
export const waterCapacity=(kind:Facility)=>kind==='tank'?1200:kind==='coolTower'||kind==='tankFarm'?4200:
  kind==='pumpStation'||kind==='deepPump'?410:160;
const kilns: Facility[] = ['smallKiln','kiln'];
export const consumes = (recipe: Recipe | undefined, good: Good) => recipe?.input?.[0]===good||recipe?.secondary?.[0]===good;
export const takesLogs=(kind:Facility) => storageSite(kind)||kind==='fire'||buyerSite(kind)||(isRecipe(kind)&&(recipes[kind] as Recipe).input?.[0]&&['timber','branches'].includes((recipes[kind] as Recipe).input![0]));
export type Site = Point & {
  id: string; kind: Facility; yaw?:number; input: Stack[]; output: Stack[]; jobs: Batch[];
  on: boolean; fuel: number; status: string; manual?:boolean; enlarged?:boolean; sortGood?:Good; secondary?:string; shipped?:number; freightPlan?:'road'|'rail'; dedicatedRide?:string; scrubbers?:boolean; staffed?:boolean; clearingTarget?:number; payroll?:number; shift?:'day'|'continuous'; order?:'harvest'|'haul'|'clear';
  mechanic?:{ride:string;time:number}; crane?:{log:number;ride:string;remaining:number;x:number;y:number;z:number}; winch?:{log:number; ready:number}; planted?:number; fertilizer?:boolean; intensive?:boolean; water?: number; climate?:ClimateSample[]; waterMode?:'all'|'farm'|'industry'; waterRate?:'normal'|'conserve'|'deplete'; reserve?:number; priority?:boolean; gridFlow?:number; gridCapacity?:number; uptime?:number; service?:number; yieldCarry?:number; layout?: 'quality'|'volume'; sortHigh?:boolean; link?: string; haul?: Haul; shipment?:Shipment; mode?: 'sell' | 'charcoal';
};
export type Ride = Point & { id: string; kind: VehicleType; yaw: number; fuel: number; wear: number; hitch?:string; hitchReady?:number; attachment?:'saw'|'tow'; water?:number; freight?:Stack };
export const trailerGap=(tow:Ride)=>tow.kind==='truck'?5:3.85;
export function cargoPosition(ride:Ride,index:number,ground:number) {
  const def=vehicleTypes[ride.kind], slot=(index%3-1)*.34;
  const reach=def.forks?-2.06:def.trailer?.35:.68;
  return {
    x:ride.x+Math.cos(ride.yaw)*slot+Math.sin(ride.yaw)*reach,
    z:ride.z-Math.sin(ride.yaw)*slot+Math.cos(ride.yaw)*reach,
    y:ground+(def.forks?1.03:.79)+Math.floor(index/3)*.32,
  };
}
export type Ledger = { date: number; note: string; amount: number };
export type Contract = { good: Good; quantity: number; deadline: number; payout: number; done: boolean; failed: boolean; dense?:boolean; grade?:number; received?:number; plan?:'quick'|'supply'|'export' };
export const isOpenContract=(contract:Contract,clock:number)=>!contract.done&&!contract.failed&&contract.deadline>clock;
export type Project = { kind: 'watershed' | 'quarry' | 'thermal' | 'dryland' | 'integrated' | 'continental'; district: number; phase: number; complete?: boolean };
type RecordRow = { hits: number; harvest: number; fire: number; sold: number; produced: number; earned: number; spent: number; miles: number };
export type Save = ReturnType<Campaign['snapshot']>;

const baseSites: [Facility, number, number][] = [['fire', -6.5, 0], ['market', 7.2, -2.2]];
const rootStats = (): RecordRow => ({ hits: 0, harvest: 0, fire: 0, sold: 0, produced: 0, earned: 0, spent: 0, miles: 0 });
const isRecipe = (kind: Facility): kind is keyof typeof recipes => Object.hasOwn(recipes, kind);
const allDistricts = DISTRICTS ** 2;
const pressureFields=['clearing','drainage','removal','heat','grazing','pollution','runoff'] as const;
const pressureSlots:Record<keyof Pressure,number>={clearing:0,drainage:1,removal:2,heat:3,grazing:4,pollution:5,runoff:6};
export const projectBond=5500;
export const districtProjects:Record<Project['kind'],{name:string;price:number;facility:Facility;research?:string}> = {
  watershed:{name:'Watershed drawdown',price:6200,facility:'pump'},
  quarry:{name:'Regional stripping',price:8200,facility:'quarry'},
  thermal:{name:'Thermal exhaustion',price:9500,facility:'thermal'},
  dryland:{name:'Dryland farming and extraction',price:12500,facility:'soilRecovery',research:'20-12'},
  integrated:{name:'Integrated conversion program',price:24000,facility:'stormTower',research:'23-12'},
  continental:{name:'Continental extraction program',price:32000,facility:'urbanBlock',research:'21-12'},
};
export const fields:Facility[]=['pasture','crop','megaFarm','soilRecovery'];

export function getQuantity(stacks: Stack[], good?: Good) {
  return stacks.reduce((n, stack) => n + (!good || stack.good === good ? stack.quantity : 0), 0);
}
export function put(stacks: Stack[], stack: Stack, capacity = Infinity) {
  if (stack.quantity <= 0 || getQuantity(stacks) + stack.quantity > capacity) return false;
  const lot = stacks.find(s => s.good === stack.good && Math.abs(s.quality - stack.quality) < .015 && Math.abs(s.moisture - stack.moisture) < .015);
  if (lot) {
    const total = lot.quantity + stack.quantity;
    lot.quality = (lot.quality * lot.quantity + stack.quality * stack.quantity) / total;
    lot.moisture = (lot.moisture * lot.quantity + stack.moisture * stack.quantity) / total;
    lot.quantity = total;
  } else stacks.push({ ...stack });
  return true;
}
export function take(stacks: Stack[], good: Good, quantity: number, minQuality = 0, maxMoisture = 1): Stack | undefined {
  if (!Number.isInteger(quantity) || quantity < 1) return;
  const eligible = stacks.filter(s => s.good === good && s.quality >= minQuality && s.moisture <= maxMoisture);
  if (getQuantity(eligible) < quantity) return;
  let needed = quantity, quality = 0, moisture = 0;
  for (const lot of eligible) {
    const n = Math.min(needed, lot.quantity);
    needed -= n;
    quality += n * lot.quality;
    moisture += n * lot.moisture;
    lot.quantity -= n;
    if (!lot.quantity) stacks.splice(stacks.indexOf(lot), 1);
    if (!needed) break;
  }
  return { good, quantity, quality: quality / quantity, moisture: moisture / quantity };
}
function takeLot(stacks:Stack[],lot:Stack,quantity:number) {
  const index=stacks.indexOf(lot);
  if(index<0||quantity<=0||quantity>lot.quantity)return;
  const removed={...lot,quantity};
  lot.quantity-=quantity;
  if(!lot.quantity)stacks.splice(index,1);
  return removed;
}
export const priceFor = (stack: Stack) => Math.round(goods[stack.good][1] * stack.quantity * (.64 + stack.quality * .45 + (1 - stack.moisture) * .18));
export const canWin = (desertCount: number) => desertCount === TOTAL;
export const cargoMass = (logs: Iterable<Log>, id: string) => Array.from(logs).reduce((sum, l) => sum + (l.cargo === id ? l.kilograms : 0), 0);

export class Campaign {
  seed: number;
  challenge:Challenge='standard';
  clock = 0;
  cash = 0;
  treeDamage = new Map<number, number>();
  removed = new Set<number>();
  brokenRocks=new Set<number>();
  groundStumps=new Set<number>();
  elevation=new Map<number,number>();
  recycledCells=new Set<number>();
  terrainRevision=0;
  rockVersion=0;
  logs = new Map<number, Log>();
  soil = new Map<number, Soil>();
  sites: Site[] = [];
  rides: Ride[] = [];
  stock: Stack[] = [];
  ownedTools = new Set<Tool>(['knife']);
  ownedUpgrades = new Set<string>();
  mods = modifiers(this.ownedUpgrades);
  tool: Tool = 'knife';
  wear = 100;
  toolWear: Partial<Record<Tool,number>> = {};
  stamina = 100;
  battery = 100;
  player = { x: 0, z: -.7, yaw: 0, pitch: -.03 };
  districts = new Set([homeDistrict]);
  projects: Project[] = [];
  cleanup:CleanupJob[]=[];
  prototypes=new Set<Prototype>();
  scienceSpent=0;
  policy:'manual'|'revenue'|'land'='manual';
  ledger: Ledger[] = [];
  contracts: Contract[] = [];
  stats = rootStats();
  won = false;
  completionTime = 0;
  nextId = 1;
  rain = 0;
  landRevision = 0;
  desertCount = 0;
  desertByDistrict = new Uint16Array(allDistricts);
  notices: string[] = [];
  achievements = new Set<string>();
  claimed = new Set<QuestId>();
  private tickTime = 0;
  private landQueue = new Set<number>();
  private pressures=new Float64Array(TOTAL*pressureFields.length);
  private pressureTracked=new Uint8Array(TOTAL);
  private pressureActive=new Uint8Array(TOTAL);
  readonly routePackets=new Map<string,{at:number;good:Good;from:Point;to:Point}>();
  readonly routeStatus=new Map<string,string>();
  private roadPower = new Map<string, boolean>();

  constructor(seed=20831,challenge:Challenge='standard') {
    this.seed=seed;
    this.challenge=challenge;
    for (const [kind,x,z] of baseSites)this.sites.push(this.makeSite(kind,x,z));
    for(const [x,z]of [[18,-20],[-24,13]]){
      const ruin=this.makeSite('ruin',x,z);ruin.on=false;ruin.status='Abandoned';this.sites.push(ruin);
    }
  }

  eventAt(time=this.clock) {
    if(time<300)return 'Clear weather';
    const events=['Market shortage','Thunderstorm','Dry front','Busy freight lanes','Clear weather'];
    return events[(Math.floor((time-300)/160)+this.seed%5)%events.length];
  }

  private makeSite(kind: Facility, x: number, z: number): Site {
    return { id: 's' + this.nextId++, kind, x, z, input: [], output: [], jobs: [], on: true, fuel: facilities[kind].supply && !biomassSites.includes(kind) ? 100 : 0, status: 'Idle' };
  }

  notice(message: string) { this.notices.push(message); }
  claimQuest(id:QuestId) {
    const quest=quests[id];
    if(this.claimed.has(id)||quest.progress(this)<quest.target)return false;
    this.claimed.add(id);
    if(quest.reward)this.finance(quest.reward,'Field objective · '+quest.title);
    this.notice(quest.reward?`Objective complete · +$${quest.reward}`:`Objective complete · ${quest.title}`);
    return true;
  }

  finance(amount: number, note: string) {
    this.cash += amount;
    if (amount > 0) this.stats.earned += amount;
    else this.stats.spent -= amount;
    this.ledger.unshift({ date: this.clock, note, amount });
    this.ledger.length = Math.min(150, this.ledger.length);
  }

  buyUpgrade(id: string) {
    const item = upgradesById.get(id), required = upgradeFacility[id];
    if(id==='24-12'&&!canWin(this.desertCount))return false;
    if (!item?.implemented || this.ownedUpgrades.has(id) || this.cash < item.price
      || (item.previous && !this.ownedUpgrades.has(item.previous)) || (required && !this.sites.some(s => s.kind === required))) return false;
    this.ownedUpgrades.add(id);
    const previousDurability = this.mods.knifeDurability;
    this.mods = modifiers(this.ownedUpgrades);
    if(this.tool==='knife')this.wear+=this.mods.knifeDurability-previousDurability;
    else if(this.toolWear.knife!==undefined)this.toolWear.knife+=this.mods.knifeDurability-previousDurability;
    for (const [tool, node] of Object.entries(forestryUnlocks)) if (node===id) this.ownedTools.add(tool as Tool);
    this.finance(-item.price, item.name);
    if(id==='24-12')this.achievements.add('Stable desert certification');
    this.notice(item.name + ' installed');
    return true;
  }

  acquireTool(tool: Tool) {
    if (!this.ownedTools.has(tool)) {
      const node = tool === 'knife' ? undefined : forestryUnlocks[tool];
      if (!node || !this.buyUpgrade(node)) return false;
    }
    this.equip(tool);
    return true;
  }

  equip(tool: Tool) {
    if (!this.ownedTools.has(tool) || this.tool === tool) return;
    this.toolWear[this.tool] = this.wear;
    this.tool = tool;
    this.wear = this.toolWear[tool] ?? (tool === 'knife' ? this.mods.knifeDurability : 100);
  }

  get swingTime() { return tools[this.tool].interval * (this.tool === 'knife' ? this.mods.knifeInterval : 1); }

  hit(tree: Tree, alternating = false) {
    if (!this.isStanding(tree)) return { damage: 0, felled: false, ratio: 0 };
    const type = species[tree.kind], isKnife = this.tool === 'knife', config = tools[this.tool];
    const powered = this.tool === 'electric' || this.tool === 'chainsaw' || this.tool === 'harvester';
    const energy = powered ? (this.tool === 'harvester' ? 4.6 : this.tool === 'chainsaw' ? 2.75 : 2.1) * this.mods.chain * (this.prototypes.has('motor')?.68:1) : 0;
    if (this.battery < energy) return { damage: 0, felled: false, ratio: 0 };
    const effort = (isKnife ? 4 * this.mods.knifeStamina : powered ? 2.5 : 5) * this.mods.handStamina;
    if (this.stamina < effort) return { damage: 0, felled: false, ratio: 0 };
    this.battery -= energy;
    this.stamina -= effort;
    this.stats.hits++;
    let damage = (this.prototypes.has('edge')&&tree.kind>=1?1.37:1)*config.power * (this.wear <= 0 ? .46 : 1);
    if (isKnife) {
      if (tree.kind === 0) damage *= this.mods.saplingDamage;
      if (tree.kind === 1) damage *= this.mods.mediumDamage;
      if (tree.kind >= 2) damage *= this.mods.hardwoodKnife ? .82 : .16;
      if (this.mods.alternating && alternating) damage *= 1.2;
      if (this.mods.poweredKnife && this.battery >= 3) { this.battery -= 3; damage *= 1.6; }
      if (this.mods.notch) damage *= 1.15;
      if (this.mods.prestigeKnife) damage *= 2;
    }
    if (this.tool === 'axe' && tree.kind >= 1) damage *= this.mods.axeForce;
    if (powered && tree.kind >= 2) damage *= this.mods.heavyTeeth;
    const service = powered ? this.mods.chain : isKnife ? 1 : this.mods.sharpening;
    if (!(isKnife && this.mods.shatterproof && tree.kind >= 2)) this.wear = Math.max(0, this.wear - config.wear * service);
    const total = type.health * tree.scale;
    const progress = (this.treeDamage.get(tree.id) ?? 0) + damage;
    this.treeDamage.set(tree.id, progress);
    return { damage, felled: progress >= total - Number.EPSILON, ratio: clamp(progress / total) };
  }

  harvesterHit(tree:Tree,vehicle:Ride) {
    if(!this.isStanding(tree)||vehicle.fuel<=0)return {ratio:0,felled:false};
    const machine=vehicle.kind==='giantRig'?105:vehicle.kind==='treeHarvester'?57:vehicle.kind==='tractor'?22:0;
    const damage=machine*(this.mods.harvesterHead?1.65:1);
    const progress=(this.treeDamage.get(tree.id)??0)+damage;
    const need=species[tree.kind].health*tree.scale;
    this.treeDamage.set(tree.id,progress);
    if(damage)this.stats.hits++;
    vehicle.fuel=Math.max(0,vehicle.fuel-(vehicle.kind==='giantRig'?3.8:1.4));
    return {ratio:clamp(progress/need),felled:progress>=need};
  }

  isStanding(tree: Tree) {
    const land = this.soil.get(indexAt(tree.x, tree.z));
    return !this.removed.has(tree.id) && (land?.vegetation ?? 1) > .03;
  }

  fell(tree: Tree, logPosition: Log) {
    if (this.removed.has(tree.id)) return false;
    this.removed.add(tree.id);
    this.treeDamage.delete(tree.id);
    this.logs.set(logPosition.id, logPosition);
    this.stats.harvest++;
    this.landRevision++;
    const cell = indexAt(tree.x, tree.z);
    const land = this.getSoil(cell);
    const standing = this.standingFraction(cell);
    land.vegetation = Math.min(land.vegetation, standing);
    this.landQueue.add(cell);
    return true;
  }

  cutLog(id: number, next: Point, slice = .5, machine=false) {
    const log = this.logs.get(id);
    if (!log || log.cargo || log.carrier || log.units < 2 || this.tool === 'knife'&&!machine) return false;
    const units = Math.max(1,Math.min(log.units-1,Math.round(log.units * slice))), ratio = units / log.units;
    if(indexAt(next.x,next.z)<0)return false;
    const second = { ...log, id: this.nextId++, ...next, y: this.ground(next.x,next.z) + .52, units, length: log.length * ratio, kilograms: log.kilograms * ratio };
    this.logs.set(second.id, second);
    log.units -= units;
    log.kilograms *= 1 - ratio;
    log.length *= 1 - ratio;
    return true;
  }

  cutHarvestedLog(id:number,point:Point) { return this.cutLog(id,point,.5,true); }

  ground(x:number,z:number) {
    if(!this.elevation.size)return height(x,z);
    const left=Math.floor((x+SIZE/2-8)/CELL)*CELL-SIZE/2+8, front=Math.floor((z+SIZE/2-8)/CELL)*CELL-SIZE/2+8;
    const at=(a:number,b:number)=>this.elevation.get(indexAt(a,b))??0;
    const tx=(x-left)/CELL,tz=(z-front)/CELL;
    const delta=(at(left,front)*(1-tx)+at(left+CELL,front)*tx)*(1-tz)
      +(at(left,front+CELL)*(1-tx)+at(left+CELL,front+CELL)*tx)*tz;
    return height(x,z)+delta;
  }

  clearBrush(at:Point) {
    const i=indexAt(at.x,at.z);
    if(i<0||this.stamina<4)return false;
    const cell=this.getSoil(i), trees=treesIn(this.seed,i).filter(tree=>this.isStanding(tree)).length;
    const before=cell.vegetation;
    const floor=Math.min(.79,trees*.15);
    cell.vegetation=Math.max(Math.min(floor,before),before-.065);
    if(cell.vegetation===before)return false;
    this.stamina-=4;this.landQueue.add(i);this.landRevision++;
    return true;
  }

  grind(tree:Tree,mechanized=false) {
    if(!this.removed.has(tree.id)||this.groundStumps.has(tree.id)||(!mechanized&&(this.tool!=='grinder'||this.stamina<4)))return false;
    if(!mechanized&&!put(this.stock,{good:'chips',quantity:1,quality:.65,moisture:.52},150))return false;
    if(!mechanized)this.stamina-=4;
    this.groundStumps.add(tree.id);
    const tile=indexAt(tree.x,tree.z),soil=this.getSoil(tile);
    soil.fertility=clamp(soil.fertility-(this.mods.rootRipper?.12:.038));
    soil.erosion=clamp(soil.erosion+.10);
    this.landQueue.add(tile);this.landRevision++;
    return true;
  }

  mulch(log:Log) {
    if(this.tool!=='mulcher'||log.cargo||log.carrier||!this.logs.has(log.id)||log.kilograms>110)return false;
    if(!put(this.stock,{good:'chips',quantity:log.units*2,quality:.68,moisture:log.moisture},150))return false;
    this.logs.delete(log.id);
    return true;
  }

  excavate(at:Point,vehicle:Ride) {
    const i=indexAt(at.x,at.z);
    if((vehicle.kind!=='excavator'&&vehicle.kind!=='scoopLoader')||i<0||!this.districts.has(districtAt(i))||vehicle.fuel<1)return false;
    if(vehicle.freight&&vehicle.freight.good!=='ore')return false;
    const old=this.elevation.get(i)??0;
    if((vehicle.freight?.quantity??0)>=42||old<=-3)return false;
    const cut=vehicle.kind==='scoopLoader'?.18:.39;
    this.elevation.set(i,Math.max(-3,old-cut));
    this.terrainRevision++;
    vehicle.fuel=Math.max(0,vehicle.fuel-1.1);
    vehicle.freight={good:'ore',quality:.69,moisture:.25,quantity:(vehicle.freight?.quantity??0)+1};
    this.stripGround(at,4);
    if(vehicle.kind==='excavator')for(const tree of treesIn(this.seed,i))if(distance(tree,at)<4.3)this.grind(tree,true);
    return true;
  }

  demolish(site:Site,vehicle:Ride) {
    if(vehicle.kind!=='demolisher'||site.kind!=='ruin'||distance(vehicle,site)>7||vehicle.fuel<3)return false;
    const i=this.sites.indexOf(site);
    if(i<0||!put(this.stock,{good:'salvage',quantity:5,quality:.70,moisture:.12},150))return false;
    vehicle.fuel-=3;
    this.sites.splice(i,1);
    this.landRevision++;
    this.notice('Abandoned structure dismantled · recovered metal added');
    return true;
  }

  getSoil(i:number) {
    const existing=this.soil.get(i);
    if(existing)return existing;
    const base=defaultSoil();
    this.soil.set(i,base);
    return base;
  }

  private standingFraction(i: number) {
    const trees = treesIn(this.seed, i);
    return trees.filter(t => !this.removed.has(t.id)).length / Math.max(1, trees.length);
  }

  logStack(log: Log): Stack { return { good: log.part==='branch'?'branches':'timber', quantity: log.units, quality: log.quality, moisture: log.moisture }; }
  fireValue(log: Log) {
    return Math.round((log.units*13+log.kilograms*.2)*(this.mods.sortDry&&log.moisture<.45?1.22:1)
      *(this.mods.ashContracts&&log.units>=3?1.18:1));
  }

  acceptLog(site: Site, log: Log) {
    if (!site.on || log.cargo || log.carrier || !this.logs.has(log.id) || distance(site, log) > facilities[site.kind].size + .8) return false;
    if (site.kind === 'fire') {
      if (log.kilograms > this.mods.burnMass || site.jobs.length >= this.mods.burnSlots) return false;
      const toCharcoal = this.mods.carbon && site.mode === 'charcoal';
      site.jobs.push({
        good: toCharcoal?'charcoal':'ash', quantity: toCharcoal ? log.units : this.mods.ash ? 1 : 0, moisture: .05, quality: .82,
        remaining: (1.6 + log.kilograms * .044) / this.mods.burnSpeed,
        payout: toCharcoal ? 0 : this.fireValue(log),
      });
    } else if (buyerSite(site.kind)) {
      const stack=this.logStack(log);
      if(!this.buyerAccepts(site,stack))return false;
      this.sellAt(site,stack);
    } else {
      const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
      if (!storageSite(site.kind) && !consumes(recipe,this.logStack(log).good)) return false;
      if(!this.allowedStorage(site,this.logStack(log).good))return false;
      if (!put(storageSite(site.kind) ? site.output : site.input, this.logStack(log), this.capacity(site))) return false;
    }
    this.logs.delete(log.id);
    return true;
  }

  capacity(site: Site) {
    const capacity=site.kind==='logisticsHub'?1200:site.kind==='warehouse'?850:site.kind==='stackRack'?45:
      site.kind==='loadingHopper'?175:storageSite(site.kind)?260:computeSites.includes(site.kind)&&this.mods.rackManagement?76:
      site.kind==='fire'?32:site.kind==='bench'||site.kind==='rack'?20:42;
    return capacity+(site.enlarged?32:0);
  }

  enlarge(site:Site) {
    if(!this.mods.buffer||site.enlarged||this.cash<65)return false;
    this.finance(-65,'Install enlarged output buffer');
    site.enlarged=true;
    return true;
  }

  transfer(site: Site, good: Good, quantity: number, retrieve: boolean) {
    const source = retrieve ? site.output : this.stock;
    const destination = retrieve ? this.stock : storageSite(site.kind) ? site.output : site.input;
    const capacity = retrieve ? 150 : this.capacity(site);
    const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
    if(!retrieve&&!this.allowedStorage(site,good))return false;
    if (!retrieve && !storageSite(site.kind) && !consumes(recipe,good) && !(biomassSites.includes(site.kind)&&fuelGood(good))) return false;
    if (getQuantity(destination) + quantity > capacity) return false;
    const stack = take(source, good, quantity);
    return stack ? put(destination, stack, capacity) : false;
  }

  buyerAccepts(site:Site,stack:Stack) {
    if(stack.good==='compute')return false;
    if(site.kind==='timberBuyer')return stack.good==='timber'||stack.good==='branches';
    if(site.kind==='specialistBuyer')return stack.quality>=.80&&stack.moisture<=.38;
    return buyerSite(site.kind);
  }

  marketValue(stack:Stack,site?:Site,at=this.clock) {
    const rate=(1+Math.sin(at/89)*.11+Math.sin(at/281)*.065)*
      (this.eventAt(at)==='Market shortage'&&['timber','boards','dry'].includes(stack.good)?1.18:1);
    const certified=(this.mods.certified||this.mods.buyerCert)&&['boards','dry','finished','treated'].includes(stack.good)
      &&stack.quality>=.90&&stack.moisture<=.18;
    const premium=site?.kind==='specialistBuyer'?1.30:1;
    return Math.round(priceFor(stack)*rate*premium*(certified?1.26:1));
  }

  private deliveryValue(contract:Contract,quantity:number) {
    const before=contract.received??0;
    return Math.floor(contract.payout*(before+quantity)/contract.quantity)-Math.floor(contract.payout*before/contract.quantity);
  }

  private creditDelivery(contract:Contract,quantity:number) {
    const paid=this.deliveryValue(contract,quantity);
    contract.received=(contract.received??0)+quantity;
    contract.done=contract.received>=contract.quantity;
    this.finance(paid,`${contract.done?'Contract fulfilled':'Contract shipment'} · ${goods[contract.good][0]}`);
    this.notice(`${contract.done?'Contract complete':'Shipment accepted'} · +$${paid}`);
  }

  private sellAt(site:Site,stack:Stack) {
    if(site.kind==='tradeHub'&&this.mods.tradeOptimizer) {
      for(const c of this.contracts){
        if(c.good!==stack.good||!isOpenContract(c,this.clock)||stack.quality<(c.grade??0))continue;
        const delivered=Math.min(stack.quantity,c.quantity-(c.received??0));
        if(delivered<=0)continue;
        this.creditDelivery(c,delivered);
        stack={...stack,quantity:stack.quantity-delivered};
        if(!stack.quantity)return;
      }
    }
    this.sellStack(stack,site);
  }

  sellStack(stack:Stack,site?:Site) {
    const payout=this.marketValue(stack,site);
    this.finance(payout,`${goods[stack.good][0]} ×${stack.quantity} · ${site?facilities[site.kind].name:'Timber Exchange'}`);
    this.stats.sold+=stack.quantity;
    this.notice(`+$${payout} · ${goods[stack.good][0]}`);
  }

  sellInventory(good: Good,quantity: number,lot?:Stack,site?:Site) {
    if(good==='compute'||!Number.isInteger(quantity)||quantity<=0)return false;
    const acceptable=(stack:Stack)=>stack.good===good&&(!site||this.buyerAccepts(site,stack));
    if(lot) {
      const shipped=acceptable(lot)?takeLot(this.stock,lot,quantity):undefined;
      if(!shipped)return false;
      if(site)this.sellAt(site,shipped);
      else this.sellStack(shipped);
      return true;
    }
    if(getQuantity(this.stock.filter(acceptable),good)<quantity)return false;
    const stack=take(this.stock,good,quantity,site?.kind==='specialistBuyer'?.8:0,site?.kind==='specialistBuyer'?.38:1);
    if(!stack)return false;
    if(site)this.sellAt(site,stack);
    else this.sellStack(stack);
    return true;
  }

  canTakeContract() {
    return this.contracts.filter(c=>isOpenContract(c,this.clock)).length<(this.mods.tradeOptimizer?3:1);
  }

  private recordContract(contract:Contract) {
    this.contracts.unshift(contract);
    if(this.contracts.length>25) {
      const oldestClosed=this.contracts.map(item=>isOpenContract(item,this.clock)).lastIndexOf(false);
      this.contracts.splice(oldestClosed,1);
    }
  }

  acceptContract(good:Good,dense=false,plan?:Contract['plan']) {
    if(dense&&(good!=='compute'||!this.mods.denseCompute)||!this.canTakeContract())return false;
    if(plan==='quick'&&!this.mods.shortOrders||plan==='supply'&&!this.mods.supplyDeals||plan==='export'&&!this.mods.exportMarket)return false;
    if(good==='timber'&&!this.mods.ashContracts&&plan!=='quick'||good==='packed'&&!this.mods.exportOrders||['briquettes','pellets'].includes(good)&&!this.mods.bioOrders)return false;
    const quantity=plan==='quick'?4:plan==='supply'?27:plan==='export'?54:good==='compute'?(dense?54:this.mods.uplink?22:12):
      good==='packed'?48:good==='timber'?32:['briquettes','pellets'].includes(good)?24:['finished','treated'].includes(good)?16:8;
    const expires=plan==='quick'?160:plan==='supply'?1100:plan==='export'?1350:dense||good==='packed'?1200:good==='compute'?480:360;
    const rate=dense?2.5:plan==='export'?2.2:plan==='supply'?1.7:1.5;
    this.recordContract({good,quantity,deadline:this.clock+expires,payout:Math.round(goods[good][1]*quantity*rate),done:false,failed:false,dense,
      grade:plan==='export'?.83:undefined,plan});
    return true;
  }

  acceptCommission(good:Good,premium=false) {
    if(!this.mods.commissions||!['finishedCabinet','floors','modular'].includes(good)||!this.canTakeContract()) return false;
    const quantity=premium?25:12;
    this.recordContract({good,quantity,deadline:this.clock+(premium?990:570),payout:Math.round(goods[good][1]*quantity*(premium?2.15:1.65)),
      done:false,failed:false,grade:premium?.92:.81});
    return true;
  }

  deliveryQuote(contract:Contract) {
    if(!isOpenContract(contract,this.clock))return;
    const need=contract.quantity-(contract.received??0);
    const quantity=contract.plan==='supply'?Math.min(9,need):need;
    if(quantity<=0)return;
    const available=getQuantity(this.stock.filter(lot=>lot.quality>=(contract.grade??0)),contract.good);
    return {quantity,payout:this.deliveryValue(contract,quantity),available};
  }

  fulfill(contract:Contract) {
    const quote=this.deliveryQuote(contract);
    if(!quote||!take(this.stock,contract.good,quote.quantity,contract.grade))return false;
    this.creditDelivery(contract,quote.quantity);
    return true;
  }

  siteIssue(kind: Facility, at: Point) {
    const def = facilities[kind], i = indexAt(at.x, at.z);
    if(computeSites.includes(kind)&&this.challenge==='noCompute')return 'Compute installations are disabled by this challenge';
    if (i < 0 || (Math.hypot(at.x, at.z) > 29 && !this.districts.has(districtAt(i)))) return 'Purchase this district first';
    if (this.cash < def.price) return 'Insufficient funds';
    if(kind==='ruin')return 'Only abandoned world structures can be reclaimed';
    if(kind==='pavedRoad'&&getQuantity(this.stock,'asphalt')<1)return 'Bring one unit of paving aggregate';
    if(kind==='urbanBlock'&&getQuantity(this.stock,'foundation')<4)return 'Bring four cured foundation sections';
    if(def.research&&!this.ownedUpgrades.has(def.research)) return 'Requires facility research';
    if(kind==='heatIsland'&&this.sites.filter(s=>(s.kind==='road'||s.kind==='pavedRoad')&&distance(s,at)<60).length<3)return 'Connect three nearby paved segments first';
    if(kind==='deepPump'&&!this.sites.some(s=>s.kind==='flowPipe'&&distance(s,at)<65))return 'Connect a high-flow pipeline first';
    if (def.requires && !this.sites.some(s => s.kind === def.requires)) return `Requires ${facilities[def.requires].name}`;
    if (this.sites.some(s => distance(s, at) < Math.max(2, facilities[s.kind].size + def.size - 1.4))) return 'Leave room around equipment';
    if (['road', 'belt', 'rail', 'pipe'].indexOf(kind) < 0 && treesIn(this.seed, i).some(t => this.isStanding(t) && distance(t, at) < def.size)) return 'Clear trees from the footprint';
    return '';
  }

  build(kind: Facility, at: Point) {
    const issue = this.siteIssue(kind, at);
    if (issue) { this.notice(issue); return; }
    const site = this.makeSite(kind, at.x, at.z);
    site.yaw=this.player.yaw;
    this.sites.push(site);
    if(kind==='pavedRoad')take(this.stock,'asphalt',1);
    if(kind==='urbanBlock')take(this.stock,'foundation',4);
    this.finance(-facilities[kind].price, facilities[kind].name);
    this.notice(facilities[kind].name + ' installed');
    return site;
  }

  acquireRide(kind: VehicleType, point: Point) {
    const vehicle = vehicleTypes[kind];
    if(vehicle.research&&!this.ownedUpgrades.has(vehicle.research))return;
    if (this.cash < vehicle.cost
      || indexAt(point.x, point.z) < 0 || (Math.hypot(point.x, point.z) > 29 && !this.districts.has(districtAt(indexAt(point.x, point.z))))) return;
    const ride: Ride = { ...point, id: 'v' + this.nextId++, kind, yaw: this.player.yaw, fuel: 100, wear: 0 };
    this.rides.push(ride);
    this.finance(-vehicle.cost, vehicle.name);
    return ride;
  }

  assignWinch(site:Site,log?:Log) {
    if(site.kind!=='winch'||!site.on)return false;
    if(!log){site.winch=undefined;return true;}
    if(log.cargo||log.carrier||!this.logs.has(log.id)||distance(site,log)>22||log.kilograms>420)return false;
    const attached=this.sites.filter(s=>s!==site&&s.winch?.log===log.id).length;
    if(attached>=(this.mods.extraAnchor?2:1))return false;
    site.winch={log:log.id,ready:this.clock+this.mods.couplerTime};
    return true;
  }

  toggleTrailer(tow:Ride) {
    if(!this.rides.includes(tow)||!this.mods.hitch||vehicleTypes[tow.kind].trailer||['sled','cart','wheelbarrow'].includes(tow.kind)
      ||this.sites.some(s=>s.dedicatedRide===tow.id))return false;
    const attached=this.rides.find(v=>v.hitch===tow.id);
    if(attached){attached.hitch=undefined;attached.hitchReady=undefined;return true;}
    const trailer=this.rides.filter(v=>vehicleTypes[v.kind].trailer&&!v.hitch&&distance(tow,v)<5.9)
      .sort((a,b)=>distance(tow,a)-distance(tow,b))[0];
    if(!trailer)return false;
    trailer.hitch=tow.id;
    trailer.hitchReady=this.clock+this.mods.couplerTime;
    return true;
  }

  buyDistrict(district: number) {
    if (district < 0 || district >= allDistricts || this.districts.has(district) || this.cash < 950) return false;
    this.finance(-950, 'Purchase district permit');
    this.districts.add(district);
    return true;
  }

  projectBlockers(district:number,kind:Project['kind']) {
    const rules=districtProjects[kind], issues:string[]=[];
    if(!this.districts.has(district))issues.push('Requires a district permit');
    if(this.projects.some(p=>p.district===district))issues.push('A project is already commissioned here');
    if(this.desertByDistrict[district]===DISTRICT_CELLS)issues.push('All district cells are already stable');
    if(!this.sites.some(s=>s.kind==='forestry'))issues.push('Build '+facilities.forestry.name);
    if(rules.research&&!this.ownedUpgrades.has(rules.research))issues.push('Research '+upgradesById.get(rules.research)!.name);
    if(!this.sites.some(s=>s.kind===rules.facility))issues.push('Build '+facilities[rules.facility].name);
    if(this.cash<rules.price)issues.push('Insufficient funds');
    return issues;
  }

  startProject(district: number, kind: Project['kind']) {
    if(this.projectBlockers(district,kind).length)return false;
    this.finance(-districtProjects[kind].price, kind + ' district deployment');
    this.projects.push({ district, kind, phase: 0 });
    this.notice('District work order commissioned');
    return true;
  }

  retool() {
    if (this.tool !== 'knife' && this.cash < 10) return false;
    if (this.tool !== 'knife') this.finance(-10, 'Service tool');
    this.wear = this.tool === 'knife' ? this.mods.knifeDurability : 100;
    this.battery = 100;
    return true;
  }

  private canPark(at:Point,rig:Ride[]) {
    const tile=indexAt(at.x,at.z);
    const radius=2.5;
    if(tile<0||Math.max(Math.abs(at.x),Math.abs(at.z))>SIZE/2-radius
      ||Math.hypot(at.x,at.z)>29&&!this.districts.has(districtAt(tile))
      ||this.rides.some(other=>!rig.includes(other)&&distance(other,at)<2.8)
      ||this.sites.some(site=>!lineKinds.includes(site.kind)&&distance(site,at)<facilities[site.kind].size+1.4))return false;
    const cells=new Set<number>();
    for(const dx of [-radius,radius])for(const dz of [-radius,radius])cells.add(indexAt(at.x+dx,at.z+dz));
    for(const cell of cells)if(cell>=0&&treesIn(this.seed,cell).some(tree=>this.isStanding(tree)&&distance(tree,at)<radius))return false;
    return true;
  }

  recoverRide(selected:Ride) {
    if(!this.rides.includes(selected)||this.cash<18)return false;
    const ride=this.rides.find(v=>v.id===selected.hitch)??selected;
    const trailer=this.rides.find(v=>v.hitch===ride.id);
    const rig=trailer?[ride,trailer]:[ride];
    if(this.sites.some(s=>s.shipment&&rig.some(v=>s.dedicatedRide===v.id)))return false;
    const depots=this.sites.filter(s=>s.kind==='serviceBay'||s.kind==='depot'||s.kind==='market')
      .sort((a,b)=>distance(a,ride)-distance(b,ride));
    for(const yard of depots)for(let n=0;n<12;n++){
      const angle=n*Math.PI/6, radius=facilities[yard.kind].size+3.2;
      const position={x:yard.x+Math.cos(angle)*radius,z:yard.z+Math.sin(angle)*radius};
      const gap=trailerGap(ride);
      const behind={x:position.x+Math.sin(ride.yaw)*gap,z:position.z+Math.cos(ride.yaw)*gap};
      if(!this.canPark(position,rig)||trailer&&!this.canPark(behind,rig))continue;
      this.finance(-18,'Recover stranded vehicle');
      const placements=trailer?[[ride,position],[trailer,behind]] as const:[[ride,position]] as const;
      for(const [vehicle,at] of placements){
        Object.assign(vehicle,at,{yaw:ride.yaw});
        const ground=this.ground(at.x,at.z);
        let slot=0;
        for(const log of this.logs.values())if(log.cargo===vehicle.id)Object.assign(log,cargoPosition(vehicle,slot++,ground));
      }
      if(vehicleTypes[ride.kind].motor){ride.fuel=Math.max(20,ride.fuel);ride.wear=Math.min(65,ride.wear);}
      if(trailer)trailer.hitchReady=undefined;
      this.notice('Recovered '+vehicleTypes[ride.kind].name+(trailer?' and trailer':'')+' to '+facilities[yard.kind].name);
      return true;
    }
    return false;
  }

  refuel(ride: Ride) {
    if (this.cash < 18) return false;
    this.finance(-18, 'Vehicle service');
    ride.fuel = 100;
    ride.wear = 0;
    return true;
  }

  private allowedStorage(site:Site,good:Good) {
    if(site.kind==='fuelSilo')return fuelGood(good);
    if(site.kind==='stackRack')return good==='timber'||good==='branches';
    if(site.kind==='loadingHopper')return ['chips','driedChips','pellets','ore','mixedOre','sand','ash'].includes(good);
    return true;
  }

  private cargoAllowed(site:Site,stack:Stack) {
    return this.buyerAccepts(site,stack)||storageSite(site.kind)&&this.allowedStorage(site,stack.good)
      ||consumes(isRecipe(site.kind)?recipes[site.kind]:undefined,stack.good)||biomassSites.includes(site.kind)&&fuelGood(stack.good);
  }

  connectAlternate(site:Site,target:Site,good:Good) {
    if(!this.mods.sortGate||!['sortGate','robotSorter'].includes(site.kind)||site===target
      ||!this.sites.includes(site)||!this.sites.includes(target)||site.link===target.id
      ||!this.reachable(site,target,lineKinds,26))return false;
    site.secondary=target.id;site.sortGood=good;
    return true;
  }

  freightMode(site:Site):Shipment['mode']|undefined {
    if(site.kind==='dronePad')return 'air';
    if(site.kind==='intermodal')return site.freightPlan??'rail';
    if(site.kind==='railDepot'||site.kind==='railTerminal')return 'rail';
    if(['roadDepot','autoGarage','shippingHub'].includes(site.kind))return 'road';
  }

  assignDriverless(garage:Site,vehicle:Ride) {
    if(garage.kind!=='autoGarage'||garage.shipment||!['pickup','truck','regionalTruck','flatbed'].includes(vehicle.kind)
      ||distance(garage,vehicle)>9||vehicle.freight||cargoMass(this.logs.values(),vehicle.id)>0
      ||this.sites.some(s=>s!==garage&&s.dedicatedRide===vehicle.id))return false;
    garage.dedicatedRide=vehicle.id;
    return true;
  }

  paveAt(at:Point) {
    if(!this.ownedUpgrades.has('16-07')||this.siteIssue('pavedRoad',at))return false;
    if(!this.build('pavedRoad',at))return false;
    return true;
  }

  connect(source: Site, target: Site) {
    if (source === target || !this.sites.includes(source) || !this.sites.includes(target) || source.shipment || source.secondary===target.id) return false;
    const mode=this.freightMode(source);
    const route=mode==='rail'?this.findPath(source,target,['rail'],source.kind==='railTerminal'?16:12):
      mode==='air'?distance(source,target)<=320:
      mode==='road'?this.findPath(source,target,['road','serviceRoad','pavedRoad'],this.mods.regionalShipping?35:22):
      distance(source,target)<=16||this.reachable(source,target,lineKinds,26);
    if (!route) return false;
    source.link = target.id;
    return true;
  }

  disconnectRoute(site:Site,alternate=false) {
    if(alternate){
      this.routeStatus.delete(site.id+':'+site.secondary);
      site.secondary=undefined;site.sortGood=undefined;
    }else if(!site.shipment){
      this.routeStatus.delete(site.id+':'+site.link);
      site.link=undefined;
    }
  }

  private findPath(from:Point,to:Point,kinds:Facility[],span:number) {
    if(distance(from,to)<=span)return [from,to];
    const nodes=this.sites.filter(s=>s.on&&kinds.includes(s.kind));
    const parents=new Map<Point,Point|undefined>([[from,undefined]]);
    const queue=[from];
    for(let index=0;index<queue.length;index++) {
      const current=queue[index];
      if(distance(current,to)<=span) {
        const path=[to,current];
        let parent=parents.get(current);
        while(parent){path.push(parent);parent=parents.get(parent);}
        return path.reverse();
      }
      for(const next of nodes) {
        if(parents.has(next)||distance(current,next)>span)continue;
        parents.set(next,current);
        queue.push(next);
      }
    }
    return undefined;
  }

  private reachable(a: Point, b: Point, kinds: Facility[], span: number) {
    return Boolean(this.findPath(a,b,kinds,span));
  }

  private freight(site:Site,target:Site,dt:number) {
    const mode=this.freightMode(site)!;
    const rail=mode==='rail', capacity=rail?(this.mods.longTrain&&site.kind!=='railDepot'?78:30):mode==='road'?(site.kind==='shippingHub'?82:56):8;
    const now=site.shipment;
    if(now) {
      if(now.elapsed<now.duration) {
        now.elapsed+=dt;
        site.status=now.returning?'Vehicle returning':`${rail?'Train':mode==='road'?'Truck':'Drone'} en route · ${Math.ceil(now.duration-now.elapsed)}s remaining`;
        return;
      }
      if(now.returning){site.shipment=undefined;site.status='Vehicle back at garage';return;}
      if(!target.on){site.status='Freight held · receiver offline';return;}
      if(buyerSite(target.kind)) {
        if(!this.buyerAccepts(target,now.load)){site.status='Freight held · buyer rejected grade';return;}
        this.sellAt(target,now.load);
      }
      else if(!put(storageSite(target.kind)?target.output:target.input,now.load,this.capacity(target))) {
        site.status='Freight held · receiver full';
        return;
      }
      if(site.kind==='autoGarage'){
        now.returning=true;now.path.reverse();now.elapsed=0;
      }else site.shipment=undefined;
      site.status='Shipment delivered';
      return;
    }
    if(!target.on){site.status='Freight blocked · receiver offline';return;}
    if(mode==='air'&&!this.roadPower.get(site.id)){site.status='Drone charger needs grid power';return;}
    const path=rail?this.findPath(site,target,['rail'],site.kind==='railTerminal'?16:12):
      mode==='road'?this.findPath(site,target,['road','serviceRoad','pavedRoad'],this.mods.regionalShipping?35:22):
      distance(site,target)<=320?[site,target]:undefined;
    if(!path){site.status=rail?'Freight blocked · broken track':mode==='road'?'Freight blocked · no road link':'Freight blocked · out of range';return;}
    const length=path.slice(1).reduce((n,p,index)=>n+distance(p,path[index]),0);
    const lot=site.output.find(l=>this.cargoAllowed(target,l));
    if(!lot){site.status=site.output.length?'Freight blocked · incompatible cargo':'Waiting for freight';return;}
    const available=buyerSite(target.kind)?capacity:this.capacity(target)-getQuantity(storageSite(target.kind)?target.output:target.input);
    const amount=Math.min(lot.quantity,capacity,available);
    if(amount<=0){site.status='Freight blocked · receiver full';return;}
    const fee=Math.max(2,Math.round(length*(rail?.021:mode==='road'?.034:.055)*(this.mods.freightDiscount&&amount>=16?.66:1)*(this.mods.regionalShipping?.73:1)));
    const vehicle=site.kind==='autoGarage'?this.rides.find(v=>v.id===site.dedicatedRide):undefined;
    const travelFuel=length*.09;
    if(site.kind==='autoGarage'&&(!vehicle||vehicle.fuel<travelFuel||vehicle.wear>=100||distance(vehicle,site)>12)){
      site.status='Vehicle unavailable · assign or service a parked vehicle';return;
    }
    if(this.cash<fee){site.status='Freight blocked · dispatch costs';return;}
    const load=takeLot(site.output,lot,amount);
    if(!load)return;
    this.finance(-fee,rail?'Rail freight dispatch':mode==='road'?'Truck freight dispatch':'Drone freight dispatch');
    if(vehicle){vehicle.fuel-=travelFuel;vehicle.wear=Math.min(100,vehicle.wear+length*.013);}
    site.shipment={mode,target:target.id,load,path:path.map(({x,z})=>({x,z})),
      duration:Math.max(3,length/(rail?12:mode==='road'?10:22))*(this.eventAt()==='Busy freight lanes'?1.35:1),elapsed:0};
    site.status='Shipment dispatched';
  }

  private supplyCooling(site:Site,dt:number) {
    const base={data:13,serverHall:25,hyperscale:98}[site.kind as 'data'|'serverHall'|'hyperscale']??0;
    if(!base)return true;
    const requested=base*dt*(this.mods.airFans?.91:1)*(this.mods.liquidLoop?1.36:1);
    return this.takeWater(site,requested,this.mods.campus?65:46);
  }

  get science() {
    if(!this.mods.researchDesk)return 0;
    return Math.max(0,Math.floor(this.stats.produced/16)+Math.floor(this.desertCount/256)+this.achievements.size*2-this.scienceSpent);
  }

  develop(prototype:Prototype) {
    const cost=prototype==='edge'?12:20;
    if(!this.mods.prototypes||this.prototypes.has(prototype)||this.science<cost)return false;
    this.prototypes.add(prototype);
    this.scienceSpent+=cost;
    return true;
  }

  dispatchCleanup(cell:number) {
    if(!this.mods.cleanupDispatch||!Number.isInteger(cell)||cell<0||cell>=TOTAL
      ||!this.districts.has(districtAt(cell))||this.cleanup.some(job=>job.cell===cell)||this.cash<80)return false;
    if(desertified(this.soil.get(cell)??defaultSoil()))return false;
    const crew=this.sites.find(s=>s.on&&['megaDryer','dryer','megascraper','forestry'].includes(s.kind));
    if(!crew||this.cleanup.length>=96)return false;
    this.finance(-80,'Survey cleanup dispatch');
    this.cleanup.push({cell,crew:crew.id,travel:Math.ceil(distance(crew,cellPoint(cell))/19)});
    return true;
  }

  pumpByHand(site:Site) {
    if(site.kind!=='handPump'||!site.on)return 0;
    const cell=indexAt(site.x,site.z), soil=this.getSoil(cell);
    const drawn=Math.max(0,Math.min(11,soil.groundwater*350,waterCapacity(site.kind)-(site.water??0)));
    if(!drawn)return 0;
    soil.groundwater=clamp(soil.groundwater-drawn/350);
    soil.moisture=clamp(soil.moisture-drawn/700);
    site.water=(site.water??0)+drawn;
    this.landQueue.add(cell);
    return drawn;
  }

  waterCargo(cart:Ride,site:Site,unload=false) {
    if(cart.kind!=='waterCart'||!waterSites.includes(site.kind)||distance(cart,site)>5.5)return 0;
    const stored=site.water??0, held=cart.water??0;
    const moved=unload?Math.min(held,waterCapacity(site.kind)-stored):Math.min(210-held,stored);
    if(moved<=0)return 0;
    cart.water=held+(unload?-moved:moved);
    site.water=stored+(unload?moved:-moved);
    return moved;
  }

  private waterReach(from:Point,to:Point,range:number) {
    return this.reachable(from,to,waterPipes,range)||
      this.sites.some(node=>node.kind==='flowPipe'&&node.on&&distance(from,node)<=range+20&&this.reachable(node,to,waterPipes,range+32));
  }

  private takeWater(site:Site,requested:number,range:number) {
    const farm=fields.includes(site.kind);
    const stores=this.sites.filter(source=>source.on&&waterSites.includes(source.kind)&&this.waterReach(site,source,range)
      &&(source.waterMode!=='farm'||farm)&&(source.waterMode!=='industry'||!farm));
    if(stores.reduce((total,source)=>total+(source.water??0),0)<requested) return false;
    let remaining=requested;
    for(const source of stores) {
      const amount=Math.min(remaining,source.water??0);
      source.water=(source.water??0)-amount;
      if((remaining-=amount)<=0) break;
    }
    return true;
  }

  sow(site:Site) {
    if(site.kind!=='crop'||(site.planted??0)>=3||this.cash<12)return false;
    this.finance(-12,'Sow crop plot');
    site.planted=(site.planted??0)+1;
    return true;
  }

  fertilize(site:Site) {
    if(!this.mods.fertilizer||!['crop','megaFarm'].includes(site.kind)||site.fertilizer||this.cash<45)return false;
    this.finance(-45,'Field fertilizer');
    site.fertilizer=true;
    return true;
  }

  private farmReady(site:Site) {
    const soil=this.getSoil(indexAt(site.x,site.z));
    const field=site.kind==='crop'||site.kind==='megaFarm';
    if(site.kind==='soilRecovery'){
      if(soil.fertility<=.32)return true;
      site.status='Soil has not been exhausted';return false;
    }
    const cell=indexAt(site.x,site.z);
    if(!treesIn(this.seed,cell).some(tree=>this.isStanding(tree))) {
      if(soil.vegetation>.13){soil.vegetation=.12;this.landRevision++;}
      this.landQueue.add(cell);
    }
    if(soil.vegetation>.24){site.status='Clear the field canopy';return false;}
    if(field&&this.mods.irrigation&&soil.moisture<.44&&this.takeWater(site,4,52))soil.moisture=clamp(soil.moisture+.018);
    if(soil.moisture<.19||soil.fertility<.16){site.status='Field too dry or exhausted';return false;}
    if(site.kind==='crop'&&!this.mods.cropHarvester&&!site.planted){site.status='Awaiting sowing order';return false;}
    return true;
  }

  private makeBatch(site:Site,recipe:Recipe, poweredFan=false, crank=false) {
    const [good,baseQuantity]=recipe.output, mill=mills.includes(site.kind);
    const farming=fields.includes(site.kind), growing=farming&&site.kind!=='soilRecovery';
    if(farming&&!this.farmReady(site))return false;
    let quantity=baseQuantity;
    if(growing&&site.fertilizer)quantity+=Math.ceil(baseQuantity*.40);
    if(growing&&site.intensive)quantity+=Math.ceil(baseQuantity*.26);
    const carry=mill&&this.mods.bladeGuide?(site.yieldCarry??0)+baseQuantity*.10:0;
    quantity+=Math.floor(carry+1e-8);
    if(mill&&this.mods.cutPatterns&&site.layout==='volume')quantity+=1;
    const residue=site.kind==='crusher'?'sand':mill&&site.kind!=='bench'&&this.mods.offcuts?'chips':this.mods.recovery&&paperLines.includes(site.kind)?'wastePaper':
      this.mods.barkSorter&&site.kind==='charcoalDrum'?'chips':site.kind==='charcoal'||site.kind==='charcoalDrum'?'ash':undefined;
    const offcut=residue?1:0;
    if(pulpLines.includes(site.kind)&&this.mods.chipScreen)quantity++;
    if(this.mods.oreScreen&&['licensedQuarry','stripMine','bucketMine'].includes(site.kind))quantity+=Math.ceil(baseQuantity*.17);
    const queued=site.jobs.reduce((sum,job)=>sum+job.quantity+(job.offcut??0),0);
    if(getQuantity(site.output)+queued+quantity+offcut>this.capacity(site)) {site.status='Output full';return false;}
    const first=recipe.input,second=recipe.secondary;
    const firstCount=first?Math.max(1,first[1]-(this.mods.templates&&['joinery','cabinet','modular'].includes(site.kind)?1:0)):0;
    const available=(good:Good)=>getQuantity(site.input.filter(lot=>lot.quality>=(recipe.minQuality??0)&&lot.moisture<=(recipe.maxMoisture??1)),good);
    if(first&&available(first[0])<firstCount||second&&available(second[0])<second[1]){
      site.status='Awaiting suitable material';
      return false;
    }
    if(pulpLines.includes(site.kind)&&!this.takeWater(site,site.kind==='bulkPulp'?48:16,51)){site.status='Pulp needs supplied water';return false;}
    if(recipe.labor&&this.cash<recipe.labor){site.status='Labor budget too low';return false;}
    if(recipe.labor)this.finance(-recipe.labor,'Furniture assembly payroll');
    const input=first?take(site.input,first[0],firstCount,recipe.minQuality,recipe.maxMoisture):undefined;
    const parts=second?take(site.input,second[0],second[1],recipe.minQuality,recipe.maxMoisture):undefined;
    if(carry)site.yieldCarry=clamp(carry-Math.floor(carry+1e-8));
    let quality=(parts&&input?(parts.quality+input.quality)/2:input?.quality??.91)+(site.kind==='bench'?.02:.08);
    let remaining=recipe.time, moisture=recipe.moisture??input?.moisture??.16;
    if(mill){
      if(this.mods.logClamp){remaining*=.82;quality+=.018;}
      if(this.mods.feeder&&site.kind!=='bench')remaining*=.72;
      if(this.mods.precision&&(input?.quality??0)>.73)quality+=.10;
      if(this.mods.debarker&&site.kind!=='bench'){quality+=.07;moisture=Math.max(0,moisture-.035);}
      if(this.mods.cutPatterns&&site.layout==='quality')quality+=.13;
      if(crank)remaining*=.58;
    }
    if(site.kind==='rack') {
      if(poweredFan)remaining*=.60;
      if(!this.mods.canopy)remaining*=1+this.rain*.60;
    }
    if(kilns.includes(site.kind)){
      if(this.mods.airflow)quality+=.11;
      if(this.mods.smartKiln){remaining*=.72;moisture*=.85;}
    }
    if(paperLines.includes(site.kind)&&this.mods.paperDryer){remaining*=.72;quality+=.13;moisture=Math.min(moisture,.17);}
    if(site.staffed)remaining*=.76;
    if(this.mods.nailer&&['workshop','carpentry','pallet'].includes(site.kind))remaining*=.63;
    if(site.kind==='finishBooth')quality+=.17;
    if(site.kind==='crusher'&&this.mods.oreScreen)quality+=.11;
    if(site.kind==='joinery'&&this.mods.surfaceSander)quality+=.19;
    if(computeSites.includes(site.kind)) {
      if(this.mods.rackManagement)remaining*=.87;
      if(this.mods.airFans)remaining*=.78;
      if(this.mods.liquidLoop&&site.kind!=='serverRack')remaining*=.62;
    }
    if(growing){
      const i=indexAt(site.x,site.z),soil=this.getSoil(i);
      if(site.kind==='crop'&&!this.mods.cropHarvester)site.planted=Math.max(0,(site.planted??0)-1);
      const depletion=site.intensive?.029:.012;
      soil.fertility=clamp(soil.fertility-depletion);
      soil.moisture=clamp(soil.moisture-(site.kind==='pasture'?.016:.042));
      soil.groundwater=clamp(soil.groundwater-(site.kind==='pasture'?.004:.011));
      if(site.fertilizer){soil.pollution=clamp(soil.pollution+.12);soil.fertility=clamp(soil.fertility-.024);site.fertilizer=false;}
      this.landQueue.add(i);
    }
    site.jobs.push({good,quantity,quality:clamp(quality),moisture,remaining,offcut,residue});
    site.status=recipe.name;
    return true;
  }

  crankBench(site:Site) {
    return site.kind==='bench'&&site.on&&this.mods.benchCrank&&site.jobs.length===0&&this.makeBatch(site,recipes.bench,false,true);
  }

  private computeRemaining() {
    const ordered=this.contracts.reduce((sum,c)=>sum+(c.good==='compute'&&isOpenContract(c,this.clock)?c.quantity-(c.received??0):0),0);
    if(!ordered)return 0;
    const pledged=getQuantity(this.stock,'compute')+this.sites.reduce((n,site)=>n+getQuantity(site.output,'compute')
      +site.jobs.reduce((total,job)=>total+(job.good==='compute'?job.quantity:0),0)
      +(site.shipment?.load.good==='compute'&&!site.shipment.returning?site.shipment.load.quantity:0),0);
    return Math.max(0,ordered-pledged);
  }

  breakRock(id:number,point:Point) {
    if(this.tool!=='breaker'||this.brokenRocks.has(id)||distance(this.player,point)>tools.breaker.range||this.stamina<6)return false;
    if(!put(this.stock,{good:'ore',quantity:2,quality:.73,moisture:.18},150))return false;
    this.stamina-=6;
    this.wear=Math.max(0,this.wear-tools.breaker.wear);
    this.brokenRocks.add(id);
    this.rockVersion++;
    this.landRevision++;
    this.notice('Surface aggregate collected');
    return true;
  }

  freightBed(ride:Ride,site:Site,unload=false) {
    if(!freightVehicles.includes(ride.kind)||distance(ride,site)>6.5)return 0;
    if(unload){
      const stack=ride.freight;
      if(!stack)return 0;
      if(buyerSite(site.kind)){
        if(!this.buyerAccepts(site,stack))return 0;
        this.sellAt(site,stack);
      }else if(!this.cargoAllowed(site,stack)||!put(storageSite(site.kind)?site.output:site.input,stack,this.capacity(site)))return 0;
      ride.freight=undefined;
      return stack.quantity;
    }
    const legallyCarried=ride.kind==='mixer'?['concrete']:['palletJack','forkliftPro','deliveryVan','regionalTruck','flatbed'].includes(ride.kind)?
      Object.keys(goods).filter(g=>g!=='compute'):['ore','mixedOre','sand','foundation','asphalt','ashAggregate'];
    const cargo=site.output.find(lot=>legallyCarried.includes(lot.good)&&(!ride.freight||ride.freight.good===lot.good));
    if(!cargo)return 0;
    const held=ride.freight?.quantity??0;
    const lot=takeLot(site.output,cargo,Math.min(cargo.quantity,(ride.kind==='palletJack'?16:ride.kind==='mixer'?24:ride.kind==='regionalTruck'?72:ride.kind==='flatbed'?90:42)-held));
    if(!lot)return 0;
    if(ride.freight){
      const previous=ride.freight,total=previous.quantity+lot.quantity;
      lot.quality=(lot.quality*lot.quantity+previous.quality*previous.quantity)/total;
      lot.moisture=(lot.moisture*lot.quantity+previous.moisture*previous.quantity)/total;
      lot.quantity=total;
    }
    ride.freight=lot;
    return lot.quantity-held;
  }

  private hasHeatSink(at:Point,range:number) {
    return this.sites.some(source=>source.on&&facilities[source.kind].effect==='thermal'&&source.fuel>0&&this.waterReach(at,source,range));
  }

  compactGround(at:Point,dt:number) {
    const i=indexAt(at.x,at.z);
    if(i<0||!this.districts.has(districtAt(i)))return false;
    const cell=this.getSoil(i), definiteTree=treesIn(this.seed,i).some(t=>this.isStanding(t));
    cell.fertility=clamp(cell.fertility-dt*.018);
    cell.erosion=clamp(cell.erosion+dt*.045);
    cell.substrate=clamp(cell.substrate+dt*.017);
    if(!definiteTree)cell.vegetation=clamp(cell.vegetation-dt*.070);
    this.landQueue.add(i);
    return true;
  }

  private gridReach(from:Point,to:Point,span=78) {
    return this.reachable(from,to,utilityNodes,span)
      ||this.sites.some(node=>node.on&&node.kind==='transformer'&&distance(from,node)<=75&&this.reachable(node,to,utilityNodes,125))
      ||this.sites.some(node=>node.on&&node.kind==='backbone'&&distance(from,node)<=80&&this.reachable(node,to,utilityNodes,230));
  }

  private gridSources(){
    return this.sites.flatMap(site=>{
      const maximum=facilities[site.kind].supply??0;
      if(!site.on){site.gridCapacity=0;return [];}
      if(site.kind==='battery'){
        const draw=Math.min(36,site.reserve??0);
        site.gridCapacity=draw;
        return draw>0?[{site,free:draw}]:[];
      }
      if(!maximum)return [];
      if(biomassSites.includes(site.kind)&&site.fuel<=8){
        const fuel=site.input.find(l=>fuelGood(l.good));
        if(fuel){
          const energy=({chips:30,driedChips:42,briquettes:76,pellets:65,charcoal:63,wastePaper:21} as Partial<Record<Good,number>>)[fuel.good]??0;
          take(site.input,fuel.good,1);
          site.fuel=Math.min(100,site.fuel+energy*(.78+(1-fuel.moisture)*.22));
        }
      }
      if(facilities[site.kind].effect==='thermal'&&site.fuel>0)site.fuel=Math.max(0,site.fuel-.012);
      const daylight=clamp(Math.sin(.7+this.clock/235)*.52+.56);
      const wind=Math.max(.24,.50+Math.sin(this.clock/45+this.seed%7)*.24+this.rain*.20);
      const power=(this.challenge==='leanPower'?.67:1)*(site.scrubbers?.84:1)*(site.kind==='solar'?maximum*daylight*(1-this.rain*.59)
        :site.kind==='wind'?maximum*wind:site.fuel>0?maximum:0);
      site.gridCapacity=power;
      return power>0?[{site,free:power}]:[];
    }).sort((a,b)=>Number(a.site.kind==='battery')-Number(b.site.kind==='battery'));
  }

  private simulateMachinery(dt: number) {
    const supply=this.gridSources();
    this.roadPower.clear();
    let computeNeeded=this.computeRemaining();
    const policyWeight=(site:Site)=>(site.priority?300:0)+(site.staffed?25:0)+Math.min(20,getQuantity(site.input))-(getQuantity(site.output)>=this.capacity(site)?35:0);
    const plan=this.mods.foreman||this.mods.priority?[...this.sites].sort((a,b)=>policyWeight(b)-policyWeight(a)):this.sites;
    for (const site of plan) {
      site.gridFlow=0;
      if (!site.on) { site.status = 'Paused'; continue; }
      if(site.staffed&&(site.payroll??0)<=this.clock){
        if(this.cash>=9){this.finance(-9,'Machine operator wages');site.payroll=this.clock+65;}
        else {site.staffed=false;this.notice('Machine operator off shift · insufficient funds');}
      }
      if (site.kind === 'fire') {
        site.status = site.jobs.length ? 'Burning' : 'Ready for physical delivery';
        if (!site.jobs.length && this.mods.stoker) {
          const depot = this.sites.find(s => s.kind === 'depot' && s.link === site.id);
          if (depot && getQuantity(site.output) < this.capacity(site)) {
            const raw = take(depot.output, 'timber', 1);
            if (raw) site.jobs.push({ good: 'ash', quantity: this.mods.ash ? 1 : 0, quality: .8, moisture: .05, remaining: 2 / this.mods.burnSpeed, payout: 17 });
          }
        }
        for (const job of site.jobs) job.remaining -= dt;
        while (site.jobs[0]?.remaining <= 0) {
          const job = site.jobs[0];
          if (job.quantity && !put(site.output, job, this.capacity(site))) { site.status = 'Output full'; break; }
          site.jobs.shift();
          this.stats.fire++;
          if (job.payout) { this.finance(job.payout, 'Delivered timber · Ash Exchange'); this.notice(`+$${job.payout} · Ash Exchange`); }
        }
        continue;
      }
      const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
      const computing=computeSites.includes(site.kind);
      if(computing){
        if((site.service??0)>0){site.service=Math.max(0,site.service!-dt);site.status='Server maintenance';continue;}
        if(!computeNeeded&&!site.jobs.length){site.status='Waiting for a compute contract';continue;}
      }
      let watts = Math.max(recipe?.power ?? 0, facilities[site.kind].power ?? 0);
      if(computing&&this.mods.airFans)watts+=2;
      if(kilns.includes(site.kind)&&this.mods.smartKiln)watts=Math.max(1,watts-2);
      const fan=site.kind==='rack'&&this.mods.dryingFan&&supply.some(source=>source.free>=2&&this.gridReach(site,source.site));
      if(fan)watts=2;
      if(this.mods.heatExchange&&kilns.includes(site.kind)&&this.sites.some(source=>source.on&&
        (biomassSites.includes(source.kind)&&source.fuel>0||['charcoal','charcoalDrum'].includes(source.kind)&&source.jobs.length>0)
        &&this.waterReach(site,source,58)))watts=Math.max(1,watts-3);
      if(site.kind==='kiln'&&this.mods.heatReuse&&this.sites.some(s=>s.kind==='fire'&&s.jobs.length>0&&distance(site,s)<22))watts=Math.max(0,watts-3);
      const within=this.mods.campus&&computing?118:78;
      const network=watts?supply.filter(source=>source.free>0&&this.gridReach(site,source.site,within)):[];
      const powered=network.reduce((sum,source)=>sum+source.free,0)>=watts;
      const backup=computing&&this.mods.backup&&(site.reserve??0)>=watts*dt;
      if(!powered&&!backup){site.status='No grid power';continue;}
      if(computing&&!this.supplyCooling(site,dt)){site.status='Cooling supply required';continue;}
      if(powered&&watts){
        let remaining=watts;
        for(const source of network){
          const draw=Math.min(remaining,source.free);
          source.free-=draw;
          if(source.site.kind==='battery')source.site.reserve=Math.max(0,(source.site.reserve??0)-draw*dt);
          else if(source.site.kind!=='solar'&&source.site.kind!=='wind')source.site.fuel=Math.max(0,source.site.fuel-draw*dt*.00065*(biomassSites.includes(source.site.kind)?this.mods.biomassEfficiency:1));
          if((remaining-=draw)<=0)break;
        }
        if(computing&&this.mods.backup)site.reserve=Math.min(700,(site.reserve??0)+4*dt);
      } else if(backup) site.reserve=Math.max(0,(site.reserve??0)-watts*dt);
      if(computing){
        site.uptime=(site.uptime??0)+dt;
        if(site.uptime>=(this.mods.serverService?280:145)){site.uptime=0;site.service=this.mods.serverService?4:15;}
      }
      if(site.kind==='climateTower'&&this.clock%25<dt){
        const i=indexAt(site.x,site.z), soil=this.soil.get(i)??defaultSoil();
        site.climate=[{time:this.clock,moisture:soil.moisture,heat:soil.heat,desert:this.desertByDistrict[districtAt(i)]}, ...(site.climate??[])].slice(0,12);
      }
      site.gridFlow=watts;
      this.roadPower.set(site.id, true);
      site.status = 'Operational';
      if(waterPumps.includes(site.kind)&&site.kind!=='handPump') {
        const aquifer=this.soil.get(indexAt(site.x,site.z))?.groundwater??.85;
        const rating=site.kind==='deepPump'?178:site.kind==='pumpStation'?113:site.kind==='borePump'?66:36;
        const rate=site.waterRate==='conserve'?.43:site.waterRate==='deplete'?1.36:1;
        site.water=Math.min(waterCapacity(site.kind),(site.water??0)+dt*rating*rate*aquifer);
        site.status=site.water>1?'Extracting cooling water':'Aquifer exhausted';
      }
      if(waterStores.includes(site.kind)) {
        const maximum=waterCapacity(site.kind);
        const flow=site.kind==='coolTower'?140:site.kind==='tankFarm'?92:24;
        let remaining=Math.min(flow*dt,maximum-(site.water??0));
        for(const source of this.sites) {
          if(remaining<=0)break;
          if(!waterPumps.includes(source.kind)||!source.on||!this.waterReach(site,source,46)) continue;
          if(source.waterMode&&source.waterMode!=='all'&&source.waterMode!==site.waterMode)continue;
          const transfer=Math.min(source.water??0,remaining);
          if(transfer<=0)continue;
          source.water=(source.water??0)-transfer;
          site.water=(site.water??0)+transfer;
          remaining-=transfer;
        }
      }
      if(this.rain>.3&&!this.mods.sheltered&&(site.kind==='rack'||storageSite(site.kind))) {
        for(const lot of site.output)if(lot.good==='boards'||lot.good==='dry'){
          lot.moisture=clamp(lot.moisture+dt*.0015*this.rain);
          lot.quality=clamp(lot.quality-dt*.0004*this.rain);
        }
      }
      if (!recipe) continue;
      for(const work of [...site.jobs]){
        work.remaining-=dt;
        site.status=recipe.name;
        if(work.remaining>0)continue;
        if(!put(site.output,work,this.capacity(site))){site.status='Output full';continue;}
        if(work.offcut)put(site.output,{good:work.residue??'chips',quantity:work.offcut,quality:.68,moisture:work.moisture},this.capacity(site));
        this.stats.produced+=work.quantity;
        site.jobs.splice(site.jobs.indexOf(work),1);
      }
      const concurrent=site.kind==='millComplex'?3:mills.includes(site.kind)&&site.kind!=='bench'&&this.mods.twinBlade?2:1;
      if(!site.manual&&site.jobs.length<concurrent&&(!computing||computeNeeded>0)&&this.makeBatch(site,recipe,Boolean(fan))&&computing) {
        const running=site.jobs.at(-1)!;
        running.quantity=Math.min(running.quantity,computeNeeded);
        computeNeeded-=running.quantity;
      }
    }
    for(const station of this.sites){
      if(!station.on||station.kind!=='battery'||(station.reserve??0)>=680)continue;
      const source=supply.find(item=>item.site.kind!=='battery'&&item.free>4&&this.gridReach(station,item.site));
      if(!source)continue;
      const draw=Math.min(9,source.free,680-(station.reserve??0));
      source.free-=draw;
      station.reserve=(station.reserve??0)+draw;
      station.gridFlow=draw;
      if(source.site.kind!=='solar'&&source.site.kind!=='wind')source.site.fuel=Math.max(0,source.site.fuel-draw*dt*.00065*(biomassSites.includes(source.site.kind)?this.mods.biomassEfficiency:1));
    }
    for(const source of supply)source.site.gridFlow=(source.site.gridCapacity??0)-source.free;
    for(const [id,packet] of this.routePackets)if(this.clock-packet.at>2)this.routePackets.delete(id);
    this.routeStatus.clear();
    for(const site of this.sites){
      if(!site.link&&!site.secondary)continue;
      const primary=this.sites.find(s=>s.id===site.link);
      if(primary&&this.freightMode(site)){
        if(site.on)this.freight(site,primary,dt);
        this.routeStatus.set(site.id+':'+primary.id,site.on?site.status:'Dispatch paused · sender offline');
        continue;
      }
      if(site.on&&site.kind==='rollerIntake'&&this.roadPower.get(site.id)&&primary?.on){
        const raw=Array.from(this.logs.values()).find(l=>!l.cargo&&!l.carrier&&l.length<4.5&&distance(site,l)<2.1);
        if(raw&&distance(site,primary)<7){
          const span=distance(raw,primary);
          if(span>.8){raw.x+=(primary.x-raw.x)*Math.min(.82,1.2/span);raw.z+=(primary.z-raw.z)*Math.min(.82,1.2/span);raw.y=height(raw.x,raw.z)+.34;}
          if(this.acceptLog(primary,raw))site.status='Physical log forwarded';
        }
      }
      const secondary=site.secondary!==site.link?this.sites.find(s=>s.id===site.secondary):undefined;
      if(primary)this.routeStatus.set(site.id+':'+primary.id,this.forwardRoute(site,primary,secondary?site.sortGood:undefined));
      if(secondary)this.routeStatus.set(site.id+':'+secondary.id,this.forwardRoute(site,secondary,site.sortGood,true));
    }
  }

  private forwardRoute(site:Site,target:Site,sort?:Good,alternate=false) {
    if(!site.on)return 'Blocked · sender offline';
    if(!target.on)return 'Blocked · receiver offline';
    if(distance(site,target)>26&&!this.reachable(site,target,lineKinds,26))return 'Blocked · disconnected';
    if(target.kind==='fire'&&this.mods.stoker)return 'Waiting · fire needs physical logs';
    const motorized=['picker','sortGate','robotSorter'].includes(site.kind);
    if(motorized&&!this.roadPower.get(site.id))return 'Blocked · no power';
    const gradeGate=site.sortHigh&&(this.mods.sortingCamera||this.mods.roboticSort);
    const lot=site.output.find(l=>this.cargoAllowed(target,l)&&(!sort||(l.good===sort)===alternate)&&(!gradeGate||l.quality>=.84));
    if(!lot)return site.output.length?'Waiting · no compatible cargo':'Waiting · buffer empty';
    const swift=this.sites.some(s=>s.kind==='poweredBelt'&&this.roadPower.get(s.id)&&distance(site,s)<16);
    const hub=this.mods.logistics&&this.sites.some(s=>s.kind==='logisticsHub'&&s.on&&distance(s,site)<40);
    const max=hub?16:site.kind==='fuelSilo'||swift?12:site.kind==='picker'?10:4;
    const receiver=storageSite(target.kind)?target.output:target.input;
    const amount=Math.min(max,lot.quantity,buyerSite(target.kind)?max:this.capacity(target)-getQuantity(receiver));
    if(amount<=0)return 'Blocked · receiver full';
    const shipment=takeLot(site.output,lot,amount)!;
    if(buyerSite(target.kind))this.sellAt(target,shipment);
    else put(receiver,shipment);
    site.shipped=(site.shipped??0)+amount;
    this.routePackets.set(site.id+':'+target.id,{at:this.clock,good:shipment.good,from:site,to:target});
    return `Moved ${amount} × ${goods[shipment.good][0]}`;
  }

  assignHauler(base:Site,target:Site) {
    const supported=buyerSite(target.kind)||storageSite(target.kind)||(isRecipe(target.kind)&&(recipes[target.kind] as Recipe).input?.[0]==='timber');
    if((!['forestry','helperPost','crewDepot'].includes(base.kind)&&!(this.mods.yardmaster&&storageSite(base.kind)))||!supported||distance(base,target)>110||base.haul?.log) return false;
    if(!base.haul) {
      if(this.cash<340) return false;
      this.finance(-340,'Hire local log hauler');
    }
    base.haul={x:base.x,z:base.z,target:target.id,phase:'waiting',status:'Awaiting a fallen log',due:this.clock+65};
    return true;
  }

  private simulateHaulers(dt:number,heldId?:number) {
    const reservations=new Set(this.sites.flatMap(site=>site.haul?.log===undefined?[]:[site.haul.log]));
    for(const base of this.sites) {
      const truck=base.haul;
      if(!truck||!base.on||base.order&&base.order!=='haul') continue;
      if(base.shift==='day'&&this.clock%180>=140){truck.status='Crew on break';continue;}
      if(base.kind==='helperPost'||this.mods.scheduling) {
        if((truck.due??0)<=this.clock) {
          const wages=base.kind==='helperPost'?6:13;
          if(this.cash<wages){truck.status='Crew waiting for wages';continue;}
          this.finance(-wages,'Logging crew wages');
          truck.due=this.clock+65;
        }
      }
      const target=this.sites.find(site=>site.id===truck.target);
      if(!target) continue;
      const log=truck.log===undefined?undefined:this.logs.get(truck.log);
      if(truck.phase==='waiting') {
        const available=Array.from(this.logs.values()).filter(wood=>wood.id!==heldId&&!wood.cargo&&!wood.carrier
          &&!reservations.has(wood.id)&&wood.kilograms<=(base.kind==='helperPost'?78:base.kind==='crewDepot'?850:600)&&distance(wood,base)<(base.kind==='crewDepot'?125:85))
          .sort((a,b)=>distance(a,base)-distance(b,base))[0];
        if(!available) continue;
        truck.log=available.id;
        reservations.add(available.id);
        truck.phase='pickup';
        truck.status='Travelling to fallen timber';
        continue;
      }
      if(!log&&truck.phase!=='return') {
        truck.log=undefined;truck.phase='return';truck.status='Returning to yard';
      }
      if(truck.phase==='pickup'&&(log?.id===heldId||log?.cargo||log?.carrier)) {
        truck.log=undefined;truck.phase='return';truck.status='Log reassigned · returning to yard';
        continue;
      }
      const next=truck.phase==='pickup'&&log?log:truck.phase==='delivery'?target:base;
      const travel=distance(truck,next);
      const route=this.mods.markers&&travel>19?this.findPath(truck,next,['road','pavedRoad'],23):undefined;
      const mark=route&&route.length>2&&distance(truck,route[1])>2.2?route[1]:next;
      const remaining=distance(truck,mark);
      const pace=base.kind==='helperPost'?2.4:truck.phase==='delivery'?3.4:5.5;
      const step=Math.min(remaining,dt*pace*(this.mods.crewToolkit?1.28:1));
      if(remaining>.2){
        truck.x+=(mark.x-truck.x)*step/remaining;
        truck.z+=(mark.z-truck.z)*step/remaining;
      }
      if(truck.phase==='delivery'&&log) {
        log.x=truck.x;log.z=truck.z;log.y=this.ground(truck.x,truck.z)+.83;
        log.q=[Math.SQRT1_2,0,0,Math.SQRT1_2];
      }
      if(travel>.92) continue;
      if(truck.phase==='pickup'&&log) {
        log.carrier=base.id;
        truck.phase='delivery';
        truck.status='Hauling to '+facilities[target.kind].name;
      } else if(truck.phase==='delivery'&&log) {
        log.carrier=undefined;
        if(!this.acceptLog(target,log)) {
          log.carrier=base.id;
          truck.status='Delivery blocked · receiver closed or full';
          if(truck.alternate&&this.mods.fleetController){
            const second=this.sites.find(s=>s.id===truck.alternate);
            if(second?.on){
              truck.alternate=truck.target;
              truck.target=second.id;
              truck.status='Rerouting to alternate receiver';
            }
          }
          continue;
        }
        truck.log=undefined;
        truck.phase='return';
        truck.status='Returning to yard';
      } else if(truck.phase==='return') {
        truck.phase='waiting';
        truck.status='Awaiting a fallen log';
      }
    }
  }

  private simulateLand(dt: number) {
    const pressures=this.pressures, width=pressureFields.length;
    pressures.fill(0);
    this.pressureActive.fill(0);
    const add=(i:number,effect:keyof Pressure,amount:number)=>{
      pressures[i*width+pressureSlots[effect]]+=amount;
      if(amount)this.pressureActive[i]=1;
      if(!this.pressureTracked[i]){
        this.pressureTracked[i]=1;
        this.landQueue.add(i);
      }
    };
    for (const site of this.sites) {
      const def = facilities[site.kind], center = indexAt(site.x, site.z);
      if (!site.on || !def.effect || center < 0 || (def.power && !this.roadPower.get(site.id))) continue;
      if (def.effect==='fire' && !site.jobs.length) continue;
      if (def.effect==='thermal' && site.fuel <= 0) continue;
      if(def.effect==='duct'&&!this.hasHeatSink(site,site.kind==='heatRelay'?115:58))continue;
      const paved=def.effect==='island'?this.sites.filter(s=>(s.kind==='road'||s.kind==='pavedRoad')&&distance(site,s)<60).length:0;
      const cx = center % 256, cz = Math.floor(center / 256), radius = def.reach!;
      for (let z = Math.max(0, cz - radius); z <= Math.min(255, cz + radius); z++) {
        for (let x = Math.max(0, cx - radius); x <= Math.min(255, cx + radius); x++) {
          const falloff = 1 - Math.hypot(x - cx, z - cz) / (radius + .01);
          if (falloff <= 0) continue;
          const i = z * 256 + x;
          if (!this.districts.has(districtAt(i))) continue;
          const force = .35 + falloff * .9;
          switch (def.effect) {
            case 'fire': add(i, 'heat', force * .7); break;
            case 'pump': {
              const rating=site.kind==='deepPump'?3.25:site.kind==='pumpStation'?2.3:site.kind==='borePump'?1.9:1.6;
              const flow=site.waterRate==='conserve'?.44:site.waterRate==='deplete'?1.36:1;
              add(i,'drainage',force*rating*flow);
              break;
            }
            case 'ditch': add(i,'runoff',force*1.4); break;
            case 'grazing':
              if(site.kind==='ranch'&&!site.jobs.length)break;
              add(i,'grazing',force*(this.mods.grazingDensity?2.4:1.5));break;
            case 'field':
              if(site.jobs.length){add(i,'grazing',force*(site.intensive?1.7:.88));add(i,'drainage',force*.45);}
              break;
            case 'quarry': if(site.kind!=='soilRecovery'||site.jobs.length)add(i,'removal',force);break;
            case 'thermal': add(i,'heat',force*(site.scrubbers?1.15:1.6));add(i,'pollution',force*(site.scrubbers?.25:1));break;
            case 'duct': add(i,'heat',force*(site.kind==='heatRelay'?1.72:1.2));break;
            case 'dust':
              if((this.soil.get(i)?.stage??0)>=3){add(i,'runoff',force*1.4);add(i,'removal',force*.28);}
              break;
            case 'island':
              add(i,'heat',force*(1+paved*.12));
              add(i,'runoff',force*.48);break;
            case 'storm':
              if((this.soil.get(i)?.stage??0)>=4&&((x-cx)*Math.sin(this.clock/60)+(z-cz)*Math.cos(this.clock/60))>=0){
                add(i,'runoff',force*2.25);add(i,'removal',force*.80);add(i,'heat',force*.55);
              }
              break;
            case 'dryer':
              add(i,'heat',force*(site.kind==='megaDryer'?3.15:1.55));add(i,'removal',force*(site.kind==='megaDryer'?1.42:.7));break;
            case 'data': add(i, 'heat', force); add(i, 'drainage', force * 1.28); break;
            case 'forestry': break;
          }
        }
      }
      const harvesting=site.kind==='forestry'||site.kind==='crewDepot'||site.kind==='helperPost'&&this.mods.jobBoards;
      if(harvesting&&site.order!=='haul'&&this.clock%(site.kind==='crewDepot'?5:this.mods.crewToolkit?6:8)<dt && getQuantity(site.output) < this.capacity(site)) {
        const tree = this.nextForestryTree(center, radius);
        if (tree) {
          this.removed.add(tree.id);
          this.treeDamage.delete(tree.id);
          this.landRevision++;
          const i = indexAt(tree.x, tree.z);
          this.getSoil(i).vegetation = Math.min(this.getSoil(i).vegetation, this.standingFraction(i));
          this.landQueue.add(i);
          this.stats.harvest++;
          put(site.output, { good: 'timber', quantity: species[tree.kind].yield, quality: .74, moisture: .65 }, this.capacity(site));
        }
      }
    }
    for(const site of this.sites){
      if(!site.on)continue;
      if(site.kind==='clearingCrew'&&site.clearingTarget!==undefined){
        const target=site.clearingTarget;
        if(!this.districts.has(districtAt(target)))continue;
        add(target,'clearing',1.3);add(target,'grazing',.88);
        if(this.clock%6<dt){
          const tree=treesIn(this.seed,target).find(t=>this.isStanding(t)&&t.kind===0);
          if(tree){
            this.removed.add(tree.id);this.treeDamage.delete(tree.id);
            this.landRevision++;this.stats.harvest++;
            put(site.output,{good:'chips',quantity:2,quality:.65,moisture:.57},this.capacity(site));
          }
        }
      }
      if(site.kind==='recycler'&&this.roadPower.get(site.id)&&this.clock%5<dt){
        const branch=[...this.logs.values()].find(l=>l.part==='branch'&&!l.cargo&&!l.carrier&&distance(l,site)<20);
        if(branch&&put(site.output,{good:'chips',quantity:branch.units*2,quality:.69,moisture:branch.moisture},this.capacity(site)))this.logs.delete(branch.id);
        const cell=indexAt(site.x,site.z),soil=this.soil.get(cell);
        if(soil&&soil.erosion>.36&&!this.recycledCells.has(cell)&&put(site.output,{good:'ore',quantity:3,quality:.54,moisture:.28},this.capacity(site)))
          this.recycledCells.add(cell);
      }
    }
    for(const station of this.sites){
      if(station.kind==='helperPost'&&station.order==='harvest'&&station.on&&this.clock%(this.mods.crewToolkit?8:11)<dt&&getQuantity(station.output)<32){
        const i=indexAt(station.x,station.z);
        const tree=this.nextForestryTree(i,3);
        if(tree){
          this.removed.add(tree.id);
          this.treeDamage.delete(tree.id);
          const tile=indexAt(tree.x,tree.z);
          const land=this.getSoil(tile);
          land.vegetation=Math.min(land.vegetation,this.standingFraction(tile));
          this.landQueue.add(tile);this.landRevision++;this.stats.harvest++;
          put(station.output,{good:'timber',quantity:species[tree.kind].yield,quality:.73,moisture:.62},this.capacity(station));
        }
      }
      if(station.kind!=='helperPost'||station.order!=='clear'||!station.on)continue;
      const center=indexAt(station.x,station.z);
      if(center>=0)add(center,'grazing',1.25);
    }
    const dispatched=new Set<string>();
    for(let i=0;i<this.cleanup.length;){
      const job=this.cleanup[i], source=this.sites.find(s=>s.id===job.crew);
      if(desertified(this.soil.get(job.cell)??defaultSoil())){this.cleanup.splice(i,1);continue;}
      i++;
      if(!source?.on||dispatched.has(source.id)||(facilities[source.kind].power&&!this.roadPower.get(source.id)))continue;
      dispatched.add(source.id);
      if(job.travel>0){job.travel=Math.max(0,job.travel-dt);continue;}
      const force=source.kind==='megaDryer'?2:1;
      add(job.cell,'clearing',2.5*force);add(job.cell,'heat',1.8*force);add(job.cell,'drainage',1.7*force);add(job.cell,'removal',1.45*force);
    }
    for (const project of this.projects) {
      if(project.complete)continue;
      if(this.desertByDistrict[project.district]===DISTRICT_CELLS) {
        project.complete=true;
        this.finance(projectBond,'Completed regional conversion contract');
        this.notice('District converted · completion bond paid');
        continue;
      }
      project.phase += dt;
      for(let offset=0;offset<DISTRICT_CELLS;offset++){
        const wave=(offset%DISTRICT+Math.floor(offset/DISTRICT))*1.5;
        if (project.phase < wave) continue;
        const i=districtCell(project.district,offset);
        add(i, 'clearing', 1.1);
        if (project.kind === 'watershed') { add(i, 'drainage', 3.2); add(i, 'grazing', 2.6); }
        if (project.kind === 'quarry') { add(i, 'removal', 2.1); add(i, 'drainage', .8); }
        if(project.kind==='continental'){add(i,'removal',2.45);add(i,'heat',1.3);add(i,'drainage',1.1);}
        if (project.kind === 'integrated') {add(i,'heat',2.2);add(i,'removal',1.5);add(i,'drainage',1.8);add(i,'pollution',.48);}
        if (project.kind === 'dryland') {add(i,'grazing',2.3);add(i,'removal',1.25);add(i,'drainage',1.6);}
        if (project.kind === 'thermal') { add(i, 'heat', 2.7); add(i, 'removal', .58); }
      }
    }
    const localPressure=noPressure(), idlePressure=noPressure();
    for (const i of this.landQueue) {
      const soil = this.getSoil(i), before = desertified(soil);
      const affected=this.pressureActive[i];
      if(!affected&&before&&irreversibleSoil(soil)){
        this.landQueue.delete(i);
        this.pressureTracked[i]=0;
        continue;
      }
      if(affected){
        const cell=i*width;
        for(let index=0;index<width;index++)localPressure[pressureFields[index]]=pressures[cell+index];
      }
      const hadCanopy=soil.vegetation>.03;
      if (applyLand(soil, affected?localPressure:idlePressure, dt, this.rain, 1, this.clock)||hadCanopy!==(soil.vegetation>.03)) this.landRevision++;
      const now = desertified(soil);
      if (before !== now) {
        this.desertCount += now ? 1 : -1;
        this.desertByDistrict[districtAt(i)] += now ? 1 : -1;
      }
    }
    if (!this.won && canWin(this.desertCount)) { this.won = true; this.completionTime = this.clock; this.notice('Campaign complete · All cells stabilized'); }
  }

  private nextForestryTree(center: number, radius: number) {
    for (let d = 0; d <= radius; d++) {
      for (let z = -d; z <= d; z++) for (let x = -d; x <= d; x++) {
        if (Math.max(Math.abs(x), Math.abs(z)) !== d) continue;
      const cx = center % 256 + x, cz = Math.floor(center / 256) + z;
        if (cx < 0 || cx >= 256 || cz < 0 || cz >= 256) continue;
        const i = cz * 256 + cx;
        if (!this.districts.has(districtAt(i))) continue;
        const tree = treesIn(this.seed, i).find(t => this.isStanding(t));
        if (tree) return tree;
      }
    }
    return;
  }

  staff(site:Site) {
    if(!this.mods.staffing||!isRecipe(site.kind)&&site.kind!=='crewDepot')return false;
    if(site.staffed){site.staffed=false;return true;}
    if(this.cash<40)return false;
    this.finance(-40,'Hire machine operator');
    site.staffed=true;
    site.payroll=this.clock+65;
    return true;
  }

  loadByCrane(site:Site,log:Log,ride:Ride) {
    const reserved=this.sites.reduce((mass,station)=>mass+(station.crane?.ride===ride.id?this.logs.get(station.crane.log)?.kilograms??0:0),0);
    if(site.kind!=='craneYard'||site.crane||log.cargo||log.carrier||distance(log,site)>11||distance(ride,site)>10
      ||cargoMass(this.logs.values(),ride.id)+reserved+log.kilograms>vehicleTypes[ride.kind].capacity||!this.logs.has(log.id))return false;
    log.carrier=site.id;
    site.crane={log:log.id,ride:ride.id,remaining:5,x:log.x,y:log.y,z:log.z};
    return true;
  }

  scheduleService(site:Site,ride:Ride){
    if(site.kind!=='serviceBay'||site.mechanic||distance(site,ride)>10||this.cash<18)return false;
    this.finance(-18,'Book fleet service');
    site.mechanic={ride:ride.id,time:7};
    return true;
  }

  private updateYardTools(dt:number) {
    for(const site of this.sites){
      if(!site.on)continue;
      if(site.kind==='serviceBay'&&site.mechanic){
        const car=this.rides.find(v=>v.id===site.mechanic!.ride);
        if(!car){site.mechanic=undefined;continue;}
        if(distance(car,site)>11)continue;
        site.mechanic.time=Math.max(0,site.mechanic.time-dt);
        if(site.mechanic.time===0){car.fuel=100;car.wear=0;site.mechanic=undefined;this.notice('Fleet service complete');}
      }
      if(site.kind!=='craneYard'||!site.crane||!this.roadPower.get(site.id))continue;
      const job=site.crane,log=this.logs.get(job.log),vehicle=this.rides.find(v=>v.id===job.ride);
      if(!log||!vehicle||distance(vehicle,site)>11){
        if(log)log.carrier=undefined;
        site.crane=undefined;continue;
      }
      job.remaining=Math.max(0,job.remaining-dt);
      const mix=1-job.remaining/5;
      log.x=job.x+(vehicle.x-job.x)*mix;log.z=job.z+(vehicle.z-job.z)*mix;
      log.y=this.ground(log.x,log.z)+.5+Math.sin(mix*Math.PI)*3.2;
      if(!job.remaining){log.carrier=undefined;log.cargo=vehicle.id;site.crane=undefined;this.notice('Crane loaded the vehicle');}
    }
  }

  private maintainFleet(dt:number){
    if(!this.mods.maintenance)return;
    for(const base of this.sites){
      if(!base.on||base.kind!=='crewDepot')continue;
      const active=base.mechanic;
      if(active){
        active.time=Math.max(0,active.time-dt);
        const vehicle=this.rides.find(v=>v.id===active.ride);
        if(!vehicle){base.mechanic=undefined;continue;}
        if(active.time<=0&&this.cash>=22){
          this.finance(-22,'Dispatch maintenance mechanic');
          vehicle.wear=Math.max(0,vehicle.wear-60);
          vehicle.fuel=Math.min(100,vehicle.fuel+30);
          base.mechanic=undefined;
        }
        continue;
      }
      const vehicle=this.rides.find(v=>v.wear>45&&distance(v,base)<110&&
        !this.sites.some(s=>s.mechanic?.ride===v.id));
      if(vehicle)base.mechanic={ride:vehicle.id,time:5+distance(vehicle,base)/4};
    }
  }

  private runPolicies(){
    if(this.mods.regionalAutopilot)for(const site of this.sites){
      if(site.kind!=='crewDepot'||!site.on||!site.staffed||site.link)continue;
      const receiver=this.sites.find(s=>s!==site&&['bench','mill','bandsaw','speedMill','millComplex'].includes(s.kind)&&
        distance(s,site)<48&&this.reachable(site,s,['road','pavedRoad','belt'],26));
      if(receiver)this.connect(site,receiver);
    }
    if(!this.mods.opsPolicy||this.policy==='manual'||this.clock%14>=1)return;
    if(this.policy==='land'&&!this.cleanup.length&&this.cash>=400) {
      for(const region of this.districts){
        const first=this.scan(region,1,'moisture')[0];
        if(first&&this.dispatchCleanup(first.i))break;
      }
    } else if(this.policy==='revenue') {
      const active=this.contracts.find(c=>isOpenContract(c,this.clock));
      for(const site of this.sites) if(site.staffed)site.priority=site.jobs.some(job=>job.good===active?.good)||
        (isRecipe(site.kind)&&recipes[site.kind].output[0]===active?.good);
    }
  }

  tick(dt: number, rest = true, heldId?:number) {
    this.clock += dt;
    if (rest) this.stamina = Math.min(this.mods.stamina, this.stamina + dt * 16 * this.mods.recover * this.mods.athlete);
    this.tickTime += dt;
    if (this.tickTime < 1) return;
    this.tickTime -= 1;
    const previous=this.eventAt(this.clock-1), current=this.eventAt();
    if(previous!==current&&current!=='Clear weather')this.notice(current+' · Field bulletin');
    const weather=Math.max(0,Math.sin(this.clock/96+this.seed%13)-.58)*2;
    this.rain=current==='Thunderstorm'?Math.max(.55,weather):current==='Dry front'?weather*.2:weather;
    for (const contract of this.contracts) if (!contract.done && this.clock >= contract.deadline) contract.failed = true;
    this.simulateMachinery(1);
    this.simulateHaulers(1,heldId);
    this.maintainFleet(1);
    this.updateYardTools(1);
    this.runPolicies();
    this.simulateLand(1);
    for (const [key, checked] of [
      ['First Shave', this.stats.harvest > 0], ['Smoke Signal', this.stats.fire > 0], ['Value Added', this.stats.produced > 0],
      ['Fleet Service', this.rides.length >= 3], ['First Dry Cell', this.desertCount > 0], ['The Last Jungle', this.won],
      ['No Compute Needed',this.won&&this.challenge==='noCompute'],['Lean Grid Victory',this.won&&this.challenge==='leanPower'],
    ] as const) if (checked && !this.achievements.has(key)) { this.achievements.add(key); this.notice(`Award · ${key}`); }
  }

  stripGround(at:Point,seconds:number) {
    const i=indexAt(at.x,at.z);
    if(i<0||!this.districts.has(districtAt(i)))return false;
    const soil=this.getSoil(i);
    const before=desertified(soil);
    const wasVisible=soil.vegetation>.03;
    if(applyLand(soil,{clearing:2.4,drainage:.7,removal:this.mods.compactor?6.8:4.5,heat:0,grazing:this.mods.compactor?1:0,pollution:.18},seconds,this.rain,1,this.clock)
      ||wasVisible!==(soil.vegetation>.03))this.landRevision++;
    if(!before&&desertified(soil)) {
      this.desertCount++;
      this.desertByDistrict[districtAt(i)]++;
    }
    this.landQueue.add(i);
    return true;
  }

  scan(district?: number, limit = 64, filter?:Blocker) {
    const output: { i: number; at: Point; soil: Soil }[] = [];
    if(district!==undefined&&(!Number.isInteger(district)||district<0||district>=allDistricts))return output;
    const count=district===undefined?TOTAL:DISTRICT_CELLS;
    for (let offset = 0; offset < count && output.length < limit; offset++) {
      const i=district===undefined?offset:districtCell(district,offset);
      const soil = this.soil.get(i) ?? defaultSoil();
      if (!desertified(soil)&&(!filter||blockers(soil).includes(filter))) output.push({ i, at: cellPoint(i), soil });
    }
    return output;
  }

  snapshot() {
    return {
      version: VERSION, seed: this.seed, challenge:this.challenge,clock: this.clock, cash: this.cash, player: { ...this.player }, savedAt: Date.now(),
      treeDamage: [...this.treeDamage], brokenRocks:[...this.brokenRocks],groundStumps:[...this.groundStumps],elevation:[...this.elevation],recycledCells:[...this.recycledCells], removed: [...this.removed], soil: [...this.soil], logs: [...this.logs.values()],
      sites: this.sites, rides: this.rides, stock: this.stock, ownedTools: [...this.ownedTools], ownedUpgrades: [...this.ownedUpgrades],
      tool: this.tool, wear: this.wear, toolWear: this.toolWear, battery: this.battery, districts: [...this.districts], ledger: this.ledger, contracts: this.contracts,
      stats: this.stats, won: this.won, completionTime: this.completionTime, nextId: this.nextId, projects: this.projects, policy:this.policy,cleanup:this.cleanup, prototypes:[...this.prototypes],scienceSpent:this.scienceSpent, achievements: [...this.achievements], claimed: [...this.claimed],
    };
  }

  static restore(s: Save) {
    const game=new Campaign(s.seed,s.challenge??'standard');
    Object.assign(game, {
      clock: s.clock, cash: s.cash, player: s.player, treeDamage: new Map(s.treeDamage), removed: new Set(s.removed), brokenRocks:new Set(s.brokenRocks??[]),groundStumps:new Set(s.groundStumps??[]),
      elevation:new Map(s.elevation??[]),recycledCells:new Set(s.recycledCells??[]),soil: new Map(s.soil),
      sites: s.sites, rides: s.rides, stock: s.stock, ownedTools: new Set(s.ownedTools), ownedUpgrades: new Set(s.ownedUpgrades),
      tool: s.tool, wear: s.wear, toolWear: s.toolWear ?? {}, battery: s.battery, districts: new Set(s.districts), ledger: s.ledger, contracts: s.contracts,
      policy:s.policy??'manual',cleanup:s.cleanup??[], prototypes:new Set(s.prototypes??[]),scienceSpent:s.scienceSpent??0,stats: s.stats, completionTime: s.completionTime, nextId: s.nextId, projects: s.projects,
      logs: new Map(s.logs.map(l => [l.id, l])), achievements: new Set(s.achievements), claimed: new Set(s.claimed??[]),
    });
    game.mods = modifiers(game.ownedUpgrades);
    for (const [i, land] of game.soil) {
      const stable=desertified(land);
      if(!stable||!irreversibleSoil(land)){
        game.landQueue.add(i);
        game.pressureTracked[i]=1;
      }
      if(!stable)continue;
      game.desertCount++;
      game.desertByDistrict[districtAt(i)]++;
    }
    game.won = s.won && canWin(game.desertCount);
    return game;
  }
}

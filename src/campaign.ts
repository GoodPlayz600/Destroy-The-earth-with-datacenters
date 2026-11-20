import { CELL, DISTRICTS, TOTAL, facilities, goods, recipes, species, tools, vehicles } from './catalog';
import type { Facility, Good, Recipe, Stack, Tool, VehicleType } from './catalog';
import { applyLand, cellPoint, clamp, defaultSoil, desertified, distance, districtAt, hash, height, homeDistrict, indexAt, noPressure, treesIn } from './land';
import type { Point, Pressure, Soil, Tree } from './land';
import { forestryUnlocks, modifiers, upgradeFacility, upgradesById } from './upgrades';

export const VERSION = 1;
export type Log = Point & { id: number; y: number; q: [number, number, number, number]; kind: number; length: number; kilograms: number; units: number; moisture: number; quality: number; cargo?: string; carrier?: string };
export type Haul = Point & { target: string; log?: number; phase: 'waiting'|'pickup'|'delivery'|'return'; status: string; };
export const storageSite = (kind:Facility) => kind==='depot'||kind==='railDepot'||kind==='dronePad';
export type Shipment = { mode:'rail'|'air'; load:Stack; target:string; path:Point[]; duration:number; elapsed:number; };
type Batch = Stack & { remaining: number; payout?: number; offcut?: number };
export const mills: Facility[] = ['bench','bandsaw','mill','speedMill','millComplex'];
const kilns: Facility[] = ['smallKiln','kiln'];
export const takesLogs=(kind:Facility) => storageSite(kind)||kind==='fire'||kind==='market'||(isRecipe(kind)&&(recipes[kind] as Recipe).input?.[0]==='timber');
export type Site = Point & {
  id: string; kind: Facility; yaw?:number; input: Stack[]; output: Stack[]; jobs: Batch[];
  on: boolean; fuel: number; status: string; water?: number; yieldCarry?:number; layout?: 'quality'|'volume'; sortHigh?:boolean; link?: string; haul?: Haul; shipment?:Shipment; mode?: 'sell' | 'charcoal';
};
export type Ride = Point & { id: string; kind: VehicleType; yaw: number; fuel: number; wear: number };
export type Ledger = { date: number; note: string; amount: number };
export type Contract = { good: Good; quantity: number; deadline: number; payout: number; done: boolean; failed: boolean };
export type Project = { kind: 'watershed' | 'quarry' | 'thermal'; district: number; phase: number; complete?: boolean };
type RecordRow = { hits: number; harvest: number; fire: number; sold: number; produced: number; earned: number; spent: number; miles: number };
export type Save = ReturnType<Campaign['snapshot']>;

const baseSites: [Facility, number, number][] = [['fire', -6.5, 0], ['market', 7.2, -2.2]];
const rootStats = (): RecordRow => ({ hits: 0, harvest: 0, fire: 0, sold: 0, produced: 0, earned: 0, spent: 0, miles: 0 });
const isRecipe = (kind: Facility): kind is keyof typeof recipes => Object.hasOwn(recipes, kind);
const allDistricts = DISTRICTS ** 2;
export const projectPrices = { watershed: 6200, quarry: 8200, thermal: 9500 };

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
export const priceFor = (stack: Stack) => Math.round(goods[stack.good][1] * stack.quantity * (.64 + stack.quality * .45 + (1 - stack.moisture) * .18));
export const canWin = (desertCount: number) => desertCount === TOTAL;
export const cargoMass = (logs: Iterable<Log>, id: string) => Array.from(logs).reduce((sum, l) => sum + (l.cargo === id ? l.kilograms : 0), 0);

export class Campaign {
  seed: number;
  clock = 0;
  cash = 0;
  treeDamage = new Map<number, number>();
  removed = new Set<number>();
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
  private tickTime = 0;
  private landQueue = new Set<number>();
  private roadPower = new Map<string, boolean>();

  constructor(seed = 20831) {
    this.seed = seed;
    for (const [kind, x, z] of baseSites) this.sites.push(this.makeSite(kind, x, z));
  }

  private makeSite(kind: Facility, x: number, z: number): Site {
    return { id: 's' + this.nextId++, kind, x, z, input: [], output: [], jobs: [], on: true, fuel: facilities[kind].supply ? 100 : 0, status: 'Idle' };
  }

  notice(message: string) { this.notices.push(message); }
  finance(amount: number, note: string) {
    this.cash += amount;
    if (amount > 0) this.stats.earned += amount;
    else this.stats.spent -= amount;
    this.ledger.unshift({ date: this.clock, note, amount });
    this.ledger.length = Math.min(150, this.ledger.length);
  }

  buyUpgrade(id: string) {
    const item = upgradesById.get(id), required = upgradeFacility[id];
    if (!item?.implemented || this.ownedUpgrades.has(id) || this.cash < item.price
      || (item.previous && !this.ownedUpgrades.has(item.previous)) || (required && !this.sites.some(s => s.kind === required))) return false;
    this.ownedUpgrades.add(id);
    const previousDurability = this.mods.knifeDurability;
    this.mods = modifiers(this.ownedUpgrades);
    if(this.tool==='knife')this.wear+=this.mods.knifeDurability-previousDurability;
    else if(this.toolWear.knife!==undefined)this.toolWear.knife+=this.mods.knifeDurability-previousDurability;
    for (const [tool, node] of Object.entries(forestryUnlocks)) if (node===id) this.ownedTools.add(tool as Tool);
    this.finance(-item.price, item.name);
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
    const energy = powered ? (this.tool === 'harvester' ? 4.6 : this.tool === 'chainsaw' ? 2.75 : 2.1) * this.mods.chain : 0;
    if (this.battery < energy) return { damage: 0, felled: false, ratio: 0 };
    const effort = (isKnife ? 4 * this.mods.knifeStamina : powered ? 2.5 : 5) * this.mods.handStamina;
    if (this.stamina < effort) return { damage: 0, felled: false, ratio: 0 };
    this.battery -= energy;
    this.stamina -= effort;
    this.stats.hits++;
    let damage = config.power * (this.wear <= 0 ? .46 : 1);
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

  cutLog(id: number, next: Point, slice = .5) {
    const log = this.logs.get(id);
    if (!log || log.cargo || log.carrier || log.units < 2 || this.tool === 'knife') return false;
    const units = Math.max(1,Math.min(log.units-1,Math.round(log.units * slice))), ratio = units / log.units;
    const second = { ...log, id: this.nextId++, ...next, y: height(next.x, next.z) + .52, units, length: log.length * ratio, kilograms: log.kilograms * ratio };
    this.logs.set(second.id, second);
    log.units -= units;
    log.kilograms *= 1 - ratio;
    log.length *= 1 - ratio;
    return true;
  }

  getSoil(i: number) {
    if (!this.soil.has(i)) this.soil.set(i, defaultSoil());
    return this.soil.get(i)!;
  }

  private standingFraction(i: number) {
    const trees = treesIn(this.seed, i);
    return trees.filter(t => !this.removed.has(t.id)).length / Math.max(1, trees.length);
  }

  logStack(log: Log): Stack { return { good: 'timber', quantity: log.units, quality: log.quality, moisture: log.moisture }; }
  fireValue(log: Log) {
    return Math.round((log.units * 13 + log.kilograms * .2) * (this.mods.sortDry && log.moisture < .45 ? 1.22 : 1));
  }

  acceptLog(site: Site, log: Log) {
    if (!site.on || log.cargo || log.carrier || !this.logs.has(log.id) || distance(site, log) > facilities[site.kind].size + .8) return false;
    if (site.kind === 'fire') {
      if (log.kilograms > this.mods.burnMass || site.jobs.length >= this.mods.burnSlots) return false;
      const toCharcoal = this.mods.carbon && site.mode === 'charcoal';
      site.jobs.push({
        good: 'charcoal', quantity: toCharcoal ? log.units : this.mods.ash ? 1 : 0, moisture: .05, quality: .82,
        remaining: (1.6 + log.kilograms * .044) / this.mods.burnSpeed,
        payout: toCharcoal ? 0 : this.fireValue(log),
      });
    } else if (site.kind === 'market') {
      this.sellStack(this.logStack(log));
    } else {
      const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
      if (!storageSite(site.kind) && recipe?.input?.[0] !== 'timber') return false;
      if (!put(storageSite(site.kind) ? site.output : site.input, this.logStack(log), this.capacity(site))) return false;
    }
    this.logs.delete(log.id);
    return true;
  }

  capacity(site: Site) {
    return storageSite(site.kind) ? 260 : site.kind === 'fire' ? 32 : site.kind === 'bench' || site.kind === 'rack' ? 20 : 42;
  }

  transfer(site: Site, good: Good, quantity: number, retrieve: boolean) {
    const source = retrieve ? site.output : this.stock;
    const destination = retrieve ? this.stock : storageSite(site.kind) ? site.output : site.input;
    const capacity = retrieve ? 150 : this.capacity(site);
    const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
    if (!retrieve && !storageSite(site.kind) && recipe?.input?.[0] !== good) return false;
    if (getQuantity(destination) + quantity > capacity) return false;
    const stack = take(source, good, quantity);
    return stack ? put(destination, stack, capacity) : false;
  }

  marketValue(stack:Stack) {
    const certified=this.mods.certified&&['boards','dry','finished','treated'].includes(stack.good)&&stack.quality>=.90&&stack.moisture<=.18;
    return Math.round(priceFor(stack)*(certified?1.26:1));
  }

  sellStack(stack: Stack) {
    const payout=this.marketValue(stack);
    this.finance(payout, `${goods[stack.good][0]} ×${stack.quantity} · Timber Exchange`);
    this.stats.sold += stack.quantity;
    this.notice(`+$${payout} · ${goods[stack.good][0]}`);
  }

  sellInventory(good: Good, quantity: number, lot?:Stack) {
    if(lot) {
      const index=this.stock.indexOf(lot);
      if(index<0||lot.good!==good||!Number.isInteger(quantity)||quantity<=0||quantity>lot.quantity) return false;
      const shipped={...lot,quantity};
      lot.quantity-=quantity;
      if(!lot.quantity)this.stock.splice(index,1);
      this.sellStack(shipped);
      return true;
    }
    const stack = take(this.stock, good, quantity);
    if (!stack) return false;
    this.sellStack(stack);
    return true;
  }

  acceptContract(good: Good) {
    if (this.contracts.some(c => !c.done && !c.failed)) return false;
    const quantity = good === 'compute' ? 12 : ['finished','treated'].includes(good)?16:8;
    this.contracts.unshift({ good, quantity, deadline: this.clock + 360, payout: Math.round(goods[good][1] * quantity * 1.5), done: false, failed: false });
    this.contracts.length = Math.min(this.contracts.length, 25);
    return true;
  }

  fulfill(contract: Contract) {
    if (contract.done || contract.failed || contract.deadline <= this.clock || !take(this.stock, contract.good, contract.quantity)) return false;
    contract.done = true;
    this.finance(contract.payout, `Contract fulfilled · ${goods[contract.good][0]}`);
    this.notice(`Contract complete · +$${contract.payout}`);
    return true;
  }

  siteIssue(kind: Facility, at: Point) {
    const def = facilities[kind], i = indexAt(at.x, at.z);
    if (i < 0 || (Math.hypot(at.x, at.z) > 29 && !this.districts.has(districtAt(i)))) return 'Purchase this district first';
    if (this.cash < def.price) return 'Insufficient funds';
    if(def.research&&!this.ownedUpgrades.has(def.research)) return 'Requires facility research';
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
    this.finance(-facilities[kind].price, facilities[kind].name);
    this.notice(facilities[kind].name + ' installed');
    return site;
  }

  acquireRide(kind: VehicleType, point: Point) {
    const vehicle = vehicles[kind];
    if (this.cash < vehicle.cost || (kind === 'sled' && !this.mods.sled) || (kind === 'cart' && !this.mods.cart)
      || indexAt(point.x, point.z) < 0 || (Math.hypot(point.x, point.z) > 29 && !this.districts.has(districtAt(indexAt(point.x, point.z))))) return;
    const ride: Ride = { ...point, id: 'v' + this.nextId++, kind, yaw: this.player.yaw, fuel: 100, wear: 0 };
    this.rides.push(ride);
    this.finance(-vehicle.cost, vehicle.name);
    return ride;
  }

  buyDistrict(district: number) {
    if (district < 0 || district >= allDistricts || this.districts.has(district) || this.cash < 950) return false;
    this.finance(-950, 'Purchase district permit');
    this.districts.add(district);
    return true;
  }

  startProject(district: number, kind: Project['kind']) {
    if (!this.districts.has(district) || this.projects.some(p => p.district === district) || this.cash < projectPrices[kind]) return false;
    if (!this.sites.some(s => s.kind === 'forestry')) return false;
    const required = kind === 'watershed' ? 'pump' : kind === 'quarry' ? 'quarry' : 'thermal';
    if (!this.sites.some(s => s.kind === required)) return false;
    this.finance(-projectPrices[kind], kind + ' district deployment');
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

  refuel(ride: Ride) {
    if (this.cash < 18) return false;
    this.finance(-18, 'Vehicle service');
    ride.fuel = 100;
    ride.wear = 0;
    return true;
  }

  connect(source: Site, target: Site) {
    if (source === target || !this.sites.includes(source) || !this.sites.includes(target) || source.shipment) return false;
    const route=source.kind==='railDepot'
      ?this.findPath(source,target,['rail'],12)
      :source.kind==='dronePad'?distance(source,target)<=320
      :distance(source,target)<=16||this.reachable(source,target,['belt','rail','road'],26);
    if (!route) return false;
    source.link = target.id;
    return true;
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
    const rail=site.kind==='railDepot', capacity=rail?30:8;
    const now=site.shipment;
    if(now) {
      if(now.elapsed<now.duration) {
        now.elapsed+=dt;
        site.status=`${rail?'Train':'Drone'} en route · ${Math.ceil(now.duration-now.elapsed)}s remaining`;
        return;
      }
      if(!target.on){site.status='Freight held · receiver offline';return;}
      if(target.kind==='market') this.sellStack(now.load);
      else if(!put(storageSite(target.kind)?target.output:target.input,now.load,this.capacity(target))) {
        site.status='Freight held · receiver full';
        return;
      }
      site.shipment=undefined;
      site.status='Shipment delivered';
      return;
    }
    if(!target.on){site.status='Freight blocked · receiver offline';return;}
    if(!rail&&!this.roadPower.get(site.id)){site.status='Drone charger needs grid power';return;}
    const path=rail?this.findPath(site,target,['rail'],12):distance(site,target)<=320?[site,target]:undefined;
    if(!path){site.status=rail?'Freight blocked · broken track':'Freight blocked · out of range';return;}
    const length=path.slice(1).reduce((n,p,index)=>n+distance(p,path[index]),0);
    const recipe: Recipe | undefined = isRecipe(target.kind) ? recipes[target.kind] : undefined;
    const lot=site.output.find(l=>storageSite(target.kind)||target.kind==='market'||recipe?.input?.[0]===l.good);
    if(!lot){site.status=site.output.length?'Freight blocked · incompatible cargo':'Waiting for freight';return;}
    const available=target.kind==='market'?capacity:this.capacity(target)-getQuantity(storageSite(target.kind)?target.output:target.input);
    const amount=Math.min(lot.quantity,capacity,available);
    if(amount<=0){site.status='Freight blocked · receiver full';return;}
    const fee=Math.max(2,Math.round(length*(rail?.021:.055)));
    if(this.cash<fee){site.status='Freight blocked · dispatch costs';return;}
    const load=take(site.output,lot.good,amount);
    if(!load)return;
    this.finance(-fee,rail?'Rail freight dispatch':'Drone freight dispatch');
    site.shipment={mode:rail?'rail':'air',target:target.id,load,path:path.map(({x,z})=>({x,z})),duration:Math.max(3,length/(rail?12:22)),elapsed:0};
    site.status='Shipment dispatched';
  }

  private supplyCooling(site:Site,dt:number) {
    const requested=13*dt;
    const stores=this.sites.filter(source=>source.on&&(source.kind==='pump'||source.kind==='tank')
      &&this.reachable(site,source,['pipe'],46));
    if(stores.reduce((total,source)=>total+(source.water??0),0)<requested) return false;
    let remaining=requested;
    for(const source of stores) {
      const amount=Math.min(remaining,source.water??0);
      source.water=(source.water??0)-amount;
      if((remaining-=amount)<=0) break;
    }
    return true;
  }

  private makeBatch(site:Site,recipe:Recipe, poweredFan=false, crank=false) {
    const [good,baseQuantity]=recipe.output, mill=mills.includes(site.kind);
    let quantity=baseQuantity;
    const carry=mill&&this.mods.bladeGuide?(site.yieldCarry??0)+baseQuantity*.10:0;
    quantity+=Math.floor(carry+1e-8);
    if(mill&&this.mods.cutPatterns&&site.layout==='volume')quantity+=1;
    const offcut=mill&&site.kind!=='bench'&&this.mods.offcuts?1:0;
    const queued=site.jobs.reduce((sum,job)=>sum+job.quantity+(job.offcut??0),0);
    if(getQuantity(site.output)+queued+quantity+offcut>this.capacity(site)) {site.status='Output full';return false;}
    const input=recipe.input?take(site.input,...recipe.input,recipe.minQuality,recipe.maxMoisture):undefined;
    if(recipe.input&&!input){site.status='Awaiting suitable material';return false;}
    if(carry)site.yieldCarry=clamp(carry-Math.floor(carry+1e-8));
    let quality=(input?.quality??.91)+(site.kind==='bench'?.02:.08);
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
    if(site.kind==='joinery'&&this.mods.surfaceSander)quality+=.19;
    site.jobs.push({good,quantity,quality:clamp(quality),moisture,remaining,offcut});
    site.status=recipe.name;
    return true;
  }

  crankBench(site:Site) {
    return site.kind==='bench'&&site.on&&this.mods.benchCrank&&site.jobs.length===0&&this.makeBatch(site,recipes.bench,false,true);
  }

  private simulateMachinery(dt: number) {
    const supply = this.sites.filter(s => s.on && facilities[s.kind].supply && s.fuel > 0).map(site => ({ site, free: facilities[site.kind].supply! }));
    this.roadPower.clear();
    for (const site of this.sites) {
      if (!site.on) { site.status = 'Paused'; continue; }
      if (site.kind === 'fire') {
        site.status = site.jobs.length ? 'Burning' : 'Ready for physical delivery';
        if (!site.jobs.length && this.mods.stoker) {
          const depot = this.sites.find(s => s.kind === 'depot' && s.link === site.id);
          if (depot && getQuantity(site.output) < this.capacity(site)) {
            const raw = take(depot.output, 'timber', 1);
            if (raw) site.jobs.push({ good: 'charcoal', quantity: this.mods.ash ? 1 : 0, quality: .8, moisture: .05, remaining: 2 / this.mods.burnSpeed, payout: 17 });
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
      let watts = Math.max(recipe?.power ?? 0, facilities[site.kind].power ?? 0);
      if(kilns.includes(site.kind)&&this.mods.smartKiln)watts=Math.max(1,watts-2);
      const fan=site.kind==='rack'&&this.mods.dryingFan&&supply.some(source=>source.free>=2&&this.reachable(site,source.site,['substation'],78));
      if(fan)watts=2;
      if (site.kind === 'kiln' && this.mods.heatReuse && this.sites.some(s => s.kind === 'fire' && s.jobs.length > 0 && distance(site, s) < 22)) watts = Math.max(0, watts - 3);
      const generator = !watts ? undefined : supply.find(source => source.free >= watts && this.reachable(site, source.site, ['substation'], 78));
      if (watts && !generator) { site.status = 'No grid power'; continue; }
      if (site.kind === 'data' && !this.supplyCooling(site,dt)) {
        site.status = 'Cooling supply required';
        continue;
      }
      if (generator) {
        generator.free -= watts;
        generator.site.fuel = Math.max(0, generator.site.fuel - watts * dt * .00065);
      }
      this.roadPower.set(site.id, true);
      site.status = 'Operational';
      if (site.kind === 'pump') {
        const aquifer=this.soil.get(indexAt(site.x,site.z))?.groundwater??.85;
        site.water=Math.min(160,(site.water??0)+dt*36*aquifer);
        site.status=site.water>1?'Extracting cooling water':'Aquifer exhausted';
      }
      if (site.kind === 'tank') {
        for(const source of this.sites) {
          if(source.kind!=='pump'||!source.on||!this.reachable(site,source,['pipe'],46)) continue;
          const transfer=Math.min(source.water??0,24*dt,1200-(site.water??0));
          if(transfer<=0)continue;
          source.water=(source.water??0)-transfer;
          site.water=(site.water??0)+transfer;
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
        if(work.offcut)put(site.output,{good:'chips',quantity:work.offcut,quality:.68,moisture:work.moisture},this.capacity(site));
        this.stats.produced+=work.quantity;
        site.jobs.splice(site.jobs.indexOf(work),1);
      }
      const concurrent=site.kind==='millComplex'?3:mills.includes(site.kind)&&site.kind!=='bench'&&this.mods.twinBlade?2:1;
      if(site.jobs.length<concurrent)this.makeBatch(site,recipe,Boolean(fan));
    }
    for (const site of this.sites) {
      if (!site.on || !site.link) continue;
      const target = this.sites.find(s => s.id === site.link);
      if(target&&(site.kind==='railDepot'||site.kind==='dronePad')){this.freight(site,target,dt);continue;}
      if(!site.output.length)continue;
      if (!target?.on) { site.status = 'Route blocked · receiver offline'; continue; }
      if (distance(site, target) > 26 && !this.reachable(site, target, ['belt','rail','road'], 26)) { site.status = 'Route blocked · disconnected'; continue; }
      if (target.kind === 'fire' && this.mods.stoker) continue;
      const recipe: Recipe | undefined = isRecipe(target.kind) ? recipes[target.kind] : undefined;
      const lot = site.output.find(s => (!site.sortHigh||!this.mods.sortingCamera||s.quality>=.84)
        &&(storageSite(target.kind) || target.kind === 'market' || recipe?.input?.[0] === s.good));
      if (!lot) { site.status = 'Route blocked · incompatible cargo'; continue; }
      if (target.kind === 'market') {
        const shipped = take(site.output, lot.good, Math.min(4, lot.quantity));
        if (shipped) this.sellStack(shipped);
      } else {
        const buffer = storageSite(target.kind) ? target.output : target.input;
        const n = Math.min(4, lot.quantity, this.capacity(target) - getQuantity(buffer));
        if (n <= 0) { site.status = 'Route blocked · receiver full'; continue; }
        const shipped = take(site.output, lot.good, n);
        if (shipped) put(buffer, shipped);
      }
    }
  }

  assignHauler(base:Site,target:Site) {
    const supported=target.kind==='market'||storageSite(target.kind)||(isRecipe(target.kind)&&(recipes[target.kind] as Recipe).input?.[0]==='timber');
    if(base.kind!=='forestry'||!supported||distance(base,target)>110||base.haul?.log) return false;
    if(!base.haul) {
      if(this.cash<340) return false;
      this.finance(-340,'Hire local log hauler');
    }
    base.haul={x:base.x,z:base.z,target:target.id,phase:'waiting',status:'Awaiting a fallen log'};
    return true;
  }

  private simulateHaulers(dt:number,heldId?:number) {
    const reservations=new Set(this.sites.flatMap(site=>site.haul?.log===undefined?[]:[site.haul.log]));
    for(const base of this.sites) {
      const truck=base.haul;
      if(!truck||!base.on) continue;
      const target=this.sites.find(site=>site.id===truck.target);
      if(!target) continue;
      const log=truck.log===undefined?undefined:this.logs.get(truck.log);
      if(truck.phase==='waiting') {
        const available=Array.from(this.logs.values()).filter(wood=>wood.id!==heldId&&!wood.cargo&&!wood.carrier
          &&!reservations.has(wood.id)&&wood.kilograms<=600&&distance(wood,base)<85)
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
      const travel=distance(truck,next),step=Math.min(travel,dt*(truck.phase==='delivery'?3.4:5.5));
      if(travel>.2) {
        truck.x+=(next.x-truck.x)*step/travel;
        truck.z+=(next.z-truck.z)*step/travel;
      }
      if(truck.phase==='delivery'&&log) {
        log.x=truck.x;log.z=truck.z;log.y=height(truck.x,truck.z)+.83;
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
    const pressure = new Map<number, Pressure>();
    const add = (i: number, effect: keyof Pressure, n: number) => {
      let row = pressure.get(i);
      if (!row) { row = noPressure(); pressure.set(i, row); }
      row[effect] += n;
      this.landQueue.add(i);
    };
    for (const site of this.sites) {
      const def = facilities[site.kind], center = indexAt(site.x, site.z);
      if (!site.on || !def.effect || center < 0 || (def.power && !this.roadPower.get(site.id))) continue;
      if (site.kind === 'fire' && !site.jobs.length) continue;
      if (site.kind === 'thermal' && site.fuel <= 0) continue;
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
            case 'pump': add(i, 'drainage', force * 1.6); break;
            case 'grazing': add(i, 'grazing', force * 1.5); break;
            case 'quarry': add(i, 'removal', force); break;
            case 'thermal': add(i, 'heat', force * 1.6); add(i, 'pollution', force); break;
            case 'dryer': add(i, 'heat', force * 1.55); add(i, 'removal', force * .7); break;
            case 'data': add(i, 'heat', force); add(i, 'drainage', force * 1.28); break;
            case 'forestry': break;
          }
        }
      }
      if (site.kind === 'forestry' && this.clock % 8 < dt && getQuantity(site.output) < this.capacity(site)) {
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
    for (const project of this.projects) {
      if(project.complete)continue;
      if(this.desertByDistrict[project.district]===1024) {
        project.complete=true;
        this.finance(5500,'Completed regional conversion contract');
        this.notice('District converted · completion bond paid');
        continue;
      }
      project.phase += dt;
      const dx = project.district % DISTRICTS * 32, dz = Math.floor(project.district / DISTRICTS) * 32;
      for (let z = dz; z < dz + 32; z++) for (let x = dx; x < dx + 32; x++) {
        const i = z * 256 + x;
        const wave = (x - dx + z - dz) * 1.5;
        if (project.phase < wave) continue;
        add(i, 'clearing', 1.1);
        if (project.kind === 'watershed') { add(i, 'drainage', 3.2); add(i, 'grazing', 2.6); }
        if (project.kind === 'quarry') { add(i, 'removal', 2.1); add(i, 'drainage', .8); }
        if (project.kind === 'thermal') { add(i, 'heat', 2.7); add(i, 'removal', .58); }
      }
    }
    for (const i of this.landQueue) {
      const soil = this.getSoil(i), before = desertified(soil);
      const current=pressure.get(i);
      if(!current&&before&&soil.fertility<=.24&&soil.substrate>=.85)continue;
      const p = current ?? noPressure();
      const hadCanopy=soil.vegetation>.03;
      if (applyLand(soil, p, dt, this.rain, 1, this.clock)||hadCanopy!==(soil.vegetation>.03)) this.landRevision++;
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

  tick(dt: number, rest = true, heldId?:number) {
    this.clock += dt;
    if (rest) this.stamina = Math.min(this.mods.stamina, this.stamina + dt * 16 * this.mods.recover * this.mods.athlete);
    this.tickTime += dt;
    if (this.tickTime < 1) return;
    this.tickTime -= 1;
    this.rain = Math.max(0, Math.sin(this.clock / 96 + this.seed % 13) - .58) * 2;
    for (const contract of this.contracts) if (!contract.done && this.clock >= contract.deadline) contract.failed = true;
    this.simulateMachinery(1);
    this.simulateHaulers(1,heldId);
    this.simulateLand(1);
    for (const [key, checked] of [
      ['First Shave', this.stats.harvest > 0], ['Smoke Signal', this.stats.fire > 0], ['Value Added', this.stats.produced > 0],
      ['Fleet Service', this.rides.length >= 3], ['First Dry Cell', this.desertCount > 0], ['The Last Jungle', this.won],
    ] as const) if (checked && !this.achievements.has(key)) { this.achievements.add(key); this.notice(`Award · ${key}`); }
  }

  stripGround(at:Point,seconds:number) {
    const i=indexAt(at.x,at.z);
    if(i<0||!this.districts.has(districtAt(i)))return false;
    const soil=this.getSoil(i);
    const before=desertified(soil);
    const wasVisible=soil.vegetation>.03;
    if(applyLand(soil,{clearing:2.4,drainage:.7,removal:4.5,heat:0,grazing:0,pollution:.18},seconds,this.rain,1,this.clock)
      ||wasVisible!==(soil.vegetation>.03))this.landRevision++;
    if(!before&&desertified(soil)) {
      this.desertCount++;
      this.desertByDistrict[districtAt(i)]++;
    }
    this.landQueue.add(i);
    return true;
  }

  scan(district?: number, limit = 64) {
    const output: { i: number; at: Point; soil: Soil }[] = [];
    for (let i = 0; i < TOTAL && output.length < limit; i++) {
      if (district !== undefined && districtAt(i) !== district) continue;
      const soil = this.soil.get(i) ?? defaultSoil();
      if (!desertified(soil)) output.push({ i, at: cellPoint(i), soil });
    }
    return output;
  }

  snapshot() {
    return {
      version: VERSION, seed: this.seed, clock: this.clock, cash: this.cash, player: { ...this.player }, savedAt: Date.now(),
      treeDamage: [...this.treeDamage], removed: [...this.removed], soil: [...this.soil], logs: [...this.logs.values()],
      sites: this.sites, rides: this.rides, stock: this.stock, ownedTools: [...this.ownedTools], ownedUpgrades: [...this.ownedUpgrades],
      tool: this.tool, wear: this.wear, toolWear: this.toolWear, battery: this.battery, districts: [...this.districts], ledger: this.ledger, contracts: this.contracts,
      stats: this.stats, won: this.won, completionTime: this.completionTime, nextId: this.nextId, projects: this.projects, achievements: [...this.achievements],
    };
  }

  static restore(s: Save) {
    const game = new Campaign(s.seed);
    Object.assign(game, {
      clock: s.clock, cash: s.cash, player: s.player, treeDamage: new Map(s.treeDamage), removed: new Set(s.removed), soil: new Map(s.soil),
      sites: s.sites, rides: s.rides, stock: s.stock, ownedTools: new Set(s.ownedTools), ownedUpgrades: new Set(s.ownedUpgrades),
      tool: s.tool, wear: s.wear, toolWear: s.toolWear ?? {}, battery: s.battery, districts: new Set(s.districts), ledger: s.ledger, contracts: s.contracts,
      stats: s.stats, completionTime: s.completionTime, nextId: s.nextId, projects: s.projects,
      logs: new Map(s.logs.map(l => [l.id, l])), achievements: new Set(s.achievements),
    });
    game.mods = modifiers(game.ownedUpgrades);
    for (const [i, land] of game.soil) {
      game.landQueue.add(i);
      if (!desertified(land)) continue;
      game.desertCount++;
      game.desertByDistrict[districtAt(i)]++;
    }
    game.won = s.won && canWin(game.desertCount);
    return game;
  }
}

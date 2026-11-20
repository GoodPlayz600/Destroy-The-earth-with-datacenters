import { CELL, DISTRICTS, TOTAL, facilities, goods, recipes, species, tools, vehicles, vehicleTypes } from './catalog';
import type { Facility, Good, Recipe, Stack, Tool, VehicleType } from './catalog';
import { applyLand, cellPoint, clamp, defaultSoil, desertified, distance, districtAt, hash, height, homeDistrict, indexAt, noPressure, treesIn } from './land';
import type { Point, Pressure, Soil, Tree } from './land';
import { quests } from './quests';
import type { QuestId } from './quests';
import { forestryUnlocks, modifiers, upgradeFacility, upgradesById } from './upgrades';

export const VERSION = 1;
export type Log = Point & { id: number; y: number; q: [number, number, number, number]; kind: number; length: number; kilograms: number; units: number; moisture: number; quality: number; cargo?: string; carrier?: string; part?:'branch' };
export type Haul = Point & { target: string; log?: number; phase: 'waiting'|'pickup'|'delivery'|'return'; status: string; };
export const buyerSite=(kind:Facility)=>['market','timberBuyer','specialistBuyer','tradeHub'].includes(kind);
export const storageSite = (kind:Facility) => kind==='depot'||kind==='railDepot'||kind==='dronePad'||kind==='fuelSilo';
export type Shipment = { mode:'rail'|'air'; load:Stack; target:string; path:Point[]; duration:number; elapsed:number; };
type Batch = Stack & { remaining: number; payout?: number; offcut?: number; residue?:Good };
export const mills: Facility[] = ['bench','bandsaw','mill','speedMill','millComplex'];
export const biomassSites:Facility[]=['biopower','cogeneration','wastePower'];
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
  on: boolean; fuel: number; status: string; winch?:{log:number; ready:number}; planted?:number; fertilizer?:boolean; intensive?:boolean; water?: number; waterMode?:'all'|'farm'|'industry'; waterRate?:'normal'|'conserve'|'deplete'; reserve?:number; priority?:boolean; gridFlow?:number; gridCapacity?:number; uptime?:number; service?:number; yieldCarry?:number; layout?: 'quality'|'volume'; sortHigh?:boolean; link?: string; haul?: Haul; shipment?:Shipment; mode?: 'sell' | 'charcoal';
};
export type Ride = Point & { id: string; kind: VehicleType; yaw: number; fuel: number; wear: number; hitch?:string; hitchReady?:number; water?:number };
export type Ledger = { date: number; note: string; amount: number };
export type Contract = { good: Good; quantity: number; deadline: number; payout: number; done: boolean; failed: boolean; dense?:boolean; grade?:number; received?:number; plan?:'quick'|'supply'|'export' };
export type Project = { kind: 'watershed' | 'quarry' | 'thermal' | 'dryland'; district: number; phase: number; complete?: boolean };
type RecordRow = { hits: number; harvest: number; fire: number; sold: number; produced: number; earned: number; spent: number; miles: number };
export type Save = ReturnType<Campaign['snapshot']>;

const baseSites: [Facility, number, number][] = [['fire', -6.5, 0], ['market', 7.2, -2.2]];
const rootStats = (): RecordRow => ({ hits: 0, harvest: 0, fire: 0, sold: 0, produced: 0, earned: 0, spent: 0, miles: 0 });
const isRecipe = (kind: Facility): kind is keyof typeof recipes => Object.hasOwn(recipes, kind);
const allDistricts = DISTRICTS ** 2;
export const projectPrices = { watershed: 6200, quarry: 8200, thermal: 9500, dryland: 12500 };
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
  claimed = new Set<QuestId>();
  private tickTime = 0;
  private landQueue = new Set<number>();
  private roadPower = new Map<string, boolean>();

  constructor(seed = 20831) {
    this.seed = seed;
    for (const [kind, x, z] of baseSites) this.sites.push(this.makeSite(kind, x, z));
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
    if(indexAt(next.x,next.z)<0)return false;
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
      if(site.kind==='fuelSilo')return false;
      if (!put(storageSite(site.kind) ? site.output : site.input, this.logStack(log), this.capacity(site))) return false;
    }
    this.logs.delete(log.id);
    return true;
  }

  capacity(site: Site) {
    return storageSite(site.kind) ? 260 : computeSites.includes(site.kind)&&this.mods.rackManagement?76 : site.kind === 'fire' ? 32 : site.kind === 'bench' || site.kind === 'rack' ? 20 : 42;
  }

  transfer(site: Site, good: Good, quantity: number, retrieve: boolean) {
    const source = retrieve ? site.output : this.stock;
    const destination = retrieve ? this.stock : storageSite(site.kind) ? site.output : site.input;
    const capacity = retrieve ? 150 : this.capacity(site);
    const recipe: Recipe | undefined = isRecipe(site.kind) ? recipes[site.kind] : undefined;
    if(!retrieve&&site.kind==='fuelSilo'&&!fuelGood(good))return false;
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
    const rate=1+Math.sin(at/89)*.11+Math.sin(at/281)*.065;
    const certified=(this.mods.certified||this.mods.buyerCert)&&['boards','dry','finished','treated'].includes(stack.good)
      &&stack.quality>=.90&&stack.moisture<=.18;
    const premium=site?.kind==='specialistBuyer'?1.30:1;
    return Math.round(priceFor(stack)*rate*premium*(certified?1.26:1));
  }

  private creditDelivery(contract:Contract,quantity:number) {
    const before=contract.received??0;
    contract.received=before+quantity;
    contract.done=contract.received>=contract.quantity;
    const paid=Math.floor(contract.payout*contract.received/contract.quantity)-Math.floor(contract.payout*before/contract.quantity);
    this.finance(paid,`${contract.done?'Contract fulfilled':'Contract shipment'} · ${goods[contract.good][0]}`);
    this.notice(`${contract.done?'Contract complete':'Shipment accepted'} · +$${paid}`);
  }

  private sellAt(site:Site,stack:Stack) {
    if(site.kind==='tradeHub'&&this.mods.tradeOptimizer) {
      for(const c of this.contracts){
        if(c.good!==stack.good||c.done||c.failed||stack.quality<(c.grade??0))continue;
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
      const index=this.stock.indexOf(lot);
      if(index<0||!acceptable(lot)||quantity>lot.quantity)return false;
      const shipped={...lot,quantity};
      lot.quantity-=quantity;
      if(!lot.quantity)this.stock.splice(index,1);
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
    return this.contracts.filter(c=>!c.done&&!c.failed).length<(this.mods.tradeOptimizer?3:1);
  }

  acceptContract(good:Good,dense=false,plan?:Contract['plan']) {
    if(dense&&(good!=='compute'||!this.mods.denseCompute)||!this.canTakeContract())return false;
    if(plan==='quick'&&!this.mods.shortOrders||plan==='supply'&&!this.mods.supplyDeals||plan==='export'&&!this.mods.exportMarket)return false;
    if(good==='timber'&&!this.mods.ashContracts&&plan!=='quick'||good==='packed'&&!this.mods.exportOrders||['briquettes','pellets'].includes(good)&&!this.mods.bioOrders)return false;
    const quantity=plan==='quick'?4:plan==='supply'?27:plan==='export'?54:good==='compute'?(dense?54:this.mods.uplink?22:12):
      good==='packed'?48:good==='timber'?32:['briquettes','pellets'].includes(good)?24:['finished','treated'].includes(good)?16:8;
    const expires=plan==='quick'?160:plan==='supply'?1100:plan==='export'?1350:dense||good==='packed'?1200:good==='compute'?480:360;
    const rate=dense?2.5:plan==='export'?2.2:plan==='supply'?1.7:1.5;
    this.contracts.unshift({good,quantity,deadline:this.clock+expires,payout:Math.round(goods[good][1]*quantity*rate),done:false,failed:false,dense,
      grade:plan==='export'?.83:undefined,plan});
    this.contracts.length=Math.min(this.contracts.length,25);
    return true;
  }

  acceptCommission(good:Good,premium=false) {
    if(!this.mods.commissions||!['finishedCabinet','floors','modular'].includes(good)||!this.canTakeContract()) return false;
    const quantity=premium?25:12;
    this.contracts.unshift({good,quantity,deadline:this.clock+(premium?990:570),payout:Math.round(goods[good][1]*quantity*(premium?2.15:1.65)),
      done:false,failed:false,grade:premium?.92:.81});
    this.contracts.length=Math.min(this.contracts.length,25);
    return true;
  }

  fulfill(contract:Contract) {
    if(contract.done||contract.failed||contract.deadline<=this.clock)return false;
    const need=contract.quantity-(contract.received??0);
    const batch=contract.plan==='supply'?Math.min(9,need):need;
    if(!take(this.stock,contract.good,batch,contract.grade))return false;
    this.creditDelivery(contract,batch);
    return true;
  }

  siteIssue(kind: Facility, at: Point) {
    const def = facilities[kind], i = indexAt(at.x, at.z);
    if (i < 0 || (Math.hypot(at.x, at.z) > 29 && !this.districts.has(districtAt(i)))) return 'Purchase this district first';
    if (this.cash < def.price) return 'Insufficient funds';
    if(def.research&&!this.ownedUpgrades.has(def.research)) return 'Requires facility research';
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
    this.finance(-facilities[kind].price, facilities[kind].name);
    this.notice(facilities[kind].name + ' installed');
    return site;
  }

  acquireRide(kind: VehicleType, point: Point) {
    const vehicle = vehicleTypes[kind];
    if(vehicle.research&&!this.ownedUpgrades.has(vehicle.research))return;
    if (this.cash < vehicle.cost || (kind === 'sled' && !this.mods.sled) || (kind === 'cart' && !this.mods.cart)
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
    if(!this.mods.hitch||vehicleTypes[tow.kind].trailer||tow.kind==='sled'||tow.kind==='cart')return false;
    const attached=this.rides.find(v=>v.hitch===tow.id);
    if(attached){attached.hitch=undefined;attached.hitchReady=undefined;return true;}
    const trailer=this.rides.find(v=>vehicleTypes[v.kind].trailer&&!v.hitch&&distance(tow,v)<5.9);
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

  startProject(district: number, kind: Project['kind']) {
    if (!this.districts.has(district) || this.projects.some(p => p.district === district) || this.cash < projectPrices[kind]) return false;
    if (!this.sites.some(s => s.kind === 'forestry')) return false;
    if(kind==='dryland'&&!this.mods.drylandOffice)return false;
    const required = kind === 'watershed' ? 'pump' : kind === 'quarry' ? 'quarry' : kind==='dryland'?'soilRecovery':'thermal';
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
      if(buyerSite(target.kind)) {
        if(!this.buyerAccepts(target,now.load)){site.status='Freight held · buyer rejected grade';return;}
        this.sellAt(target,now.load);
      }
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
    const lot=site.output.find(l=>storageSite(target.kind)&&(target.kind!=='fuelSilo'||fuelGood(l.good))||this.buyerAccepts(target,l)||consumes(recipe,l.good)||biomassSites.includes(target.kind)&&fuelGood(l.good));
    if(!lot){site.status=site.output.length?'Freight blocked · incompatible cargo':'Waiting for freight';return;}
    const available=buyerSite(target.kind)?capacity:this.capacity(target)-getQuantity(storageSite(target.kind)?target.output:target.input);
    const amount=Math.min(lot.quantity,capacity,available);
    if(amount<=0){site.status='Freight blocked · receiver full';return;}
    const fee=Math.max(2,Math.round(length*(rail?.021:.055)*(this.mods.freightDiscount&&amount>=16?.66:1)));
    if(this.cash<fee){site.status='Freight blocked · dispatch costs';return;}
    const load=take(site.output,lot.good,amount);
    if(!load)return;
    this.finance(-fee,rail?'Rail freight dispatch':'Drone freight dispatch');
    site.shipment={mode:rail?'rail':'air',target:target.id,load,path:path.map(({x,z})=>({x,z})),duration:Math.max(3,length/(rail?12:22)),elapsed:0};
    site.status='Shipment dispatched';
  }

  private supplyCooling(site:Site,dt:number) {
    const base={data:13,serverHall:25,hyperscale:98}[site.kind as 'data'|'serverHall'|'hyperscale']??0;
    if(!base)return true;
    const requested=base*dt*(this.mods.airFans?.91:1)*(this.mods.liquidLoop?1.36:1);
    return this.takeWater(site,requested,this.mods.campus?65:46);
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
    const residue=mill&&site.kind!=='bench'&&this.mods.offcuts?'chips':this.mods.recovery&&paperLines.includes(site.kind)?'wastePaper':
      this.mods.barkSorter&&site.kind==='charcoalDrum'?'chips':site.kind==='charcoal'||site.kind==='charcoalDrum'?'ash':undefined;
    const offcut=residue?1:0;
    if(pulpLines.includes(site.kind)&&this.mods.chipScreen)quantity++;
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
    if(this.mods.nailer&&['workshop','carpentry','pallet'].includes(site.kind))remaining*=.63;
    if(site.kind==='finishBooth')quality+=.17;
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
    const ordered=this.contracts.reduce((sum,c)=>sum+(c.good==='compute'&&!c.done&&!c.failed?c.quantity-(c.received??0):0),0);
    if(!ordered)return 0;
    const pledged=getQuantity(this.stock,'compute')+this.sites.reduce((n,site)=>n+getQuantity(site.output,'compute')
      +site.jobs.reduce((total,job)=>total+(job.good==='compute'?job.quantity:0),0)
      +(site.shipment?.load.good==='compute'?site.shipment.load.quantity:0),0);
    return Math.max(0,ordered-pledged);
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
      const daylight=clamp(Math.sin(.7+this.clock/235)*.52+.56);
      const wind=Math.max(.24,.50+Math.sin(this.clock/45+this.seed%7)*.24+this.rain*.20);
      const power=site.kind==='solar'?maximum*daylight*(1-this.rain*.59)
        :site.kind==='wind'?maximum*wind:site.fuel>0?maximum:0;
      site.gridCapacity=power;
      return power>0?[{site,free:power}]:[];
    }).sort((a,b)=>Number(a.site.kind==='battery')-Number(b.site.kind==='battery'));
  }

  private simulateMachinery(dt: number) {
    const supply=this.gridSources();
    this.roadPower.clear();
    let computeNeeded=this.computeRemaining();
    const plan=this.mods.priority?[...this.sites].sort((a,b)=>Number(Boolean(b.priority))-Number(Boolean(a.priority))):this.sites;
    for (const site of plan) {
      site.gridFlow=0;
      if (!site.on) { site.status = 'Paused'; continue; }
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
        for(const source of this.sites) {
          if(!waterPumps.includes(source.kind)||!source.on||!this.waterReach(site,source,46)) continue;
          const transfer=Math.min(source.water??0,flow*dt,maximum-(site.water??0));
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
        if(work.offcut)put(site.output,{good:work.residue??'chips',quantity:work.offcut,quality:.68,moisture:work.moisture},this.capacity(site));
        this.stats.produced+=work.quantity;
        site.jobs.splice(site.jobs.indexOf(work),1);
      }
      const concurrent=site.kind==='millComplex'?3:mills.includes(site.kind)&&site.kind!=='bench'&&this.mods.twinBlade?2:1;
      if(site.jobs.length<concurrent&&(!computing||computeNeeded>0)&&this.makeBatch(site,recipe,Boolean(fan))&&computing) {
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
        &&(storageSite(target.kind) && (target.kind!=='fuelSilo'||fuelGood(s.good)) || this.buyerAccepts(target,s) || consumes(recipe,s.good)));
      if (!lot) { site.status = 'Route blocked · incompatible cargo'; continue; }
      if (buyerSite(target.kind)) {
        const shipped = take(site.output, lot.good, Math.min(4, lot.quantity));
        if (shipped) this.sellAt(target,shipped);
      } else {
        const buffer = storageSite(target.kind) ? target.output : target.input;
        const n = Math.min(site.kind==='fuelSilo'?12:4, lot.quantity, this.capacity(target) - getQuantity(buffer));
        if (n <= 0) { site.status = 'Route blocked · receiver full'; continue; }
        const shipped = take(site.output, lot.good, n);
        if (shipped) put(buffer, shipped);
      }
    }
  }

  assignHauler(base:Site,target:Site) {
    const supported=buyerSite(target.kind)||storageSite(target.kind)||(isRecipe(target.kind)&&(recipes[target.kind] as Recipe).input?.[0]==='timber');
    if((base.kind!=='forestry'&&!(this.mods.yardmaster&&storageSite(base.kind)))||!supported||distance(base,target)>110||base.haul?.log) return false;
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
      row[effect] = (row[effect]??0)+n;
      this.landQueue.add(i);
    };
    for (const site of this.sites) {
      const def = facilities[site.kind], center = indexAt(site.x, site.z);
      if (!site.on || !def.effect || center < 0 || (def.power && !this.roadPower.get(site.id))) continue;
      if (site.kind === 'fire' && !site.jobs.length) continue;
      if (def.effect==='thermal' && site.fuel <= 0) continue;
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
        if (project.kind === 'dryland') {add(i,'grazing',2.3);add(i,'removal',1.25);add(i,'drainage',1.6);}
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
    if(applyLand(soil,{clearing:2.4,drainage:.7,removal:this.mods.compactor?6.8:4.5,heat:0,grazing:this.mods.compactor?1:0,pollution:.18},seconds,this.rain,1,this.clock)
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
      stats: this.stats, won: this.won, completionTime: this.completionTime, nextId: this.nextId, projects: this.projects, achievements: [...this.achievements], claimed: [...this.claimed],
    };
  }

  static restore(s: Save) {
    const game = new Campaign(s.seed);
    Object.assign(game, {
      clock: s.clock, cash: s.cash, player: s.player, treeDamage: new Map(s.treeDamage), removed: new Set(s.removed), soil: new Map(s.soil),
      sites: s.sites, rides: s.rides, stock: s.stock, ownedTools: new Set(s.ownedTools), ownedUpgrades: new Set(s.ownedUpgrades),
      tool: s.tool, wear: s.wear, toolWear: s.toolWear ?? {}, battery: s.battery, districts: new Set(s.districts), ledger: s.ledger, contracts: s.contracts,
      stats: s.stats, completionTime: s.completionTime, nextId: s.nextId, projects: s.projects,
      logs: new Map(s.logs.map(l => [l.id, l])), achievements: new Set(s.achievements), claimed: new Set(s.claimed??[]),
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

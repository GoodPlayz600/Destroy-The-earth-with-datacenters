import { upgradeSpec } from './upgrade-spec';
import type { Facility } from './catalog';

export type Upgrade = { id: string; name: string; price: number; description: string; previous?: string; implemented: boolean };
const delivered = [
  '01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09','01-10','01-11','01-12',
  '02-01','02-02','02-03','02-04','02-05','02-06','02-07','02-08','02-09','02-10','02-11','02-12',
  '03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08',
  '04-01','04-02','04-03','04-04','04-05','04-06','04-07','04-08','04-09','04-10','04-11',
  '05-01','05-02','05-03','05-04','05-05','05-06','05-07','05-08','05-09','05-10','05-11','05-12',
  '06-01','06-02','06-03','06-04','06-05','06-06','06-07','06-08','06-09','06-10','06-11','06-12',
  '09-01','09-02','09-03','09-04','09-05','09-06','09-07','09-08','09-09','09-10','09-11','09-12',
  '10-01','10-02','10-03','10-04','10-05','10-06','10-07','10-08','10-09','10-10','10-11','10-12',
  '11-01','11-02','11-03','11-04','11-05','11-06','11-07','11-08','11-09','11-10','11-11','11-12',
  '12-01','12-02','12-03','12-04','12-05','12-06','12-07','12-08','12-09','12-10','12-11','12-12',
  '13-01','13-02','13-03','13-04','13-05','13-06','13-07','13-08','13-09','13-10','13-11','13-12',
  '18-01','18-02','18-03','18-04','18-05','18-06','18-07','18-08','18-09','18-10','18-11','18-12',
  '20-01','20-02','20-03','20-04','20-05','20-06','20-07','20-08','20-09','20-10','20-11','20-12',
  '22-01','22-02','22-03','22-04','22-05','22-06','22-07','22-08','22-09','22-10','22-11','22-12',
];
const working = new Set(delivered);
export const upgrades: Upgrade[] = upgradeSpec.map(([id, name, price, description]) => {
  const number = Number(id.slice(3));
  return { id, name, price, description, implemented: working.has(id),
    previous: number === 1 ? undefined : `${id.slice(0,3)}${String(number - 1).padStart(2,'0')}` };
});
export const upgradesById = new Map(upgrades.map(upgrade => [upgrade.id, upgrade]));
if (upgrades.length !== 288 || upgradesById.size !== upgrades.length) throw Error('Invalid upgrade catalog');
export const upgradeFacility: Record<string, Facility> = { '04-08': 'depot', '04-09': 'charcoal', '04-10': 'thermal', '04-11': 'kiln',
  '09-01':'bench', '09-05':'bandsaw', '09-11':'speedMill', '10-01':'rack', '10-06':'smallKiln', '10-10':'treatment',
  '11-01':'workshop','11-05':'carpentry','11-12':'modular',
  '12-01':'chipper','12-05':'reelPress','12-12':'bulkPulp',
  '13-01':'charcoal','13-03':'charcoalDrum','13-12':'ashRefiner',
  '18-09':'thermal','18-11':'transformer','18-12':'backbone',
  '20-04':'crop','20-06':'pump','20-11':'megaFarm','20-12':'soilRecovery',
  '22-03':'serverRack','22-05':'serverHall','22-07':'generator','22-09':'data','22-12':'coolTower',
};

export function modifiers(owns: ReadonlySet<string>) {
  const has = (id: string) => owns.has(id);
  return {
    knifeStamina: has('01-01') ? .85 : 1, saplingDamage: has('01-02') ? 1.35 : 1,
    knifeDurability: has('01-03') ? 150 : 100, alternating: has('01-04'),
    mediumDamage: has('01-05') ? 1.25 : 1, shatterproof: has('01-06'),
    knifeInterval: (has('01-07') ? .8 : 1) * (has('01-08') ? .8 : 1),
    poweredKnife: has('01-09'), hardwoodKnife: has('01-10'), notch: has('01-11'),
    prestigeKnife: has('01-12'), grip: (has('02-01') ? 1.15 : 1) * (has('02-12') ? 1.2 : 1),
    walk: has('02-02') ? 1.08 : 1, mud: has('02-03') ? .7 : 1, stamina: has('02-04') ? 120 : 100,
    dragMass: has('02-05') ? 85 : 68, liftMass: has('02-06') ? 40 : 25, recover: has('02-07') ? 1.35 : 1,
    liftLogs: has('02-08'), sprint: (has('02-09') ? 1.2 : 1) * (has('02-12') ? 1.2 : 1),
    handStamina: has('02-10') ? .75 : 1, carrySlots: has('02-11') ? 2 : 1,
    athlete: has('02-12') ? 1.2 : 1,
    rope: has('03-01'), ropeRange: has('03-02') ? 7.5 : 5, ropeMass: has('03-03') ? 180 : 110,
    shove: has('03-04') ? 1.3 : 1, sled: has('03-05'), sledSpeed: has('03-06') ? 1.25 : 1,
    cart: has('03-07'), cartCapacity: has('03-08') ? 1.25 : 1, burnMass: has('04-01') ? 110 : 70,
    burnSpeed: (has('04-02') ? 1.25 : 1) * (has('04-07') ? 1.35 : 1), scale: has('04-03'),
    ash: has('04-04'), burnSlots: (has('04-05') ? 2 : 1) + (has('04-10') ? 2 : 0), sortDry: has('04-06'),
    stoker: has('04-08'), carbon: has('04-09'), heatReuse: has('04-11'),
    sharpening: has('05-03') ? .80 : 1, axeForce: has('05-04') ? 1.74 : 1, crosscut: has('05-05'),
    hitch:has('06-03'), traction:has('06-04')?.45:1, stakes:has('06-08')?1.3:1, suspension:has('06-09')?.44:1,
    winch:has('06-10'), liftBed:has('06-11'), fleetEfficiency:has('06-12')?.85:1,
    benchCrank:has('09-01'), logClamp:has('09-02'), bladeGuide:has('09-03'), offcuts:has('09-05'), feeder:has('09-06'),
    precision:has('09-07'), twinBlade:has('09-08'), debarker:has('09-09'), cutPatterns:has('09-11'),
    canopy:has('10-01'), moistureGauge:has('10-02'), dryingFan:has('10-03'), sheltered:has('10-04'), airflow:has('10-06'),
    surfaceSander:has('10-08'), sortingCamera:has('10-10'), smartKiln:has('10-11'), certified:has('10-12'),
    nailer:has('11-02'), templates:has('11-05'), commissions:has('11-12'),
    chipScreen:has('12-02'), paperDryer:has('12-05'), recovery:has('12-09'), exportOrders:has('12-12'),
    barkSorter:has('13-02'), biomassEfficiency:has('13-06')?.78:1, heatExchange:has('13-07'), bioOrders:has('13-08'),
    meter:has('18-04'), priority:has('18-10'),
    fertilizer:has('20-04'), cropHarvester:has('20-05'), irrigation:has('20-06'), grazingDensity:has('20-07'),
    override:has('20-08'), compactor:has('20-09'), drylandOffice:has('20-12'),
    uplink:has('22-02'), rackManagement:has('22-03'), airFans:has('22-05'), liquidLoop:has('22-06'), backup:has('22-07'),
    serverService:has('22-08'), campus:has('22-09'), denseCompute:has('22-10'),
    chain: has('05-07') ? .68 : 1, heavyTeeth: has('05-09') ? 1.35 : 1, wedges: has('05-10'), forestryMastery: has('05-12'),
  };
}

export const forestryUnlocks = {
  saw: '05-01', axe: '05-02', electric: '05-06', chainsaw: '05-08', harvester: '05-11',
} as const;

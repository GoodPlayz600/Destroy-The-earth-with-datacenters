import { upgradeSpec } from './upgrade-spec';
import type { Facility } from './catalog';

export type Upgrade = { id: string; name: string; price: number; description: string; previous?: string; implemented: boolean };
const delivered = [
  '01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09','01-10','01-11','01-12',
  '02-01','02-02','02-03','02-04','02-05','02-06','02-07','02-08','02-09','02-10','02-11','02-12',
  '03-01','03-02','03-03','03-04','03-05','03-06','03-07','03-08',
  '04-01','04-02','04-03','04-04','04-05','04-06','04-07','04-08','04-09','04-10','04-11',
];
const working = new Set(delivered);
export const upgrades: Upgrade[] = upgradeSpec.map(([id, name, price, description]) => {
  const number = Number(id.slice(3));
  return { id, name, price, description, implemented: working.has(id),
    previous: number === 1 ? undefined : `${id.slice(0,3)}${String(number - 1).padStart(2,'0')}` };
});
export const upgradesById = new Map(upgrades.map(upgrade => [upgrade.id, upgrade]));
if (upgrades.length !== 288 || upgradesById.size !== upgrades.length) throw Error('Invalid upgrade catalog');
export const upgradeFacility: Record<string, Facility> = { '04-08': 'depot', '04-09': 'charcoal', '04-10': 'thermal', '04-11': 'kiln' };

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
  };
}

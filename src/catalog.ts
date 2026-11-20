export const SIZE = 4096;
export const CELL = 16;
export const CELLS = SIZE / CELL;
export const TOTAL = CELLS ** 2;
export const DISTRICT = 32;
export const DISTRICTS = CELLS / DISTRICT;

export const species = [
  { name: 'Pioneer sapling', height: 4.2, radius: .18, health: 12, mass: 22, yield: 1, bark: '#76513a', leaf: '#74ab4d' },
  { name: 'Copperwood', height: 8, radius: .34, health: 40, mass: 58, yield: 2, bark: '#7d4f3a', leaf: '#427d42' },
  { name: 'Fan palm', height: 9, radius: .3, health: 54, mass: 74, yield: 2, bark: '#8c7760', leaf: '#5e9b53' },
  { name: 'Iron canopy', height: 14, radius: .65, health: 145, mass: 220, yield: 5, bark: '#594637', leaf: '#346e43' },
];

export const tools = {
  knife: { name: 'Plastic Butter Knife', power: 1, interval: .32, range: 3.25, wear: 1, cost: 0 },
  saw: { name: 'Pocket Saw', power: 4, interval: .29, range: 3.4, wear: 1.4, cost: 75 },
  axe: { name: 'Steel Hatchet', power: 10, interval: .52, range: 3.8, wear: 1.7, cost: 158 },
  electric: { name: 'Electric Chainsaw', power: 18, interval: .25, range: 4.05, wear: 1.5, cost: 3000 },
  chainsaw: { name: 'Gas Chainsaw', power: 23, interval: .24, range: 4.3, wear: 2.1, cost: 13875 },
  harvester: { name: 'Mobile Harvester', power: 85, interval: .55, range: 8, wear: 1, cost: 131250 },
};
export type Tool = keyof typeof tools;

export const goods = {
  timber: ['Green timber', 25, '#875e43'], boards: ['Green boards', 34, '#bd884e'],
  dry: ['Kiln-dried boards', 49, '#dcaa67'], crates: ['Freight crates', 118, '#aa7644'],
  furniture: ['Workshop furniture', 240, '#b07b48'], beams: ['Engineered beams', 105, '#b58d66'],
  chips: ['Woodchips', 13, '#d9a477'], pulp: ['Pulp', 29, '#c2c5aa'],
  paper: ['Paper rolls', 105, '#e0d7a9'], charcoal: ['Charcoal', 32, '#495150'],
  pellets: ['Fuel pellets', 74, '#ad7a4f'], plywood: ['Plywood', 105, '#ad8471'],
  finished: ['Planed lumber', 68, '#dab380'], treated: ['Treated outdoor lumber', 122, '#966d51'],
  ore: ['Crushed stone', 32, '#85877d'], cement: ['Cement', 86, '#bdc3bb'],
  compute: ['Compute batches', 345, '#70babc'],
} as const;
export type Good = keyof typeof goods;
export type Stack = { good: Good; quantity: number; quality: number; moisture: number };
export type Recipe = {
  name: string; input?: readonly [Good, number]; output: readonly [Good, number];
  time: number; power: number; moisture?: number; minQuality?: number; maxMoisture?: number;
};
export const recipes = {
  bench: { name: 'Rip timber', input: ['timber', 1], output: ['boards', 2], time: 4, power: 0 },
  rack: { name: 'Air dry boards', input: ['boards', 2], output: ['dry', 2], time: 21, power: 0, moisture: .18 },
  workshop: { name: 'Assemble crates', input: ['boards', 2], output: ['crates', 1], time: 12, power: 0 },
  bandsaw: { name: 'Compact bandsaw milling', input: ['timber', 1], output: ['boards', 3], time: 5, power: 4 },
  speedMill: { name: 'High-speed sawline', input: ['timber', 4], output: ['boards', 11], time: 7, power: 13 },
  millComplex: { name: 'Twin industrial sawline', input: ['timber', 4], output: ['boards', 12], time: 8, power: 20 },
  smallKiln: { name: 'Workshop kiln drying', input: ['boards', 2], output: ['dry', 2], time: 10, power: 3, moisture: .10 },
  planer: { name: 'Plane boards', input: ['dry', 2], output: ['finished', 2], time: 7, power: 4, maxMoisture: .20 },
  treatment: { name: 'Treat outdoor boards', input: ['finished', 2], output: ['treated', 2], time: 12, power: 7, minQuality: .74, moisture: .09 },
  mill: { name: 'High-speed milling', input: ['timber', 2], output: ['boards', 5], time: 8, power: 6 },
  kiln: { name: 'Kiln drying', input: ['boards', 4], output: ['dry', 4], time: 9, power: 5, moisture: .08 },
  joinery: { name: 'Fine joinery', input: ['dry', 2], output: ['furniture', 1], time: 12, power: 4, minQuality: .73, maxMoisture: .23 },
  beams: { name: 'Laminate beams', input: ['boards', 4], output: ['beams', 2], time: 14, power: 4 },
  chipper: { name: 'Shred timber', input: ['timber', 2], output: ['chips', 5], time: 8, power: 4 },
  pulp: { name: 'Blend pulp', input: ['chips', 2], output: ['pulp', 2], time: 12, power: 4 },
  paper: { name: 'Roll paper', input: ['pulp', 2], output: ['paper', 1], time: 12, power: 5 },
  charcoal: { name: 'Carbonize timber', input: ['timber', 2], output: ['charcoal', 2], time: 14, power: 0, moisture: .04 },
  pellet: { name: 'Press pellets', input: ['chips', 3], output: ['pellets', 2], time: 12, power: 4, moisture: .1 },
  plywood: { name: 'Press plywood', input: ['boards', 3], output: ['plywood', 2], time: 12, power: 5 },
  quarry: { name: 'Crush stone', output: ['ore', 4], time: 22, power: 4 },
  cement: { name: 'Bake cement', input: ['ore', 3], output: ['cement', 3], time: 16, power: 7 },
  data: { name: 'Process compute contract', output: ['compute', 2], time: 24, power: 12 },
} as const satisfies Record<string, Recipe>;

export type Facility = keyof typeof recipes | 'fire' | 'market' | 'depot' | 'railDepot' | 'dronePad' | 'generator' | 'substation' | 'pump' | 'pipe' | 'tank' | 'grazing' | 'thermal' | 'dryer' | 'forestry' | 'road' | 'belt' | 'rail';
type Building = {
  name: string; price: number; color: string; size: number; requires?: Facility; research?: string;
  effect?: 'fire' | 'pump' | 'grazing' | 'quarry' | 'thermal' | 'dryer' | 'forestry' | 'data';
  reach?: number; power?: number; supply?: number;
};
export const facilities: Record<Facility, Building> = {
  fire: { name: 'Ash Exchange', price: 180, color: '#bd6c39', size: 2, effect: 'fire', reach: 1 },
  bench: { name: 'Field Sawbench', price: 75, color: '#567969', size: 2 },
  rack: { name: 'Drying Rack', price: 130, color: '#9e704a', size: 2.5, requires: 'bench' },
  workshop: { name: 'Crate Workshop', price: 195, color: '#ac8052', size: 3, requires: 'bench' },
  market: { name: 'Timber Exchange', price: 160, color: '#5c8878', size: 2.5 },
  depot: { name: 'Freight Depot', price: 520, color: '#76807c', size: 4 },
  railDepot: { name: 'Regional Rail Depot', price: 1600, color: '#8a8170', size: 4.5, requires: 'depot' },
  dronePad: { name: 'Cargo Drone Pad', price: 2300, color: '#6e7d68', size: 3.5, requires: 'depot', power: 5 },
  bandsaw: { name: 'Compact Bandsaw Mill', price: 520, color: '#629082', size: 3.2, requires: 'bench', research: '09-04' },
  speedMill: { name: 'High-Speed Sawmill', price: 7900, color: '#839984', size: 5, requires: 'bandsaw', research: '09-10' },
  millComplex: { name: 'Industrial Mill Complex', price: 14600, color: '#66877d', size: 6, requires: 'speedMill', research: '09-12' },
  smallKiln: { name: 'Small Workshop Kiln', price: 460, color: '#a67857', size: 2.6, requires: 'rack', research: '10-05' },
  planer: { name: 'Lumber Planer', price: 625, color: '#819474', size: 3, requires: 'rack', research: '10-07' },
  treatment: { name: 'Treatment Vat', price: 1320, color: '#63846c', size: 4, requires: 'planer', research: '10-09' },
  mill: { name: 'Sawmill', price: 530, color: '#59817c', size: 4, requires: 'bench' },
  kiln: { name: 'Lumber Kiln', price: 490, color: '#b0784f', size: 3.5, requires: 'mill' },
  joinery: { name: 'Fine Joinery', price: 670, color: '#ab8a5e', size: 4, requires: 'kiln' },
  beams: { name: 'Beam Laminator', price: 640, color: '#839666', size: 4, requires: 'mill' },
  chipper: { name: 'Forestry Chipper', price: 385, color: '#8c984c', size: 3, requires: 'bench' },
  pulp: { name: 'Pulp Vat', price: 510, color: '#658c85', size: 3.5, requires: 'chipper' },
  paper: { name: 'Paper Mill', price: 715, color: '#9aab98', size: 4, requires: 'pulp' },
  charcoal: { name: 'Charcoal Retort', price: 425, color: '#736255', size: 3 },
  pellet: { name: 'Pellet Press', price: 630, color: '#8a7860', size: 3, requires: 'chipper' },
  plywood: { name: 'Plywood Press', price: 710, color: '#926950', size: 4, requires: 'mill' },
  generator: { name: 'Grid Generator', price: 305, color: '#be964b', size: 3, supply: 28 },
  substation: { name: 'Grid Relay', price: 195, color: '#897f64', size: 2 },
  pump: { name: 'Drainage Array', price: 550, color: '#5e8c9e', size: 3, effect: 'pump', reach: 9, power: 5 },
  pipe: { name: 'Cooling Pipeline', price: 85, color: '#5e8c9e', size: 2, requires: 'pump' },
  tank: { name: 'Cooling Reservoir', price: 270, color: '#719496', size: 3, requires: 'pump' },
  grazing: { name: 'Grazing Station', price: 460, color: '#8c955a', size: 4, effect: 'grazing', reach: 7 },
  quarry: { name: 'Aggregate Quarry', price: 950, color: '#9b826f', size: 5, effect: 'quarry', reach: 11, power: 4 },
  cement: { name: 'Cement Works', price: 1220, color: '#989e90', size: 5, requires: 'quarry' },
  thermal: { name: 'Thermal Plant', price: 1750, color: '#c08250', size: 6, effect: 'thermal', reach: 14, supply: 48 },
  dryer: { name: 'District Desiccator', price: 5100, color: '#c4985d', size: 6, effect: 'dryer', reach: 25, power: 14 },
  forestry: { name: 'Forestry Crew Base', price: 1250, color: '#859065', size: 4, effect: 'forestry', reach: 11 },
  data: { name: 'Compute Campus', price: 3100, color: '#759096', size: 6, effect: 'data', reach: 15, power: 12, requires: 'pump' },
  road: { name: 'Freight Road', price: 22, color: '#6f736a', size: 2 },
  belt: { name: 'Freight Conveyor', price: 120, color: '#7d876b', size: 2, requires: 'depot' },
  rail: { name: 'Freight Rail', price: 250, color: '#938477', size: 2, requires: 'depot' },
};

export const vehicles = {
  sled: { name: 'Skid Sled', cost: 95, speed: 4.4, capacity: 85, motor: false, color: '#86633e' },
  cart: { name: 'Hand Cart', cost: 145, speed: 5.4, capacity: 135, motor: false, color: '#77916c' },
  atv: { name: 'Forestry ATV', cost: 370, speed: 11, capacity: 130, motor: true, color: '#c08a39' },
  pickup: { name: 'Field Pickup', cost: 680, speed: 13, capacity: 260, motor: true, color: '#788b63' },
  skid: { name: 'Skid Steer', cost: 1300, speed: 8, capacity: 450, motor: true, color: '#ca9d44' },
  truck: { name: 'Logging Truck', cost: 2180, speed: 15, capacity: 850, motor: true, color: '#b98d50' },
  dozer: { name: 'Tracked Bulldozer', cost: 3150, speed: 8, capacity: 490, motor: true, color: '#d5a849' },
};
export type VehicleType = keyof typeof vehicles;

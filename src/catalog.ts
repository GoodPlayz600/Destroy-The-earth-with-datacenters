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
  pallet: ['Timber pallets', 146, '#a7794b'], laminate: ['Laminated components', 189, '#be9765'],
  turned: ['Turned wood parts', 165, '#b78756'], cabinets: ['Cabinetry', 370, '#aa784b'],
  finishedCabinet: ['Finished cabinetry', 560, '#85634d'], floors: ['Floor panels', 208, '#a98567'],
  modular: ['Modular furniture', 780, '#ac8674'],
  finished: ['Planed lumber', 68, '#dab380'], treated: ['Treated outdoor lumber', 122, '#966d51'],
  hay: ['Pasture hay', 39, '#b3a96e'], harvest: ['Field crops', 79, '#bb985e'], grazingYield: ['Grazing output', 162, '#9d8f6f'],
  ore: ['Crushed stone', 32, '#85877d'], cement: ['Cement', 86, '#bdc3bb'],
  compute: ['Compute batches', 345, '#70babc'],
} as const;
export type Good = keyof typeof goods;
export type Stack = { good: Good; quantity: number; quality: number; moisture: number };
export type Recipe = {
  name: string; input?: readonly [Good, number]; output: readonly [Good, number];
  time: number; power: number; secondary?: readonly [Good, number]; labor?: number; moisture?: number; minQuality?: number; maxMoisture?: number;
};
export const recipes = {
  bench: { name: 'Rip timber', input: ['timber', 1], output: ['boards', 2], time: 4, power: 0 },
  rack: { name: 'Air dry boards', input: ['boards', 2], output: ['dry', 2], time: 21, power: 0, moisture: .18 },
  workshop: { name: 'Assemble crates', input: ['boards', 2], output: ['crates', 1], time: 12, power: 0 },
  carpentry: { name: 'Hand-build crate batches', input: ['boards', 3], output: ['crates', 2], time: 14, power: 0 },
  pallet: { name: 'Assemble standard pallets', input: ['boards', 3], output: ['pallet', 2], time: 14, power: 2 },
  laminate: { name: 'Press laminated components', input: ['dry', 3], output: ['laminate', 2], time: 14, power: 5 },
  lathe: { name: 'Turn wooden parts', input: ['dry', 3], output: ['turned', 3], time: 14, power: 3 },
  cabinet: { name: 'Join cabinet parts', input: ['finished', 3], output: ['cabinets', 2], time: 17, power: 6, minQuality: .75 },
  finishBooth: { name: 'Finish cabinet surfaces', input: ['cabinets', 2], output: ['finishedCabinet', 2], time: 14, power: 4, moisture: .11 },
  veneer: { name: 'Press prepared veneer into plywood', input: ['finished', 4], output: ['plywood', 5], time: 18, power: 8 },
  floor: { name: 'Mill floor panels', input: ['plywood', 4], output: ['floors', 4], time: 16, power: 10 },
  modular: { name: 'Assemble modular furniture', input: ['laminate', 3], secondary: ['turned', 2], output: ['modular', 2], time: 20, power: 12, labor: 58, minQuality: .78 },
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
  pasture: { name: 'Gather hay', output: ['hay', 3], time: 24, power: 0 },
  ranch: { name: 'Raise pasture stock', input: ['hay', 2], output: ['grazingYield', 2], time: 23, power: 0, labor: 14 },
  crop: { name: 'Harvest seasonal crop', output: ['harvest', 4], time: 27, power: 0 },
  megaFarm: { name: 'Regional crop harvest', output: ['harvest', 18], time: 36, power: 14 },
  soilRecovery: { name: 'Recover exhausted substrate', output: ['ore', 7], time: 25, power: 10 },
  quarry: { name: 'Crush stone', output: ['ore', 4], time: 22, power: 4 },
  cement: { name: 'Bake cement', input: ['ore', 3], output: ['cement', 3], time: 16, power: 7 },
  serverRack: { name: 'Process local compute', output: ['compute', 1], time: 31, power: 5 },
  serverHall: { name: 'Process modular server batches', output: ['compute', 4], time: 29, power: 28 },
  hyperscale: { name: 'Process hyperscale contract', output: ['compute', 10], time: 31, power: 81 },
  data: { name: 'Process compute contract', output: ['compute', 2], time: 24, power: 12 },
} as const satisfies Record<string, Recipe>;

export type Facility = keyof typeof recipes | 'fire' | 'market' | 'depot' | 'railDepot' | 'dronePad' | 'generator' | 'substation' | 'portable' | 'pole' | 'battery' | 'biopower' | 'solar' | 'wind' | 'transformer' | 'gridPlant' | 'backbone' | 'gridCampus' | 'pump' | 'pipe' | 'tank' | 'coolTower' | 'grazing' | 'thermal' | 'dryer' | 'forestry' | 'road' | 'belt' | 'rail';
type Building = {
  name: string; price: number; color: string; size: number; requires?: Facility; research?: string;
  effect?: 'fire' | 'pump' | 'grazing' | 'field' | 'quarry' | 'thermal' | 'dryer' | 'forestry' | 'data';
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
  carpentry: { name: 'Carpenter Workbench', price: 295, color: '#9b784e', size: 2.8, requires: 'workshop', research: '11-01' },
  pallet: { name: 'Pallet Assembly Jig', price: 530, color: '#9a8660', size: 3.1, requires: 'carpentry', research: '11-03' },
  laminate: { name: 'Wood Glue Press', price: 690, color: '#99936d', size: 3.2, requires: 'carpentry', research: '11-04' },
  lathe: { name: 'Craftsman’s Lathe', price: 1200, color: '#a3815c', size: 3.3, requires: 'carpentry', research: '11-06' },
  cabinet: { name: 'Cabinet Shop', price: 2900, color: '#a47b60', size: 4.5, requires: 'lathe', research: '11-07' },
  finishBooth: { name: 'Finishing Booth', price: 3100, color: '#a69176', size: 4.5, requires: 'cabinet', research: '11-08' },
  veneer: { name: 'Industrial Plywood Press', price: 5900, color: '#a4806d', size: 5, requires: 'laminate', research: '11-09' },
  floor: { name: 'Flooring Line', price: 9100, color: '#9c9c72', size: 6, requires: 'veneer', research: '11-10' },
  modular: { name: 'Modular Furniture Factory', price: 38000, color: '#928670', size: 7, requires: 'cabinet', research: '11-11' },
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
  portable: { name: 'Portable Generator', price: 160, color: '#a48a5a', size: 1.8, supply: 12, research: '18-01' },
  pole: { name: 'Utility Pole', price: 62, color: '#948067', size: 1.2, research: '18-02' },
  battery: { name: 'Station Battery Bank', price: 450, color: '#818c79', size: 2.6, research: '18-03' },
  biopower: { name: 'Biomass Generator', price: 1100, color: '#7b8464', size: 4, supply: 41, research: '18-05', effect:'thermal', reach:4 },
  transformer: { name: 'Transformer Station', price: 1630, color: '#9b906c', size: 3, research: '18-06' },
  solar: { name: 'Solar Array', price: 3800, color: '#5e7a84', size: 6, supply: 40, research: '18-07' },
  wind: { name: 'Wind Turbine', price: 6300, color: '#b0ae9a', size: 3.2, supply: 54, research: '18-08' },
  gridPlant: { name: 'Thermal Powerhouse', price: 18000, color: '#a78562', size: 7, supply: 132, research: '18-09', effect:'thermal', reach:24 },
  backbone: { name: 'Industrial Grid Backbone', price: 9000, color: '#aea689', size: 5, research: '18-11' },
  gridCampus: { name: 'Gigawatt Utility Campus', price: 103000, color: '#978c74', size: 12, supply: 488, research: '18-12', effect:'thermal', reach:30 },
  generator: { name: 'Grid Generator', price: 305, color: '#be964b', size: 3, supply: 28 },
  substation: { name: 'Grid Relay', price: 195, color: '#897f64', size: 2 },
  pump: { name: 'Drainage Array', price: 550, color: '#5e8c9e', size: 3, effect: 'pump', reach: 9, power: 5 },
  pipe: { name: 'Cooling Pipeline', price: 85, color: '#5e8c9e', size: 2, requires: 'pump' },
  tank: { name: 'Cooling Reservoir', price: 270, color: '#719496', size: 3, requires: 'pump' },
  pasture: { name: 'Seeded Pasture', price: 370, color: '#8c9b63', size: 4, research: '20-01' },
  ranch: { name: 'Fenced Grazing Plot', price: 620, color: '#969261', size: 5, effect:'grazing', reach:4, requires: 'pasture', research:'20-02' },
  crop: { name: 'Seasonal Crop Field', price: 990, color: '#938b5c', size: 5.5, effect:'field', reach:4, requires: 'pasture', research:'20-03' },
  megaFarm: { name: 'Mega-Farm Complex', price: 12500, color: '#a49162', size: 10, effect:'field', reach:12, power:14, requires:'crop', research:'20-10' },
  soilRecovery: { name: 'Exhausted-Soil Extractor', price: 17500, color: '#9b7963', size: 7, effect:'quarry', reach:9, power:10, requires:'megaFarm', research:'20-11' },
  grazing: { name: 'Grazing Station', price: 460, color: '#8c955a', size: 4, effect: 'grazing', reach: 7 },
  quarry: { name: 'Aggregate Quarry', price: 950, color: '#9b826f', size: 5, effect: 'quarry', reach: 11, power: 4 },
  cement: { name: 'Cement Works', price: 1220, color: '#989e90', size: 5, requires: 'quarry' },
  thermal: { name: 'Thermal Plant', price: 1750, color: '#c08250', size: 6, effect: 'thermal', reach: 14, supply: 48 },
  dryer: { name: 'District Desiccator', price: 5100, color: '#c4985d', size: 6, effect: 'dryer', reach: 25, power: 14 },
  forestry: { name: 'Forestry Crew Base', price: 1250, color: '#859065', size: 4, effect: 'forestry', reach: 11 },
  serverRack: { name: 'Garage Server Rack', price: 280, color: '#58908a', size: 2, research: '22-01' },
  serverHall: { name: 'Modular Server Hall', price: 8800, color: '#739a9c', size: 8, power: 28, requires: 'data', research: '22-04', effect: 'data', reach: 19 },
  coolTower: { name: 'Mega-Cooling Tower', price: 45000, color: '#81949b', size: 7, requires: 'tank', research: '22-11' },
  hyperscale: { name: 'Hyperscale Desert Cloud', price: 360000, color: '#8c9691', size: 13, power: 81, requires: 'coolTower', research: '22-12', effect: 'data', reach: 31 },
  data: { name: 'Compute Campus', price: 3100, color: '#759096', size: 6, effect: 'data', reach: 15, power: 12, requires: 'pump' },
  road: { name: 'Freight Road', price: 22, color: '#6f736a', size: 2 },
  belt: { name: 'Freight Conveyor', price: 120, color: '#7d876b', size: 2, requires: 'depot' },
  rail: { name: 'Freight Rail', price: 250, color: '#938477', size: 2, requires: 'depot' },
};

type VehicleDefinition = {name:string;cost:number;speed:number;capacity:number;motor:boolean;color:string;research?:string;trailer?:boolean;forks?:boolean};
export const vehicles = {
  sled: { name: 'Skid Sled', cost: 95, speed: 4.4, capacity: 85, motor: false, color: '#86633e' },
  cart: { name: 'Hand Cart', cost: 145, speed: 5.4, capacity: 135, motor: false, color: '#77916c' },
  trike: { name: 'Cargo Tricycle', cost: 180, speed: 6.6, capacity: 120, motor: false, color:'#9a8a64', research:'06-01' },
  utility: { name: 'Electric Utility Cart', cost: 275, speed: 8.6, capacity: 190, motor: true, color:'#78907b', research:'06-02' },
  towAtv: { name: 'ATV Tow Rig', cost: 595, speed: 12.8, capacity: 180, motor: true, color:'#c0a14b', research:'06-05' },
  trailer: { name: 'Timber Trailer', cost: 750, speed: 0, capacity: 600, motor: false, color:'#8f845f', trailer:true, research:'06-06' },
  towPickup: { name: 'Work Pickup', cost: 1700, speed: 14.5, capacity: 340, motor: true, color:'#879369', research:'06-07' },
  forklift: { name: 'Log Forklift', cost: 1900, speed: 6.8, capacity: 610, motor: true, color:'#c4a454', forks:true },
  atv: { name: 'Forestry ATV', cost: 370, speed: 11, capacity: 130, motor: true, color: '#c08a39' },
  pickup: { name: 'Field Pickup', cost: 680, speed: 13, capacity: 260, motor: true, color: '#788b63' },
  skid: { name: 'Skid Steer', cost: 1300, speed: 8, capacity: 450, motor: true, color: '#ca9d44', forks:true },
  truck: { name: 'Logging Truck', cost: 2180, speed: 15, capacity: 850, motor: true, color: '#b98d50' },
  dozer: { name: 'Tracked Bulldozer', cost: 3150, speed: 8, capacity: 490, motor: true, color: '#d5a849' },
};
export type VehicleType = keyof typeof vehicles;
export const vehicleTypes:Record<VehicleType,VehicleDefinition> = vehicles;

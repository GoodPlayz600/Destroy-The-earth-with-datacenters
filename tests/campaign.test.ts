import assert from 'node:assert/strict';
import test from 'node:test';
import { Campaign, canWin, getQuantity, priceFor, put, take } from '../src/campaign';
import type { Log, Project } from '../src/campaign';
import { CELLS, TOTAL, facilities, recipes, species, vehicleTypes } from '../src/catalog';
import type { Facility } from '../src/catalog';
import { applyLand, conversionLabel, defaultSoil, desertified, districtAt, height, homeDistrict, indexAt, noPressure, treesIn } from '../src/land';
import { validateSave } from '../src/storage';
import { forestryUnlocks, modifiers, upgradeFacility, upgrades } from '../src/upgrades';
const upgradePrerequisiteFacilities=Object.values(upgradeFacility);

const run = (g:Campaign,n:number) => { for(let i=0;i<n;i++) g.tick(1); };
const baseLog = (g:Campaign,x:number,z:number):Log => ({
  id:g.nextId++,x,z,y:height(x,z)+.3,q:[0,0,Math.SQRT1_2,Math.SQRT1_2],kind:0,length:2.6,
  kilograms:22,units:1,quality:.74,moisture:.64,
});
const starter = (g:Campaign) => treesIn(g.seed,indexAt(0,-6)).find(t=>t.x===0&&t.z===-6)!;
const build=(g:Campaign,kind:Parameters<Campaign['build']>[0],x:number,z:number)=>{
  const site=g.build(kind,{x,z});
  assert.ok(site,`${kind} fits at ${x},${z}: ${g.siteIssue(kind,{x,z})}`);
  return site;
};

test('seeded jungle and first progression are stable',()=>{
  const g=new Campaign();
  assert.equal(g.cash,0);
  assert.deepEqual([...g.ownedTools],['knife']);
  assert.equal(g.stats.harvest,0);
  const small=starter(g);
  assert.equal(small.kind,0);
  assert.deepEqual(treesIn(g.seed,1234),treesIn(g.seed,1234));
  assert.notDeepEqual(treesIn(g.seed,1234),treesIn(g.seed+1,1234));
  let swings=0, felled=false;
  while(!felled&&swings<20){ felled=g.hit(small).felled;swings++; }
  assert.ok(felled);
  assert.ok(swings>=10&&swings<=14);
  assert.equal(g.fell(small,baseLog(g,0,-10)),true);
  assert.equal(g.isStanding(small),false);
  assert.equal(g.stats.harvest,1);
  assert.equal(g.desertCount,0);
  assert.equal(g.hit(small).damage,0);
});

test('fire consumes an in-range physical log with one delayed receipt',()=>{
  const g=new Campaign(),fire=g.sites[0], wood=baseLog(g,fire.x,fire.z+8);
  g.logs.set(wood.id,wood);
  assert.equal(g.acceptLog(fire,wood),false);
  wood.z=fire.z;
  assert.equal(g.acceptLog(fire,wood),true);
  assert.equal(g.acceptLog(fire,wood),false);
  assert.equal(g.logs.size,0);
  assert.equal(g.cash,0);
  run(g,1);
  assert.equal(g.cash,0);
  run(g,6);
  assert.equal(g.cash,g.fireValue(wood));
  assert.equal(g.ledger.length,1);
  assert.equal(g.stats.fire,1);
  assert.equal(g.buyUpgrade('02-01'),true);
  assert.ok(g.mods.grip>1);
  assert.equal(g.buyUpgrade('02-01'),false);
});

test('upgrade registries enforce prerequisites, reject unavailable nodes, and affect gameplay',()=>{
  const g=new Campaign();
  assert.equal(upgrades.length,288);
  assert.equal(new Set(upgrades.map(u=>u.id)).size,288);
  g.cash=1000;
  const tree=starter(g);
  const original=g.hit(tree).damage;
  assert.equal(g.buyUpgrade('01-02'),false);
  assert.equal(g.buyUpgrade('01-01'),true);
  assert.equal(g.buyUpgrade('01-02'),true);
  assert.ok(g.hit(tree).damage>original);
  const cash=g.cash;
  assert.equal(g.buyUpgrade('24-12'),false);
  assert.equal(g.cash,cash);
});

test('refining reserves material once, produces boards, and gives the player a better sale',()=>{
  const g=new Campaign();
  g.cash=700;
  const bench=build(g,'bench',1,4), market=g.sites.find(s=>s.kind==='market')!;
  const log=baseLog(g,bench.x,bench.z);
  g.logs.set(log.id,log);
  assert.equal(g.acceptLog(bench,log),true);
  assert.equal(g.acceptLog(market,log),false);
  assert.equal(getQuantity(bench.input),1);
  run(g,1);
  assert.equal(getQuantity(bench.input),0);
  assert.equal(getQuantity(bench.output),0);
  assert.equal(bench.jobs.length,1);
  run(g,5);
  assert.equal(getQuantity(bench.output,'boards'),2);
  assert.equal(g.transfer(bench,'boards',2,true),true);
  assert.equal(g.transfer(bench,'boards',2,true),false);
  const cash=g.cash;
  assert.equal(g.sellInventory('boards',2),true);
  assert.equal(g.sellInventory('boards',2),false);
  assert.ok(g.cash-cash>priceFor(g.logStack(log)));
  assert.ok(g.cash-cash>g.fireValue(log));
});

test('stock transfer preserves quantity, moisture, grade and acceptable capacity',()=>{
  const source=[{good:'boards' as const,quantity:3,quality:.61,moisture:.62}];
  assert.equal(take(source,'boards',2,.7),undefined);
  assert.equal(getQuantity(source),3);
  assert.equal(take(source,'boards',4),undefined);
  const exact=take(source,'boards',2)!;
  assert.equal(exact.quality,.61);
  assert.equal(exact.moisture,.62);
  assert.equal(getQuantity(source),1);
  assert.equal(put(source,exact,2),false);
  assert.equal(put(source,exact,3),true);
  assert.equal(getQuantity(source),3);
  assert.ok(priceFor(exact)<priceFor({...exact,moisture:.1,quality:.9}));
});

test('industrial machinery stops for grid and buffer limits and delivers through a real route',()=>{
  const g=new Campaign();
  g.cash=10000;
  const bench=build(g,'bench',0,5);
  const mill=build(g,'mill',0,14);
  put(mill.input,{good:'timber',quantity:4,quality:.82,moisture:.63});
  run(g,25);
  assert.match(mill.status,/No grid/);
  assert.equal(getQuantity(mill.input),4);
  const power=build(g,'generator',10,14);
  put(mill.output,{good:'boards',quantity:g.capacity(mill),quality:.85,moisture:.6});
  run(g,2);
  assert.match(mill.status,/Output full/);
  const market=g.sites.find(s=>s.kind==='market')!;
  assert.equal(g.connect(mill,market),true);
  run(g,33);
  assert.equal(getQuantity(mill.input),0);
  assert.ok(g.stats.produced>=10);
  assert.ok(g.stats.sold>=10);
  power.on=false;
  run(g,2);
  assert.match(mill.status,/No grid/);
  assert.equal(bench.jobs.length,0);
});

test('contracts enforce timers and quota without duplicating money',()=>{
  const g=new Campaign();
  assert.equal(g.acceptContract('boards'),true);
  assert.equal(g.acceptContract('paper'),false);
  const c=g.contracts[0];
  assert.equal(g.fulfill(c),false);
  put(g.stock,{good:'boards',quantity:c.quantity,quality:.85,moisture:.58});
  assert.equal(g.fulfill(c),true);
  assert.equal(g.fulfill(c),false);
  assert.equal(g.cash,c.payout);
  assert.equal(g.acceptContract('paper'),true);
  run(g,361);
  assert.ok(g.contracts[0].failed);
  assert.equal(g.fulfill(g.contracts[0]),false);
});

test('versioned save preserves timber pose, an in-flight burn, cash and upgrades',()=>{
  const g=new Campaign();
  const tree=starter(g),wood=baseLog(g,0,-8);
  assert.ok(g.fell(tree,wood));
  g.cash=30;
  assert.ok(g.buyUpgrade('01-01'));
  const fire=g.sites[0], extra=baseLog(g,fire.x,fire.z);
  g.logs.set(extra.id,extra);
  assert.ok(g.acceptLog(fire,extra));
  const payload=validateSave(JSON.parse(JSON.stringify(g.snapshot())));
  const saved=Campaign.restore(payload);
  assert.equal(saved.cash,g.cash);
  assert.deepEqual(saved.logs.get(wood.id),wood);
  assert.equal(saved.isStanding(tree),false);
  assert.equal(saved.sites[0].jobs.length,1);
  assert.ok(saved.ownedUpgrades.has('01-01'));
  run(saved,6);
  assert.equal(saved.cash,g.cash+g.fireValue(extra));
  assert.throws(()=>validateSave({...g.snapshot(),version:999}),/Unsupported/);
  assert.throws(()=>validateSave({...g.snapshot(),logs:[{...wood,cargo:'v777'}]}),/references/);
});

test('authoritative dry rules require vegetation, moisture, soil and sustained stability',()=>{
  const s=defaultSoil();
  s.vegetation=0;
  for(let n=0;n<20;n++)applyLand(s,noPressure(),1,0,0,n);
  assert.equal(s.stage,2);
  assert.equal(desertified(s),false);
  s.moisture=.12;s.groundwater=.1;s.substrate=.9;s.fertility=.19;
  for(let n=0;n<59;n++)applyLand(s,noPressure(),1,0,0,n);
  assert.equal(desertified(s),false);
  applyLand(s,noPressure(),1,0,0,60);
  assert.equal(desertified(s),true);
  s.moisture=.15;
  assert.equal(desertified(s),false);
});

test('water, soil stripping and thermal projects independently complete a district',()=>{
  const categories:Project['kind'][]=['watershed','quarry','thermal'];
  for(const kind of categories) {
    const g=new Campaign();
    g.cash=30000;
    build(g,'forestry',15,14);
    const k=kind==='watershed'?'pump':kind;
    build(g,k,3,14);
    assert.ok(g.startProject(homeDistrict,kind));
    run(g,950);
    assert.equal(g.desertByDistrict[homeDistrict],1024,kind);
    assert.equal(g.scan(homeDistrict).length,0);
    assert.equal(g.won,false);
    assert.equal(g.sites.some(s=>s.kind==='data'),false);
    assert.equal(Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot())))).desertCount,g.desertCount);
  }
});

test('4096-meter boundaries include 65,536 cells and victory triggers once at the exact count',()=>{
  assert.equal(indexAt(-2048,-2048),0);
  assert.equal(indexAt(2048,2048),-1);
  assert.equal(indexAt(2047.99,2047.99),TOTAL-1);
  assert.equal(CELLS**2,TOTAL);
  assert.equal(conversionLabel(TOTAL-1),'99.99');
  assert.equal(canWin(TOTAL-1),false);
  assert.equal(canWin(TOTAL),true);
  const g=new Campaign();
  for(let i=0;i<TOTAL;i++) {
    const soil=g.getSoil(i);
    Object.assign(soil,{vegetation:0,moisture:0,groundwater:0,fertility:0,erosion:1,substrate:1,stable:i===TOTAL-1?59:60,stage:i===TOTAL-1?5:6});
  }
  const restored=Campaign.restore(g.snapshot());
  assert.equal(restored.won,false);
  assert.equal(restored.desertCount,TOTAL-1);
  assert.equal(restored.desertByDistrict[districtAt(TOTAL-1)],1023);
  run(restored,1);
  assert.ok(restored.won);
  assert.equal(restored.desertCount,TOTAL);
  run(restored,1);
  assert.equal(restored.notices.filter(n=>n.startsWith('Campaign complete')).length,1);
  assert.ok(Campaign.restore(restored.snapshot()).won);
});

test('content has a real recipe and facility for every production branch',()=>{
  assert.ok(Object.keys(recipes).length>=10);
  assert.ok(Object.keys(facilities).length>=25);
  for(const [kind,recipe] of Object.entries(recipes)){
    assert.ok(Object.hasOwn(facilities,kind));
    assert.ok(recipe.time>0);
    assert.ok(recipe.output[1]>0);
  }
  assert.ok(species.length>=3);
});

test('haulers reserve each physical log once and deliver after travel',()=>{
  const g=new Campaign();
  g.cash=6500;
  const first=build(g,'forestry',-10,12), second=build(g,'forestry',10,12);
  const receiver=build(g,'bench',2,6);
  assert.ok(g.assignHauler(first,receiver));
  assert.ok(g.assignHauler(second,receiver));
  const log=baseLog(g,-6,8);
  g.logs.set(log.id,log);
  g.tick(1,true,log.id);
  assert.equal(first.haul?.log,undefined);
  run(g,5);
  assert.equal(first.haul?.log,log.id);
  assert.equal(second.haul?.log,undefined);
  assert.equal(log.carrier,first.id);
  assert.ok(g.logs.has(log.id));
  receiver.on=false;
  run(g,20);
  assert.ok(g.logs.has(log.id));
  assert.match(first.haul!.status,/blocked/);
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  receiver.on=true;
  run(g,12);
  assert.equal(g.logs.has(log.id),false);
  assert.equal(getQuantity(receiver.output,'boards'),2);
});

test('tool wear survives switching and forestry unlocks go through the upgrade chain',()=>{
  const g=new Campaign();
  g.cash=10000;
  assert.equal(g.acquireTool('axe'),false);
  assert.equal(g.acquireTool('saw'),true);
  const before=g.wear;
  g.hit(starter(g));
  assert.ok(g.wear<before);
  const used=g.wear;
  assert.equal(g.acquireTool('knife'),true);
  assert.equal(g.acquireTool('saw'),true);
  assert.equal(g.wear,used);
  assert.ok(g.buyUpgrade('05-02'));
  const restored=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.ok(restored.ownedTools.has('axe'));
  assert.equal(restored.wear,used);
});

test('compute processing requires electricity and physically connected cooling storage',()=>{
  const g=new Campaign();
  g.cash=10000;
  const gen=build(g,'generator',-6,12), pump=build(g,'pump',0,13), data=build(g,'data',11,13);
  assert.ok(g.acceptContract('compute'));
  gen.on=false;
  run(g,8);
  assert.match(data.status,/No grid power/);
  assert.equal(getQuantity(data.output),0);
  gen.on=true; pump.on=false;
  run(g,8);
  assert.match(data.status,/Cooling supply/);
  assert.equal(getQuantity(data.output),0);
  pump.on=true;
  run(g,31);
  assert.ok(getQuantity(data.output,'compute')>=2);
  assert.ok(pump.water!==undefined&&pump.water<160);
  assert.ok(gen.fuel<100);
});

test('every campaign district can finish through playable projects and the completion state stays stable',()=>{
  const g=new Campaign();
  g.cash=850000;
  build(g,'forestry',15,14);
  build(g,'pump',3,14);
  build(g,'thermal',-8,11);
  build(g,'quarry',-12,-7);
  for(let i=0;i<64;i++) {
    if(i!==homeDistrict)assert.ok(g.buyDistrict(i));
    assert.ok(g.startProject(i,['watershed','quarry','thermal'][i%3] as Project['kind']));
  }
  for(let n=0;n<1100&&!g.won;n++)g.tick(1);
  assert.ok(g.won,'all districts must reach stable desert through simulation');
  assert.equal(g.desertCount,TOTAL);
  run(g,5);
  assert.equal(g.projects.filter(p=>p.complete).length,64);
  const bonds=g.ledger.filter(row=>row.note.includes('completion contract')).length;
  run(g,10);
  assert.equal(g.ledger.filter(row=>row.note.includes('completion contract')).length,bonds);
  const restored=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.ok(restored.won);
  assert.equal(restored.scan().length,0);
});

test('rail and air freight reserve real stock, travel, and deliver only once',()=>{
  const g=new Campaign();
  g.cash=18000;
  build(g,'depot',-10,10);
  const rail=build(g,'railDepot',0,13), market=g.sites[1];
  assert.equal(g.connect(rail,market),false);
  build(g,'rail',4,7);
  assert.ok(g.connect(rail,market));
  put(rail.output,{good:'boards',quantity:26,quality:.85,moisture:.42});
  run(g,1);
  assert.equal(getQuantity(rail.output),0);
  assert.equal(rail.shipment?.load.quantity,26);
  assert.equal(g.stats.sold,0);
  assert.equal(g.connect(rail,g.sites[0]),false);
  market.on=false;
  run(g,10);
  assert.equal(g.stats.sold,0);
  assert.match(rail.status,/receiver offline/);
  const resumed=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(resumed.sites.find(s=>s.id===rail.id)?.shipment?.load.quantity,26);
  market.on=true;
  run(g,10);
  assert.equal(rail.shipment,undefined);
  assert.equal(g.stats.sold,26);
  const air=build(g,'dronePad',9,10);
  assert.ok(g.connect(air,market));
  put(air.output,{good:'dry',quantity:12,quality:.92,moisture:.1});
  run(g,6);
  assert.equal(getQuantity(air.output),12);
  assert.match(air.status,/power/);
  build(g,'generator',14,12);
  run(g,1);
  assert.equal(air.shipment?.load.quantity,8);
  assert.equal(getQuantity(air.output),4);
  run(g,20);
  assert.equal(g.stats.sold,38);
});

test('lot-based receipts use the exact moisture and grade displayed in the market',()=>{
  const g=new Campaign();
  const a={good:'boards' as const,quantity:2,quality:.61,moisture:.62};
  const b={good:'boards' as const,quantity:2,quality:.90,moisture:.20};
  put(g.stock,a);put(g.stock,b);
  const selected=g.stock[1], expected=priceFor(selected);
  assert.ok(g.sellInventory('boards',2,selected));
  assert.equal(g.cash,expected);
  assert.deepEqual(g.stock,[a]);
  assert.equal(g.sellInventory('boards',2,selected),false);
});

test('sawmill research changes measured output and concurrent machine reservations',()=>{
  const g=new Campaign();
  g.cash=95000;
  const bench=build(g,'bench',1,4);
  for(const node of ['09-01','09-02','09-03','09-04'])assert.ok(g.buyUpgrade(node),node);
  put(bench.input,{good:'timber',quantity:5,quality:.80,moisture:.55});
  assert.ok(g.crankBench(bench));
  assert.ok(bench.jobs[0].remaining<3);
  assert.equal(g.crankBench(bench),false);
  run(g,50);
  assert.equal(getQuantity(bench.output,'boards'),11);
  const main=build(g,'bandsaw',-8,12);
  for(const node of ['09-05','09-06','09-07','09-08'])assert.ok(g.buyUpgrade(node),node);
  build(g,'generator',1,14);
  put(main.input,{good:'timber',quantity:6,quality:.84,moisture:.5});
  run(g,2);
  assert.equal(main.jobs.length,2);
  assert.equal(getQuantity(main.input),4);
  run(g,28);
  assert.ok(getQuantity(main.output,'chips')>=6);
  assert.ok(main.output.filter(l=>l.good==='boards').every(l=>l.quality>=.94));
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
});

test('server output is capped by a live contract and cash is issued only on fulfillment',()=>{
  const g=new Campaign();
  g.cash=28000;
  const gen=build(g,'generator',-8,11);
  assert.ok(g.buyUpgrade('22-01'));
  const rack=build(g,'serverRack',0,9);
  run(g,44);
  assert.equal(getQuantity(rack.output,'compute'),0);
  assert.match(rack.status,/Waiting for a compute contract/);
  assert.ok(g.acceptContract('compute'));
  const order=g.contracts[0], balance=g.cash;
  run(g,433);
  assert.equal(getQuantity(rack.output,'compute'),order.quantity);
  assert.equal(g.cash,balance);
  assert.ok(gen.fuel<100);
  assert.ok(g.transfer(rack,'compute',order.quantity,true));
  assert.equal(g.sellInventory('compute',order.quantity),false);
  assert.ok(g.fulfill(order));
  assert.equal(g.cash,balance+order.payout);
  assert.equal(getQuantity(g.stock,'compute'),0);
});

test('modular furniture requires both material lots and charges labor only after reservation',()=>{
  const g=new Campaign();
  g.cash=2500000;
  build(g,'bench',0,4);
  build(g,'workshop',-5,11);
  assert.ok(g.buyUpgrade('11-01'));
  build(g,'carpentry',0,11);
  for(let i=2;i<=11;i++) assert.ok(g.buyUpgrade('11-'+String(i).padStart(2,'0')));
  build(g,'lathe',9,7);
  build(g,'cabinet',14,-3);
  build(g,'generator',11,17);
  for(const tree of treesIn(g.seed,indexAt(0,20))) {
    if(Math.hypot(tree.x,tree.z-20)<7)g.fell(tree,baseLog(g,tree.x,tree.z));
  }
  const factory=build(g,'modular',0,20);
  const quality=.92;
  put(factory.input,{good:'laminate',quantity:2,quality,moisture:.11});
  const balance=g.cash;
  run(g,5);
  assert.equal(g.cash,balance);
  assert.equal(getQuantity(factory.input,'laminate'),2);
  put(factory.input,{good:'turned',quantity:2,quality,moisture:.11});
  run(g,1);
  assert.equal(g.cash,balance-58);
  assert.equal(getQuantity(factory.input),0);
  run(g,25);
  assert.equal(getQuantity(factory.output,'modular'),2);
  assert.equal(g.cash,balance-58);
});

test('trailers require research, attach to a specific local tow vehicle and retain their hitch over reload',()=>{
  const g=new Campaign();
  g.cash=50000;
  const tow=g.acquireRide('pickup',{x:0,z:12})!;
  assert.ok(tow);
  assert.equal(g.toggleTrailer(tow),false);
  assert.equal(g.acquireRide('trailer',{x:0,z:17}),undefined);
  for(let n=1;n<=6;n++)assert.ok(g.buyUpgrade('06-'+String(n).padStart(2,'0')));
  const trailer=g.acquireRide('trailer',{x:0,z:17})!;
  assert.ok(g.toggleTrailer(tow));
  assert.equal(trailer.hitch,tow.id);
  const saved=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(saved.rides[1].hitch,saved.rides[0].id);
  assert.ok(g.toggleTrailer(tow));
  assert.equal(trailer.hitch,undefined);
});

test('storage bridges a short blackout with conserved grid supply',()=>{
  const g=new Campaign();
  g.cash=30000;
  for(let n=1;n<=5;n++)assert.ok(g.buyUpgrade('18-'+String(n).padStart(2,'0')));
  const gen=build(g,'portable',-9,12);
  const reserve=build(g,'battery',4,12);
  const bio=build(g,'biopower',11,12);
  const bench=build(g,'bench',0,5);
  const mill=build(g,'mill',0,16);
  run(g,21);
  assert.ok((reserve.reserve??0)>=100);
  gen.on=false;
  put(mill.input,{good:'timber',quantity:2,quality:.84,moisture:.55});
  const before=reserve.reserve!;
  run(g,10);
  assert.ok(reserve.reserve!<before);
  assert.equal(getQuantity(mill.output,'boards'),5);
  assert.equal(bio.fuel,0);
  put(g.stock,{good:'chips',quantity:1,quality:.72,moisture:.53});
  assert.ok(g.transfer(bio,'chips',1,false));
  put(mill.input,{good:'timber',quantity:2,quality:.84,moisture:.55});
  run(g,12);
  assert.ok(bio.fuel>0);
  assert.equal(getQuantity(mill.output,'boards'),10);
  assert.equal(getQuantity(bio.input),0);
  assert.equal(bench.jobs.length,0);
});

test('farms require cleared soil and real sowing, and crop yields deplete the parcel',()=>{
  const g=new Campaign();
  g.cash=45000;
  const ranchSite={x:-10,z:10}, cropSite={x:5,z:12};
  for(const point of [ranchSite,cropSite]) {
    for(const tree of treesIn(g.seed,indexAt(point.x,point.z)))g.fell(tree,baseLog(g,tree.x,tree.z));
  }
  for(let n=1;n<=3;n++)assert.ok(g.buyUpgrade('20-'+String(n).padStart(2,'0')));
  const pasture=build(g,'pasture',ranchSite.x,ranchSite.z);
  const crop=build(g,'crop',cropSite.x,cropSite.z);
  const soil=g.getSoil(indexAt(cropSite.x,cropSite.z));
  run(g,30);
  assert.equal(getQuantity(crop.output),0);
  assert.ok(getQuantity(pasture.output,'hay')>0);
  assert.ok(g.buyUpgrade('20-04'));
  assert.ok(g.sow(crop));
  assert.ok(g.fertilize(crop));
  const start=soil.fertility;
  run(g,35);
  assert.equal(getQuantity(crop.output,'harvest'),6);
  assert.ok(soil.fertility<start);
  assert.ok(soil.pollution>0);
  assert.equal(crop.planted,0);
  assert.equal(crop.fertilizer,false);
});

test('field objectives use recorded play and pay their reward just once across reloads',()=>{
  const g=new Campaign(), fire=g.sites[0];
  assert.equal(g.claimQuest('firstSale'),false);
  const log=baseLog(g,fire.x,fire.z);
  g.logs.set(log.id,log);
  assert.ok(g.acceptLog(fire,log));
  assert.equal(g.claimQuest('firstSale'),false);
  run(g,8);
  const before=g.cash;
  assert.ok(g.claimQuest('firstSale'));
  assert.equal(g.cash,before+25);
  assert.equal(g.claimQuest('firstSale'),false);
  const loaded=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(loaded.claimQuest('firstSale'),false);
  assert.equal(loaded.cash,before+25);
});

test('branch chipping and fire byproducts preserve physically delivered inventory',()=>{
  const g=new Campaign();
  g.cash=20000;
  build(g,'bench',0,5);
  build(g,'chipper',1,12);
  assert.ok(g.buyUpgrade('12-01'));
  const chip=build(g,'branchChipper',9,12);
  build(g,'generator',-10,10);
  const branch={...baseLog(g,chip.x,chip.z),part:'branch' as const,kilograms:10,length:1.3};
  const trunk=baseLog(g,chip.x,chip.z);
  g.logs.set(branch.id,branch);g.logs.set(trunk.id,trunk);
  assert.equal(g.acceptLog(chip,trunk),false);
  assert.ok(g.acceptLog(chip,branch));
  assert.equal(g.acceptLog(chip,branch),false);
  run(g,12);
  assert.equal(getQuantity(chip.output,'chips'),2);
  const fire=g.sites[0];
  for(let n=1;n<=4;n++)assert.ok(g.buyUpgrade('04-'+String(n).padStart(2,'0')));
  trunk.x=fire.x;trunk.z=fire.z;
  assert.ok(g.acceptLog(fire,trunk));
  run(g,9);
  assert.equal(getQuantity(fire.output,'ash'),1);
  assert.equal(getQuantity(fire.output,'charcoal'),0);
});

test('standing delivery contracts lock a rate and credit each shipment once',()=>{
  const game=new Campaign();
  game.cash=65000;
  build(game,'depot',-10,10);
  for(let n=1;n<=9;n++)assert.ok(game.buyUpgrade('14-'+String(n).padStart(2,'0')));
  assert.ok(game.acceptContract('boards',false,'supply'));
  const order=game.contracts[0], starting=game.cash;
  assert.ok(order.deadline>game.clock+900);
  for(let batch=0;batch<3;batch++) {
    put(game.stock,{good:'boards',quantity:9,quality:.86,moisture:.40});
    assert.ok(game.fulfill(order));
    assert.equal(order.received,(batch+1)*9);
    assert.equal(order.done,batch===2);
    assert.equal(game.fulfill(order),false);
    run(game,40);
  }
  assert.equal(game.cash,starting+order.payout);
  assert.equal(getQuantity(game.stock),0);
  const save=Campaign.restore(validateSave(JSON.parse(JSON.stringify(game.snapshot()))));
  assert.equal(save.contracts[0].received,27);
});

test('water cart transfers conserve the finite volume drawn from a manual pump',()=>{
  const g=new Campaign();
  g.cash=10000;
  assert.ok(g.buyUpgrade('19-01'));
  assert.ok(g.buyUpgrade('19-02'));
  const pump=build(g,'handPump',0,8), tankSite=build(g,'pump',-9,10);
  const soil=g.getSoil(indexAt(0,8));
  const before=soil.groundwater;
  for(let i=0;i<4;i++)assert.ok(g.pumpByHand(pump)>0);
  assert.ok(soil.groundwater<before);
  const ride=g.acquireRide('waterCart',{x:0,z:10})!;
  assert.ok(ride);
  assert.equal(g.waterCargo(ride,pump),44);
  assert.equal(pump.water,0);
  assert.equal(ride.water,44);
  assert.equal(g.waterCargo(ride,tankSite,true),0);
  ride.x=-8;ride.z=10;
  assert.equal(g.waterCargo(ride,tankSite,true),44);
  assert.equal(tankSite.water,44);
  assert.equal(ride.water,0);
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
});

test('scrubbers change heat, pollution and offered grid output in the same parcel',()=>{
  const ordinary=new Campaign(), filtered=new Campaign();
  ordinary.cash=filtered.cash=12000;
  const normal=build(ordinary,'thermal',7,13), clean=build(filtered,'thermal',7,13);
  clean.scrubbers=true;
  run(ordinary,90);run(filtered,90);
  const tile=indexAt(normal.x,normal.z);
  const raw=ordinary.getSoil(tile), controlled=filtered.getSoil(tile);
  assert.ok(raw.pollution>controlled.pollution);
  assert.ok(raw.heat>controlled.heat);
  assert.ok((normal.gridCapacity??0)>(clean.gridCapacity??0));
  assert.ok(normal.fuel<100);
});

test('survey research spends earned science and the last-cell crew operates through actual soil rules',()=>{
  const g=new Campaign();
  g.cash=10000000;
  g.stats.produced=900;
  for(let i=1;i<=4;i++)assert.ok(g.buyUpgrade('24-'+String(i).padStart(2,'0')));
  const climate=build(g,'climateTower',11,13), generator=build(g,'generator',-9,10);
  build(g,'forestry',1,13);
  for(let i=5;i<=7;i++)assert.ok(g.buyUpgrade('24-'+String(i).padStart(2,'0')));
  assert.equal(g.science,56);
  assert.ok(g.develop('edge'));
  assert.equal(g.science,44);
  assert.equal(g.develop('edge'),false);
  run(g,26);
  assert.ok((climate.climate?.length??0)>0);
  assert.ok(generator.fuel<100);
  const i=indexAt(111,111), initial=g.cash;
  assert.ok(g.dispatchCleanup(i));
  assert.equal(g.cash,initial-80);
  assert.equal(g.dispatchCleanup(i),false);
  assert.equal(g.desertCount,0);
  run(g,730);
  assert.ok(desertified(g.getSoil(i)));
  assert.equal(g.cleanup.length,0);
  assert.ok(g.desertCount>0);
  assert.equal(g.won,false);
  const restored=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(restored.prototypes.has('edge'),true);
  assert.equal(restored.desertCount,g.desertCount);
});

test('rock breaking and mine freight keep deposits, cargo and stock separate',()=>{
  const g=new Campaign();
  g.cash=165000;
  assert.ok(g.acquireTool('breaker'));
  const stone={x:0,z:-2.5};
  assert.ok(g.breakRock(12570,stone));
  assert.equal(g.breakRock(12570,stone),false);
  assert.equal(getQuantity(g.stock,'ore'),2);
  build(g,'quarry',-11,-9);
  assert.ok(g.buyUpgrade('21-02'));
  const mine=build(g,'licensedQuarry',1,12);
  assert.ok(g.buyUpgrade('21-03'));
  assert.ok(g.buyUpgrade('21-04'));
  const truck=g.acquireRide('oreTruck',{x:1,z:9})!;
  assert.ok(truck);
  build(g,'generator',-9,10);
  run(g,30);
  const produced=getQuantity(mine.output,'mixedOre');
  assert.ok(produced>0);
  assert.equal(g.freightBed(truck,mine),produced);
  assert.equal(getQuantity(mine.output),0);
  assert.equal(truck.freight?.quantity,produced);
  const market=g.sites[1];
  assert.equal(g.freightBed(truck,market,true),0);
  truck.x=market.x;truck.z=market.z;
  const start=g.cash;
  assert.equal(g.freightBed(truck,market,true),produced);
  assert.equal(g.freightBed(truck,market,true),0);
  assert.ok(g.cash>start);
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
});

test('powered sorting splits actual material lots without duplicating grade or receipts',()=>{
  const g=new Campaign();
  g.cash=75000;
  const rack=build(g,'bench',0,5);
  for(let n=1;n<=6;n++){
    assert.ok(g.buyUpgrade('15-'+String(n).padStart(2,'0')));
    if(n===1)build(g,'stackRack',-8,7);
  }
  const gate=build(g,'sortGate',0,11), warehouse=build(g,'depot',9,12), market=g.sites[1];
  const generator=build(g,'generator',-9,13);
  assert.ok(g.enlarge(rack));
  assert.equal(g.capacity(rack),52);
  assert.ok(g.connect(gate,market));
  assert.ok(g.connectAlternate(gate,warehouse,'chips'));
  put(gate.output,{good:'chips',quantity:7,quality:.78,moisture:.40});
  put(gate.output,{good:'boards',quantity:8,quality:.90,moisture:.28});
  generator.on=false;
  run(g,2);
  assert.equal(getQuantity(gate.output),15);
  generator.on=true;
  run(g,5);
  assert.equal(getQuantity(gate.output),0);
  assert.equal(getQuantity(warehouse.output,'chips'),7);
  assert.equal(g.stats.sold,8);
  assert.equal(gate.shipped,15);
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
});

test('staffing reserves one paid position and shortens actual processing time',()=>{
  const g=new Campaign();
  g.cash=40000;
  assert.ok(g.buyUpgrade('17-01'));
  build(g,'helperPost',-9,10);
  for(let n=2;n<=6;n++)assert.ok(g.buyUpgrade('17-'+String(n).padStart(2,'0')));
  const bench=build(g,'bench',0,8);
  const cash=g.cash;
  assert.ok(g.staff(bench));
  assert.equal(g.cash,cash-40);
  put(bench.input,{good:'timber',quantity:1,quality:.80,moisture:.54});
  run(g,1);
  assert.equal(bench.jobs[0].remaining,4*.76);
  run(g,65);
  assert.equal(g.cash,cash-49);
  assert.equal(getQuantity(bench.output,'boards'),2);
  assert.ok(g.staff(bench));
  run(g,66);
  assert.equal(g.cash,cash-49);
});

test('owned autonomous truck reserves stock, uses fuel, delivers once and returns',()=>{
  const g=new Campaign();
  g.cash=4500000;
  for(let n=1;n<=11;n++){
    if(n===2){
      assert.ok(g.buyUpgrade('16-02'));
      build(g,'loadingPad',-9,12);
      continue;
    }
    assert.ok(g.buyUpgrade('16-'+String(n).padStart(2,'0')));
    if(n===5)build(g,'roadDepot',1,13);
    if(n===8){
      build(g,'depot',10,13);
      build(g,'railDepot',-12,-6);
      for(const tree of treesIn(g.seed,indexAt(13,-10)))g.fell(tree,baseLog(g,tree.x,tree.z));
      build(g,'railTerminal',13,-10);
    }
  }
  for(const tree of treesIn(g.seed,indexAt(0,-15)))g.fell(tree,baseLog(g,tree.x,tree.z));
  const garage=build(g,'autoGarage',0,-15), market=g.sites[1];
  const ride=g.acquireRide('regionalTruck',{x:0,z:-17})!;
  assert.ok(ride&&g.assignDriverless(garage,ride));
  assert.ok(g.connect(garage,market));
  put(garage.output,{good:'boards',quantity:17,quality:.86,moisture:.42});
  run(g,1);
  assert.equal(getQuantity(garage.output),0);
  assert.ok(ride.fuel<100);
  assert.equal(garage.shipment?.load.quantity,17);
  run(g,5);
  assert.equal(g.stats.sold,17);
  assert.equal(garage.shipment?.returning,true);
  run(g,10);
  assert.equal(garage.shipment,undefined);
  assert.equal(g.stats.sold,17);
});

test('every defined upgrade is purchasable in order given its prerequisites and unlock state',()=>{
  const g=new Campaign();
  g.cash=20_000_000_000;
  const required = new Set(upgradePrerequisiteFacilities);
  for(const kind of required)g.sites.push({id:'s'+g.nextId++,kind,x:11,z:13,on:true,fuel:100,input:[],output:[],jobs:[],status:'Ready'});
  assert.ok(upgrades.every(u=>u.implemented));
  for(const upgrade of upgrades){
    if(upgrade.id==='24-12'){
      assert.equal(g.buyUpgrade(upgrade.id),false);
      g.desertCount=TOTAL;
    }
    assert.ok(g.buyUpgrade(upgrade.id),upgrade.id+' · '+upgrade.name);
    assert.equal(g.buyUpgrade(upgrade.id),false);
  }
  assert.equal(g.ownedUpgrades.size,288);
  assert.ok(g.achievements.has('Stable desert certification'));
  assert.doesNotThrow(()=>validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
});

test('powered cranes reserve a unique trunk and place it on the selected vehicle',()=>{
  const g=new Campaign();
  g.cash=2600000;
  for(let n=1;n<=6;n++)assert.ok(g.buyUpgrade('07-'+String(n).padStart(2,'0')));
  const crane=build(g,'craneYard',0,11), truck=g.acquireRide('pickup',{x:5,z:11})!;
  const log=baseLog(g,-3,8);
  g.logs.set(log.id,log);
  assert.ok(g.loadByCrane(crane,log,truck));
  assert.equal(g.loadByCrane(crane,log,truck),false);
  run(g,4);
  assert.equal(log.cargo,undefined);
  assert.equal(crane.crane?.remaining,5);
  build(g,'generator',-10,11);
  run(g,2);
  assert.ok(log.y>1.4);
  assert.equal(log.carrier,crane.id);
  run(g,5);
  assert.equal(log.carrier,undefined);
  assert.equal(log.cargo,truck.id);
  assert.equal(crane.crane,undefined);
});

test('excavation changes the actual elevation used by the game and preserves cargo across saves',()=>{
  const g=new Campaign();
  g.cash=200000;
  for(let n=1;n<=6;n++)assert.ok(g.buyUpgrade('08-'+String(n).padStart(2,'0')));
  const crane=g.acquireRide('excavator',{x:8,z:8})!;
  assert.ok(crane);
  const base=g.ground(8,8);
  assert.ok(g.excavate(crane,crane));
  assert.ok(g.excavate(crane,crane));
  assert.ok(g.ground(8,8)<base-.60);
  assert.equal(crane.freight?.quantity,2);
  assert.ok(crane.fuel<100);
  const copy=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(copy.ground(8,8),g.ground(8,8));
  assert.equal(copy.rides[0].freight?.quantity,2);
});

test('air drying, crate construction and separated inputs have distinct timings and returns',()=>{
  const g=new Campaign();
  g.cash=2400;
  build(g,'bench',0,5);
  const rack=build(g,'rack',-9,10), shop=build(g,'workshop',8,13);
  const original={good:'boards' as const,quantity:4,quality:.82,moisture:.63};
  put(g.stock,original);
  assert.ok(g.transfer(rack,'boards',2,false));
  assert.ok(g.transfer(shop,'boards',2,false));
  assert.equal(getQuantity(g.stock),0);
  run(g,15);
  assert.equal(getQuantity(shop.output,'crates'),1);
  assert.equal(getQuantity(rack.output),0);
  run(g,10);
  assert.equal(getQuantity(rack.output,'dry'),2);
  assert.ok(rack.output[0].moisture<original.moisture);
  assert.ok(priceFor(shop.output[0])>priceFor({...original,quantity:2}));
});

test('the substrate simulation reaches all seven stages through ordinary rules',()=>{
  const view=defaultSoil(), reached=new Set([view.stage]);
  view.vegetation=0;
  const stage=(seconds:number,p:ReturnType<typeof noPressure>)=>{
    for(let i=0;i<seconds;i++){applyLand(view,p,1,0,0,i);reached.add(view.stage);}
  };
  stage(30,noPressure());
  stage(115,{...noPressure(),drainage:1});
  stage(350,{...noPressure(),drainage:1,removal:1});
  assert.deepEqual([...reached].sort(),[0,1,2,3,4,5,6]);
});

test('challenge variants persist their distinct limits and first bulletin changes prices',()=>{
  const g=new Campaign(20831,'noCompute');
  g.cash=8000;
  build(g,'pump',0,11);
  assert.match(g.siteIssue('data',{x:10,z:13}),/disabled/);
  const copy=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(copy.challenge,'noCompute');
  const standard=new Campaign(20831), lean=new Campaign(20831,'leanPower');
  standard.cash=lean.cash=8000;
  const a=build(standard,'generator',0,11),b=build(lean,'generator',0,11);
  run(standard,1);run(lean,1);
  assert.ok((a.gridCapacity??0)>(b.gridCapacity??0));
  assert.notEqual(g.eventAt(0),g.eventAt(300));
});

test('each upgrade changes a modifier or unlocks a modeled facility, vehicle, tool or achievement',()=>{
  const facilityUnlocks=Object.values(facilities).flatMap(f=>f.research??[]);
  const vehicleUnlocks=Object.values(vehicleTypes).flatMap(v=>v.research??[]);
  const toolUnlocks=Object.values(forestryUnlocks);
  const direct=new Set<string>([...facilityUnlocks,...vehicleUnlocks,...toolUnlocks,'24-12']);
  for(const upgrade of upgrades){
    const before=modifiers(new Set());
    const after=modifiers(new Set([upgrade.id]));
    const changed=Object.entries(after).some(([key,v])=>v!==before[key as keyof typeof before]);
    assert.ok(changed||direct.has(upgrade.id),upgrade.id+' has no connected effect');
  }
});

test('facility and upgrade prerequisites can be reached without a circular dependency',()=>{
  const built=new Set<Facility>(), known=new Set<string>();
  let changed=true;
  while(changed){
    const before=built.size+known.size;
    for(const [id,def]of Object.entries(facilities))if((!def.research||known.has(def.research))&&(!def.requires||built.has(def.requires)))built.add(id as Facility);
    for(const u of upgrades)if((!u.previous||known.has(u.previous))&&(!upgradeFacility[u.id]||built.has(upgradeFacility[u.id])))known.add(u.id);
    changed=built.size+known.size!==before;
  }
  const blocked=upgrades.filter(upgrade=>!known.has(upgrade.id));
  assert.deepEqual(blocked.map(x=>x.id),[]);
});

test('stranded vehicle recovery preserves the original log and cargo reservation',()=>{
  const g=new Campaign();
  g.cash=1500;
  const ride=g.acquireRide('pickup',{x:5,z:12})!;
  const wood=baseLog(g,5,12);wood.cargo=ride.id;
  g.logs.set(wood.id,wood);
  ride.x=206;ride.z=198;ride.fuel=0;ride.wear=100;
  const money=g.cash;
  assert.ok(g.recoverRide(ride));
  assert.equal(g.cash,money-18);
  assert.ok(ride.fuel>=20&&ride.wear<=65);
  assert.equal(g.logs.size,1);
  assert.equal(g.logs.get(wood.id)?.cargo,ride.id);
  const saved=Campaign.restore(validateSave(JSON.parse(JSON.stringify(g.snapshot()))));
  assert.equal(saved.logs.get(wood.id)?.cargo,saved.rides[0].id);
});

test('manual sawbench mode keeps a workpiece available until the player cranks it',()=>{
  const g=new Campaign();
  g.cash=480;
  const bench=build(g,'bench',0,5);
  assert.ok(g.buyUpgrade('09-01'));
  bench.manual=true;
  put(bench.input,{good:'timber',quantity:1,quality:.74,moisture:.60});
  run(g,5);
  assert.equal(getQuantity(bench.input),1);
  assert.equal(bench.jobs.length,0);
  assert.ok(g.crankBench(bench));
  run(g,5);
  assert.equal(getQuantity(bench.output,'boards'),2);
  assert.equal(getQuantity(bench.input),0);
});

test('wood-energy heat exchange reduces the live electrical draw of a kiln',()=>{
  const g=new Campaign();
  g.cash=280000;
  build(g,'bench',0,5);
  const retort=build(g,'charcoal',10,12);
  assert.ok(g.buyUpgrade('13-01'));
  build(g,'charcoalDrum',2,13);
  for(let n=2;n<=7;n++)assert.ok(g.buyUpgrade('13-'+String(n).padStart(2,'0')));
  build(g,'mill',-9,10);
  const kiln=build(g,'kiln',7,3);
  build(g,'generator',-13,3);
  run(g,1);
  assert.equal(kiln.gridFlow,5);
  put(retort.input,{good:'timber',quantity:2,quality:.8,moisture:.61});
  put(kiln.input,{good:'boards',quantity:4,quality:.85,moisture:.54});
  run(g,2);
  assert.ok(retort.jobs.length>0);
  assert.equal(kiln.gridFlow,2);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { Campaign, canWin, getQuantity, priceFor, put, take } from '../src/campaign';
import type { Log, Project } from '../src/campaign';
import { CELLS, TOTAL, facilities, recipes, species } from '../src/catalog';
import { applyLand, conversionLabel, defaultSoil, desertified, districtAt, height, homeDistrict, indexAt, noPressure, treesIn } from '../src/land';
import { validateSave } from '../src/storage';
import { upgrades } from '../src/upgrades';

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

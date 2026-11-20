import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium, firefox, webkit } from 'playwright';

const engine=process.env.BROWSER??'chromium';
const browsers={chromium,firefox,webkit};
if (!browsers[engine]) throw Error('Set BROWSER to chromium, firefox, or webkit.');
const base=process.env.TEST_URL??'http://127.0.0.1:4177';
const target=base+'/?review';
const server=process.env.TEST_URL?undefined:spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4177','--strictPort'],{stdio:'inherit'});
let browser;
const result='test-results';
const flags=engine==='chromium'?['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']:undefined;
await mkdir(result,{recursive:true});
const snapshots=await mkdtemp(join(tmpdir(),'clearcut-review-'));
const capture=process.env.CAPTURE==='1'||engine==='firefox';
const screenshot=(page,name)=>capture?page.screenshot({path:`${result}/${engine}-${name}.png`,timeout:20000}):Promise.resolve();
try{
  if(server) for(let i=0;i<75;i++){
    try{if((await fetch(base)).ok)break;}catch{}
    if(i===74) throw Error('Vite did not start.');
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  browser=await browsers[engine].launch({executablePath:process.env.BROWSER_BIN||undefined,headless:process.env.HEADED!=='1',args:flags,
    ...(engine==='firefox'?{firefoxUserPrefs:{'webgl.disabled':false,'webgl.force-enabled':true,'gfx.webrender.software':true}}:{})});
  const p=await browser.newPage({viewport:{width:960,height:660},deviceScaleFactor:1,acceptDownloads:true});
  p.setDefaultTimeout(35000);
  const errors=[];
  p.on('pageerror',error=>{errors.push(error.message);console.error('Browser page error:',error.stack);});
  p.on('console',message=>{if(message.type()==='error'&&!message.text().includes('favicon')) {const event=message.text()+' @ '+message.location().url;errors.push(event);console.error(event);}});
  const inspect=()=>p.evaluate(()=>window.clearcutReview());
  const wait=(f,arg)=>p.waitForFunction(f,arg,{timeout:42000,polling:45});
  const press=code=>p.keyboard.press(code);
  const click=name=>p.getByRole('button',{name,exact:true}).click();
  const select=(name,value)=>p.locator('.row').filter({hasText:name}).getByRole('combobox').selectOption(value);
  const move=async(axis,to)=>{
    const s=await inspect(),greater=s.player[axis]<to;
    const code=axis==='x'?(greater?'KeyD':'KeyA'):(greater?'KeyS':'KeyW');
    await p.keyboard.down(code);
    try{await wait(({axis,to,greater})=>greater?window.clearcutReview().player[axis]>=to:window.clearcutReview().player[axis]<=to,{axis,to,greater});}
    finally{await p.keyboard.up(code);}
  };
  await p.goto(target);
  console.log('Reviewing fresh campaign');
  await p.getByRole('button',{name:'Play campaign'}).waitFor();
  await screenshot(p,'menu');
  await click('Settings');
  await select('Graphics quality','low');
  await select('Look mode','drag');
  await p.locator('.row').filter({hasText:'Forward'}).getByRole('button',{name:'KeyW',exact:true}).click();
  await press('ArrowUp');
  await p.getByRole('button',{name:'ArrowUp',exact:true}).waitFor();
  await click('Close panel');
  await click('Play campaign');
  assert.equal((await inspect()).cash,0);
  assert.equal((await inspect()).tool,'knife');
  await p.keyboard.down('ArrowUp');
  await wait(()=>window.clearcutReview().player.z< -1.18);
  await p.keyboard.up('ArrowUp');
  await press('Space');
  await wait(()=>window.clearcutReview().observed.airborne>.20);
  await wait(()=>window.clearcutReview().observed.airborne===0);
  await press('Escape');
  await click('Settings');
  await click('Reset bindings');
  await click('Close panel');
  await p.mouse.move(480,330);
  await p.mouse.down();
  await wait(()=>window.clearcutReview().clock>.50);
  await p.mouse.up();
  assert.equal((await inspect()).stats.hits,0,'Out of range swing must miss');
  await move('z',-3.55);
  await p.getByText('Pioneer sapling',{exact:true}).waitFor();
  await p.mouse.down();
  await wait(()=>window.clearcutReview().stats.harvest===1);
  await p.mouse.up();
  const cut=await inspect();
  assert.ok(cut.stats.hits>=10&&cut.stats.hits<=14);
  assert.deepEqual(cut.removed,[cut.removed[0]]);
  assert.equal(cut.logs.length,1);
  await screenshot(p,'felled');
  await move('z',-6.95);
  await p.keyboard.down('KeyE');
  await p.locator('.hold-context').waitFor();
  await move('x',-6.50);
  await move('z',1.70);
  await wait(()=>window.clearcutReview().logs.some(l=>Math.hypot(l.x+6.5,l.z)<2.20));
  assert.equal((await inspect()).cash,0,'Dragging must not mint money');
  await p.keyboard.up('KeyE');
  await wait(()=>window.clearcutReview().logs.length===0);
  assert.equal((await inspect()).cash,0,'Payment must wait for the burn');
  await wait(()=>window.clearcutReview().cash>=15);
  const paid=await inspect();
  assert.equal(paid.stats.fire,1);
  await press('KeyU');
  await p.locator('.row').filter({hasText:'Rubberized Handle'}).getByRole('button',{name:'$15',exact:true}).click();
  await p.getByRole('button',{name:'Installed',exact:true}).waitFor();
  assert.equal((await inspect()).cash,paid.cash-15);
  const frozen=(await inspect()).clock;
  await p.waitForTimeout(300);
  assert.equal((await inspect()).clock,frozen,'Panel pauses the simulation');
  await screenshot(p,'upgrades');
  await click('Close panel');
  await press('Escape');
  await click('Save campaign');
  await p.getByText('Campaign saved',{exact:true}).waitFor();
  await p.reload();
  await click('Continue campaign');
  const resumed=await inspect();
  assert.deepEqual(resumed.removed,cut.removed);
  assert.equal(resumed.cash,paid.cash-15);
  assert.ok(resumed.ownedUpgrades.includes('01-01'));
  await press('KeyM');
  await p.getByRole('heading',{name:'Land survey'}).waitFor();
  await screenshot(p,'map');
  await click('Close panel');
  await p.setViewportSize({width:450,height:720});
  await press('Escape');
  await click('Settings');
  const panel=await p.locator('.panel').boundingBox();
  assert.ok(panel&&panel.x>=0&&panel.x+panel.width<=450);
  await screenshot(p,'narrow');
  const exported=p.waitForEvent('download');
  await click('Export');
  await (await exported).saveAs(join(snapshots,'campaign.json'));
  await p.setViewportSize({width:960,height:660});
  console.log('Reviewing imported refining fixture');
  const fixture=await inspect();
  fixture.player={x:0,z:9.5,yaw:0,pitch:-.03};
  fixture.cash=100;
  fixture.logs.push({
    id:fixture.nextId++,x:0,y:.35,z:7,q:[Math.SQRT1_2,0,0,Math.SQRT1_2],
    kind:0,length:2.6,kilograms:22,units:1,moisture:.67,quality:.76,
  });
  await p.locator('input[type=file]').setInputFiles({name:'refining-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
  await p.getByText('Campaign imported',{exact:true}).waitFor();
  await click('Close panel');
  await press('KeyB');
  await p.locator('.row').filter({hasText:'Field Sawbench'}).getByRole('button',{name:'$75',exact:true}).click();
  await p.mouse.click(480,330);
  await wait(()=>window.clearcutReview().sites.some(s=>s.kind==='bench'));
  await p.keyboard.down('KeyE');
  await p.locator('.hold-context').waitFor();
  await move('z',5.45);
  await p.getByText('Release the log here to deliver',{exact:true}).waitFor({timeout:42000});
  await p.keyboard.up('KeyE');
  await wait(()=>window.clearcutReview().sites.some(s=>s.kind==='bench'&&s.output.some(l=>l.good==='boards'&&l.quantity===2)));
  await press('KeyE');
  await p.getByRole('heading',{name:'Field Sawbench'}).waitFor();
  await click('Take batch');
  assert.equal((await inspect()).stock.find(lot=>lot.good==='boards').quantity,2);
  await screenshot(p,'sawbench');
  await click('Close panel');
  await move('x',7.15);
  await move('z',.35);
  await press('KeyE');
  await p.getByRole('heading',{name:'Timber Exchange'}).waitFor();
  await p.getByRole('button',{name:/Sell batch/}).click();
  const refined=await inspect();
  assert.ok(refined.cash>75);
  assert.equal(refined.stock.length,0);
  assert.equal(refined.stats.produced,2);
  console.log('Reviewing standing board order with newer closed orders');
  await click('Close panel');
  await press('Escape');
  await click('Settings');
  const boardOrder=await inspect();
  boardOrder.player={x:7.2,z:0,yaw:0,pitch:-.03};
  boardOrder.ownedUpgrades.push(...Array.from({length:12},(_,i)=>'14-'+String(i+1).padStart(2,'0')));
  boardOrder.stock.push({good:'boards',quantity:27,quality:.86,moisture:.4});
  boardOrder.contracts=Array.from({length:5},()=>({good:'paper',quantity:8,received:8,payout:350,deadline:boardOrder.clock+360,done:true,failed:false}));
  boardOrder.contracts.push({good:'boards',quantity:27,payout:1701,deadline:boardOrder.clock+1100,done:false,failed:false,plan:'supply'});
  await p.locator('input[type=file]').setInputFiles({name:'order-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(boardOrder))});
  await p.getByText('Campaign imported',{exact:true}).waitFor();
  await click('Close panel');
  await press('KeyE');
  await p.getByRole('heading',{name:'Timber Exchange'}).waitFor();
  for(let delivery=1;delivery<=3;delivery++){
    await click('Deliver 9 · $567');
    const delivered=await inspect();
    assert.equal(delivered.cash,boardOrder.cash+567*delivery);
    const order=delivered.contracts.find(deal=>deal.plan==='supply');
    assert.equal(order.received,9*delivery);
    assert.equal(order.done,delivery===3);
  }
  assert.equal((await inspect()).stock.length,0);
  await screenshot(p,'standing-order');
  console.log('Reviewing vehicle loading, driving, and delivery');
  await click('Close panel');
  await press('Escape');
  await click('Settings');
  const fleetTest=await inspect();
  fleetTest.player={x:0,z:13,yaw:0,pitch:-.03};
  fleetTest.cash=1000;
  fleetTest.logs.push({id:fleetTest.nextId++,x:.2,y:.32,z:9.8,q:[Math.SQRT1_2,0,0,Math.SQRT1_2],
    kind:0,length:2.6,kilograms:22,units:1,moisture:.65,quality:.76});
  await p.locator('input[type=file]').setInputFiles({name:'fleet-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fleetTest))});
  await wait(()=>window.clearcutReview().cash===1000);
  await click('Close panel');
  await press('KeyB');
  await p.locator('.row').filter({hasText:'Field Pickup'}).getByRole('button',{name:'$680',exact:true}).click();
  await p.mouse.click(480,330);
  await wait(()=>window.clearcutReview().rides.some(v=>v.kind==='pickup'));
  await move('z',10.55);
  await press('KeyL');
  const loaded=await inspect();
  assert.equal(loaded.logs[0].cargo,loaded.rides[0].id);
  await screenshot(p,'pickup-loaded');
  await press('KeyF');
  await move('z',4.85);
  await press('KeyL');
  await wait(()=>window.clearcutReview().logs.length===0);
  await wait(()=>window.clearcutReview().stats.produced===4);
  await press('KeyF');
  console.log('Reviewing wheelbarrow, sled, and cart delivery in one campaign');
  await press('Escape');
  await click('Settings');
  const manual=await inspect();
  manual.player={x:-8.2,z:5.1,yaw:0,pitch:-.03};
  manual.ownedUpgrades.push(...Array.from({length:7},(_,i)=>'03-0'+(i+1)));
  const equipment=[['wheelbarrow','Logging Wheelbarrow',5.1],['sled','Skid Sled',9.45],['cart','Hand Cart',13.5]];
  for(const [kind,,z] of equipment){
    manual.rides.push({id:'v'+manual.nextId++,kind,x:-8.2,z,yaw:0,fuel:100,wear:0});
    manual.logs.push({id:manual.nextId++,x:-8.2,y:.35,z:z+.7,q:[Math.SQRT1_2,0,0,Math.SQRT1_2],
      kind:0,length:2.6,kilograms:22,units:1,moisture:.65,quality:.76});
  }
  await p.locator('input[type=file]').setInputFiles({name:'manual-hauling-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(manual))});
  await wait(()=>window.clearcutReview().rides.some(v=>v.kind==='cart'));
  await click('Close panel');
  for(const [index,[kind,name,z]] of equipment.entries()){
    if(index>0){
      await move('x',-8.15);
      await move('z',z-.1);
    }
    const before=(await inspect()).stats.fire;
    const vehicle=manual.rides.find(ride=>ride.kind===kind);
    await press('KeyL');
    await wait(id=>window.clearcutReview().logs.some(log=>log.cargo===id),vehicle.id);
    await press('KeyF');
    await p.getByText('Manual transport',{exact:true}).waitFor();
    await p.locator('.tool-details').getByText(name,{exact:true}).waitFor();
    await move('z',.8);
    await press('KeyL');
    await wait(previous=>window.clearcutReview().stats.fire===previous+1,before);
    await press('KeyF');
  }
  await screenshot(p,'manual-hauling');
  console.log('Reviewing trailer coupling, driving, and loaded rig recovery');
  await press('Escape');
  await click('Settings');
  const towingTest=await inspect();
  towingTest.player={x:-1.7,z:12,yaw:0,pitch:-.03};
  towingTest.ownedUpgrades.push(...Array.from({length:6},(_,i)=>'06-0'+(i+1)));
  const tow={id:'v'+towingTest.nextId++,kind:'truck',x:-1.7,z:12,yaw:0,fuel:100,wear:0};
  const unhitched={id:'v'+towingTest.nextId++,kind:'trailer',x:-1.7,z:16.7,yaw:0,fuel:100,wear:0};
  towingTest.rides.push(tow,unhitched);
  const trailerLog=towingTest.nextId++;
  towingTest.logs.push({id:trailerLog,x:unhitched.x,y:.79,z:unhitched.z,q:[Math.SQRT1_2,0,0,Math.SQRT1_2],
    kind:0,length:2.6,kilograms:22,units:1,moisture:.65,quality:.76,cargo:unhitched.id});
  await p.locator('input[type=file]').setInputFiles({name:'loaded-trailer-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(towingTest))});
  await wait(id=>window.clearcutReview().rides.some(v=>v.id===id),unhitched.id);
  await click('Close panel');
  await press('KeyF');
  await press('KeyH');
  await wait(({tow,trailer})=>{
    const save=window.clearcutReview();
    const vehicle=save.rides.find(v=>v.id===trailer);
    return vehicle.hitch===tow&&save.clock>=vehicle.hitchReady;
  },{tow:tow.id,trailer:unhitched.id});
  await move('z',8.4);
  const driven=await inspect();
  assert.ok(driven.rides.find(v=>v.id===unhitched.id).z<unhitched.z-.5);
  assert.equal(driven.logs.find(l=>l.id===trailerLog).cargo,unhitched.id);
  await press('KeyQ');
  await p.locator('.row').filter({hasText:'Timber Trailer'}).filter({hasText:'Coupled to Logging Truck'})
    .getByRole('button',{name:'Recover rig · $18',exact:true}).click();
  await p.getByText('Recovered Logging Truck and trailer to Timber Exchange',{exact:true}).waitFor();
  const recovered=await inspect();
  const loadedTrailer=recovered.rides.find(v=>v.id===unhitched.id);
  const recoveredTruck=recovered.rides.find(v=>v.id===tow.id);
  const wood=recovered.logs.find(l=>l.id===trailerLog);
  assert.equal(recovered.cash,driven.cash-18);
  assert.equal(loadedTrailer.hitch,tow.id);
  assert.ok(Math.abs(Math.hypot(recoveredTruck.x-loadedTrailer.x,recoveredTruck.z-loadedTrailer.z)-5)<.001);
  assert.ok(Math.hypot(wood.x-loadedTrailer.x,wood.z-loadedTrailer.z)<1);
  await click('Close panel');
  console.log('Reviewing independent factory lanes with an occupied depot');
  await press('Escape');
  await click('Settings');
  const sorting=await inspect();
  sorting.player={x:1,z:12.3,yaw:0,pitch:-.03};
  sorting.ownedUpgrades.push(...Array.from({length:6},(_,i)=>'15-0'+(i+1)));
  const addSite=(kind,x,z,output=[])=>{
    const site={id:'s'+sorting.nextId++,kind,x,z,input:[],output,jobs:[],on:true,fuel:100,status:'Idle'};
    sorting.sites.push(site);
    return site;
  };
  const storage=addSite('depot',-12,11,[{good:'timber',quantity:260,quality:.75,moisture:.5}]);
  addSite('generator',11,12);
  const sorter=addSite('sortGate',1,10,[
    {good:'boards',quantity:60,moisture:.32,quality:.88},
    {good:'chips',quantity:12,moisture:.44,quality:.73},
  ]);
  sorter.link=sorting.sites.find(s=>s.kind==='market').id;
  sorter.secondary=storage.id;
  sorter.sortGood='chips';
  sorting.logs=sorting.logs.filter(l=>l.cargo);
  await p.locator('input[type=file]').setInputFiles({name:'factory-routing-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(sorting))});
  await wait(id=>window.clearcutReview().sites.some(site=>site.id===id),sorter.id);
  await click('Close panel');
  await wait(id=>window.clearcutReview().sites.find(s=>s.id===id).shipped>=4,sorter.id);
  await press('KeyE');
  await p.getByRole('heading',{name:'Material Sorting Gate',exact:true}).waitFor();
  await p.locator('.row').filter({hasText:'Primary · Timber Exchange'}).getByText('Moved 4 × Green boards',{exact:true}).waitFor();
  await p.locator('.row').filter({hasText:'Alternate · Freight Depot'}).getByText('Blocked · receiver full',{exact:true}).waitFor();
  await screenshot(p,'factory-lanes');
  await click('Disconnect primary');
  assert.equal((await inspect()).sites.find(s=>s.id===sorter.id).link,undefined);
  assert.equal((await inspect()).sites.find(s=>s.id===sorter.id).secondary,storage.id);
  await click('Close panel');
  console.log('Reviewing excavation in the streamed 3D world');
  await press('Escape');
  await click('Settings');
  const excavation=await inspect();
  excavation.player={x:8,z:14,yaw:0,pitch:-.09};
  excavation.cash=24600;
  excavation.ownedUpgrades.push(...Array.from({length:6},(_,i)=>'08-0'+(i+1)));
  await p.locator('input[type=file]').setInputFiles({name:'excavation-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(excavation))});
  await wait(()=>window.clearcutReview().cash===24600);
  await click('Close panel');
  await press('KeyB');
  await p.locator('.row').filter({hasText:'Heavy Excavator'}).getByRole('button',{name:'$14,200',exact:true}).click();
  await p.mouse.click(480,330);
  await wait(()=>window.clearcutReview().rides.some(v=>v.kind==='excavator'));
  await move('z',10.90);
  await press('KeyF');
  await p.mouse.down();
  await wait(()=>window.clearcutReview().elevation.some(([,depth])=>depth<-.7));
  await p.mouse.up();
  const cutTerrain=await inspect();
  assert.ok(cutTerrain.rides.some(v=>v.kind==='excavator'&&v.freight?.quantity>=2));
  await screenshot(p,'excavation');
  await press('KeyF');
  console.log('Reviewing final-cell settlement and archive');
  await press('Escape');
  await click('Settings');
  const census=await inspect();
  const settled={vegetation:0,moisture:0,groundwater:0,fertility:0,heat:.12,pollution:0,erosion:1,substrate:1,
    stable:60,stage:6,clearedFor:400,lastTick:census.clock};
  census.soil=Array.from({length:65536},(_,i)=>[i,i===65535?{...settled,stable:59,stage:5}:settled]);
  const fixturePath=join(snapshots,'final-cell.json');
  await writeFile(fixturePath,JSON.stringify(census));
  await p.locator('input[type=file]').setInputFiles(fixturePath);
  await p.getByText('Campaign imported',{exact:true}).waitFor();
  await click('Close panel');
  await p.getByRole('heading',{name:'The last jungle',exact:true}).waitFor({timeout:80000});
  await p.getByText('65,536',{exact:true}).waitFor();
  assert.ok((await inspect()).won);
  await screenshot(p,'victory');
  await p.setViewportSize({width:1920,height:1080});
  const large=await p.locator('.panel').boundingBox();
  assert.ok(large&&large.x>=0&&large.y>=0&&large.x+large.width<=1920&&large.y+large.height<=1080);
  await p.setViewportSize({width:960,height:660});
  await click('New Game+');
  const plus=await inspect();
  assert.equal(plus.won,false);
  assert.equal(plus.cash,0);
  assert.notEqual(plus.seed,census.seed);
  await press('Escape');
  await click('Settings');
  const completedArchive=p.locator('.row').filter({hasText:'Campaign '+census.seed});
  await completedArchive.getByRole('button',{name:'Restore archive'}).click();
  await p.getByText('Archived campaign restored',{exact:true}).waitFor();
  assert.ok((await inspect()).won);
  await click('Close panel');
  assert.equal(await p.getByRole('heading',{name:'The last jungle',exact:true}).isVisible(),false);
  await press('Escape');
  await click('Settings');
  await select('Look mode','pointer');
  await click('Close panel');
  await p.waitForFunction(()=>document.pointerLockElement?.id==='world'||
    document.querySelector('.notices')?.textContent?.includes('Pointer lock unavailable'),undefined,{timeout:14000});
  console.log('Pointer lock: '+(await p.evaluate(()=>document.pointerLockElement?.id==='world')?'captured':'fallback displayed'));
  assert.deepEqual(errors,[]);
  if(engine==='chromium'){
    console.log('Reviewing touchscreen movement and harvesting');
    const mobile=await browser.newPage({viewport:{width:430,height:760},deviceScaleFactor:1,hasTouch:true,isMobile:true});
    await mobile.bringToFront();
    await mobile.goto(target);
    await mobile.getByRole('button',{name:'Play campaign',exact:true}).tap();
    const touch=await mobile.context().newCDPSession(mobile);
    async function hold(label,until) {
      const rect=await mobile.getByRole('button',{name:label,exact:true}).boundingBox();
      assert.ok(rect);
      await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:1}]});
      try{await mobile.waitForFunction(until,undefined,{timeout:45000});}
      finally{await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
    }
    await hold('Move forward',()=>window.clearcutReview().player.z<-3.65);
    await mobile.getByText('Pioneer sapling',{exact:true}).waitFor();
    await hold('Swing',()=>window.clearcutReview().stats.harvest===1);
    assert.equal(await mobile.evaluate(()=>window.clearcutReview().logs.length),1);
    const rope=mobile.getByRole('button',{name:'Rope',exact:true});
    assert.equal(await rope.isVisible(),false);
    const ropeTest=await mobile.evaluate(()=>window.clearcutReview());
    ropeTest.ownedUpgrades.push('03-01');
    ropeTest.player.z=-6.95;
    await mobile.getByRole('button',{name:/Pause$/}).tap();
    await mobile.getByRole('button',{name:'Settings',exact:true}).tap();
    await mobile.locator('input[type=file]').setInputFiles({name:'touch-rope-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(ropeTest))});
    await mobile.getByText('Campaign imported',{exact:true}).waitFor();
    await mobile.getByRole('button',{name:'Close panel',exact:true}).tap();
    await rope.tap();
    await mobile.locator('.hold-context').waitFor();
    await mobile.getByRole('button',{name:'Drop',exact:true}).tap();
    await mobile.locator('.hold-context').waitFor({state:'hidden'});
    assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),430);
    await screenshot(mobile,'touch');
    await mobile.close();
  }
  console.log(`${engine}: menu, WebGL, walk, swing, fell, haul, burn, upgrade, jump, remapping, pause, reload, map, resize, save export/import, sawbench placement, physical feed, market sale, vehicle delivery, excavation, victory and New Game+ archives passed.`);
} catch(error) {
  const page=browser?.contexts()[0]?.pages()[0];
  if(page){
    await page.screenshot({path:`${result}/${engine}-failure.png`,timeout:3000}).catch(()=>{});
    console.dir(await page.evaluate(()=>{
      const save=window.clearcutReview?.();
      return {text:document.body.innerText.slice(0,2300),save:save?{...save,soil:save.soil.slice(0,8)}:undefined};
    }).catch(()=>null),{depth:4,maxArrayLength:20});
  }
  throw error;
} finally {
  await browser?.close();
  server?.kill();
}

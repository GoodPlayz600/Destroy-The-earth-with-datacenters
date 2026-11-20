import assert from 'node:assert/strict';
import { mkdtemp, mkdir } from 'node:fs/promises';
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
  p.on('console',message=>{if(message.type()==='error'&&!message.text().includes('favicon')) errors.push(message.text());});
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
  await p.getByRole('button',{name:'Play campaign'}).waitFor();
  await screenshot(p,'menu');
  await click('Settings');
  await select('Graphics quality','low');
  await select('Look mode','drag');
  await click('Close panel');
  await click('Play campaign');
  assert.equal((await inspect()).cash,0);
  assert.equal((await inspect()).tool,'knife');
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
  await wait(()=>window.clearcutReview().logs.some(l=>Math.abs(l.z-3.75)<1.3));
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
  assert.deepEqual(errors,[]);
  console.log(`${engine}: menu, WebGL, walk, swing, fell, haul, burn, upgrade, pause, reload, map, resize, save export/import, sawbench placement, physical feed and market sale passed.`);
} catch(error) {
  const page=browser?.contexts()[0]?.pages()[0];
  if(page){
    await page.screenshot({path:`${result}/${engine}-failure.png`,timeout:3000}).catch(()=>{});
    console.error(await page.evaluate(()=>({text:document.body.innerText.slice(0,2300),save:window.clearcutReview?.()})).catch(()=>null));
  }
  throw error;
} finally {
  await browser?.close();
  server?.kill();
}

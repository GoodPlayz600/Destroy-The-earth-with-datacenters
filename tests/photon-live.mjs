import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { Campaign } from '../src/campaign.ts';
import { newCode,roomBackup } from '../src/coop-wire.ts';

const origin='https://destroy-the-earth-with-datacenters.steepyak8.chatgpt.site/';
const browser=await chromium.launch({headless:false,args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const viewport={width:760,height:500};
const hostContext=await browser.newContext({viewport});
const host=await hostContext.newPage();
await host.addInitScript(()=>{
  const raf=window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame=(frame)=>raf(function gate(time){
    if(window.stopHostRendering)raf(gate);
    else frame(time);
  });
});
const guestContext=await browser.newContext({viewport});
const guest=await guestContext.newPage();
for(const p of [host,guest]){
  p.setDefaultTimeout(30000);
  await p.addInitScript(()=>localStorage.setItem('clearcut.preferences',JSON.stringify({quality:'low',look:'drag'})));
  p.on('pageerror',e=>console.log('Page error:',e.message));
  p.on('requestfailed',r=>console.log('Request failed:',new URL(r.url()).pathname,r.failure()?.errorText));
}
const click=async(p,name)=>{await p.bringToFront();await p.getByRole('button',{name,exact:true}).click();};
const lobby=p=>p.getByRole('dialog',{name:'Multiplayer'});
const status=p=>p.locator('body').innerText({timeout:5000}).then(text=>text.slice(-1200));
const open=async(p)=>{await p.goto(origin);await click(p,'Multiplayer');};
const roomDetails=async(p)=>{await p.keyboard.press('Escape');await click(p,'Room details');};
const escape=p=>p.keyboard.press('Escape');
const pageLog=p=>p.on('console',msg=>{
  if(msg.type()==='error'||/RealtimeCore.*(ERROR|Connection)/.test(msg.text()))
    console.log(msg.text().replace(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi,'[id]'));
});
pageLog(host);pageLog(guest);
try {
  await open(guest);
  await open(host);
  const code=newCode();
  const fixture=new Campaign(20831);
  fixture.cash=2000;
  fixture.player={x:-1.6,z:-3.4,yaw:0,pitch:-.03};
  fixture.stock.push({good:'timber',quantity:1,quality:.82,moisture:.25});
  Object.assign(fixture.sites.find(s=>s.kind==='market'),{x:0,z:-2});
  assert.ok(fixture.build('bench',{x:2.8,z:-3.4}));
  fixture.rides.push({id:'v'+fixture.nextId++,kind:'cart',x:2.6,z:-3.4,yaw:0,fuel:100,wear:0});
  const wallet='$'+fixture.cash.toLocaleString('en-US');
  await lobby(host).locator('input[type=file]').setInputFiles({
    name:'room-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(roomBackup(code,'us',fixture.snapshot()))),
  });
  await lobby(host).getByText(code,{exact:true}).waitFor();
  await click(host,'Reopen');
  await lobby(host).waitFor({state:'hidden',timeout:35000});
  await roomDetails(host);
  assert.equal(await lobby(host).locator('.coop-code').innerText(),code);
  console.log('Host reopened a real Photon room from a multiplayer backup.');

  await guest.bringToFront();
  await lobby(guest).getByLabel('Room code').fill(code);
  await click(guest,'Join room');
  await lobby(guest).waitFor({state:'hidden',timeout:45000});
  await guest.getByText(wallet,{exact:true}).waitFor();
  console.log('Guest joined and loaded the host checkpoint.');

  await guest.keyboard.press('Escape');
  assert.equal(await guest.getByRole('button',{name:'Host menu',exact:true}).count(),0);
  await escape(guest);

  await guest.mouse.move(380,250);
  await guest.mouse.down();
  try {await guest.getByText('Make the first sale',{exact:true}).waitFor({timeout:26000});}
  finally {await guest.mouse.up();}
  console.log('Guest harvested a tree using the shared field controls.');

  await guest.keyboard.press('KeyT');
  await guest.getByRole('heading',{name:'Timber Exchange',exact:true}).waitFor();
  await click(guest,'Sell one');
  await guest.getByRole('button',{name:'Sell one',exact:true}).waitFor({state:'hidden'});
  await escape(guest);
  console.log('Guest used the full trade menu and sold shared stock.');

  await guest.keyboard.down('KeyD');
  try {await guest.waitForFunction(()=>document.querySelector('.compass')?.textContent?.includes('3 E'));}
  finally {await guest.keyboard.up('KeyD');}
  await guest.keyboard.press('KeyT');
  await guest.getByRole('heading',{name:'Field Sawbench',exact:true}).waitFor();
  await click(guest,'Stop');
  await guest.getByRole('button',{name:'Start',exact:true}).waitFor();
  console.log('Guest used the full station menu and switched the sawbench off.');

  await click(host,'Close multiplayer');
  await click(host,'Host menu');
  const hostMenu=host.getByRole('dialog',{name:'Host menu'});
  await hostMenu.waitFor();
  const stations=hostMenu.getByLabel('Stations & logistics');
  assert.equal(await stations.isChecked(),true);
  assert.equal(await hostMenu.getByLabel('Vehicles & cargo').isChecked(),true);
  await stations.uncheck();
  await guest.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.disabled&&b.textContent==='Start'));
  await click(host,'Restore full access');
  await guest.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>!b.disabled&&b.textContent==='Start'));
  await click(guest,'Start');
  await guest.getByRole('button',{name:'Stop',exact:true}).waitFor();
  console.log('The individual station restriction propagated and full access restored the control.');

  await guest.bringToFront();
  await escape(guest);
  await guest.keyboard.press('KeyF');
  await guest.getByText('Manual transport',{exact:true}).waitFor();
  const before=await guest.locator('.compass').textContent();
  await guest.keyboard.down('KeyS');
  try {await guest.waitForFunction(old=>document.querySelector('.compass')?.textContent!==old,before);}
  finally {await guest.keyboard.up('KeyS');}
  await guest.keyboard.press('KeyQ');
  await guest.getByRole('heading',{name:'Equipment',exact:true}).waitFor();
  const position=await guest.locator('.compass').textContent();
  await guest.locator('.overlay .row').filter({hasText:'Hand Cart'}).getByRole('button',{name:'Recover · $18',exact:true}).click();
  await guest.waitForFunction(old=>document.querySelector('.compass')?.textContent!==old,position);
  await escape(guest);
  await guest.keyboard.press('KeyF');
  await guest.getByText('Manual transport',{exact:true}).waitFor({state:'hidden'});
  console.log('Guest entered, drove, recovered and exited the shared Hand Cart.');
} catch(error) {
  console.log('Host status:',await status(host).catch(()=>null));
  console.log('Guest status:',await status(guest).catch(()=>null));
  throw error;
} finally { await browser.close(); }

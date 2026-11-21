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
  await guest.getByText('$2,000',{exact:true}).waitFor();
  console.log('Guest joined and loaded the host checkpoint.');

  const cover=await host.context().newPage();
  await cover.bringToFront();
  await host.evaluate(()=>{window.stopHostRendering=true;});
  await guest.bringToFront();

  await guest.keyboard.press('KeyQ');
  await guest.getByRole('heading',{name:'Equipment'}).waitFor();
  await escape(guest);
  await guest.keyboard.press('KeyU');
  const upgrade=guest.locator('.overlay .row').filter({hasText:'Rubberized Handle'});
  await upgrade.getByRole('button',{name:'$15',exact:true}).click();
  await upgrade.getByRole('button',{name:'Installed',exact:true}).waitFor();
  await escape(guest);
  console.log('Guest opened gear and bought an upgrade with the host paused and no host animation frames.');

  await guest.keyboard.press('KeyB');
  await guest.locator('.overlay .row').filter({hasText:'Field Sawbench'}).getByRole('button',{name:'$75',exact:true}).click();
  await guest.locator('#world').click({position:{x:380,y:250}});
  await guest.getByText('Field Sawbench installed.',{exact:true}).waitFor();
  console.log('Guest built a shared sawbench without host animation frames.');

  await guest.mouse.move(380,250);
  await guest.mouse.down();
  try {await guest.getByText('Make the first sale',{exact:true}).waitFor({timeout:26000});}
  finally {await guest.mouse.up();}
  await guest.keyboard.down('KeyW');
  try {await guest.getByText('Felled pioneer sapling',{exact:true}).waitFor({timeout:6000});}
  finally {await guest.keyboard.up('KeyW');}
  await guest.keyboard.down('KeyE');
  try {
    await guest.getByText(/Log grabbed/).waitFor();
    await guest.keyboard.down('KeyS');
    await guest.getByText(/Log grabbed/).waitFor({state:'hidden',timeout:8000});
    await guest.keyboard.up('KeyS');
  }finally {await guest.keyboard.up('KeyS');await guest.keyboard.up('KeyE');}
  console.log('Guest harvested and moved the fallen log without resuming the host.');

  await guest.keyboard.press('KeyJ');
  await guest.getByRole('heading',{name:'Field journal'}).waitFor();
  await escape(guest);
  await host.evaluate(()=>{window.stopHostRendering=false;});
  await click(host,'Save and close room');
  await lobby(guest).getByText(code,{exact:true}).waitFor({timeout:20000});
  await lobby(host).getByText(code,{exact:true}).waitFor();
  await click(host,'Reopen');
  await lobby(host).waitFor({state:'hidden',timeout:35000});
  await click(guest,'Join room');
  await lobby(guest).waitFor({state:'hidden',timeout:45000});
  await guest.keyboard.press('KeyU');
  await upgrade.getByRole('button',{name:'Installed',exact:true}).waitFor();
  console.log('The guest purchase survived closing and reopening the room.');
} catch(error) {
  console.log('Host status:',await status(host).catch(()=>null));
  console.log('Guest status:',await status(guest).catch(()=>null));
  throw error;
} finally { await browser.close(); }

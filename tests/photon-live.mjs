import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const origin='https://destroy-the-earth-with-datacenters.steepyak8.chatgpt.site/';
const browser=await chromium.launch({headless:false,args:['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const host=await browser.newPage();
const guest=await browser.newPage();
const click=(p,name)=>p.getByRole('button',{name,exact:true}).click();
const lobby=p=>p.getByRole('dialog',{name:'Multiplayer'});
const status=p=>lobby(p).getByRole('status').textContent();
const open=async(p)=>{await p.goto(origin);await click(p,'Multiplayer');};
const roomDetails=async(p)=>{await p.keyboard.press('Escape');await click(p,'Room details');};
const pageLog=p=>p.on('console',msg=>{
  if(msg.type()==='error'||/RealtimeCore.*(ERROR|Connection)/.test(msg.text()))
    console.log(msg.text().replace(/[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}/gi,'[id]'));
});
pageLog(host);pageLog(guest);
try {
  await open(host);
  await click(host,'Host new room');
  await lobby(host).waitFor({state:'hidden',timeout:30000});
  await roomDetails(host);
  const code=await lobby(host).locator('.coop-code').innerText();
  assert.match(code,/^[A-Z2-9]{10}$/);
  console.log('Host created a live Photon room.');
  await open(guest);
  await lobby(guest).getByLabel('Room code').fill(code);
  await click(guest,'Join room');
  await lobby(guest).waitFor({state:'hidden',timeout:45000});
  await roomDetails(guest);
  await lobby(guest).getByText(/Guest.*2\/4 connected/).waitFor();
  await click(guest,'Close multiplayer');
  await click(host,'Save and close room');
  await lobby(guest).getByText(code,{exact:true}).waitFor({timeout:20000});
  await lobby(host).getByText(code,{exact:true}).waitFor();
  await click(host,'Reopen');
  await lobby(host).waitFor({state:'hidden',timeout:30000});
  await click(guest,'Join room');
  await lobby(guest).waitFor({state:'hidden',timeout:45000});
  await roomDetails(guest);
  await lobby(guest).getByText(/Guest.*2\/4 connected/).waitFor();
  console.log('Guest synced, persisted the campaign on host close, and rejoined the reopened room.');
} catch(error) {
  console.log('Host status:',await status(host).catch(()=>null));
  console.log('Guest status:',await status(guest).catch(()=>null));
  throw error;
} finally { await browser.close(); }

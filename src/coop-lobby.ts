import type { Launch } from './coop';
import { coopSlot, newCode, readRoomBackup, roomBackup, roomCode, validCode, validRegion } from './coop-wire';
import { downloadJson, listRoomSlots, loadCampaign, saveRoomCheckpoint } from './storage';

type Lobby = {
  launch:(config:Launch, source:'new'|'solo'|'saved')=>Promise<void>;
  canCopy:()=>boolean;
  live:()=>{code:string;region:string;host:boolean;count:number}|undefined;
  leave:()=>void; save:()=>void; download:()=>void;
};

function create<K extends keyof HTMLElementTagNameMap>(tag:K, name='', value='') {
  const element=document.createElement(tag);
  element.className=name;element.textContent=value;
  return element;
}
function button(label:string, action:()=>void, primary=false) {
  const element=create('button','button '+(primary?'primary':'small'),label);
  element.type='button';element.addEventListener('click',action);
  return element;
}
function field(title:string, options:Partial<HTMLInputElement>) {
  const label=create('label','coop-field',title);
  const input=create('input');
  Object.assign(input,options);
  label.append(input);
  return {label,input};
}

export class CoopLobby {
  private dialog=create('dialog','coop-dialog panel');
  private content=create('div','panel-content stack');
  private status=create('p','coop-status');
  private closeButton=button('×',()=>this.close());
  private busy=false;
  private readonly deploymentId=(import.meta.env.VITE_PHOTON_APP_ID??'').trim();
  private app=field('Photon Realtime App ID',{placeholder:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',spellcheck:false,autocomplete:'off',maxLength:36});
  private region=field('Photon region',{placeholder:'us',spellcheck:false,maxLength:16});
  private code=field('Room code',{placeholder:'10-character invite code',spellcheck:false,maxLength:10});
  private slots=create('div','coop-slots');

  constructor(root:HTMLElement) {
    this.app.input.value=this.deploymentId;
    this.region.input.value=import.meta.env.VITE_PHOTON_REGION?.trim()||'us';
    try {
      this.app.input.value=this.deploymentId||localStorage.getItem('clearcut.photonApp')||'';
      this.region.input.value=localStorage.getItem('clearcut.photonRegion')||this.region.input.value;
    } catch { /* Settings are still usable without persistent browser storage. */ }
    this.closeButton.className='close';
    this.closeButton.setAttribute('aria-label','Close multiplayer');
    const caption=create('div');
    caption.append(create('span','label','CLEARCUT FIELD OPERATIONS'),create('h2','','Multiplayer'));
    const header=create('header','panel-header');
    header.append(caption,this.closeButton);
    this.status.setAttribute('role','status');
    this.dialog.setAttribute('aria-label','Multiplayer');
    this.dialog.append(header,this.content);
    this.dialog.addEventListener('cancel',event=>{if(this.busy)event.preventDefault();});
    root.append(this.dialog);
  }

  get open() {return this.dialog.open;}
  close() {if(!this.busy)this.dialog.close();}
  message(text:string) {this.status.textContent=text;}

  show(actions:Lobby,message='') {
    if(this.busy)return;
    const live=actions.live();
    this.content.replaceChildren();
    this.message(message);
    if(!this.dialog.open)this.dialog.showModal();
    if(live) {
      const code=create('strong','coop-code',live.code);
      const metadata=create('p','sub',`${live.host?'Hosting':'Guest'} · ${live.region.toUpperCase()} · ${live.count}/4 connected`);
      const copy=button('Copy invite',()=>{
        const url=new URL(location.href);
        url.searchParams.set('room',live.code);
        url.searchParams.set('region',live.region);
        if(!navigator.clipboard){this.message(`Share room ${live.code} in region ${live.region}.`);return;}
        void navigator.clipboard.writeText(url.toString()).then(()=>this.message('Invite link copied.')).catch(()=>this.message(`Share room ${live.code} in region ${live.region}.`));
      });
      const controls=create('div','coop-actions');
      controls.append(copy,button('Save checkpoint',actions.save),button('Download room backup',actions.download));
      this.content.append(code,metadata,controls,button(live.host?'Save and close room':'Leave room',()=>{
        this.close();actions.leave();
      }),this.status);
      return;
    }
    const query=new URLSearchParams(location.search);
    const invite=roomCode(query.get('room')??'');
    const inviteRegion=(query.get('region')??'').toLowerCase();
    if(!this.code.input.value&&validCode(invite)){
      this.code.input.value=invite;
      if(validRegion(inviteRegion))this.region.input.value=inviteRegion;
    }
    const launch=(source:'new'|'solo'|'saved'|'join')=>this.run(async()=>{
      const appId=this.app.input.value.trim();
      if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(appId))
        throw Error('Enter the App ID of a Photon Realtime application.');
      const region=this.region.input.value.trim().toLowerCase();
      const code=source==='new'||source==='solo'?newCode():roomCode(this.code.input.value);
      if(!validRegion(region))throw Error('Enter a Photon region such as us.');
      if(!validCode(code))throw Error('Enter a 10-character room code.');
      try {
        if(!this.deploymentId)localStorage.setItem('clearcut.photonApp',appId);
        localStorage.setItem('clearcut.photonRegion',region);
      } catch { /* Network play does not depend on local preferences. */ }
      await actions.launch({mode:source==='join'?'join':'host',appId,region,code},source==='join'?'new':source);
      this.dialog.close();
    },'Connecting to Photon…');
    const meta=create('p','sub','Private campaigns for up to four players. Your crew shares one world, balance and construction budget.');
    this.content.append(meta);
    if(!this.deploymentId)this.content.append(this.app.label);
    const inputs=create('div','coop-inputs');
    inputs.append(this.region.label,this.code.label);
    const main=create('div','coop-actions');
    main.append(button('Join room',()=>void launch('join'),true),button('Host new room',()=>void launch('new')));
    if(actions.canCopy())main.append(button('Host a copy of solo',()=>void launch('solo')));
    const imported=create('input');imported.type='file';imported.accept='.json,application/json';imported.hidden=true;
    imported.addEventListener('change',()=>{const file=imported.files?.[0];if(!file)return;
      void this.run(async()=>{
        if(file.size>60*1024*1024)throw Error('Room backup is too large.');
        const {code,region,save}=readRoomBackup(JSON.parse(await file.text()));
        await saveRoomCheckpoint(save,coopSlot(region,code));
        await this.saved(launch);
        this.message(`Room ${code} is available under Saved rooms.`);
      },'Importing checkpoint…').finally(()=>{imported.value='';});
    });
    const section=create('section','section');
    section.append(create('h3','','Saved rooms'),this.slots,button('Import room backup',()=>imported.click()),imported);
    this.content.append(inputs,main,section,this.status);
    void this.saved(launch).catch(()=>this.message('Local room saves could not be read.'));
  }

  private async saved(launch:(mode:'saved')=>Promise<void>) {
    const keys=await listRoomSlots();
    this.slots.replaceChildren();
    if(!keys.length)this.slots.append(create('p','sub','Your room checkpoints will appear here.'));
    for(const slot of keys.reverse()){
      const code=slot.slice(-10),region=slot.slice(5,-11);
      const row=create('div','row');
      const meta=create('div','row-info');
      meta.append(create('strong','',code),create('small','',region.toUpperCase()));
      const controls=create('div','row-actions');
      controls.append(button('Reopen',()=>{
        this.region.input.value=region;this.code.input.value=code;
        void launch('saved');
      }),button('Download',()=>void this.run(async()=>{
        const save=await loadCampaign(slot);
        if(!save)throw Error('That checkpoint is unavailable.');
        downloadJson(roomBackup(code,region,save),`clearcut-room-${code}.json`);
        this.message('Room backup downloaded.');
      },'Reading checkpoint…')));
      row.append(meta,controls);
      this.slots.append(row);
    }
  }

  private async run(operation:()=>Promise<void>, message:string) {
    if(this.busy)return;
    this.busy=true;
    this.message(message);
    const controls=[this.closeButton,...this.content.querySelectorAll<HTMLButtonElement|HTMLInputElement>('button,input')];
    controls.forEach(item=>{item.disabled=true;});
    try {await operation();}
    catch(error){this.message(error instanceof Error?error.message:'The multiplayer operation failed.');}
    finally {this.busy=false;controls.forEach(item=>{item.disabled=false;});}
  }
}

import { allPermissions, permissionKeys, roomPermissions, hasPermission } from './room-permissions';
import type { CoopRoom } from './coop';

export class HostMenu {
  readonly dialog=document.createElement('dialog');
  private readonly list=document.createElement('div');
  private room?:CoopRoom;

  constructor(root:HTMLElement){
    this.dialog.className='coop-dialog host-dialog panel';
    this.dialog.setAttribute('aria-labelledby','host-menu-title');
    const header=document.createElement('header');
    header.className='panel-header';
    const title=document.createElement('h2');
    title.id='host-menu-title';
    title.textContent='Host menu';
    const close=document.createElement('button');
    close.className='close';
    close.textContent='×';
    close.setAttribute('aria-label','Close host menu');
    close.onclick=()=>this.dialog.close();
    header.append(title,close);
    const body=document.createElement('div');
    body.className='panel-content';
    const info=document.createElement('p');
    info.className='sub';
    info.textContent='Everyone joins with full gameplay access. Change permissions for individual players below.';
    this.list.className='host-player-list';
    body.append(info,this.list);
    this.dialog.append(header,body);
    root.append(this.dialog);
  }

  show(room:CoopRoom){
    if(!room.isHost)return;
    this.room=room;
    this.refresh();
    if(!this.dialog.open)this.dialog.showModal();
  }

  refresh(){
    if(!this.room?.isHost)return;
    const room=this.room;
    const focus=this.dialog.querySelector<HTMLElement>(':focus')?.id;
    const players=room.players.filter(player=>!player.host);
    this.list.replaceChildren();
    if(!players.length)this.list.textContent='Guest players will appear here when they join.';
    for(const player of players){
      const group=document.createElement('fieldset');
      const title=document.createElement('legend');
      title.textContent='Player '+player.id;
      group.append(title);
      for(const key of permissionKeys){
        const label=document.createElement('label');
        const toggle=document.createElement('input');
        toggle.id=`player-${player.id}-${key}`;
        toggle.type='checkbox';
        toggle.checked=hasPermission(player.permissions,key);
        toggle.onchange=()=>room.setPermission(player.id,key,toggle.checked);
        label.append(toggle,document.createTextNode(roomPermissions[key]));
        group.append(label);
      }
      const full=document.createElement('button');
      full.className='button small';
      full.id='player-'+player.id+'-full';
      full.textContent='Restore full access';
      full.disabled=player.permissions===allPermissions;
      full.onclick=()=>room.setPlayerPermissions(player.id,allPermissions);
      group.append(full);
      this.list.append(group);
    }
    if(focus)this.dialog.querySelector<HTMLElement>('#'+CSS.escape(focus))?.focus();
  }
}

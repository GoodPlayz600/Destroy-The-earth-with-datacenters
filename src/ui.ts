import { DISTRICTS, TOTAL, facilities, goods, recipes, tools, vehicles } from './catalog';
import type { Facility, Good, Recipe, Tool, VehicleType } from './catalog';
import { cargoMass, computeSites, consumes, getQuantity, projectPrices, storageSite, mills, waterSites } from './campaign';
import type { Campaign, Project, Site } from './campaign';
import { conversionLabel, districtName, soilColors, stages } from './land';
import type { Point } from './land';
import { bindingOptions, defaults } from './storage';
import type { Archive, Binding, Preferences } from './storage';
import { branches } from './upgrade-spec';
import { forestryUnlocks, upgrades } from './upgrades';

type Child=HTMLElement|string|undefined;
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,klass='',...children:Child[])=>{
  const node=document.createElement(tag);
  if(klass) node.className=klass;
  node.append(...children.filter((c):c is HTMLElement|string=>c!==undefined));
  return node;
};
const value=(n:number)=>n.toLocaleString('en-US',{maximumFractionDigits:0});
const cash=(n:number)=>'$'+value(n);
const duration=(seconds:number)=>`${Math.floor(seconds/60)}m ${Math.floor(seconds%60)}s`;
const label=(s:string)=>el('span','label',s);
const sub=(s:string)=>el('p','sub',s);
const section=(title:string,...children:Child[])=>el('section','section',el('h3','',title),...children);
const action=(title:string,handler:()=>void,klass='',disabled=false)=>{
  const b=el('button',klass,title);
  b.type='button'; b.disabled=disabled;
  b.addEventListener('click',handler);
  return b;
};
const shortcut=(key:string,text:string)=>el('span','shortcut',el('kbd','',key),el('span','',text));
const row=(title:string,details:string,...actions:Child[])=>el('div','row',el('div','row-info',el('strong','',title),el('small','',details)),el('div','row-actions',...actions));
const btn=(title:string,handler:()=>void,disabled=false)=>action(title,handler,'button small',disabled);
const cards=(...children:Child[])=>el('div','cards',...children);
const tc=(value:string,title:string)=>el('div','stat-card',label(title),el('strong','',value));
export type Page='settings'|'help'|'credits'|'inventory'|'build'|'map'|'upgrades'|'journal'|'site'|'pause'|'victory';
export type Hint={ title:string; detail:string; key?:string; bar?:number; };
type Hud={
  x:number;z:number; stage:number; held?:string; ride?:string; hint?:Hint; running:boolean; direction:string;
  elapsed:number; waypoint?:Point; aimedBuild?:string; buildIssue?:string; saved:string; touch:boolean;
};
type Controller={
  game:()=>Campaign; prefs:Preferences; open:(page:Page)=>void; begin:(kind:'resume'|'new'|'plus')=>void;
  resume:()=>void; menu:()=>void; refresh:()=>void; save:()=>void; download:()=>void; restore:(file:File)=>void;
  archives:()=>Archive[]; restoreArchive:(slot:string)=>void; applySettings:()=>void; binding:(key:Binding)=>void; build:(f:Facility)=>void; ride:(v:VehicleType)=>void;
  waypoint:(p:Point)=>void; site:()=>Site|undefined; touch:(key:string,pressed:boolean)=>void; fullscreen:()=>void;
};

export class UI {
  private hud=el('div','hud');
  private menu=el('div','menu');
  private overlay=el('div','overlay');
  private notices=el('div','notices');
  private touch=el('div','touch');
  private top=el('div','top');
  private bottom=el('div','bottom');
  private hint=el('div','target');
  private meter=el('div','meter');
  private saved=el('div','save-chip');
  private cashNode=el('strong','', '$0');
  private desertNode=el('strong','', '0.00%');
  private desertDetail=el('small','');
  private toolNode=el('strong','', 'Plastic Butter Knife');
  private stateNode=el('strong','', 'Jungle');
  private objective=el('div','objective');
  private assist=el('div','assist');
  private direction=el('div','compass');
  private statusLine=el('span','equipment-state');
  private bindingKey?:Binding;
  private branch=0;
  private district=36;
  private layer:'stage'|'moisture'|'heat'|'groundwater'='stage';
  private signature='';
  private noticeTimers=new Map<HTMLElement,number>();

  constructor(public root:HTMLElement,private c:Controller) {
    this.menu.hidden=true;
    this.overlay.hidden=true;
    this.hud.hidden=true;
    this.touch.hidden=true;
    this.top.append(
      el('div','phase',el('span','logo-mark'),el('div','',label('CLEARCUT FIELD OPS'),this.stateNode)),
      el('div','topright',el('div','wallet',label('WALLET'),this.cashNode),el('div','wallet desert',label('DESERT COVERAGE'),this.desertNode,this.desertDetail)),
    );
    this.objective.setAttribute('aria-live','polite');
    const reticle=el('div','reticle');
    reticle.append(el('span'),el('span'));
    this.bottom.append(
      el('div','tool-card',el('div','tool-marker','✦'),el('div','tool-details',label('EQUIPPED'),this.toolNode,this.statusLine),this.meter),
      el('div','nav-keys',this.nav('U','Upgrades','upgrades'),this.nav('B','Build','build'),this.nav('M','Map','map'),this.nav('J','Journal','journal'),this.nav('ESC','Pause','pause')),
    );
    this.hud.append(this.top,this.direction,this.objective,reticle,this.hint,this.assist,this.bottom,this.saved,this.touch);
    this.root.replaceChildren(this.menu,this.hud,this.overlay,this.notices);
    this.notices.setAttribute('aria-live','polite');
    this.setupTouch();
  }

  private nav(key:string,title:string,page:Page) {
    const button=action('',()=>this.c.open(page),'nav-key');
    button.append(shortcut(key,title));
    return button;
  }

  showMenu(hasSave:boolean, notice?:string) {
    this.hud.hidden=true;
    this.overlay.hidden=true;
    this.menu.hidden=false;
    this.root.classList.add('at-menu');
    const logo=el('div','wordmark',el('span','logo-mark'),el('span','','CLEARCUT FIELD OPERATIONS'));
    const top=el('header','menu-header',logo,el('div','live-tag',el('i'),'CAMPAIGN LIVE'));
    const headline=el('h1','',el('span','','PROJECT'),el('span','','CLEARCUT'));
    const buttons=el('div','menu-actions');
    const play=action('',()=>this.c.begin('resume'),'button primary hero-button');
    const playLabel=hasSave?'Continue campaign':'Play campaign';
    play.setAttribute('aria-label',playLabel);
    play.append(el('span','play-icon','▶'),playLabel,el('span','arrow','›'));
    buttons.append(play);
    if(hasSave) buttons.append(action('New Game',()=>this.confirmNew(),'button secondary start-new'));
    buttons.append(el('div','menu-links',this.nav('','Settings','settings'),this.nav('','How to Play','help'),this.nav('','Credits','credits')));
    const content=el('main','menu-content',
      el('div','hero-kicker',el('span'),'THE LAST JUNGLE'),
      headline,
      el('p','hero-copy','One plastic knife. A whole jungle. See how far a little industry can go.'),
      buttons,notice ? sub(notice) : undefined,
    );
    const footer=el('footer','menu-footer',el('div','',label('FIELD SITE'),el('strong','','01  /  ASH EXCHANGE')),
      el('div','',label('CAMPAIGN OBJECTIVE'),el('strong','','65,536 CELLS  /  STABLE DESERT')),
      el('div','',label('MODE'),el('strong','','SINGLE PLAYER')));
    this.menu.replaceChildren(top,content,footer);
  }

  private confirmNew() {
    this.panel('New campaign','Your current campaign will be archived in this browser.',el('div','panel-content',
      btn('Start new campaign',()=>this.c.begin('new')),btn('Go back',()=>this.c.resume())));
  }

  showPlay() {
    this.root.classList.remove('at-menu');
    this.menu.hidden=true;
    this.hud.hidden=false;
    this.overlay.hidden=true;
  }

  fatal(detail:string) {
    this.menu.hidden=true;
    this.panel('Graphics unavailable',detail,el('div','panel-content',btn('Reload',()=>location.reload())));
  }

  notice(s:string) {
    const n=el('div',s.startsWith('+$')?'notice money-notice':'notice',s);
    this.notices.append(n);
    if(this.notices.children.length>5) {
      const older=this.notices.firstElementChild as HTMLElement;
      clearTimeout(this.noticeTimers.get(older));
      this.noticeTimers.delete(older);
      older.remove();
    }
    this.noticeTimers.set(n,window.setTimeout(()=>{this.noticeTimers.delete(n);n.remove();},4200));
  }

  update(h:Hud) {
    const g=this.c.game();
    const stamp=[g.cash,g.desertCount,g.tool,g.stats.harvest,g.stats.fire,g.stats.produced,h.stage,h.direction,h.saved,h.ride,h.held,h.running,h.aimedBuild,h.buildIssue].join('|');
    if(stamp!==this.signature) {
      this.signature=stamp;
      this.cashNode.textContent=cash(g.cash);
      this.desertNode.textContent=conversionLabel(g.desertCount)+'%';
      this.desertDetail.textContent=value(g.desertCount)+' / '+value(TOTAL)+' CELLS';
      this.direction.textContent=h.direction;
      this.stateNode.textContent=stages[h.stage];
      this.toolNode.textContent=h.ride??tools[g.tool].name;
      this.saved.textContent=h.saved;
      const [step,body]=g.stats.harvest===0?['First cut','Approach a sapling. Aim at its trunk and hold Swing.']
        :g.stats.fire===0?['Make the first sale','Hold Interact beside the trunk. Drag it into the Ash Exchange and release.']
        :g.stats.produced===0?['Put your timber to work','Buy an upgrade or build a Field Sawbench for higher-value lumber.']
        :['The last jungle','Connect mills and industry. Convert every cell into stable desert.'];
      this.objective.replaceChildren(label('FIELD OBJECTIVE'),el('strong','',step),sub(body));
      this.assist.replaceChildren(h.aimedBuild?el('div','build-context',label('PLACEMENT'),el('strong','',h.aimedBuild),sub(h.buildIssue||'Swing to build · Esc to cancel'))
        : h.held?el('div','hold-context',label('HAULING'),el('strong','',h.held),sub('Release inside the station intake'))
        : '');
    }
    this.statusLine.textContent=h.ride??`Integrity ${Math.round(g.wear)}  ·  ${['electric','chainsaw','harvester'].includes(g.tool)?'Power '+Math.floor(g.battery)+'%':'Stamina '+Math.floor(g.stamina)}`;
    this.meter.style.setProperty('--amount',String(g.stamina/g.mods.stamina*100)+'%');
    this.touch.hidden=!h.touch;
    const hintStamp=JSON.stringify(h.hint);
    if(this.hint.dataset.stamp!==hintStamp) {
      this.hint.dataset.stamp=hintStamp;
      this.hint.hidden=!h.hint;
      if(h.hint) {
        const {key,title,detail,bar}=h.hint;
        const description=el('div','',el('strong','',title),el('small','',detail));
        this.hint.replaceChildren(key?el('kbd','',key):'',description);
        if(bar!==undefined) {
          const progress=el('div','damage'); progress.style.setProperty('--amount',bar*100+'%');
          this.hint.append(progress);
        }
      }
    }
  }

  private setupTouch() {
    const make=(text:string,key:string)=>{
      const b=el('button','touch-button',text);
      b.type='button';
      b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.c.touch(key,true);});
      for(const event of ['pointerup','pointercancel','lostpointercapture']) b.addEventListener(event,()=>this.c.touch(key,false));
      return b;
    };
    this.touch.append(el('div','dpad',make('↑','forward'),make('←','left'),make('↓','back'),make('→','right')),
      el('div','touch-actions',make('Swing','swing'),make('Grab','interact'),make('Jump','jump'),make('Drop','drop')));
  }

  recording(key?:Binding) { this.bindingKey=key; this.show('settings'); }

  private panel(title:string,desc:string,body:HTMLElement) {
    this.overlay.hidden=false;
    const close=action('×',()=>this.c.resume(),'close');
    close.setAttribute('aria-label','Close panel');
    const shell=el('article','panel',el('div','panel-header',el('div','',label('CLEARCUT FIELD OPERATIONS'),el('h2','',title),sub(desc)),close),body);
    this.overlay.replaceChildren(shell);
  }

  show(page:Page) {
    const g=this.c.game();
    const pages:Record<Page,()=>void>={
      pause:()=>this.panel('Field paused','Production and field work are paused.',el('div','panel-content stack',
        action('Resume campaign',()=>this.c.resume(),'button primary'),btn('Save campaign',()=>this.c.save()),btn('Settings',()=>this.c.open('settings')),
        btn('How to Play',()=>this.c.open('help')),btn('Main menu',()=>this.c.menu()))),
      help:()=>this.panel('Field manual','Start at the Ash Exchange. The Timber Exchange across the clearing buys raw and refined inventory.',el('div','panel-content',
        section('Your first shift',
          row('Approach a sapling','Aim the crosshair at the trunk and hold left mouse until it falls.'),
          row('Haul to the ring','Keep Interact held while walking backward or strafing. Release the log inside the Ash Exchange.'),
          row('Compare timber routes','The fire pays when burning is finished. The market pays for raw timber. Build a sawbench, bring it timber and sell the finished boards.'),
          row('Develop the district','Buy a permit on the map. Place machinery on cleared ground. Select a facility to inspect buffers, connect routes and transfer inventory.')),
        section('Controls',...Object.entries(bindingOptions).map(([id,[title]])=>row(title,this.c.prefs.bindings[id as Binding].replace(/Key|Digit/g,''))),row('Swing / look','Left mouse / mouse. In drag look, hold right mouse and move.')))),
      credits:()=>this.panel('Credits','Project Clearcut · The Last Jungle',el('div','panel-content',section('Production',row('Original world models and sound','Procedural 3D geometry and synthesized audio.'),row('Engine','Three.js · Rapier · Vite · TypeScript'),row('Typography','Barlow Condensed, DM Sans and IBM Plex Mono.')))),
      settings:()=>this.settings(),
      inventory:()=>this.inventory(),
      build:()=>this.build(),
      map:()=>this.map(),
      upgrades:()=>this.tech(),
      journal:()=>this.journal(),
      site:()=>this.site(),
      victory:()=>this.panel('The last jungle','Every cell reached stable desert. Your completed campaign can still be explored.',el('div','panel-content',
        cards(tc(conversionLabel(g.desertCount)+'%','Desert coverage'),tc(value(g.desertCount),'Stabilized cells'),tc(duration(g.completionTime),'Campaign time'),
          tc(value(g.stats.harvest),'Individual harvests'),tc(cash(g.stats.earned),'Lifetime earnings'),tc(value(g.achievements.size),'Awards')),
        el('div','controls-row',btn('Keep exploring',()=>this.c.resume()),btn('Export completed save',()=>this.c.download()),btn('New Game+',()=>this.c.begin('plus'))))),
    };
    pages[page]();
  }

  private settings() {
    const prefs=this.c.prefs;
    const select=(options:string[],selected:string,update:(value:string)=>void)=>{
      const input=el('select','input');
      for(const option of options) { const o=el('option','',option);o.value=option;input.append(o); }
      input.value=selected;
      input.addEventListener('change',()=>{update(input.value);this.c.applySettings();});
      return input;
    };
    const range=(value:number,min:number,max:number,update:(n:number)=>void)=>{
      const input=el('input','range');
      input.type='range';input.min=String(min);input.max=String(max);input.step='.05';input.value=String(value);
      input.addEventListener('input',()=>{update(Number(input.value));this.c.applySettings();});
      return input;
    };
    const check=(value:boolean,update:(n:boolean)=>void)=>{
      const input=el('input','toggle');
      input.type='checkbox';input.checked=value;
      input.addEventListener('change',()=>{update(input.checked);this.c.applySettings();});
      return input;
    };
    const file=el('input');
    file.type='file';
    file.accept='application/json,.json';
    file.hidden=true;
    file.addEventListener('change',()=>{if(file.files?.[0])this.c.restore(file.files[0]);});
    const bindingRows=Object.entries(bindingOptions).map(([id,[title]])=>row(title,'',
      btn(this.bindingKey===id?'Press a key…':prefs.bindings[id as Binding],()=>this.c.binding(id as Binding))));
    this.panel('Settings','Graphics, controls and local campaign files.',el('div','panel-content',
      section('Display',
        row('Graphics quality','',select(['low','medium','high'],prefs.quality,v=>prefs.quality=v as Preferences['quality'])),
        row('Interface scale','',range(prefs.scale,.8,1.25,v=>prefs.scale=v)),
        row('Reduced camera motion','',check(prefs.reduced,v=>prefs.reduced=v)),
        row('Fullscreen','',btn('Toggle fullscreen',()=>this.c.fullscreen()))),
      section('Audio and mouse',
        row('Master volume','',range(prefs.volume,0,1,v=>prefs.volume=v)),
        row('Look sensitivity','',range(prefs.sensitivity,.25,2,v=>prefs.sensitivity=v)),
        row('Look mode','Pointer lock or right-mouse drag',select(['pointer','drag'],prefs.look,v=>prefs.look=v as Preferences['look'])),
        row('Toggle grabbing','Tap Interact to latch, then tap again to release',check(prefs.sticky,v=>prefs.sticky=v))),
      section('Campaign data',
        row('Offline industry','Simulate up to five minutes on return',check(prefs.offline,v=>prefs.offline=v)),
        row('Save files','',btn('Export',()=>this.c.download()),btn('Import',()=>file.click()),file),
        ...this.c.archives().map(archive=>row(archive.label,new Date(archive.date).toLocaleString(),btn('Restore archive',()=>this.c.restoreArchive(archive.slot))))),
      section('Bindings',...bindingRows,btn('Reset bindings',()=>{
        prefs.bindings=structuredClone(defaults.bindings);this.c.applySettings();this.show('settings');
      })),
    ));
  }

  private inventory() {
    const g=this.c.game();
    this.panel('Equipment','Tools, personal stock, and the current fleet.',el('div','panel-content',
      section('Hand tools',...Object.entries(tools).map(([k,item])=>{
        const id=k as Tool,owned=g.ownedTools.has(id);
        const node=id==='knife'?undefined:upgrades.find(upgrade=>upgrade.id===forestryUnlocks[id]);
        const locked=Boolean(node?.previous&&!g.ownedUpgrades.has(node.previous));
        return row(item.name,`Cut power ${item.power} · Range ${item.range} m`,btn(g.tool===id?'Equipped':owned?'Equip':locked?'Requires research':cash(item.cost),()=>{
          if(g.acquireTool(id))this.c.refresh();
        },g.tool===id||(!owned&&(locked||g.cash<item.cost))));
      }),btn('Service equipped tool',()=>{if(g.retool())this.c.refresh();})),
      section('Inventory',g.stock.length?undefined:sub('The tool bag has no saleable stock.'),
        ...Object.keys(goods).filter(k=>getQuantity(g.stock,k as Good)>0).map(k=>row(goods[k as Good][0],`${getQuantity(g.stock,k as Good)} units`))),
      section('Fleet',g.rides.length?undefined:sub('No vehicles in service.'),
        ...g.rides.map(v=>row(vehicles[v.kind].name,`${Math.floor(v.fuel)}% fuel · ${Math.floor(cargoMass(g.logs.values(),v.id))} kg cargo · ${Math.round(v.x)}, ${Math.round(v.z)}`,
          btn('Mark',()=>this.c.waypoint(v)))))));
  }

  private build() {
    const g=this.c.game();
    this.panel('Construction','Choose a facility, then aim at a clear footprint and swing to place it.',el('div','panel-content',
      section('Facilities',...Object.entries(facilities).map(([k,item])=>{
        const kind=k as Facility,recipe:Recipe|undefined=Object.hasOwn(recipes,kind)?recipes[kind as keyof typeof recipes]:undefined;
        const missing=item.requires&&!g.sites.some(s=>s.kind===item.requires);
        const unresearched=item.research&&!g.ownedUpgrades.has(item.research);
        const locked=missing||unresearched;
        const parts=[recipe?.name,item.supply?`${item.supply} kW grid output`:undefined,(recipe?.power??item.power)?`${recipe?.power??item.power} kW draw`:undefined,missing?`Requires ${facilities[item.requires!].name}`:unresearched?'Requires facility research':undefined].filter(Boolean);
        return row(item.name,parts.join(' · '),btn(cash(item.price),()=>this.c.build(kind),g.cash<item.price||Boolean(locked)));
      })),
      section('Transport',...Object.entries(vehicles).map(([k,item])=>row(item.name,`${item.capacity} kg payload · ${item.motor?'Motorized':'Manual'}`,
        btn(cash(item.cost),()=>this.c.ride(k as VehicleType),g.cash<item.cost||(k==='sled'&&!g.mods.sled)||(k==='cart'&&!g.mods.cart)))))));
  }

  private tech() {
    const g=this.c.game();
    const tabs=el('div','branch-tabs');
    branches.forEach((title,n)=>tabs.append(action(title,()=>{this.branch=n;this.tech();},n===this.branch?'branch selected':'branch')));
    const displayed=upgrades.slice(this.branch*12,this.branch*12+12);
    const available=upgrades.filter(u=>u.implemented).length;
    this.panel('Upgrades',`${g.ownedUpgrades.size} installed · ${available} available designs · ${cash(g.cash)} in the wallet`,el('div','panel-content',
      tabs,section(branches[this.branch],...displayed.map(item=>{
        const owned=g.ownedUpgrades.has(item.id),prereq=item.previous&&!g.ownedUpgrades.has(item.previous);
        const unavailable=!item.implemented;
        return row(item.name,unavailable?'In development':item.description,btn(owned?'Installed':unavailable?'Unavailable':prereq?'Requires previous':cash(item.price),()=>{
          if(!g.buyUpgrade(item.id))this.notice('Required facility or funds unavailable');
          this.c.refresh();
        },owned||unavailable||Boolean(prereq)||g.cash<item.price));
      }))));
  }

  private map() {
    const g=this.c.game();
    const grid=el('div','map-grid');
    const controls=el('div','controls-row survey-controls');
    for(const [name,id] of [['Biome stage','stage'],['Soil moisture','moisture'],['Water table','groundwater'],['Heat','heat']] as const) {
      controls.append(action(name,()=>{this.layer=id;this.map();},this.layer===id?'branch selected':'branch'));
    }
    const metrics=Array.from({length:DISTRICTS**2},()=>({moisture:.68*1024,groundwater:.85*1024,heat:.12*1024}));
    const layers=Array.from({length:DISTRICTS**2},()=>Array(7).fill(0) as number[]);
    for(const [i,s] of g.soil) {
      const x=Math.floor((i%256)/32),z=Math.floor(i/256/32);
      const district=z*DISTRICTS+x;
      layers[district][s.stage]++;
      metrics[district].moisture+=s.moisture-.68;
      metrics[district].groundwater+=s.groundwater-.85;
      metrics[district].heat+=s.heat-.12;
    }
    for(let i=0;i<DISTRICTS**2;i++) {
      const b=action('',()=>{this.district=i;this.map();},i===this.district?'zone active':'zone');
      const desert=g.desertByDistrict[i],style=layers[i].reduce((last,n,index)=>n>0?index:last,-1);
      const precision=this.layer==='stage'?0:Math.round(metrics[i][this.layer]/10.24);
      const soil=this.layer==='stage'?soilColors[Math.max(0,style)]
        : this.layer==='heat'?`hsl(${51-.42*precision} 55% ${33+precision*.18}%)`:`hsl(${40+precision*1.75} 39% ${33+precision*.18}%)`;
      b.style.setProperty('--land',soil);
      b.append(el('strong','',districtName(i)),el('small','',this.layer!=='stage'?precision+'%':desert?Math.floor(desert/10.24)+'%':g.districts.has(i)?'OWNED':'·'));
      grid.append(b);
    }
    const district=this.district,count=g.desertByDistrict[district];
    const selected=el('div','panel-content',cards(tc(conversionLabel(g.desertCount)+'%','Campaign desert'),tc(value(g.desertCount)+' / '+value(TOTAL),'Stable cells')),controls,grid,
      section('District '+districtName(district),sub(`${count} / 1,024 cells stable`),
        g.districts.has(district)?sub('Permit active'):btn('Purchase permit · $950',()=>{if(g.buyDistrict(district))this.map();},g.cash<950),
        ...Object.entries(projectPrices).map(([key,price])=>{
          const kind=key as Project['kind'], built=g.projects.find(p=>p.district===district);
          const ready=g.sites.some(s=>s.kind==='forestry')&&g.sites.some(s=>s.kind===(kind==='watershed'?'pump':kind==='quarry'?'quarry':'thermal'));
          const display={watershed:'Watershed drawdown',quarry:'Regional stripping',thermal:'Thermal exhaustion'}[kind];
          return row(display,built?.kind===kind?(built.complete?'Bond paid · all district cells stable':`Commissioned · ${duration(built.phase)}`):'Requires local industrial expertise and a district permit',
            btn(cash(price),()=>{if(g.startProject(district,kind))this.map();},Boolean(built)||!ready||!g.districts.has(district)||g.cash<price));
        })),
      section('Remaining-cell survey',...g.scan(district,12).map(({i,at,soil})=>row(`Cell ${i} · ${stages[soil.stage]}`,
        `Vegetation ${Math.round(soil.vegetation*100)}% · Soil moisture ${Math.round(soil.moisture*100)}% · Substrate ${Math.round(soil.substrate*100)}%`,
        btn('Mark',()=>this.c.waypoint(at))))));
    this.panel('Land survey','The survey tracks every cell, including the ground beneath machinery and roads.',selected);
  }

  private journal() {
    const g=this.c.game();
    this.panel('Field journal','Production, contracts, lifetime achievements and receipts.',el('div','panel-content',
      cards(tc(value(g.stats.harvest),'Trees harvested'),tc(value(g.stats.produced),'Units refined'),tc(cash(g.stats.earned),'Lifetime earnings'),tc(duration(g.clock),'Time in field')),
      section('Work plan',row('Start a timber operation','Sell wood at the fire or market. Build a sawbench and sell the products.'),
        row('Scale production','Use a generator, connect machines, then route output to buyers.'),
        row('Transform the land','Buy district permits and commission forestry with drainage, soil stripping or thermal conversion.')),
      section('Operations',
        row('Earnings per field minute',g.clock>2?cash(g.stats.earned/(g.clock/60)):'Begin field work'),
        row('Average swings per harvest',g.stats.harvest?String(Math.round(g.stats.hits/g.stats.harvest)):'No harvest recorded'),
        row('Machine bottlenecks',g.sites.filter(site=>['No grid power','Output full','Awaiting suitable material'].includes(site.status)).map(site=>facilities[site.kind].name+' · '+site.status).join(' / ')||'No blocked production'),
        row('Desert cells per field hour',g.clock>60?value(g.desertCount/(g.clock/3600)):'Collecting data')),
      section('Awards',g.achievements.size?undefined:sub('Earn your first award by felling a tree.'),...Array.from(g.achievements,a=>row(a,'Unlocked'))),
      section('Recent receipts',g.ledger.length?undefined:sub('Receipts appear after the first transaction.'),
        ...g.ledger.slice(0,18).map(entry=>row(entry.note,duration(entry.date),el('strong',entry.amount>0?'positive':'',`${entry.amount>0?'+':'−'}${cash(Math.abs(entry.amount))}`))))));
  }

  private site() {
    const s=this.c.site(),g=this.c.game();
    if(!s) return this.c.resume();
    const def=facilities[s.kind];
    const recipe:Recipe|undefined=Object.hasOwn(recipes,s.kind)?recipes[s.kind as keyof typeof recipes]:undefined;
    const content=el('div','panel-content',cards(tc(s.status,'Facility status'),tc(String(getQuantity(s.output)),'Output stock'),tc(recipe?.power?recipe.power+' kW':String(getQuantity(s.input)),recipe?.power?'Power demand':'Input stock')));
    if(s.kind==='market') {
      content.append(section('Price comparison',sub('Typical returns per starter sapling. Buyer payout varies with quality and moisture.'),
        row('Ash Exchange','One green sapling, paid after burning',el('strong','','~$17')),
        row('Timber Exchange','One unit of green timber',el('strong','','~$26')),
        row('Field Sawbench','Two green boards, sold at the exchange',el('strong','','~$71'))),
      section('Sell from your bag',...g.stock.filter(lot=>lot.good!=='compute').map(lot=>row(goods[lot.good][0],`${lot.quantity} units`,btn('Sell one',()=>{g.sellInventory(lot.good,1,lot);this.site();}),
        btn(`Sell batch · ${cash(g.marketValue(lot))}`,()=>{g.sellInventory(lot.good,lot.quantity,lot);this.site();})))),
      section('Freight contracts',...g.contracts.slice(0,4).map(deal=>row(goods[deal.good][0],
        `${deal.quantity} units${deal.grade?' · '+Math.round(deal.grade*100)+'% minimum grade':''} · ${deal.done?'Closed':deal.failed?'Expired':duration(deal.deadline-g.clock)+' remaining'}`,
        btn('Fulfill · '+cash(deal.payout),()=>{g.fulfill(deal);this.site();},deal.done||deal.failed||getQuantity(g.stock.filter(l=>l.quality>=(deal.grade??0)),deal.good)<deal.quantity))),
        ...(['boards','dry','crates','paper','compute',...(g.mods.certified?['finished','treated']:[])] as Good[]).map(kind=>btn('Contract · '+goods[kind][0],()=>{g.acceptContract(kind);this.site();},g.contracts.some(c=>!c.done&&!c.failed))),
        g.mods.denseCompute?btn('Contract · High-density compute',()=>{g.acceptContract('compute',true);this.site();},
          g.contracts.some(c=>!c.done&&!c.failed)):undefined),
      g.mods.commissions?section('Custom-order studio',...(['finishedCabinet','floors','modular'] as Good[]).map(good=>row(goods[good][0],
        'Commission graded stock for a specialist customer',btn('Standard',()=>{g.acceptCommission(good);this.site();},g.contracts.some(c=>!c.done&&!c.failed)),
        btn('Premium',()=>{g.acceptCommission(good,true);this.site();},g.contracts.some(c=>!c.done&&!c.failed))))):el('span'));
    } else {
      content.append(section('Operation',row('Run schedule',s.on?'Enabled while in the field':'Stopped',btn(s.on?'Stop':'Start',()=>{s.on=!s.on;this.site();})),
        s.kind==='bench'&&g.mods.benchCrank?row('Manual crank','Start a faster hand-sawn batch from the input buffer',
          btn('Crank saw',()=>{if(g.crankBench(s))this.site();},Boolean(s.jobs.length)||getQuantity(s.input,'timber')===0)):undefined,
        g.mods.cutPatterns&&mills.includes(s.kind)?row('Cut pattern',s.layout==='volume'?'Maximize volume':s.layout==='quality'?'Select high-grade cuts':'Standard throughput',
          btn('Cycle',()=>{s.layout=s.layout==='volume'?'quality':s.layout==='quality'?undefined:'volume';this.site();})):undefined,
        g.mods.sortingCamera?row('Sorting gate',s.sortHigh?'Route high-grade batches only':'Route all compatible stock',
          btn('Change',()=>{s.sortHigh=!s.sortHigh;this.site();})):undefined,
        def.supply?row('Fuel',Math.floor(s.fuel)+'%',btn('Refuel · $25',()=>{if(g.cash>=25){g.finance(-25,'Generator fuel');s.fuel=100;this.site();}},g.cash<25||s.fuel===100)):undefined,
        waterSites.includes(s.kind)?row('Cooling water',Math.floor(s.water??0)+' L stored · feed a nearby compute campus or extend with pipe'):undefined,
        computeSites.includes(s.kind)?row('Compute scheduling',s.kind==='serverRack'?'Requires a live compute contract and electricity.':
          'Requires a live compute contract, electricity and cooling water. Inspect the flow at the pump or reservoir.'):undefined,
        computeSites.includes(s.kind)&&g.mods.backup?row('Battery reserve',Math.floor(s.reserve??0)+' / 700 charge'):undefined,
        s.kind==='fire'&&g.mods.carbon?row('Fire mode',s.mode==='charcoal'?'Charcoal collection':'Cash sale',btn('Switch',()=>{s.mode=s.mode==='charcoal'?'sell':'charcoal';this.site();})):undefined,
        ...s.jobs.map(job=>row(goods[job.good][0],`${Math.ceil(Math.max(0,job.remaining))}s remaining`))),
      section('Output',
        s.output.length?undefined:sub('No batches ready. Resume play to run production.'),
        ...s.output.map(lot=>row(goods[lot.good][0],`${lot.quantity} units · ${Math.floor(lot.quality*100)}% grade${g.mods.moistureGauge?' · '+Math.round(lot.moisture*100)+'% moisture':''}`,
          btn('Take one',()=>{g.transfer(s,lot.good,1,true);this.site();}),btn('Take batch',()=>{g.transfer(s,lot.good,lot.quantity,true);this.site();})))),
      section('Feed from your bag',...g.stock.filter(lot=>storageSite(s.kind)||consumes(recipe,lot.good)).map(lot=>row(goods[lot.good][0],`${lot.quantity} units available`,
        btn('Feed one',()=>{g.transfer(s,lot.good,1,false);this.site();}),btn('Feed batch',()=>{g.transfer(s,lot.good,lot.quantity,false);this.site();})))),
      section('Freight route',
        s.shipment?row('Shipment on the move',`${s.shipment.load.quantity} × ${goods[s.shipment.load.good][0]} · ${Math.max(0,Math.ceil(s.shipment.duration-s.shipment.elapsed))}s`):undefined,
        sub(!s.link&&s.kind==='railDepot'?'Lay connected track between the depot and its destination.':
          !s.link&&s.kind==='dronePad'?'Power the charger, then choose a destination up to 320 m away.':s.link?`Connected to ${facilities[g.sites.find(t=>t.id===s.link)!.kind].name}`:'Choose a compatible facility within 16 m or bridge the gap with freight infrastructure.'),
        ...g.sites.filter(target=>target!==s && (target.kind==='market'||storageSite(target.kind)||Object.hasOwn(recipes,target.kind)||target.kind==='fire')).map(target=>
          row(facilities[target.kind].name,`${Math.round(Math.hypot(s.x-target.x,s.z-target.z))} m`,btn('Connect',()=>{
            if(!g.connect(s,target))this.notice('Route out of reach, disconnected or already in use');
            this.site();
          },s.link===target.id)))));
    }
    if(s.kind==='forestry') {
      const options=g.sites.filter(target=>target.kind==='market'||storageSite(target.kind)||(Object.hasOwn(recipes,target.kind)&&(recipes[target.kind as keyof typeof recipes] as Recipe).input?.[0]==='timber'));
      content.append(section('Log hauler',sub(s.haul?.status??'Hire a worker to collect physical fallen logs within 85 m.'),
        ...options.filter(target=>target!==s&&Math.hypot(s.x-target.x,s.z-target.z)<=110).map(target=>
          row(facilities[target.kind].name,'Timber receiving station',btn(s.haul?'Assign':'Hire · $340',()=>{
            if(!g.assignHauler(s,target))this.notice('The worker is assigned to a load or funds are insufficient.');
            this.site();
          },s.haul?.target===target.id||(!s.haul&&g.cash<340))))));
    }
    this.panel(def.name,'Station · '+s.id.toUpperCase(),content);
  }
}

import { DISTRICT_CELLS, DISTRICTS, TOTAL, facilities, goods, recipes, tools, vehicles, vehicleTypes } from './catalog';
import type { Facility, Good, Recipe, Tool, VehicleType } from './catalog';
import { biomassSites, buyerSite, cargoMass, computeSites, consumes, districtProjects, fields, fuelGood, getQuantity, isOpenContract, projectBond, storageSite, mills, waterSites, waterPumps, waterCapacity } from './campaign';
import type { Campaign, Challenge, Project, Site } from './campaign';
import { blockers, conversionLabel, coverageLabel, desertRules, desertified, districtAt, districtCenter, districtName, soilColors, stages } from './land';
import type { Blocker, Point } from './land';
import { bindingOptions, defaults } from './storage';
import type { Archive, Binding, Preferences } from './storage';
import { quests } from './quests';
import type { QuestId } from './quests';
import { branches } from './upgrade-spec';
import { forestryUnlocks, upgrades, upgradesById } from './upgrades';

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
  x:number;z:number; stage:number; held?:string; ride?:string; rideDetail?:string; hint?:Hint; running:boolean; direction:string;
  elapsed:number; waypoint?:Point; aimedBuild?:string; buildIssue?:string; saved:string; touch:boolean;
};
type Controller={
  game:()=>Campaign; prefs:Preferences; open:(page:Page)=>void; begin:(kind:'resume'|'new'|'plus',challenge?:Challenge)=>void;
  resume:()=>void; menu:()=>void; refresh:()=>void; save:()=>void; download:()=>void; restore:(file:File)=>void;
  archives:()=>Archive[]; restoreArchive:(slot:string)=>void; applySettings:()=>void; binding:(key:Binding)=>void; build:(f:Facility)=>void; ride:(v:VehicleType)=>void;
  survey:(p:Point)=>void; waypoint:(p:Point)=>void; site:()=>Site|undefined; touch:(key:string,pressed:boolean)=>void; fullscreen:()=>void;
};

export class UI {
  private hud=el('div','hud');
  private menu=el('div','menu');
  private overlay=el('div','overlay');
  private notices=el('div','notices');
  private touch=el('div','touch');
  private touchRope?:HTMLButtonElement;
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
  private filter?:Blocker;
  private layer:'stage'|'moisture'|'heat'|'groundwater'|'vegetation'|'fertility'|'erosion'='stage';
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
      el('div','nav-keys',this.nav('Q','Gear','inventory'),this.nav('U','Upgrades','upgrades'),this.nav('B','Build','build'),this.nav('M','Map','map'),this.nav('J','Journal','journal'),this.nav('ESC','Pause','pause')),
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
    buttons.append(action(hasSave?'New Game':'Challenges',()=>this.confirmNew(hasSave),'button secondary start-new'));
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

  private confirmNew(hasSave:boolean) {
    this.panel('New campaign',hasSave?'Your current campaign will be archived in this browser.':'Choose a campaign condition.',el('div','panel-content',
      section('Campaign rules',
        row('Standard','All tools, industries and conversion strategies are available.',btn('Start standard',()=>this.c.begin('new'))),
        row('No compute','Win through other industries. Compute equipment stays unavailable.',btn('Start No Compute',()=>this.c.begin('new','noCompute'))),
        row('Lean grid','Every source has lower electrical capacity. Plan around a smaller grid.',btn('Start Lean Grid',()=>this.c.begin('new','leanPower')))),
      btn('Go back',()=>this.c.resume())));
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
    const stamp=[g.cash,g.desertCount,g.won,g.tool,g.stats.harvest,g.stats.fire,g.stats.produced,h.stage,h.direction,h.saved,h.ride,h.held,h.running,h.aimedBuild,h.buildIssue].join('|');
    if(stamp!==this.signature) {
      this.signature=stamp;
      this.cashNode.textContent=cash(g.cash);
      this.desertNode.textContent=conversionLabel(g.desertCount)+'%';
      this.desertDetail.textContent=value(g.desertCount)+' / '+value(TOTAL)+' CELLS';
      this.direction.textContent=h.direction;
      this.stateNode.textContent=stages[h.stage];
      this.toolNode.textContent=h.ride??tools[g.tool].name;
      this.saved.textContent=h.saved;
      const [step,body]=g.won?['Campaign complete','Every cell is stable desert. Keep exploring or open the journal to review the run.']:g.stats.harvest===0?['First cut',h.touch?'Walk to the sapling. Swipe to aim at its trunk, then hold Swing.':'Approach a sapling. Aim at its trunk and hold Swing.']
        :g.stats.fire===0?['Make the first sale',h.touch?'Hold Grab beside the trunk. Drag it into the Ash Exchange and release.':'Hold Interact beside the trunk. Drag it into the Ash Exchange and release.']
        :g.stats.produced===0?['Put your timber to work','Buy an upgrade or build a Field Sawbench for higher-value lumber.']
        :['The last jungle','Connect mills and industry. Convert every cell into stable desert.'];
      this.objective.replaceChildren(label('FIELD OBJECTIVE'),el('strong','',step),sub(body));
      this.assist.replaceChildren(h.aimedBuild?el('div','build-context',label('PLACEMENT'),el('strong','',h.aimedBuild),sub(h.buildIssue||'Swing to build · Esc to cancel'))
        : h.held?el('div','hold-context',label('HAULING'),el('strong','',h.held),sub('Release inside the station intake'))
        : '');
    }
    this.statusLine.textContent=h.rideDetail??`Integrity ${Math.round(g.wear)}  ·  ${['electric','chainsaw','harvester'].includes(g.tool)?'Power '+Math.floor(g.battery)+'%':'Stamina '+Math.floor(g.stamina)}`;
    this.meter.style.setProperty('--amount',String(g.stamina/g.mods.stamina*100)+'%');
    this.touch.hidden=!h.touch;
    if(this.touchRope) this.touchRope.hidden=!g.mods.rope&&!g.mods.winch;
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
    const make=(text:string,key:string,label?:string)=>{
      const b=el('button','touch-button',text);
      b.type='button';
      if(label)b.setAttribute('aria-label',label);
      b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.c.touch(key,true);});
      for(const event of ['pointerup','pointercancel','lostpointercapture']) b.addEventListener(event,()=>this.c.touch(key,false));
      return b;
    };
    this.touchRope=make('Rope','rope');
    this.touchRope.classList.add('touch-rope');
    this.touchRope.hidden=true;
    this.touch.append(el('div','dpad',make('↑','forward','Move forward'),make('←','left','Move left'),make('↓','back','Move back'),make('→','right','Move right')),
      el('div','touch-actions',make('Swing','swing'),make('Grab','interact'),make('Jump','jump'),make('Drop','drop'),make('Drive','ride'),make('Cargo','load'),this.touchRope));
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
        ...g.rides.map(v=>{
          const towing=g.rides.find(trailer=>trailer.hitch===v.id);
          const tow=g.rides.find(vehicle=>vehicle.id===v.hitch);
          const hitch=towing?` · Towing ${vehicles[towing.kind].name}`:tow?` · Coupled to ${vehicles[tow.kind].name}`:'';
          const service=vehicles[v.kind].motor?`${Math.floor(v.fuel)}% fuel · `:'';
          return row(vehicles[v.kind].name,`${service}${Math.floor(cargoMass(g.logs.values(),v.id))} kg cargo · ${Math.round(v.x)}, ${Math.round(v.z)}${hitch}`,
            btn('Mark',()=>this.c.waypoint(v)),btn(tow||towing?'Recover rig · $18':'Recover · $18',()=>{
              if(!g.recoverRide(v))this.notice('Recovery needs an available vehicle and a clear yard');
              this.c.refresh();
            },g.cash<18));
        }))));
  }

  private build() {
    const g=this.c.game();
    this.panel('Construction','Choose a facility, then aim at a clear footprint and swing to place it.',el('div','panel-content',
      section('Facilities',...Object.entries(facilities).filter(([id])=>id!=='ruin').map(([k,item])=>{
        const kind=k as Facility,recipe:Recipe|undefined=Object.hasOwn(recipes,kind)?recipes[kind as keyof typeof recipes]:undefined;
        const missing=item.requires&&!g.sites.some(s=>s.kind===item.requires);
        const unresearched=item.research&&!g.ownedUpgrades.has(item.research);
        const locked=missing||unresearched;
        const parts=[recipe?.name,item.supply?`${item.supply} kW grid output`:undefined,(recipe?.power??item.power)?`${recipe?.power??item.power} kW draw`:undefined,missing?`Requires ${facilities[item.requires!].name}`:unresearched?'Requires facility research':undefined].filter(Boolean);
        return row(item.name,parts.join(' · '),btn(cash(item.price),()=>this.c.build(kind),g.cash<item.price||Boolean(locked)));
      })),
      section('Transport',...Object.entries(vehicleTypes).map(([k,item])=>{
        const missing=item.research&&!g.ownedUpgrades.has(item.research)?upgradesById.get(item.research):undefined;
        const requirement=missing?` · Requires ${missing.name}`:'';
        return row(item.name,`${item.capacity} kg payload · ${item.motor?'Motorized':'Manual'}${requirement}`,
          btn(cash(item.cost),()=>this.c.ride(k as VehicleType),g.cash<item.cost||Boolean(missing)));
      }))));
  }

  private tech() {
    const g=this.c.game();
    const tabs=el('div','branch-tabs');
    branches.forEach((title,n)=>tabs.append(action(title,()=>{this.branch=n;this.tech();},n===this.branch?'branch selected':'branch')));
    const displayed=upgrades.slice(this.branch*12,this.branch*12+12);
    const available=upgrades.filter(u=>u.implemented).length;
    const research=g.mods.researchDesk?section('Research desk',sub(`${g.science} research points from production and survey milestones`),
      g.mods.prototypes?row('Prototype cutting edge','More cutting force on mature trunks',btn(g.prototypes.has('edge')?'Installed':'12 points',()=>{
        if(g.develop('edge'))this.c.refresh();
      },g.prototypes.has('edge')||g.science<12)):undefined,
      g.mods.prototypes?row('Efficient motor assembly','Reduces the charge drawn by powered tools',btn(g.prototypes.has('motor')?'Installed':'20 points',()=>{
        if(g.develop('motor'))this.c.refresh();
      },g.prototypes.has('motor')||g.science<20)):undefined):undefined;
    this.panel('Upgrades',`${g.ownedUpgrades.size} installed · ${available} available designs · ${cash(g.cash)} in the wallet`,el('div','panel-content',
      tabs,research,section(branches[this.branch],...displayed.map(item=>{
        const owned=g.ownedUpgrades.has(item.id),prereq=item.previous&&!g.ownedUpgrades.has(item.previous);
        const unavailable=!item.implemented||(item.id==='24-12'&&!g.won);
        return row(item.name,item.id==='24-12'&&!g.won?'Requires completed campaign':unavailable?'In development':item.description,btn(owned?'Installed':unavailable?'Unavailable':prereq?'Requires previous':cash(item.price),()=>{
          if(!g.buyUpgrade(item.id))this.notice('Required facility or funds unavailable');
          this.c.refresh();
        },owned||unavailable||Boolean(prereq)||g.cash<item.price));
      }))));
  }

  private map() {
    const g=this.c.game();
    const grid=el('div','map-grid');
    const aquifer=(i:number)=>g.soil.get(i)?.groundwater??.85;
    const controls=el('div','controls-row survey-controls');
    const availableLayers=[['Biome stage','stage'],['Soil moisture','moisture'],['Water table','groundwater'],['Heat','heat']] as const;
    const researchLayers=[['Vegetation','vegetation'],['Fertility','fertility'],['Erosion','erosion']] as const;
    for(const [name,id] of [...availableLayers,...(g.mods.soilOverlay?researchLayers:[])]) {
      controls.append(action(name,()=>{this.layer=id;this.map();},this.layer===id?'branch selected':'branch'));
    }
    const metrics=Array.from({length:DISTRICTS**2},()=>({moisture:.68*DISTRICT_CELLS,groundwater:.85*DISTRICT_CELLS,
      heat:.12*DISTRICT_CELLS,vegetation:DISTRICT_CELLS,fertility:.9*DISTRICT_CELLS,erosion:0}));
    const layers=Array.from({length:DISTRICTS**2},()=>[DISTRICT_CELLS,0,0,0,0,0,0]);
    for(const [i,s] of g.soil) {
      const district=districtAt(i);
      const stage=desertified(s)?6:Math.min(s.stage,5);
      layers[district][0]--;
      layers[district][stage]++;
      metrics[district].moisture+=s.moisture-.68;
      metrics[district].groundwater+=s.groundwater-.85;
      metrics[district].heat+=s.heat-.12;
      metrics[district].vegetation+=s.vegetation-1;metrics[district].fertility+=s.fertility-.9;metrics[district].erosion+=s.erosion;
    }
    for(let i=0;i<DISTRICTS**2;i++) {
      const b=action('',()=>{this.district=i;this.map();},i===this.district?'zone active':'zone');
      const desert=g.desertByDistrict[i];
      const style=layers[i].reduce((most,n,index)=>n>layers[i][most]?index:most,0);
      const precision=this.layer==='stage'?0:Math.round(metrics[i][this.layer]*100/DISTRICT_CELLS);
      const soil=this.layer==='stage'?soilColors[style]
        : this.layer==='heat'?`hsl(${51-.42*precision} 55% ${33+precision*.18}%)`:`hsl(${40+precision*1.75} 39% ${33+precision*.18}%)`;
      b.style.setProperty('--land',soil);
      b.title=this.layer==='stage'?`${stages[style]} is the largest biome · ${coverageLabel(desert)}% stable`:districtName(i);
      b.setAttribute('aria-pressed',String(i===this.district));
      b.append(el('strong','',districtName(i)),el('small','',this.layer!=='stage'?precision+'%':desert?coverageLabel(desert)+'%':g.districts.has(i)?'OWNED':'·'));
      grid.append(b);
    }
    const district=this.district,count=g.desertByDistrict[district];
    const built=g.projects.find(p=>p.district===district);
    const biomeLegend=el('ul','biome-legend');
    for(const [stage,name] of stages.entries()){
      const swatch=el('span','biome-swatch');
      swatch.style.backgroundColor=soilColors[stage];
      swatch.setAttribute('aria-hidden','true');
      biomeLegend.append(el('li','',swatch,el('span','',name),el('strong','',value(layers[district][stage]))));
    }
    const labels:Record<Blocker,string>={vegetation:'Clear vegetation',moisture:'Dry surface',ground:'Lower groundwater or fertility',substrate:'Expose substrate',time:'Wait for stabilization'};
    const survey=g.scan(district,16,this.filter);
    const filtered=el('div','controls-row survey-controls');
    if(g.mods.filters){
      const names:([Blocker|undefined,string])[]=[[undefined,'All blockers'],...Object.entries(labels) as [Blocker,string][]];
      for(const [type,name] of names)filtered.append(action(name,()=>{this.filter=type;this.map();},this.filter===type?'branch selected':'branch'));
    }
    const selected=el('div','panel-content',cards(tc(conversionLabel(g.desertCount)+'%','Campaign desert'),tc(value(g.desertCount)+' / '+value(TOTAL),'Stable cells')),controls,grid,
      section('District '+districtName(district),sub(`${value(count)} / ${value(DISTRICT_CELLS)} cells stable${g.mods.census?' · '+(DISTRICT_CELLS-count)+' remaining · '+desertRules.stabilization+'s verified hold':''}`),
        biomeLegend,
        g.mods.droneSurvey?btn('Fly survey drone',()=>this.c.survey(districtCenter(district))):undefined,
        g.districts.has(district)?sub('Permit active'):btn('Purchase permit · $950',()=>{if(g.buyDistrict(district))this.map();},g.cash<950)),
      section('District projects',sub(`Each completed project pays a ${cash(projectBond)} bond once all district cells stabilize.`),
        ...Object.entries(districtProjects).map(([key,rules])=>{
          const kind=key as Project['kind'];
          const issues=g.projectBlockers(district,kind);
          const state=built?.kind===kind?(built.complete?`Bond paid · completed in ${duration(built.phase)}`:`Commissioned · ${duration(built.phase)} elapsed`):issues.join(' · ');
          const cost=`Net project cost after bond ${cash(rules.price-projectBond)}`;
          return row(rules.name,state?cost+' · '+state:cost,
            btn(cash(rules.price),()=>{if(g.startProject(district,kind))this.map();},Boolean(issues.length)));
        })),
      g.mods.aquiferMap?section('Aquifer connectivity',
        sub('District averages use the groundwater in their individual cells. Pump outlets serve facilities within their pipe network.'),
        ...[district-DISTRICTS,district+DISTRICTS,district-1,district+1].filter(i=>i>=0&&i<DISTRICTS**2&&Math.abs(Math.floor(i/DISTRICTS)-Math.floor(district/DISTRICTS))+
          Math.abs(i%DISTRICTS-district%DISTRICTS)===1).map(i=>row(districtName(i),Math.round(metrics[i].groundwater*100/DISTRICT_CELLS)+'% mean groundwater'))):undefined,
      section('Remaining-cell survey',filtered,
        g.mods.lastPixel?btn('Queue visible cleanup jobs',()=>{for(const {i}of survey)g.dispatchCleanup(i);this.map();},!survey.length||!g.districts.has(district)):undefined,
        ...survey.map(({i,at,soil})=>{
          const pending=g.cleanup.find(job=>job.cell===i);
          const actual=`Vegetation ${Math.round(soil.vegetation*100)}% · Moisture ${(soil.moisture*100).toFixed(g.mods.surveyor?1:0)}% · Substrate ${Math.round(soil.substrate*100)}%`;
          const water=g.mods.groundScan?' · Water table '+Math.round(aquifer(i)*100)+'%':'';
          const precise=g.mods.surveyor?' · Roots active '+(soil.vegetation>.03&&soil.fertility>.22?'yes':'no'):'';
          const next=g.mods.diagnostics?' · '+blockers(soil).map(blocker=>labels[blocker]).join(' / '):'';
          return row(`Cell ${i} · ${stages[soil.stage]}`,actual+water+precise+next+(pending?` · Crew ${pending.travel?'in transit':'working'}`:''),
            btn('Mark',()=>this.c.waypoint(at)),g.mods.cleanupDispatch?btn('Dispatch · $80',()=>{
              if(!g.dispatchCleanup(i))this.notice('A suitable crew, district permit and funds are required');
              this.map();
            },Boolean(pending)||!g.districts.has(district)||g.cash<80):undefined);
        })));
    this.panel('Land survey','The survey tracks every cell, including the ground beneath machinery and roads.',selected);
  }

  private journal() {
    const g=this.c.game();
    this.panel('Field journal','Production, contracts, lifetime achievements and receipts.',el('div','panel-content',
      cards(tc(value(g.stats.harvest),'Trees harvested'),tc(value(g.stats.produced),'Units refined'),tc(cash(g.stats.earned),'Lifetime earnings'),tc(duration(g.clock),'Time in field')),
      section('Field objectives',...(Object.entries(quests) as [QuestId,typeof quests[QuestId]][]).map(([id,objective])=>{
        const accomplished=g.claimed.has(id), progress=Math.min(objective.target,objective.progress(g));
        return row(objective.title,`${objective.detail} · ${value(progress)} / ${value(objective.target)}`,
          btn(accomplished?'Recorded':objective.reward?`Claim ${cash(objective.reward)}`:'Record',()=>{
            if(g.claimQuest(id))this.c.refresh();
          },accomplished||progress<objective.target));
      })),
      g.mods.opsPolicy?section('Operations policy',row('Dispatch modes',g.policy,...(['manual','revenue','land'] as const).map(mode=>
        btn(mode,()=>{g.policy=mode;this.c.refresh();},g.policy===mode)))):undefined,
      section('Operations',
        row('Field bulletin',g.eventAt()),
        row('Earnings per field minute',g.clock>2?cash(g.stats.earned/(g.clock/60)):'Begin field work'),
        row('Average swings per harvest',g.stats.harvest?String(Math.round(g.stats.hits/g.stats.harvest)):'No harvest recorded'),
        row('Machine bottlenecks',g.sites.filter(site=>['No grid power','Output full','Awaiting suitable material'].includes(site.status)).map(site=>facilities[site.kind].name+' · '+site.status).join(' / ')||'No blocked production'),
        row('Desert cells per field hour',g.clock>60?value(g.desertCount/(g.clock/3600)):'Collecting data')),
      section('Awards',g.achievements.size?undefined:sub('Earn your first award by felling a tree.'),...Array.from(g.achievements,a=>row(a,'Unlocked'))),
      g.mods.receiptBook?section('Fire ledger',
        row('Delivered wood',cash(g.ledger.filter(l=>l.note.includes('Ash Exchange')&&l.amount>0).reduce((sum,l)=>sum+l.amount,0))),
        row('Fireyard spending',cash(-g.ledger.filter(l=>l.amount<0&&(l.note.includes('Ash Exchange')||l.note.includes('Fire'))).reduce((sum,l)=>sum+l.amount,0)))):undefined,
      section('Recent receipts',g.ledger.length?undefined:sub('Receipts appear after the first transaction.'),
        ...g.ledger.slice(0,18).map(entry=>row(entry.note,duration(entry.date),el('strong',entry.amount>0?'positive':'',`${entry.amount>0?'+':'−'}${cash(Math.abs(entry.amount))}`))))));
  }

  private site() {
    const s=this.c.site(),g=this.c.game();
    if(!s) return this.c.resume();
    const def=facilities[s.kind];
    const recipe:Recipe|undefined=Object.hasOwn(recipes,s.kind)?recipes[s.kind as keyof typeof recipes]:undefined;
    const primary=g.sites.find(target=>target.id===s.link);
    const secondary=g.sites.find(target=>target.id===s.secondary&&target!==primary);
    const content=el('div','panel-content',cards(tc(s.status,'Facility status'),tc(String(getQuantity(s.output)),'Output stock'),tc(recipe?.power?recipe.power+' kW':String(getQuantity(s.input)),recipe?.power?'Power demand':'Input stock')));
    if(buyerSite(s.kind)) {
      const activeOrders=g.contracts.filter(deal=>isOpenContract(deal,g.clock));
      const orderHistory=g.contracts.filter(deal=>!isOpenContract(deal,g.clock)).slice(0,4);
      content.append(section('Price comparison',sub('Typical returns per starter sapling. Buyer payout varies with quality and moisture.'),
        row('Ash Exchange','One green sapling, paid after burning',el('strong','','~$17')),
        row('Timber Exchange','One unit of green timber',el('strong','','~$26')),
        row('Field Sawbench','Two green boards, sold at the exchange',el('strong','','~$71'))),
      section('Sell from your bag',...g.stock.filter(lot=>g.buyerAccepts(s,lot)).map(lot=>row(goods[lot.good][0],`${lot.quantity} units`,btn('Sell one',()=>{g.sellInventory(lot.good,1,lot,s);this.site();}),
        btn(`Sell batch · ${cash(g.marketValue(lot,s))}`,()=>{g.sellInventory(lot.good,lot.quantity,lot,s);this.site();})))),
      section('Freight contracts',...activeOrders.map(deal=>{
        const quote=g.deliveryQuote(deal);
        const grade=deal.grade?` · ${Math.round(deal.grade*100)}% minimum grade`:'';
        const progress=`${deal.received??0} / ${deal.quantity} units${grade} · ${duration(deal.deadline-g.clock)} remaining`;
        const shortage=quote&&quote.available<quote.quantity?` · ${value(quote.quantity-quote.available)} more needed`:'';
        return row(goods[deal.good][0],progress+shortage,quote?btn(`Deliver ${value(quote.quantity)} · ${cash(quote.payout)}`,
          ()=>{g.fulfill(deal);this.site();},quote.available<quote.quantity):undefined);
      }),
        ...(['boards','dry','crates','paper','compute',...(g.mods.ashContracts?['timber']:[]),...(g.mods.bioOrders?['briquettes','pellets']:[]),...(g.mods.exportOrders?['packed']:[]),...(g.mods.certified?['finished','treated']:[])] as Good[]).map(kind=>btn('Contract · '+goods[kind][0],()=>{g.acceptContract(kind);this.site();},!g.canTakeContract())),
        g.mods.denseCompute?btn('Contract · High-density compute',()=>{g.acceptContract('compute',true);this.site();},
          !g.canTakeContract()):undefined,
        ...orderHistory.map(deal=>row(goods[deal.good][0],`${deal.received??0} / ${deal.quantity} units · ${deal.done?'Closed':'Expired'}`))),
      g.mods.shortOrders||g.mods.supplyDeals||g.mods.exportMarket?section('Delivery programs',
        g.mods.shortOrders?btn('Accept quick timber order',()=>{g.acceptContract('timber',false,'quick');this.site();},!g.canTakeContract()):undefined,
        g.mods.supplyDeals?btn('Accept standing board order',()=>{g.acceptContract('boards',false,'supply');this.site();},!g.canTakeContract()):undefined,
        g.mods.exportMarket?btn('Accept graded furniture export',()=>{g.acceptContract('furniture',false,'export');this.site();},!g.canTakeContract()):undefined):el('span'),
      g.mods.bulletin?section('Timber price bulletin',...([.56,.77,.93].map(grade=>{
        const lot={good:'timber' as Good,quantity:1,quality:grade,moisture:.50};
        return row(Math.round(grade*100)+'% grade','One unit of timber',el('strong','',cash(g.marketValue(lot,s))));
      })),g.mods.forecast?row('Tomorrow’s board bid',(()=>{
        const lot={good:'boards' as Good,quantity:1,quality:.87,moisture:.42};
        const estimate=g.marketValue(lot,s,g.clock+180);
        return cash(estimate-4)+'–'+cash(estimate+4)+' per unit';
      })()):undefined):el('span'),
      g.mods.commissions?section('Custom-order studio',...(['finishedCabinet','floors','modular'] as Good[]).map(good=>row(goods[good][0],
        'Commission graded stock for a specialist customer',btn('Standard',()=>{g.acceptCommission(good);this.site();},!g.canTakeContract()),
        btn('Premium',()=>{g.acceptCommission(good,true);this.site();},!g.canTakeContract())))):el('span'));
    } else {
      content.append(section('Operation',row('Run schedule',s.on?'Enabled while in the field':'Stopped',btn(s.on?'Stop':'Start',()=>{s.on=!s.on;this.site();})),
        g.mods.staffing&&(Boolean(recipe)||s.kind==='crewDepot')?row('Machine operator',s.staffed?'On shift · $9 wages per 65 field seconds':'Available · $40 to hire',
          btn(s.staffed?'End shift':'Hire',()=>{if(g.staff(s))this.site();},!s.staffed&&g.cash<40)):undefined,
        g.mods.buffer&&Boolean(recipe)?row('Output buffer',`${g.capacity(s)} units`,btn(s.enlarged?'Extended':'Install · $65',()=>{
          if(g.enlarge(s))this.site();
        },Boolean(s.enlarged)||g.cash<65)):undefined,
        g.mods.emissions&&def.effect==='thermal'?row('Emissions policy',s.scrubbers?'Scrubbers on · lower output and emissions':'Full power · higher heat and emissions',
          btn('Switch',()=>{s.scrubbers=!s.scrubbers;this.site();})):undefined,
        g.mods.meter?row('Grid meter',def.supply?`${Math.round(s.gridFlow??0)} / ${Math.round(s.gridCapacity??0)} kW delivered`:
          `${Math.round(s.gridFlow??0)} kW drawn`):undefined,
        g.mods.priority?row('Dispatch order',s.priority?'Priority load':'Normal load',btn('Change',()=>{
          s.priority=!s.priority;this.site();
        })):undefined,
        s.kind==='battery'?row('Grid reserve',Math.round(s.reserve??0)+' / 680 charge'):undefined,
        s.kind==='crop'&&!g.mods.cropHarvester?row('Sowing orders',String(s.planted??0)+' ready',btn('Sow · $12',()=>{
          g.sow(s);this.site();
        },g.cash<12||(s.planted??0)>=3)):undefined,
        (s.kind==='crop'||s.kind==='megaFarm')&&g.mods.fertilizer?row('Fertilizer',s.fertilizer?'Applied to next harvest':'Increases yield and depletes soil',
          btn('Apply · $45',()=>{g.fertilize(s);this.site();},g.cash<45||Boolean(s.fertilizer))):undefined,
        fields.includes(s.kind)&&g.mods.override?row('Crop rotation',s.intensive?'Intensive':'Normal',btn('Switch',()=>{
          s.intensive=!s.intensive;this.site();
        })):undefined,
        s.kind==='bench'&&g.mods.benchCrank?row('Manual crank',s.manual?'Wait for your crank order':'Start the next batch automatically',
          btn(s.manual?'Use automatic feed':'Use manual feed',()=>{s.manual=!s.manual;this.site();}),
          btn('Crank saw',()=>{if(g.crankBench(s))this.site();},Boolean(s.jobs.length)||getQuantity(s.input,'timber')===0)):undefined,
        g.mods.cutPatterns&&mills.includes(s.kind)?row('Cut pattern',s.layout==='volume'?'Maximize volume':s.layout==='quality'?'Select high-grade cuts':'Standard throughput',
          btn('Cycle',()=>{s.layout=s.layout==='volume'?'quality':s.layout==='quality'?undefined:'volume';this.site();})):undefined,
        (g.mods.sortingCamera||g.mods.roboticSort)?row('Sorting gate',s.sortHigh?'Route high-grade batches only':'Route all compatible stock',
          btn('Change',()=>{s.sortHigh=!s.sortHigh;this.site();})):undefined,
        def.supply&&!['solar','wind',...biomassSites].includes(s.kind)?row('Fuel',Math.floor(s.fuel)+'%',btn('Refuel · $25',()=>{if(g.cash>=25){g.finance(-25,'Generator fuel');s.fuel=100;this.site();}},g.cash<25||s.fuel===100)):undefined,
        waterSites.includes(s.kind)?row('Water storage',Math.floor(s.water??0)+' / '+waterCapacity(s.kind)+' L'):undefined,
        s.kind==='handPump'?row('Manual extraction','Draw water from the current cell',btn('Pump',()=>{g.pumpByHand(s);this.site();})):undefined,
        waterSites.includes(s.kind)&&g.mods.diversion?row('Allocation',
          s.waterMode==='farm'?'Farms and farm-only reservoirs':s.waterMode==='industry'?'Industry and industry-only reservoirs':'Shared supply',btn('Switch priority',()=>{
          s.waterMode=s.waterMode==='farm'?'industry':s.waterMode==='industry'?'all':'farm';this.site();
        })):undefined,
        waterPumps.includes(s.kind)&&s.kind!=='handPump'&&g.mods.waterBoard?row('Pump schedule',s.waterRate??'normal',btn('Switch rate',()=>{
          s.waterRate=s.waterRate==='conserve'?'deplete':s.waterRate==='deplete'?'normal':'conserve';this.site();
        })):undefined,
        computeSites.includes(s.kind)?row('Compute scheduling',s.kind==='serverRack'?'Requires a live compute contract and electricity.':
          'Requires a live compute contract, electricity and cooling water. Inspect the flow at the pump or reservoir.'):undefined,
        computeSites.includes(s.kind)&&g.mods.backup?row('Battery reserve',Math.floor(s.reserve??0)+' / 700 charge'):undefined,
        s.kind==='fire'&&g.mods.carbon?row('Fire mode',s.mode==='charcoal'?'Charcoal collection':'Cash sale',btn('Switch',()=>{s.mode=s.mode==='charcoal'?'sell':'charcoal';this.site();})):undefined,
        ...s.jobs.map(job=>row(goods[job.good][0],`${Math.ceil(Math.max(0,job.remaining))}s remaining`))),
      section('Output',
        s.output.length?undefined:sub('No batches ready. Resume play to run production.'),
        ...s.output.map(lot=>row(goods[lot.good][0],`${lot.quantity} units · ${Math.floor(lot.quality*100)}% grade${g.mods.moistureGauge?' · '+Math.round(lot.moisture*100)+'% moisture':''}`,
          btn('Take one',()=>{g.transfer(s,lot.good,1,true);this.site();}),btn('Take batch',()=>{g.transfer(s,lot.good,lot.quantity,true);this.site();})))),
      section('Feed from your bag',...g.stock.filter(lot=>storageSite(s.kind)&&(s.kind!=='fuelSilo'||fuelGood(lot.good))||consumes(recipe,lot.good)||biomassSites.includes(s.kind)&&fuelGood(lot.good)).map(lot=>row(goods[lot.good][0],`${lot.quantity} units available`,
        btn('Feed one',()=>{g.transfer(s,lot.good,1,false);this.site();}),btn('Feed batch',()=>{g.transfer(s,lot.good,lot.quantity,false);this.site();})))),
      section('Freight route',
        s.shipment?row(s.shipment.returning?'Returning to the garage':'Shipment on the move',`${s.shipment.returning?0:s.shipment.load.quantity} × ${goods[s.shipment.load.good][0]} · ${Math.max(0,Math.ceil(s.shipment.duration-s.shipment.elapsed))}s`):undefined,
        primary?row('Primary · '+facilities[primary.kind].name,g.routeStatus.get(s.id+':'+primary.id)??'Waiting for the next field tick',
          btn('Disconnect primary',()=>{g.disconnectRoute(s);this.site();},Boolean(s.shipment))):
          sub(s.kind==='railDepot'?'Lay connected track between the depot and its destination.':
            s.kind==='dronePad'?'Power the charger, then choose a destination up to 320 m away.':'Choose a compatible facility or connect farther receivers with freight infrastructure.'),
        secondary?row('Alternate · '+facilities[secondary.kind].name,g.routeStatus.get(s.id+':'+secondary.id)??'Waiting for the next field tick',
          btn('Disconnect alternate',()=>{g.disconnectRoute(s,true);this.site();})):undefined,
        ...g.sites.filter(target=>target!==s && (buyerSite(target.kind)||storageSite(target.kind)||Object.hasOwn(recipes,target.kind)||biomassSites.includes(target.kind)||target.kind==='fire')).map(target=>
          row(facilities[target.kind].name,`${Math.round(Math.hypot(s.x-target.x,s.z-target.z))} m${g.mods.brokerage?' · estimated '+cash(Math.max(2,Math.round(Math.hypot(s.x-target.x,s.z-target.z)*.055)))+' freight per dispatch':''}`,btn('Connect',()=>{
            if(!g.connect(s,target))this.notice('Route out of reach, disconnected or already in use');
            this.site();
          },s.link===target.id||s.secondary===target.id)))));
    }
    if(s.kind==='clearingCrew'){
      const choices=g.scan(this.district,10,'vegetation');
      content.append(section('Clearing work order',s.clearingTarget===undefined?sub('Choose a cell in the selected survey district.'):
        sub(`Working cell ${s.clearingTarget}`),
        ...choices.map(({i,at})=>row('Cell '+i,`${Math.round(at.x)}, ${Math.round(at.z)}`,btn('Assign',()=>{
          s.clearingTarget=i;this.site();
        },!g.districts.has(this.district)||s.clearingTarget===i)))));
    }
    if(s.kind==='craneYard'){
      const ground=[...g.logs.values()].filter(log=>!log.cargo&&!log.carrier&&Math.hypot(log.x-s.x,log.z-s.z)<11);
      const nearby=g.rides.filter(v=>Math.hypot(v.x-s.x,v.z-s.z)<10);
      content.append(section('Crane orders',s.crane?sub(`Lifting log ${s.crane.log} · ${Math.ceil(s.crane.remaining)}s left`):
        sub('Park a vehicle and stage logs within reach of the crane. The lift uses grid power.'),
        ...ground.slice(0,8).map(log=>row('Log '+log.id,`${Math.round(log.kilograms)} kg`,...nearby.map(v=>
          btn('Load '+vehicles[v.kind].name,()=>{
            if(!g.loadByCrane(s,log,v))this.notice('The load does not fit or the crane is busy');
            this.site();
          },Boolean(s.crane)))))));
    }
    if(s.kind==='serviceBay')content.append(section('Fleet service',
      s.mechanic?sub(`Service running · ${Math.ceil(s.mechanic.time)}s remaining`):sub('Repair and refuel nearby fleet vehicles.'),
      ...g.rides.filter(v=>Math.hypot(v.x-s.x,v.z-s.z)<10).map(v=>row(vehicles[v.kind].name,
        `${Math.ceil(v.wear)}% wear · ${Math.floor(v.fuel)}% fuel`,btn('Service · $18',()=>{
          if(g.scheduleService(s,v))this.site();
        },Boolean(s.mechanic)||g.cash<18||v.fuel===100&&v.wear===0)))));
    if(s.kind==='intermodal')content.append(section('Transfer mode',
      row('Dispatch by',s.freightPlan??'rail',btn('Switch',()=>{
        if(s.shipment)return;
        s.freightPlan=s.freightPlan==='road'?'rail':'road';s.link=undefined;this.site();
      },Boolean(s.shipment)))));
    if(s.kind==='autoGarage')content.append(section('Owned freight fleet',
      sub('Assign a parked, empty vehicle and connect a receiver on the road network.'),
      ...g.rides.filter(v=>['pickup','truck','regionalTruck','flatbed'].includes(v.kind)&&Math.hypot(v.x-s.x,v.z-s.z)<12)
        .map(v=>row(vehicles[v.kind].name,`${Math.floor(v.fuel)}% fuel`,btn(s.dedicatedRide===v.id?'Release vehicle':'Assign vehicle',()=>{
          if(s.dedicatedRide===v.id&&!s.shipment)s.dedicatedRide=undefined;
          else if(!g.assignDriverless(s,v))this.notice('Vehicle must be parked, empty and free of other assignments');
          this.site();
        },Boolean(s.shipment))))));
    if(g.mods.sortGate&&['sortGate','robotSorter'].includes(s.kind)) {
      const good=el('select','input'),receiver=el('select','input');
      for(const [id,spec]of Object.entries(goods)){
        const option=el('option','',spec[0]);option.value=id;good.append(option);
      }
      for(const target of g.sites.filter(v=>v!==s&&v.id!==s.link)){
        const option=el('option','',facilities[target.kind].name+' · '+target.id);
        option.value=target.id;receiver.append(option);
      }
      good.value=s.sortGood??'boards';
      if(s.secondary)receiver.value=s.secondary;
      content.append(section('Material sorting',
        row('Alternate lane','Send the selected material to a separate receiver while the primary lane handles the rest.',
          good,receiver,btn('Apply',()=>{
            const target=g.sites.find(v=>v.id===receiver.value);
            if(!target||!g.connectAlternate(s,target,good.value as Good))this.notice('The alternate route needs a connected receiver');
            this.site();
          }))));
    }
    if(s.kind==='logisticsHub')content.append(section('Factory throughput',
      ...g.sites.filter(v=>v.link||v.secondary).map(v=>row(facilities[v.kind].name,
        [`${v.shipped??0} units moved · ${getQuantity(v.output)} in buffer`,...([v.link,v.secondary].flatMap(id=>{
          const target=g.sites.find(site=>site.id===id);
          return target?[`${facilities[target.kind].name} · ${g.routeStatus.get(v.id+':'+id)??'Waiting for the next field tick'}`]:[];
        }))].join(' · ')))));
    if(s.kind==='climateTower')content.append(section('Climate history',
      s.climate?.length?undefined:sub('Resume play with grid power to record regional readings.'),
      ...(s.climate??[]).map(sample=>row(duration(sample.time),`${sample.desert} stable cells · ${Math.round(sample.moisture*100)}% soil moisture · ${Math.round(sample.heat*100)}% heat index`))));
    if(s.kind==='winch') {
      const logs=[...g.logs.values()].filter(log=>!log.cargo&&!log.carrier&&Math.hypot(s.x-log.x,s.z-log.z)<=22&&log.kilograms<=420);
      content.append(section('Cable',sub('Attach the powered drum to an actual log within 22 m. Resume play to reel it in.'),
        s.winch?btn('Release cable',()=>{g.assignWinch(s);this.site();}):undefined,
        ...logs.map(log=>row('Log '+log.id,`${Math.round(log.kilograms)} kg · ${Math.round(Math.hypot(s.x-log.x,s.z-log.z))} m away`,
          btn(s.winch?.log===log.id?'Attached':'Attach cable',()=>{
            if(!g.assignWinch(s,log))this.notice('Another winch already has this log');
            this.site();
          },s.winch?.log===log.id)))));
    }
    if(['forestry','helperPost','crewDepot'].includes(s.kind)||(g.mods.yardmaster&&storageSite(s.kind))) {
      if(g.mods.jobBoards)content.append(section('Work orders',
        row('Current assignment',s.order??'Open operations',...(['harvest','haul','clear'] as const).map(task=>
          btn(task,()=>{s.order=task;this.site();},s.order===task))),
        g.mods.scheduling?row('Crew schedule',s.shift??'continuous',btn('Change shift',()=>{
          s.shift=s.shift==='day'?'continuous':'day';this.site();
        })):undefined));
      const options=g.sites.filter(target=>buyerSite(target.kind)||storageSite(target.kind)||(Object.hasOwn(recipes,target.kind)&&(recipes[target.kind as keyof typeof recipes] as Recipe).input?.[0]==='timber'));
      content.append(section('Log hauler',sub(s.haul?.status??'Hire a worker to collect physical fallen logs within range.'),
        s.mechanic?row('Maintenance dispatch',`Vehicle ${s.mechanic.ride.toUpperCase()} · ${Math.ceil(s.mechanic.time)}s`):undefined,
        ...options.filter(target=>target!==s&&Math.hypot(s.x-target.x,s.z-target.z)<=110).map(target=>
          row(facilities[target.kind].name,'Timber receiving station',btn(s.haul?'Assign':'Hire · $340',()=>{
            if(!g.assignHauler(s,target))this.notice('The worker is assigned to a load or funds are insufficient.');
            else s.order='haul';
            this.site();
          },s.haul?.target===target.id||(!s.haul&&g.cash<340)),
          g.mods.fleetController&&s.haul?.target!==target.id&&s.haul?btn(s.haul.alternate===target.id?'Alternate set':'Alternate',()=>{
            if(s.haul){s.haul.alternate=target.id;this.site();}
          },s.haul.alternate===target.id):undefined))));
    }
    this.panel(def.name,'Station · '+s.id.toUpperCase(),content);
  }
}

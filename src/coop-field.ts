import type { Campaign, Log } from './campaign';
import { takesLogs } from './campaign';
import { SIZE, TOTAL, facilities, species, tools, vehicles } from './catalog';
import type { Facility, Tool, VehicleType } from './catalog';
import type { Pose } from './coop-wire';
import { clamp, distance, treesIn, treesPerCell } from './land';
import type { Point, Tree } from './land';
import { upgradesById } from './upgrades';

function nearTrunk(log:Log,pose:Pose,reach:number) {
  const [x,y,z,w]=log.q, dx=2*(x*y-z*w),dz=2*(y*z+x*w);
  const offset=clamp((pose.x-log.x)*dx+(pose.z-log.z)*dz,-log.length*.44,log.length*.44);
  return distance({x:log.x+dx*offset,z:log.z+dz*offset},pose)<=reach;
}

export function placementAt(p:Pick<Pose,'x'|'z'|'yaw'|'pitch'>, facility?:Facility) {
  const range=clamp(4.7-Math.max(0,-p.pitch)*.7,3.7,5.4)+(facility?facilities[facility].size*.53:0);
  return {x:Math.round((p.x-Math.sin(p.yaw)*range)*2)/2,z:Math.round((p.z-Math.cos(p.yaw)*range)*2)/2};
}

export function treeAim(game:Campaign,p:Pose,tree:Tree,reach:number) {
  if(Math.abs(p.pitch)>1.40||distance(p,tree)>reach+.9)return;
  const dx=-Math.sin(p.yaw),dz=-Math.cos(p.yaw);
  const along=(tree.x-p.x)*dx+(tree.z-p.z)*dz;
  if(along<.22||along>reach)return;
  const type=species[tree.kind], ground=game.ground(tree.x,tree.z);
  const width=Math.hypot(p.x+along*dx-tree.x,p.z+along*dz-tree.z);
  const y=game.ground(p.x,p.z)+1.64+p.lift+Math.tan(p.pitch)*along;
  if(width>type.radius*tree.scale+(game.mods.forestryMastery?.19:.095)||y<ground+.21||y>ground+type.height*tree.scale*.84)return;
  return along;
}

export class CrewWork {
  private held=new Map<number,{id:number;pose:Pose;at:number;mode:'hand'|'rope'|'lift'}>();
  private actors=new Map<number,{pose:Pose;at:number;lastAction:number;lastSwing:number;reverse:boolean}>();
  constructor(private game:()=>Campaign,private fall:(tree:Tree,pose:Pose)=>void,
    private falling:(tree:Tree)=>boolean,private hostHeld:()=>Log|undefined) {}

  isHeld(id:number) {
    for(const log of this.held.values())if(log.id===id)return true;
    return false;
  }

  observe(actor:number,pose:Pose,now:number) {
    const previous=this.actors.get(actor);
    if(previous&&distance(previous.pose,pose)>3+Math.min(3,(now-previous.at)/1000)*24)return false;
    if(previous){previous.pose=pose;previous.at=now;}
    else this.actors.set(actor,{pose,at:now,lastAction:-Infinity,lastSwing:-Infinity,reverse:false});
    const held=this.held.get(actor);
    if(held){held.pose=pose;held.at=now;}
    return true;
  }

  tick(now:number) {
    const game=this.game();
    for(const [actor,held] of this.held) {
      const log=game.logs.get(held.id);
      if(!log||log.cargo||log.carrier||now-held.at>3500){this.held.delete(actor);continue;}
      const {x,z,yaw}=held.pose;
      const reach=held.mode==='rope'?3.3:held.mode==='lift'?1.25:1.65;
      log.x=clamp(x-Math.sin(yaw)*reach,-SIZE/2+.6,SIZE/2-.6);
      log.z=clamp(z-Math.cos(yaw)*reach,-SIZE/2+.6,SIZE/2-.6);
      log.y=game.ground(log.x,log.z)+(held.mode==='lift'?.89:.44);
    }
  }

  clear() {this.held.clear();this.actors.clear();}

  leave(actor:number) {
    this.held.delete(actor);
    this.actors.delete(actor);
  }

  run(actor:number,pose:Pose,data:unknown,now:number):string|undefined {
    if(!Array.isArray(data)||data.length!==2||!this.observe(actor,pose,now))return;
    const [action,target]=data;
    const player=this.actors.get(actor)!;
    const game=this.game();
    if(now-player.lastAction<45&&action!=='drop')return;
    player.lastAction=now;
    if(action==='swing'&&Number.isSafeInteger(target)&&target>=0&&now-player.lastSwing>=game.swingTime*1000-35) {
      const cell=Math.floor(target/treesPerCell);
      if(cell>=TOTAL||['brush','grinder','mulcher','breaker'].includes(game.tool))return;
      const tree=treesIn(game.seed,cell).find(tree=>tree.id===target);
      if(!tree||this.falling(tree)||!game.isStanding(tree)||treeAim(game,pose,tree,tools[game.tool].range)===undefined)return;
      player.lastSwing=now;
      player.reverse=!player.reverse;
      const result=game.hit(tree,player.reverse);
      if(result.felled)this.fall(tree,pose);
    } else if((action==='grab'||action==='rope'||action==='lift')&&Number.isSafeInteger(target)&&!this.held.has(actor)) {
      const log=game.logs.get(target), mode=action==='grab'?'hand':action;
      const reach=mode==='rope'?game.mods.ropeRange:mode==='lift'?1.8:3.3;
      const limit=mode==='rope'?(game.mods.rope?game.mods.ropeMass:0)
        :mode==='lift'?(game.mods.liftLogs?game.mods.liftMass*game.mods.carrySlots:0):game.mods.dragMass;
      if(!log||log.cargo||log.carrier||this.isHeld(log.id)||this.hostHeld()?.id===log.id||
        !nearTrunk(log,pose,reach))return 'That log is unavailable.';
      if(!limit)return 'That log needs unlocked hauling equipment.';
      if(log.kilograms>limit)return 'That log is too heavy for this hauling equipment.';
      this.held.set(actor,{id:log.id,pose,at:now,mode});
      return mode==='hand'?'Log grabbed. Release Interact or press Drop to deliver.':'Log attached. Press Drop to deliver.';
    } else if(action==='drop') {
      this.tick(now);
      const carry=this.held.get(actor);
      this.held.delete(actor);
      const log=carry&&game.logs.get(carry.id);
      if(log&&game.sites.some(site=>takesLogs(site.kind)&&game.acceptLog(site,log)))return 'Timber delivered.';
    } else if(action==='upgrade'&&typeof target==='string'&&upgradesById.has(target)) {
      const item=upgradesById.get(target)!;
      return game.buyUpgrade(target)?item.name+' installed.':'Research prerequisites or funds are missing.';
    } else if(action==='prototype'&&(target==='edge'||target==='motor')) {
      return game.develop(target)?'Prototype research completed.':'Prototype prerequisites or research points are missing.';
    } else if(action==='equip'&&typeof target==='string'&&Object.hasOwn(tools,target)) {
      return game.acquireTool(target as Tool)?tools[target as Tool].name+' equipped for the crew.':'Tool prerequisites or funds are missing.';
    } else if(action==='service') {
      return game.retool()?'Crew tool serviced.':'Tool service needs more funds.';
    } else if(action==='vehicle'&&typeof target==='string'&&Object.hasOwn(vehicles,target)) {
      return game.acquireRide(target as VehicleType,placementAt(pose))?vehicles[target as VehicleType].name+' delivered.':'Vehicle prerequisites, placement or funds are missing.';
    } else if(action==='build'&&typeof target==='string'&&Object.hasOwn(facilities,target)) {
      const kind=target as Facility, point:Point=placementAt(pose,kind);
      const issue=game.siteIssue(kind,point);
      if(issue)return issue;
      const previous=game.player;
      try { game.player=pose; if(game.build(kind,point))return facilities[kind].name+' installed.'; }
      finally { game.player=previous; }
    }
  }
}

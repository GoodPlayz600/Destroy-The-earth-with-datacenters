import type { Campaign } from './campaign';
import { facilities, species } from './catalog';
import type { Facility } from './catalog';
import type { Pose } from './coop-wire';
import { clamp, distance } from './land';
import type { Point, Tree } from './land';
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

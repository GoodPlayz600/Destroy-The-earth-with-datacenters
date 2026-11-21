import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { CELL, SIZE, facilities, species, vehicleTypes } from './catalog';
import { cargoPosition, computeSites, utilityNodes, waterPipes, waterSites } from './campaign';
import type { Campaign, Log, Ride, Site } from './campaign';
import { clamp, distance, hash, indexAt, showsGroundCracks, soilColors, treesIn } from './land';
import type { Point, Tree } from './land';
import type { Pose } from './coop-wire';
import { box, distantTrees, freightModel, helperModel, leafBlade, logModel, mat, productModel, ropeModel, siteModel, stone, stumpModel, toolModel, treeModels, vehicleModel } from './models';

const CHUNK = 32;
const terrainMaterial = new T.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: T.DoubleSide });
const crackGeometry=new T.BoxGeometry(1,1,1);
const crackMaterial=mat('#6e5940');
const toolScene = new T.Scene();
const treeAxis = new T.Vector3(0,1,0);
const buildTint = new T.MeshBasicMaterial({ color:'#ecd49d', wireframe:true, transparent:true, opacity:.68 });

export type Rock=Point&{id:number;size:number};
function garnishPoint(seed:number,cx:number,cz:number,n:number):Point {
  return {x:cx+hash(seed+n,cx,cz+1)*CHUNK,z:cz+hash(seed-n,cz,cx-1)*CHUNK};
}
function terrainRock(game:Campaign,cx:number,cz:number,n:number,{x,z}:Point):Rock|undefined {
  if(Math.hypot(x*.8,z)<11||n%3!==0&&(game.soil.get(indexAt(x,z))?.stage??0)<4)return;
  const id=((cz+SIZE/2)/CHUNK*(SIZE/CHUNK)+(cx+SIZE/2)/CHUNK)*16+n;
  if(!game.brokenRocks.has(id))return {x,z,id,size:.21+hash(game.seed,n,cx)*.68};
}
export function rocksAt(game:Campaign,at:Point,range:number) {
  const rocks:Rock[]=[];
  for(let z=Math.floor((at.z-range)/CHUNK)*CHUNK;z<=at.z+range;z+=CHUNK)
    for(let x=Math.floor((at.x-range)/CHUNK)*CHUNK;x<=at.x+range;x+=CHUNK){
      if(x<-SIZE/2||z<-SIZE/2||x>=SIZE/2||z>=SIZE/2)continue;
      for(let n=0;n<16;n++){
        const rock=terrainRock(game,x,z,n,garnishPoint(game.seed,x,z,n));
        if(rock)rocks.push(rock);
      }
    }
  return rocks;
}
type Chunk = { base:string; rocks:Rock[]; x: number; z: number; ground: T.Mesh<T.BufferGeometry>; cover: T.Group; cells: number[]; signature: string; collider?: R.Collider; trunks: R.Collider[]; near: boolean; };
type Falling = { tree: Tree; model: T.Group; age: number; dir: T.Vector3; segmented:boolean };
type SiteView = ReturnType<typeof siteModel> & { stock?: T.Group; batch?: T.Group; signature?: string };
type Particle = { mesh: T.Mesh; velocity: T.Vector3; life: number; total: number; cloud?: boolean; smoke?:boolean };

export class Scene {
  renderer: T.WebGLRenderer;
  world = new T.Scene();
  camera = new T.PerspectiveCamera(68,innerWidth / innerHeight,.095,220);
  toolCamera = new T.PerspectiveCamera(55,innerWidth / innerHeight,.03,12);
  physics = new R.World({ x:0,y:-13.8,z:0 });
  replica=false;
  onFall?:(id:number,from:Point,wedge:number)=>void;
  onLanded?:(id:number)=>void;
  private roomCrew=new Map<number,ReturnType<typeof helperModel>>();
  remotelyHeld:(id:number)=>boolean=()=>false;
  private chunks = new Map<string, Chunk>();
  private fallers = new Map<number,Falling>();
  private logViews = new Map<number, { model:T.Group; body?: R.RigidBody; length: number }>();
  private siteViews = new Map<string,SiteView>();
  private rideViews = new Map<string,ReturnType<typeof vehicleModel>&{payload?:T.Group; signature?:string}>();
  private chops = new Map<number,T.Group>();
  private routes = new Map<string,T.Group>();
  private crew = new Map<string, ReturnType<typeof vehicleModel>>();
  private freight = new Map<string, ReturnType<typeof freightModel>>();
  private freightClock = 0;
  private packets=new Map<string,{good:string;model:T.Group}>();
  private networkView?:T.Group;
  private networkStamp='';
  private freightTime = new Map<string,number>();
  private particles: Particle[] = [];
  private painter = new T.Object3D();
  private ambient: T.HemisphereLight;
  private sunlight: T.DirectionalLight;
  private sky: T.Mesh<T.SphereGeometry,T.ShaderMaterial>;
  private rope = ropeModel();
  private hitches=new Map<string,T.Mesh>();
  private cables=new Map<string,T.Mesh>();
  private rain = new T.InstancedMesh(new T.CylinderGeometry(.016,.012,.51,4),
    new T.MeshBasicMaterial({color:'#9cb6ac',transparent:true,opacity:.28,depthWrite:false}),145);
  private selection = new T.Mesh(new T.RingGeometry(.2,.235,28),new T.MeshBasicMaterial({color:'#f1d599',side:T.DoubleSide, depthWrite:false, transparent:true, opacity:.8}));
  private ghost = new T.Mesh(new T.BoxGeometry(1,1,1),buildTint);
  private marker = new T.Mesh(new T.ConeGeometry(.6,1.7,5),new T.MeshStandardMaterial({color:'#ecc47a',emissive:'#da8938',emissiveIntensity:.3}));
  private heldTool?: T.Group;
  private trophy?:T.Group;
  private toolKind = '';
  private quality = 'medium';
  private streamStamp = '';
  private landRevision=-1;
  private terrainRevision=-1;
  private physicsTime=0;
  private frameAge=0;
  visibleTrees: Tree[] = [];
  visibleRocks:Rock[]=[];

  constructor(canvas: HTMLCanvasElement, public game: Campaign) {
    this.renderer = new T.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
    this.renderer.outputColorSpace=T.SRGBColorSpace;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.23;
    this.renderer.shadowMap.type=T.PCFShadowMap;
    this.renderer.autoClear=false;
    this.world.fog=new T.FogExp2('#b9b79a',.012);
    this.ambient = new T.HemisphereLight('#e3e6c0','#826752',2.05);
    this.world.add(this.ambient);
    this.sunlight = new T.DirectionalLight('#ffd094',3.2);
    this.sunlight.shadow.camera.left = -25;
    this.sunlight.shadow.camera.right = 25;
    this.sunlight.shadow.camera.top = 25;
    this.sunlight.shadow.camera.bottom = -25;
    this.sunlight.shadow.camera.far=100;
    this.sunlight.shadow.normalBias=.14;
    this.sunlight.shadow.bias=-.00014;
    this.sunlight.shadow.mapSize.set(1536,1536);
    this.world.add(this.sunlight,this.sunlight.target);
    this.sky=new T.Mesh(new T.SphereGeometry(160,24,14), new T.ShaderMaterial({
      side:T.BackSide, depthWrite:false, fog:false,
      uniforms:{ daylight:{value:1} },
      vertexShader:`
        varying vec3 vDirection;
        void main(){ vDirection=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
      `,
      fragmentShader:`
        varying vec3 vDirection;
        uniform float daylight;
        void main(){
          vec3 d=normalize(vDirection);
          float y=max(0.,d.y);
          vec3 day=mix(vec3(.76,.70,.48),vec3(.23,.48,.58),pow(y,.48));
          float a=max(0.,dot(d,normalize(vec3(-.57,.56,-.63))));
          day+=vec3(1.,.62,.24)*(pow(a,15.)*.25+smoothstep(.998,.999,a)*.92);
          vec3 night=mix(vec3(.20,.24,.21),vec3(.045,.095,.15),pow(y,.55));
          gl_FragColor=vec4(mix(night,day,daylight),1.);
        }
      `,
    }));
    this.sky.renderOrder=-10;
    this.world.add(this.sky,this.rope,this.selection,this.ghost,this.marker,this.rain);
    this.rain.frustumCulled=false;
    this.rain.visible=false;
    this.selection.rotation.x=-Math.PI*.5;
    this.marker.rotation.z=Math.PI;
    this.marker.visible=false;
    this.ghost.visible=false;
    this.selection.visible=false;
    toolScene.add(new T.HemisphereLight('#fff5db','#776455',3.25));
    const handSun=new T.DirectionalLight('#f9d7a2',2.2);
    handSun.position.set(1,3,1);
    toolScene.add(handSun);
    this.setQuality('medium');
    this.resize();
    this.stream(game.player,true);
  }

  setQuality(quality: string) {
    if(this.quality===quality&&this.renderer.shadowMap.enabled===(quality!=='low'))return;
    this.quality=quality;
    this.renderer.shadowMap.enabled=quality !== 'low';
    this.sunlight.castShadow=quality !== 'low';
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,quality === 'low' ? .82 : quality === 'high' ? 1.7 : 1.18));
    this.resize();
    this.streamStamp='';
  }
  resize() {
    this.renderer.setSize(innerWidth,innerHeight,false);
    const ratio=innerWidth/Math.max(1,innerHeight);
    this.camera.aspect=ratio;
    this.camera.updateProjectionMatrix();
    this.toolCamera.aspect=ratio;
    this.toolCamera.updateProjectionMatrix();
  }

  replace(game: Campaign) {
    this.game=game;
    for (const [key,chunk] of this.chunks) this.dropChunk(key,chunk);
    for (const {model,body} of this.logViews.values()) { this.world.remove(model); if (body) this.physics.removeRigidBody(body); }
    for (const collection of [this.siteViews,this.rideViews,this.crew,this.freight]) for (const {root} of collection.values()) this.removeModel(root);
    for (const obj of [...this.chops.values(), ...this.routes.values()]) this.world.remove(obj);
    this.logViews.clear(); this.siteViews.clear(); this.rideViews.clear();this.crew.clear(); this.freight.clear();this.freightTime.clear();this.chops.clear(); this.routes.clear();
    for (const f of this.fallers.values()) this.world.remove(f.model);
    this.fallers.clear();
    for(const hitch of this.hitches.values())hitch.removeFromParent();
    this.hitches.clear();
    for(const packet of this.packets.values())this.removeModel(packet.model);
    this.packets.clear();
    this.trophy?.removeFromParent();this.trophy=undefined;
    for(const cable of this.cables.values())cable.removeFromParent();
    this.cables.clear();
    if(this.networkView)this.removeModel(this.networkView);
    this.networkView=undefined;this.networkStamp='';
    this.streamStamp='';
    this.landRevision=-1;
    this.terrainRevision=-1;
    this.stream(game.player,true);
  }

  syncPlayers(poses:ReadonlyMap<number,Pose>|undefined,dt:number) {
    for(const [id,view] of this.roomCrew)if(!poses?.has(id)){
      this.removeModel(view.root);
      this.roomCrew.delete(id);
    }
    if(!poses)return;
    for(const [id,pose] of poses) {
      const target=new T.Vector3(pose.x,this.game.ground(pose.x,pose.z)+pose.lift,pose.z);
      let view=this.roomCrew.get(id);
      if(!view) {
        view=helperModel();
        box(view.root,mat('#b1e2a4'),0,1.84,0,.24,.05,.10);
        view.root.position.copy(target);
        this.world.add(view.root);
        this.roomCrew.set(id,view);
      }
      const travel=target.distanceTo(view.root.position);
      view.root.position.lerp(target,travel>15?1:Math.min(1,dt*11));
      view.root.rotation.y=pose.yaw;
      view.wheels.forEach((part,i)=>{part.rotation.x=Math.sin(this.frameAge*12+i*Math.PI/2)*Math.min(.55,travel*.4);});
    }
  }

  private removeModel(group:T.Group) {
    group.traverse(node=>{
      if(node instanceof T.Mesh) {
        if(node.geometry.userData.ownedMerge) node.geometry.dispose();
        if(node.material instanceof T.MeshBasicMaterial&&node.material.transparent) node.material.dispose();
      }
    });
    group.removeFromParent();
  }

  private elevationKey(x:number,z:number) {
    const overlay=[];
    for(let r=-1;r<=2;r++)for(let c=-1;c<=2;c++)overlay.push(this.game.elevation.get(indexAt(x+c*CELL+.1,z+r*CELL+.1))??0);
    return overlay.join(',');
  }

  private makeChunk(x: number,z: number) {
    const verts: number[]=[], colors: number[]=[], cells: number[]=[];
    const steps=CHUNK/4;
    for(let r=0;r<steps;r++) for(let c=0;c<steps;c++) {
      const px=x+c*4,pz=z+r*4;
      for(const [dx,dz] of [[0,0],[0,4],[4,0],[4,0],[0,4],[4,4]]) {
        verts.push(px+dx,this.game.ground(px+dx,pz+dz),pz+dz);
        colors.push(0,0,0);
        cells.push(indexAt(px+2,pz+2));
      }
    }
    const geometry=new T.BufferGeometry();
    geometry.setAttribute('position',new T.Float32BufferAttribute(verts,3));
    geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    geometry.computeVertexNormals();
    const ground=new T.Mesh(geometry,terrainMaterial);
    ground.receiveShadow=true;
    const cover=new T.Group();
    this.world.add(ground,cover);
    return { base:this.elevationKey(x,z),rocks:[],x,z,ground,cover,cells,signature:'',trunks:[],near:false } satisfies Chunk;
  }

  private dropChunk(key:string, chunk:Chunk) {
    this.world.remove(chunk.ground,chunk.cover);
    chunk.ground.geometry.dispose();
    this.clearCover(chunk);
    if (chunk.collider) this.physics.removeCollider(chunk.collider,false);
    this.chunks.delete(key);
  }

  private clearCover(chunk:Chunk) {
    chunk.cover.traverse(object=>{ if(object instanceof T.InstancedMesh){if(object.geometry.userData.landRock)object.geometry.dispose();object.dispose();} });
    for(const collider of chunk.trunks) this.physics.removeCollider(collider,false);
    chunk.trunks.length=0;
    chunk.cover.clear();
    chunk.rocks=[];
  }

  private paintChunk(chunk: Chunk, trees: Tree[], near: boolean, stamp: string) {
    const colors=chunk.ground.geometry.getAttribute('color');
    const points=chunk.ground.geometry.getAttribute('position');
    const palette=soilColors.map(color=>new T.Color(color));
    for (let i=0;i<colors.count;i++) {
      const land=this.game.soil.get(chunk.cells[i]);
      const x=points.getX(i),z=points.getZ(i), texture=hash(this.game.seed,Math.round(x*4),Math.round(z*4));
      const clearing=Math.hypot(x*.74,z)<12;
      const base=clearing && (!land || land.stage===0) ? new T.Color('#77694c') : palette[land?.stage??0].clone();
      base.multiplyScalar(.88+texture*.25);
      colors.setXYZ(i,base.r,base.g,base.b);
    }
    colors.needsUpdate=true;
    this.clearCover(chunk);
    chunk.signature = stamp;
    chunk.near = near;
    for(let kind=0;kind<treeModels.length;kind++) {
      const visible=trees.filter(tree=>tree.kind===kind && this.game.isStanding(tree) && !this.fallers.has(tree.id));
      if (!visible.length) continue;
      const models=this.quality==='low'||!near?distantTrees:treeModels;
      for (const piece of models[kind].children) {
        const model=piece as T.Mesh;
        const instances=new T.InstancedMesh(model.geometry,model.material,visible.length);
        for(let i=0;i<visible.length;i++) {
          const t=visible[i];
          this.painter.position.set(t.x,this.game.ground(t.x,t.z),t.z);
          this.painter.rotation.set(0,t.rotation,0);
          this.painter.scale.setScalar(t.scale);
          this.painter.updateMatrix();
          instances.setMatrixAt(i,this.painter.matrix);
        }
        instances.castShadow=near;
        instances.receiveShadow=true;
        chunk.cover.add(instances);
      }
    }
    for(const tree of trees) {
      if(this.game.removed.has(tree.id)&&!this.game.groundStumps.has(tree.id)&&near) {
        const stump=stumpModel(tree.kind,tree.scale);
        stump.position.set(tree.x,this.game.ground(tree.x,tree.z),tree.z);
        chunk.cover.add(stump);
      }
      if(near && this.game.isStanding(tree) && !this.fallers.has(tree.id)) {
        const s=species[tree.kind], h=s.height*tree.scale*.41;
        chunk.trunks.push(this.physics.createCollider(R.ColliderDesc.cylinder(h,s.radius*tree.scale).setTranslation(tree.x,this.game.ground(tree.x,tree.z)+h,tree.z)));
      }
    }
    if (near) this.decorate(chunk);
  }

  private decorate(chunk:Chunk) {
    const count=this.quality==='high' ? 460 : this.quality==='low' ? 90 : 220;
    const leaves=new T.InstancedMesh(leafBlade,mat('#77834a'),count);
    let used=0;
    for(let n=0;n<count;n++) {
      const x=chunk.x+hash(this.game.seed+n,chunk.x,chunk.z)*CHUNK,z=chunk.z+hash(this.game.seed-n,chunk.z,chunk.x)*CHUNK;
      const initial=Math.hypot(x*.81,z)<11;
      const stage=this.game.soil.get(indexAt(x,z))?.stage??0;
      if(stage>=5 || (initial && n%6!==0) || (stage>=3 && n%4!==0)) continue;
      this.painter.position.set(x,this.game.ground(x,z),z);
      this.painter.rotation.set(0,n*2.4,0);
      this.painter.scale.set(.38+n%7*.17,.42+n%11*.105,.48+n%7*.14);
      this.painter.updateMatrix();
      leaves.setMatrixAt(used,this.painter.matrix);
      leaves.setColorAt(used,new T.Color(stage>=3?'#c7ad6a':['#a0aa61','#d0b870','#679450'][n%3]));
      used++;
    }
    leaves.count=used;
    leaves.receiveShadow=true;
    chunk.cover.add(leaves);
    let cracks:T.InstancedMesh|undefined;
    let etched=0;
    for(let n=0;n<96;n++) {
      const x=chunk.x+hash(this.game.seed+n,chunk.x,chunk.z+3)*CHUNK,z=chunk.z+hash(this.game.seed-n,chunk.z,chunk.x-3)*CHUNK;
      const cell=this.game.soil.get(indexAt(x,z));
      if(!cell || !showsGroundCracks(cell))continue;
      cracks??=new T.InstancedMesh(crackGeometry,crackMaterial,96);
      this.painter.position.set(x,this.game.ground(x,z)+.016,z);
      this.painter.rotation.set(0,n*2.4,0);
      this.painter.scale.set(n%3===0?.055:.031,.016,.22+n%11*.065);
      this.painter.updateMatrix();
      cracks.setMatrixAt(etched++,this.painter.matrix);
    }
    if(cracks) { cracks.count=etched; cracks.receiveShadow=true; chunk.cover.add(cracks); }
    const rocks = new T.InstancedMesh(new T.IcosahedronGeometry(1,0),mat('#777466'),16);
    rocks.geometry.userData.landRock=true;
    const ferns = new T.InstancedMesh(leafBlade,mat('#7d9c61'),80);
    let rockCount=0,fernCount=0;
    for(let n=0;n<16;n++) {
      const {x,z}=garnishPoint(this.game.seed,chunk.x,chunk.z,n);
      if (Math.hypot(x*.8,z)<11) continue;
      const y=this.game.ground(x,z),stage=this.game.soil.get(indexAt(x,z))?.stage??0;
      if(n%3===0 || stage>=4) {
        const rock=terrainRock(this.game,chunk.x,chunk.z,n,{x,z});
        if(!rock)continue;
        const {size}=rock;
        chunk.rocks.push(rock);
        this.painter.position.set(x,y+.11,z);
        this.painter.rotation.set(0,n,0);
        this.painter.scale.set(size,size*.56,size*.78);
        this.painter.updateMatrix();
        rocks.setMatrixAt(rockCount,this.painter.matrix);
        rocks.setColorAt(rockCount++,new T.Color(stage>=5?'#ae9368':'#a2a37e'));
      } else for(let k=0;k<5;k++) {
        this.painter.position.set(x,y,z);
        this.painter.rotation.set(.33,k*1.257,.22);
        this.painter.scale.set(2.5,2.5+n%5*.32,2.8);
        this.painter.updateMatrix();
        ferns.setMatrixAt(fernCount,this.painter.matrix);
        ferns.setColorAt(fernCount++,new T.Color(['#83aa74','#659d65','#a5b86a'][n%3]));
      }
    }
    if(rockCount){rocks.count=rockCount;rocks.receiveShadow=true;chunk.cover.add(rocks);}
    else {rocks.geometry.dispose();rocks.dispose();}
    if(fernCount){ferns.count=fernCount;ferns.receiveShadow=true;chunk.cover.add(ferns);}
    else ferns.dispose();
  }

  stream(at:Point, force=false, physicsAt:Point=at) {
    const baseX=Math.floor(at.x/CHUNK)*CHUNK, baseZ=Math.floor(at.z/CHUNK)*CHUNK;
    const px=Math.floor(physicsAt.x/CHUNK)*CHUNK, pz=Math.floor(physicsAt.z/CHUNK)*CHUNK;
    const stamp=[baseX,baseZ,px,pz,this.quality].join(',');
    const terrainChanged=this.terrainRevision!==this.game.terrainRevision;
    if(!force&&!terrainChanged&&stamp===this.streamStamp&&this.game.landRevision===this.landRevision)return;
    this.terrainRevision=this.game.terrainRevision;
    this.streamStamp=stamp;
    this.landRevision=this.game.landRevision;
    const radius=this.quality==='low'?1:this.quality==='high'?3:2;
    const viewKeys=new Set<string>(), trees:Tree[]=[];
    for(let r=-radius;r<=radius;r++) for(let c=-radius;c<=radius;c++) {
      const x=baseX+c*CHUNK,z=baseZ+r*CHUNK;
      if(x< -SIZE/2||x>=SIZE/2||z< -SIZE/2||z>=SIZE/2) continue;
      const id=x+','+z;
      viewKeys.add(id);
      const previous=this.chunks.get(id);
      if(previous&&terrainChanged&&previous.base!==this.elevationKey(x,z))this.dropChunk(id,previous);
      if(!this.chunks.has(id))this.chunks.set(id,this.makeChunk(x,z));
      const chunk=this.chunks.get(id)!;
      const near=Math.abs(x-px)<=CHUNK && Math.abs(z-pz)<=CHUNK;
      const local:Tree[]=[];
      const cellStates:string[]=[];
      for(let dz=0;dz<CHUNK;dz+=CELL) for(let dx=0;dx<CHUNK;dx+=CELL) {
        const i=indexAt(x+dx+.1,z+dz+.1);
        const soil=this.game.soil.get(i);
        cellStates.push(String(soil?.stage??0)+(soil&&showsGroundCracks(soil)?'c':''));
        local.push(...treesIn(this.game.seed,i));
      }
      const actual=local.filter(t=>t.x>=x&&t.x<x+CHUNK&&t.z>=z&&t.z<z+CHUNK);
      trees.push(...actual);
      const signature=String(near)+this.quality+this.game.rockVersion+':'+cellStates.join('')+actual.map(t=>this.game.groundStumps.has(t.id)?'.':this.game.removed.has(t.id)?'x':this.game.isStanding(t)&&!this.fallers.has(t.id)?'1':'0').join('');
      if(chunk.signature!==signature) this.paintChunk(chunk,actual,near,signature);
      if(near && !chunk.collider) {
        const pos=chunk.ground.geometry.getAttribute('position');
        chunk.collider=this.physics.createCollider(R.ColliderDesc.trimesh(new Float32Array(pos.array),Uint32Array.from({length:pos.count},(_,i)=>i)).setFriction(.91));
      } else if(!near && chunk.collider) { this.physics.removeCollider(chunk.collider,false); chunk.collider=undefined; }
    }
    for(const [key,chunk] of this.chunks) if(!viewKeys.has(key)) this.dropChunk(key,chunk);
    this.visibleTrees=trees;
    this.visibleRocks=Array.from(this.chunks.values()).flatMap(chunk=>chunk.rocks);
    for(const [id,cut] of this.chops) if(!trees.some(t=>t.id===id && this.game.isStanding(t))) { this.world.remove(cut); this.chops.delete(id); }
    for(const tree of trees) {
      const damage=this.game.treeDamage.get(tree.id);
      if(damage && this.game.isStanding(tree) && !this.chops.has(tree.id)) this.scuff(tree,clamp(damage/(species[tree.kind].health*tree.scale)),this.game.player);
    }
  }

  scuff(tree:Tree, ratio:number, from:Point) {
    const previous=this.chops.get(tree.id);
    if(previous) this.world.remove(previous);
    const cut=new T.Group(), angle=Math.atan2(from.x-tree.x,from.z-tree.z);
    cut.position.set(tree.x,this.game.ground(tree.x,tree.z),tree.z);
    cut.rotation.y=angle;
    const r=species[tree.kind].radius*tree.scale;
    box(cut,mat('#c5965f'),0,1.38,r*.91,r*(.53+ratio),.03+.15*ratio,.032);
    box(cut,mat('#503d2e'),0,1.36,r*.94,r*(.45+ratio),.019+.06*ratio,.033);
    this.world.add(cut);
    this.chops.set(tree.id,cut);
  }

  startFall(tree:Tree, from:Point, wedge=0,segmented=false) {
    if(this.fallers.has(tree.id)) return;
    const model=treeModels[tree.kind].clone();
    const dir=new T.Vector3(tree.x-from.x,0,tree.z-from.z).normalize();
    dir.applyAxisAngle(treeAxis,wedge || (hash(this.game.seed,tree.id,12)-.5)*.95);
    model.position.set(tree.x,this.game.ground(tree.x,tree.z),tree.z);
    model.scale.setScalar(tree.scale);
    this.world.add(model);
    this.fallers.set(tree.id,{tree,model,dir,age:0,segmented});
    const chop=this.chops.get(tree.id);
    if(chop) this.world.remove(chop);
    this.chops.delete(tree.id);
    this.streamStamp='';
    if(!this.replica)this.onFall?.(tree.id,from,wedge);
  }

  finishReplicaFall(id:number) {
    const fall=this.fallers.get(id);
    if(fall){this.world.remove(fall.model);this.fallers.delete(id);}
    this.streamStamp='';
  }

  isFalling(tree: Tree) { return this.fallers.has(tree.id); }

  impact(point:T.Vector3, kind:'wood'|'dust'|'ember'|'smoke', amount=8) {
    const color=kind==='wood'?'#c39863':kind==='ember'?'#efad56':kind==='smoke'?'#abac93':'#a4a37b';
    for(let n=0;n<amount && this.particles.length<160;n++) {
      const obj=new T.Mesh(new T.TetrahedronGeometry(.08+Math.random()*.095),new T.MeshBasicMaterial({color,transparent:true,opacity:1}));
      obj.position.copy(point);
      const life=kind==='smoke'?1.9+Math.random()*1.1:kind==='ember'?1+Math.random()*.8:.38+Math.random()*.65;
      this.particles.push({mesh:obj,velocity:new T.Vector3((Math.random()-.5)*3.5,kind==='ember'||kind==='smoke' ? 1+Math.random() : Math.random()*3,(Math.random()-.5)*3.5),life,total:life,cloud:kind==='ember'||kind==='smoke',smoke:kind==='smoke'});
      this.world.add(obj);
    }
  }

  private syncLogs(at:Point,dt:number) {
    for(const [id,render] of this.logViews) {
      const log=this.game.logs.get(id);
      if(log && log.length===render.length && distance(log,at)<78) continue;
      if(render.body) this.physics.removeRigidBody(render.body);
      this.world.remove(render.model);
      this.logViews.delete(id);
    }
    for(const log of this.game.logs.values()) {
      if(distance(log,at)>=78) continue;
      const chunk=this.chunks.get(Math.floor(log.x/CHUNK)*CHUNK+','+Math.floor(log.z/CHUNK)*CHUNK);
      const physical=!this.replica&&!this.remotelyHeld(log.id)&&Boolean(chunk?.collider)&&!log.cargo&&!log.carrier;
      const existing=this.logViews.get(log.id);
      if(existing&&Boolean(existing.body)===physical){
        if(existing.body){
          const from=existing.body.translation(), gap=distance(log,from);
          if(gap>.25&&gap<3)existing.body.applyImpulse({x:(log.x-from.x)*log.kilograms*1.2,y:0,z:(log.z-from.z)*log.kilograms*1.2},true);
        } else if(this.replica||this.remotelyHeld(log.id)) {
          if(this.replica){
            const alpha=clamp(dt*18);
            existing.model.position.x+=(log.x-existing.model.position.x)*alpha;
            existing.model.position.y+=(log.y-existing.model.position.y)*alpha;
            existing.model.position.z+=(log.z-existing.model.position.z)*alpha;
          }else existing.model.position.set(log.x,log.y,log.z);
          existing.model.quaternion.set(...log.q);
        }
        continue;
      }
      if(existing) {
        if(existing.body) this.physics.removeRigidBody(existing.body);
        this.world.remove(existing.model);
      }
      const model=logModel(log.length,log.kind,clamp(log.kilograms/species[log.kind].mass,.56,1.25));
      model.position.set(log.x,log.y,log.z);
      model.quaternion.set(...log.q);
      this.world.add(model);
      if(!physical) { this.logViews.set(log.id,{model,length:log.length}); continue; }
      const body=this.physics.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(log.x,log.y,log.z)
        .setRotation(model.quaternion).setLinearDamping(1.30).setAngularDamping(1.38).setCcdEnabled(true));
      const radius=species[log.kind].radius*clamp(log.kilograms/species[log.kind].mass,.56,1.25);
      this.physics.createCollider(R.ColliderDesc.cylinder(log.length*.5,radius).setFriction(.76).setMass(log.kilograms).setRestitution(.19),body);
      this.logViews.set(log.id,{model,body,length:log.length});
    }
  }

  logPosition(log:Log, target:Point, reach:number) {
    const axis = new T.Vector3(0,1,0).applyQuaternion(new T.Quaternion(...log.q));
    const offset = clamp((target.x-log.x)*axis.x+(target.z-log.z)*axis.z,-log.length*.44,log.length*.44);
    const point = new T.Vector3(log.x,log.y,log.z).addScaledVector(axis,offset);
    return distance(point,target) <= reach ? point : undefined;
  }

  shove(log: Log, yaw:number) {
    const force=this.game.mods.shove*log.kilograms*2.3;
    const body=this.logViews.get(log.id)?.body;
    if(body)body.applyImpulse({x:-Math.sin(yaw)*force,y:force*.05,z:-Math.cos(yaw)*force},true);
    else {
      const push=Math.min(1.2,.48*this.game.mods.shove);
      log.x=clamp(log.x-Math.sin(yaw)*push,-SIZE/2+.7,SIZE/2-.7);
      log.z=clamp(log.z-Math.cos(yaw)*push,-SIZE/2+.7,SIZE/2-.7);
      log.y=this.game.ground(log.x,log.z)+.44;
    }
  }

  private drag(log:Log, at:Point, yaw:number, mode:'hand'|'rope'|'lift'|'winch') {
    const body=this.logViews.get(log.id)?.body;
    if(!body) return;
    const winch=mode==='winch',rope=mode==='rope'||winch;
    const point=this.logPosition(log,at,winch?17:rope?this.game.mods.ropeRange+3:5);
    if(!point) return;
    const offset=winch?-3:rope ? 3.4 : mode==='lift' ? 1.25 : 1.92;
    const target = new T.Vector3(at.x-Math.sin(yaw)*offset,this.game.ground(at.x,at.z)+(mode==='lift'?.89:.42),at.z-Math.cos(yaw)*offset);
    const vel=body.linvel(), correction=target.clone().sub(point).multiplyScalar(rope?4.3:5.65);
    correction.x-=vel.x*.75; correction.z-=vel.z*.75;
    correction.y=(target.y-point.y)*5.5-vel.y*.50;
    const strength= (winch?2.8:rope ? this.game.mods.ropeMass/110 : this.game.mods.grip) * (mode==='lift'?1.6:1);
    correction.clampLength(0,8.6*strength);
    const multiplier=Math.min(log.kilograms,95)*.17;
    body.applyImpulseAtPoint(correction.multiplyScalar(multiplier),point,true);
    if(rope) {
      const hand=new T.Vector3(at.x+(winch?Math.sin(yaw)*1.1:-.26),this.game.ground(at.x,at.z)+(winch?.68:1.13),at.z+(winch?Math.cos(yaw)*1.1:.27));
      const center=hand.clone().lerp(point,.5), axis=point.clone().sub(hand);
      this.rope.position.copy(center);
      this.rope.scale.set(.021,axis.length(),.021);
      this.rope.quaternion.setFromUnitVectors(treeAxis,axis.normalize());
      this.rope.visible=true;
    }
  }

  private syncSites(time:number, at:Point) {
    const sitesById=new Map(this.game.sites.map(site=>[site.id,site]));
    for(const [id,view]of this.siteViews)if(!sitesById.has(id)){
      this.removeModel(view.root);this.siteViews.delete(id);
      this.routes.get(id)?.removeFromParent();
      this.routes.delete(id);
    }
    for(const site of this.game.sites) {
      const existing=this.siteViews.get(site.id);
      if(distance(site,at)>125) {
        if(existing) { this.removeModel(existing.root); this.siteViews.delete(site.id); }
        const route=this.routes.get(site.id);
        if(route) { this.world.remove(route); this.routes.delete(site.id); }
        continue;
      }
      if(!this.siteViews.has(site.id)) {
        const visual=siteModel(site.kind);
        visual.root.position.set(site.x,this.game.ground(site.x,site.z),site.z);
        if(['road','serviceRoad','pavedRoad','rail','belt','poweredBelt','rollerIntake','ditch',...waterPipes].includes(site.kind))visual.root.rotation.y=site.yaw??0;
        this.world.add(visual.root);
        this.siteViews.set(site.id,visual);
      }
      const view=this.siteViews.get(site.id)!;
      view.root.position.y=this.game.ground(site.x,site.z);
      if(site.kind==='fire') {
        const hot=site.jobs.length?1.45:.83;
        for(let n=0;n<view.moving.length;n++) {
          const part=view.moving[n];
          part.rotation.set(Math.sin(time*4+n)*.27,n*2.4,Math.cos(time*4+n*.8)*.25);
          part.scale.set(.64+Math.sin(n+time*3.5)*.22,hot*(.62+Math.sin(n+time*5)*.3),.68);
          part.position.y=.28+.13*Math.sin(time*3+n);
        }
        view.glow!.intensity=8*hot+Math.sin(time*11)*2;
        if(Math.random()<(site.jobs.length?.21:.065) && distance(site,at)<24) this.impact(new T.Vector3(site.x+.34*Math.random(),this.game.ground(site.x,site.z)+.44,site.z),'ember',1);
        if(this.quality!=='low'&&Math.random()<(site.jobs.length?.10:.021)&&distance(site,at)<28)
          this.impact(new T.Vector3(site.x+.2,this.game.ground(site.x,site.z)+.80,site.z),'smoke',1);
      } else if(site.kind==='burnZone'){
        for(const [n,flame]of view.moving.entries()){
          flame.visible=Boolean(site.jobs.length);
          flame.scale.y=.62+Math.sin(time*6+n)*.27;
        }
      } else if(site.kind==='craneYard'&&site.crane){
        const log=this.game.logs.get(site.crane.log),arm=view.moving[0];
        if(log&&arm)arm.rotation.y=Math.atan2(site.x-log.x,site.z-log.z);
      } else if(site.kind==='wind'&&site.on){
        for(const hub of view.moving)hub.rotation.z=time*.52+Math.sin(time*.3)*.18;
      } else if(site.jobs.length || site.status==='Operational') {
        for(const part of view.moving) {
          if(site.kind==='bench'||computeSites.includes(site.kind)) part.rotation.y=time*11;
          else part.rotation.z=time*5;
        }
      }
      const output=site.output[0], job=site.jobs[0];
      const signature=(output ? output.good+output.quantity : '')+'|'+(job ? job.good : '');
      if(view.signature!==signature) {
        if(view.stock) this.removeModel(view.stock);
        if(view.batch) this.removeModel(view.batch);
        view.stock=undefined;
        view.batch=undefined;
        if(output) {
          view.stock=productModel(output.good,output.quantity);
          view.stock.position.set(facilities[site.kind].size*.54,.17,facilities[site.kind].size*.55);
          view.root.add(view.stock);
        }
        if(job && site.kind!=='fire') {
          view.batch=productModel(site.kind==='bench'?'timber':job.good,job.quantity);
          view.batch.position.set(-.72,site.kind==='bench'?1.08:.30,.38);
          view.root.add(view.batch);
        }
        view.signature=signature;
      }
      if(view.batch) view.batch.position.x=-.7+Math.sin(time*.85)*.52;
      this.syncRoute(site,at,sitesById);
    }
  }

  private syncUtility(at:Point) {
    const stamp=`${Math.floor(at.x/24)},${Math.floor(at.z/24)}:${this.game.sites.length}:${this.game.terrainRevision}`;
    if(this.networkStamp===stamp)return;
    this.networkStamp=stamp;
    if(this.networkView)this.removeModel(this.networkView);
    const network=new T.Group(), unique=new Set<string>();
    const inside=this.game.sites.filter(site=>distance(at,site)<140);
    const types=(site:Site)=>waterPipes.includes(site.kind)||waterSites.includes(site.kind)||computeSites.includes(site.kind);
    for(const node of inside){
      const electric=utilityNodes.includes(node.kind), pipe=waterPipes.includes(node.kind);
      if(!electric&&!pipe)continue;
      const maximum=electric?(node.kind==='backbone'?140:78):46;
      const peers=inside.filter(other=>other!==node&&(electric?utilityNodes.includes(other.kind)||Boolean(facilities[other.kind].supply):types(other))
        &&distance(node,other)<maximum).sort((a,b)=>distance(node,a)-distance(node,b)).slice(0,2);
      for(const peer of peers) {
        const id=[node.id,peer.id].sort().join(':');
        if(unique.has(id))continue;
        unique.add(id);
        const heightOf=(s:Site)=>s.kind==='backbone'?13:s.kind==='pole'?6.1:2.6;
        for(const offset of electric?[-.31,.31]:[0]){
          const a=new T.Vector3(node.x+offset,this.game.ground(node.x,node.z)+(electric?heightOf(node):.48),node.z);
          const b=new T.Vector3(peer.x+offset,this.game.ground(peer.x,peer.z)+(electric?heightOf(peer):.48),peer.z);
          const c=a.clone().lerp(b,.5);
          c.y+=electric?-Math.min(1.8,a.distanceTo(b)*.055):.02;
          const curve=new T.QuadraticBezierCurve3(a,c,b);
          const tube=new T.TubeGeometry(curve,electric?9:4,electric?.031:.145,5,false);
          tube.userData.ownedMerge=true;
          const model=new T.Mesh(tube,mat(electric?'#5b5e50':'#64858a',.44));
          network.add(model);
        }
      }
    }
    this.networkView=network;
    this.world.add(network);
  }

  private syncRoute(site:Site,at:Point,sitesById:ReadonlyMap<string,Site>) {
    const targets:Site[]=[];
    if((site.link||site.secondary)&&!this.game.freightMode(site)&&distance(site,at)<=80){
      const primary=site.link&&sitesById.get(site.link);
      const alternate=site.secondary&&sitesById.get(site.secondary);
      if(primary&&distance(site,primary)<=110)targets.push(primary);
      if(alternate&&alternate!==primary&&distance(site,alternate)<=110)targets.push(alternate);
    }
    const signature=targets.map(target=>target.id+(target.id===site.link?'p':'a')).join('|');
    const old=this.routes.get(site.id);
    if(old?.userData.signature===signature)return;
    if(old){this.world.remove(old);this.routes.delete(site.id);}
    if(!targets.length)return;
    const path=new T.Group();
    path.userData.signature=signature;
    for(const target of targets){
      const segments=Math.floor(distance(site,target)/2.3);
      const guide=mat(target.id===site.link?'#c8a26c':'#81b5a0');
      for(let n=1;n<segments;n++) {
        const p=n/segments,x=site.x+(target.x-site.x)*p,z=site.z+(target.z-site.z)*p;
        const ground=this.game.ground(x,z);
        const slat=box(path,mat('#777763'),x,ground+.13,z,1.0,.12,2.2);
        slat.rotation.y=Math.atan2(target.x-site.x,target.z-site.z);
        const wire=box(path,guide,x,ground+.20,z,.08,.03,2.2);
        wire.rotation.y=slat.rotation.y;
      }
    }
    this.world.add(path);
    this.routes.set(site.id,path);
  }

  private syncRides(at:Point,time:number,dt:number,driving?:Ride) {
    if(!this.game.rides.length)return;
    const ridesById=new Map(this.game.rides.map(ride=>[ride.id,ride]));
    const cargoByRide=new Map<string,Log[]>();
    for(const log of this.game.logs.values()){
      if(!log.cargo)continue;
      const load=cargoByRide.get(log.cargo);
      if(load)load.push(log);
      else cargoByRide.set(log.cargo,[log]);
    }
    const dispatched=new Set<string>();
    for(const site of this.game.sites)if(site.dedicatedRide&&site.shipment)dispatched.add(site.dedicatedRide);
    for(const ride of this.game.rides) {
      const existing=this.rideViews.get(ride.id);
      if(distance(ride,at)>124) {
        if(existing){this.removeModel(existing.root);this.rideViews.delete(ride.id);}
        this.hitches.get(ride.id)?.removeFromParent();
        this.hitches.delete(ride.id);
        continue;
      }
      if(!existing) {
        const model=vehicleModel(ride.kind);
        this.rideViews.set(ride.id,model);
        this.world.add(model.root);
      }
      const visual=this.rideViews.get(ride.id)!;
      visual.root.position.set(ride.x,this.game.ground(ride.x,ride.z),ride.z);
      visual.root.rotation.y=ride.yaw;
      visual.root.visible=(ride!==driving||Boolean(visual.forks))&&!dispatched.has(ride.id);
      for(const part of visual.root.children)part.visible=ride!==driving||part===visual.forks;
      for(const wheel of visual.wheels) if(ride===driving) wheel.rotation.x=time*4;
      const shipment=cargoByRide.get(ride.id)??[];
      const def=vehicleTypes[ride.kind];
      const freight=ride.freight, signature=freight?freight.good+freight.quantity:'';
      if(visual.signature!==signature){
        if(visual.payload)this.removeModel(visual.payload);
        visual.payload=undefined;
        if(freight&&ride.kind!=='mixer'){
          visual.payload=productModel(freight.good,freight.quantity);
          visual.payload.position.set(.12,.66,.48);
          visual.root.add(visual.payload);
        }
        visual.signature=signature;
      }
      if(visual.forks)visual.forks.rotation.x+=( (shipment.length?-.12:.46)-visual.forks.rotation.x)*Math.min(1,dt*3);
      const towing=ride.hitch&&ridesById.get(ride.hitch);
      let hitch=this.hitches.get(ride.id);
      if(towing){
        if(!hitch){hitch=ropeModel();this.world.add(hitch);this.hitches.set(ride.id,hitch);}
        const a=new T.Vector3(ride.x-Math.sin(ride.yaw)*1.55,this.game.ground(ride.x,ride.z)+.53,ride.z-Math.cos(ride.yaw)*1.55);
        const b=new T.Vector3(towing.x+Math.sin(towing.yaw)*1.14,this.game.ground(towing.x,towing.z)+.58,towing.z+Math.cos(towing.yaw)*1.14);
        const arm=b.clone().sub(a);
        hitch.position.copy(a).lerp(b,.5);
        hitch.scale.set(.052,arm.length(),.052);
        hitch.quaternion.setFromUnitVectors(treeAxis,arm.normalize());
        hitch.visible=true;
      } else if(hitch){hitch.removeFromParent();this.hitches.delete(ride.id);}
      for(let n=0;n<shipment.length;n++) {
        const log=shipment[n],{x,y,z}=cargoPosition(ride,n,visual.root.position.y);
        const slide=Math.min(1,dt*11.5);
        log.x+=(x-log.x)*slide;log.z+=(z-log.z)*slide;log.y+=(y-log.y)*slide;
        const rotation=new T.Quaternion().setFromEuler(new T.Euler(Math.PI*.5,ride.yaw+(def.forks?Math.PI*.5:0)+(log.roll??0),0,'YXZ'));
        log.q=new T.Quaternion(...log.q).slerp(rotation,slide).toArray();
      }
    }
  }

  private syncPackets(at:Point) {
    const visible=new Set<string>();
    for(const [id,packet]of this.game.routePackets){
      const elapsed=this.game.clock-packet.at;
      if(elapsed>1.05||distance(packet.from,at)>85||distance(packet.to,packet.from)>33)continue;
      visible.add(id);
      let item=this.packets.get(id);
      if(!item||item.good!==packet.good){
        if(item)this.removeModel(item.model);
        item={good:packet.good,model:productModel(packet.good,1)};
        this.packets.set(id,item);this.world.add(item.model);
      }
      const mix=clamp(elapsed),x=packet.from.x+(packet.to.x-packet.from.x)*mix,z=packet.from.z+(packet.to.z-packet.from.z)*mix;
      item.model.position.set(x,this.game.ground(x,z)+.36,z);
    }
    for(const [id,item]of this.packets)if(!visible.has(id)){
      this.removeModel(item.model);this.packets.delete(id);
    }
  }

  private syncFreight(at:Point,dt:number,active:boolean) {
    if(active)this.freightClock+=dt;
    for(const site of this.game.sites){
      const shipping=site.shipment;
      let current=this.freight.get(site.id);
      if(!shipping) {
        if(current){this.removeModel(current.root);this.freight.delete(site.id);}
        this.freightTime.delete(site.id);
        continue;
      }
      if(current&&Boolean(current.root.userData.returning)!==Boolean(shipping.returning)){
        this.removeModel(current.root);this.freight.delete(site.id);this.freightTime.delete(site.id);current=undefined;
      }
      const time=this.freightTime.get(site.id)??shipping.elapsed;
      const next=active?Math.min(shipping.elapsed+.85,shipping.duration,time+dt):time;
      this.freightTime.set(site.id,next);
      const path=shipping.path, legs=path.slice(1).map((p,n)=>distance(p,path[n]));
      let remaining=legs.reduce((sum,l)=>sum+l,0)*clamp(next/shipping.duration);
      let leg=0;
      while(leg<legs.length-1&&remaining>legs[leg])remaining-=legs[leg++];
      const a=path[leg],b=path[leg+1],scale=legs[leg]?clamp(remaining/legs[leg]):0;
      const x=a.x+(b.x-a.x)*scale,z=a.z+(b.z-a.z)*scale;
      if(distance(at,{x,z})>96){
        if(current){this.removeModel(current.root);this.freight.delete(site.id);}
        continue;
      }
      const visual=current??freightModel(shipping.mode,shipping.load.good,shipping.returning?0:shipping.load.quantity);
      if(!current){visual.root.userData.returning=Boolean(shipping.returning);this.freight.set(site.id,visual);this.world.add(visual.root);}
      const altitude=shipping.mode==='air'?1.0+Math.sin(clamp(next/shipping.duration)*Math.PI)*12:0;
      visual.root.position.set(x,this.game.ground(x,z)+altitude,z);
      visual.root.rotation.y=Math.atan2(a.x-b.x,a.z-b.z);
      for(const blades of visual.motion)blades.rotation.y=this.freightClock*29;
    }
  }

  private syncCrew(at:Point,dt:number,time:number) {
    for(const site of this.game.sites) {
      const worker=site.haul;
      const present=this.crew.get(site.id);
      if(!worker||distance(worker,at)>90) {
        if(present){this.removeModel(present.root);this.crew.delete(site.id);}
        continue;
      }
      const aim=new T.Vector3(worker.x,this.game.ground(worker.x,worker.z),worker.z);
      const visual=present??(site.kind==='helperPost'?helperModel():vehicleModel('skid'));
      if(!present) {
        this.crew.set(site.id,visual);
        visual.root.position.copy(aim);
        this.world.add(visual.root);
      }
      const offset=aim.clone().sub(visual.root.position);
      if(offset.lengthSq()>.04) {
        visual.root.rotation.y=Math.atan2(-offset.x,-offset.z);
        for(const [index,wheel]of visual.wheels.entries())wheel.rotation.x=site.kind==='helperPost'?Math.sin(time*6+index*Math.PI*.5)*.48:time*6;
      }
      visual.root.position.lerp(aim,Math.min(1,dt*7.5));
      if(worker.phase==='delivery'&&worker.log!==undefined) {
        const render=this.logViews.get(worker.log);
        if(render){
          const pos=visual.root.position;
          const reach=site.kind==='helperPost'?-1.20:1.28;
          render.model.position.set(pos.x-Math.sin(visual.root.rotation.y)*reach,pos.y+(site.kind==='helperPost'?.24:.86),pos.z-Math.cos(visual.root.rotation.y)*reach);
          render.model.rotation.set(Math.PI*.5,visual.root.rotation.y+Math.PI*.5,0,'YXZ');
        }
      }
    }
  }

  private pullWinches(at:Point) {
    for(const site of this.game.sites) {
      if(site.kind!=='winch')continue;
      const log=site.winch?this.game.logs.get(site.winch.log):undefined;
      const body=log?this.logViews.get(log.id)?.body:undefined;
      let cable=this.cables.get(site.id);
      if(!site.on||!log||!body||distance(site,at)>63||distance(site,log)>25){
        if(cable){cable.removeFromParent();this.cables.delete(site.id);}
        if(site.winch&&(!log||log.cargo||log.carrier))site.winch=undefined;
        continue;
      }
      if(!cable){cable=ropeModel();this.world.add(cable);this.cables.set(site.id,cable);}
      const attach=this.logPosition(log,site,25)!;
      const anchor=new T.Vector3(site.x,this.game.ground(site.x,site.z)+.57,site.z);
      const haul=anchor.clone().sub(attach),span=haul.length();
      if(site.winch!.ready<=this.game.clock&&span>1.55){
        const push=haul.clone().normalize().multiplyScalar(Math.min(log.kilograms,130)*.33);
        push.y*=.45;
        body.applyImpulseAtPoint(push,attach,true);
      }
      cable.position.copy(attach).lerp(anchor,.5);
      cable.scale.set(.023,span,.023);
      cable.quaternion.setFromUnitVectors(treeAxis,haul.normalize());
      cable.visible=true;
      const reel=this.siteViews.get(site.id)?.moving[0];
      if(reel&&span>1.55)reel.rotation.x+=.10;
    }
  }

  stepShared(dt:number,at:Point,yaw:number,held?:{log:Log;mode:'hand'|'rope'|'lift'|'winch'}) {
    this.syncLogs(at,dt);
    this.updateSimulation(dt,at,yaw,held);
  }

  private updateSimulation(dt:number, at:Point, yaw:number, held?:{log:Log; mode:'hand'|'rope'|'lift'|'winch'}) {
    this.physicsTime+=dt;
    this.rope.visible=false;
    while(this.physicsTime>=1/60) {
      this.physicsTime-=1/60;
      if(held) this.drag(held.log,at,yaw,held.mode);
      this.pullWinches(at);
      this.physics.step();
    }
    for(const [id, view] of this.logViews) {
      const log=this.game.logs.get(id);
      if(!log) continue;
      if(view.body) {
        const pos=view.body.translation(), rot=view.body.rotation();
        log.x=pos.x; log.y=pos.y; log.z=pos.z; log.q=[rot.x,rot.y,rot.z,rot.w];
        if(log.y<this.game.ground(log.x,log.z)-3 || indexAt(log.x,log.z)<0) {
          log.x=clamp(log.x,-SIZE*.5+.9,SIZE*.5-.9);
          log.z=clamp(log.z,-SIZE*.5+.9,SIZE*.5-.9);
          log.y=this.game.ground(log.x,log.z)+.55;
          view.body.setTranslation(log,true);
          view.body.setLinvel({x:0,y:0,z:0},true);
        }
      }
      view.model.position.set(log.x,log.y,log.z);
      view.model.quaternion.set(...log.q);
    }
    this.animateFalls(dt);
  }

  private animateFalls(dt:number) {
    for(const [id, fall] of this.fallers) {
      fall.age+=dt;
      const progress=clamp(fall.age/1.22), tilt=progress*progress*Math.PI*.49;
      const axis=new T.Vector3(fall.dir.z,0,-fall.dir.x);
      fall.model.quaternion.setFromAxisAngle(axis,tilt);
      fall.model.rotateY(fall.tree.rotation);
      if(progress<1||this.replica) continue;
      const tree=fall.tree, spec=species[tree.kind], length=spec.height*tree.scale*.72;
      const x=clamp(tree.x+fall.dir.x*length*.52,-SIZE/2+.4,SIZE/2-.4);
      const z=clamp(tree.z+fall.dir.z*length*.52,-SIZE/2+.4,SIZE/2-.4);
      const y=this.game.ground(x,z)+spec.radius*tree.scale+.42;
      const q=new T.Quaternion().setFromAxisAngle(axis,Math.PI*.5).toArray();
      const idLog=this.game.nextId++;
      this.game.fell(tree,{id:idLog,x,y,z,q,kind:tree.kind,length,kilograms:spec.mass*tree.scale,units:spec.yield,moisture:.68,quality:tree.kind===0?.73:.87});
      if(fall.segmented&&spec.yield>=2)this.game.cutHarvestedLog(idLog,{
        x:clamp(x+fall.dir.x*1.2,-SIZE/2+.4,SIZE/2-.4),
        z:clamp(z+fall.dir.z*1.2,-SIZE/2+.4,SIZE/2-.4),
      });
      if(tree.kind>0){
        const tx=x+fall.dir.z*1.2,tz=z-fall.dir.x*1.2;
        if(indexAt(tx,tz)>=0) {
          const id=this.game.nextId++;
          this.game.logs.set(id,{id,x:tx,z:tz,y:y+.27,q,kind:0,length:1.25+tree.scale*.45,kilograms:7+tree.scale*3,units:1,moisture:.53,quality:.63,part:'branch'});
        }
      }
      this.world.remove(fall.model);
      this.fallers.delete(id);
      this.impact(new T.Vector3(x,y,z),'dust',15);
      this.game.notice(spec.name+' felled');
      this.onLanded?.(tree.id);
    }
  }

  render(args: {
    dt:number; at:Point; y:number; shared?:boolean; yaw:number; pitch:number; menu:boolean; active:boolean; swing:number; reverse:boolean;
    reduced:boolean; stride:number; held?:{log:Log;mode:'hand'|'rope'|'lift'|'winch'}; target?:Point; build?:{point:Point;valid:boolean;size:number}; drive?:Ride;
    flyover?:number; waypoint?:Point; survey?:{point:Point;age:number};
  }) {
    const {dt,at,y,yaw,pitch,menu,active,swing,reverse,reduced,stride,held,target,build,drive,flyover,waypoint,survey}=args;
    this.frameAge+=dt;
    const sun=Math.sin(.7+this.game.clock/235)*.52+.56;
    const day=clamp(sun,.15,1);
    this.sky.material.uniforms.daylight.value=day;
    (this.world.fog as T.FogExp2).color.set(day>.67?'#b0b298':day>.37?'#939d85':'#515c58');
    (this.world.fog as T.FogExp2).density=(this.quality==='low'?.027:.014)+this.game.rain*.008;
    this.ambient.intensity=1.40+day*.72;
    this.sunlight.intensity=.5+day*2.3;
    this.sunlight.target.position.set(at.x,0,at.z);
    this.sunlight.position.set(at.x-23,32,at.z-19);
    if(menu) {
      this.camera.position.set(3.3+Math.sin(this.frameAge*.13)*1.3,3.1,-.5+Math.cos(this.frameAge*.11)*.7);
      this.camera.lookAt(0,3.2,-12);
    } else if(survey) {
      const {point,age}=survey,a=age*.24;
      this.camera.position.set(point.x+Math.cos(a)*45,Math.max(20,this.game.ground(point.x,point.z)+31),point.z+Math.sin(a)*45);
      this.camera.lookAt(point.x,this.game.ground(point.x,point.z),point.z);
    } else if(flyover!==undefined) {
      const a=flyover*.22;
      this.camera.position.set(at.x+Math.cos(a)*34,Math.min(37,9+flyover*4),at.z+Math.sin(a)*34);
      this.camera.lookAt(at.x,0,at.z);
    } else {
      this.camera.position.set(at.x,y+(reduced?0:Math.sin(stride*2)*.024),at.z);
      this.camera.rotation.set(pitch,yaw,0,'YXZ');
    }
    this.sky.position.copy(this.camera.position);
    this.rain.visible=this.game.rain>.12&&!menu&&this.quality!=='low';
    if(this.rain.visible) {
      this.rain.count=Math.ceil(this.game.rain*145);
      for(let n=0;n<this.rain.count;n++) {
        const y=9-((n*.83+this.frameAge*10)%10);
        this.painter.position.set(this.camera.position.x+(hash(n,5,8)-.5)*23+y*.16,y+this.camera.position.y-3,this.camera.position.z+(hash(n,8,2)-.5)*23);
        this.painter.rotation.set(.06,0,-.16);
        this.painter.scale.setScalar(.86);
        this.painter.updateMatrix();
        this.rain.setMatrixAt(n,this.painter.matrix);
      }
      this.rain.instanceMatrix.needsUpdate=true;
    }
    this.stream({x:this.camera.position.x,z:this.camera.position.z},false,at);
    this.syncRides(at,this.frameAge,active?dt:0,drive);
    this.syncLogs(at,dt);
    this.syncSites(this.frameAge,survey?survey.point:at);
    if(this.game.ownedUpgrades.has('24-12')&&!this.trophy){
      const monument=new T.Group();
      monument.position.set(2.8,this.game.ground(2.8,-1.7),-1.7);
      box(monument,mat('#8b7b61'),0,.19,0,.90,.38,.87);
      box(monument,mat('#b59461',.62),0,.64,0,.28,.52,.30);
      const emblem=box(monument,mat('#d7b779',.54),0,1.08,0,.64,.64,.18);
      emblem.rotation.y=.38;
      emblem.rotation.z=Math.PI*.25;
      this.trophy=monument;
      this.world.add(monument);
    }
    this.syncUtility(at);
    if(active&&!menu&&this.quality!=='low'&&Math.random()<dt*.13&&
      (this.game.soil.get(indexAt(at.x,at.z))?.stage??0)>=4){
      this.impact(new T.Vector3(at.x+(Math.random()-.5)*12,this.game.ground(at.x,at.z)+.6,at.z-4),'dust',4);
    }
    if(this.replica)this.animateFalls(dt);
    else if(active&&!args.shared)this.updateSimulation(dt,at,yaw,held);
    this.syncCrew(at,dt,this.frameAge);
    this.syncFreight(at,dt,active);
    this.syncPackets(at);
    this.selection.visible=Boolean(target)&&!menu&&!drive;
    if(target) this.selection.position.set(target.x,this.game.ground(target.x,target.z)+.05,target.z);
    this.ghost.visible=Boolean(build)&&!menu;
    if(build) {
      this.ghost.position.set(build.point.x,this.game.ground(build.point.x,build.point.z)+.64,build.point.z);
      this.ghost.scale.set(build.size*1.55,1.18,build.size*1.55);
      buildTint.color.set(build.valid?'#b6d59d':'#e49762');
    }
    this.marker.visible=Boolean(waypoint)&&!menu;
    if(waypoint) this.marker.position.set(waypoint.x,this.game.ground(waypoint.x,waypoint.z)+3+Math.sin(this.frameAge*3)*.34,waypoint.z);
    for(let n=this.particles.length-1;n>=0;n--) {
      const p=this.particles[n];
      p.life-=dt;
      if(p.life<=0) { this.world.remove(p.mesh); p.mesh.geometry.dispose(); (p.mesh.material as T.Material).dispose(); this.particles.splice(n,1); continue; }
      p.mesh.position.addScaledVector(p.velocity,dt);
      p.mesh.rotation.x+=dt*2.1;
      p.mesh.rotation.z+=dt*3.2;
      p.velocity.y+=p.cloud ? dt*.21 : -dt*8.5;
      if(p.smoke)p.mesh.scale.setScalar((1.05-p.life/p.total)*3.7+.34);
      (p.mesh.material as T.MeshBasicMaterial).opacity=clamp(p.life/p.total)*(p.smoke?.20:1);
    }
    const toolName=this.game.tool+String(this.game.mods.prestigeKnife);
    if(toolName!==this.toolKind) {
      if(this.heldTool) this.removeModel(this.heldTool);
      this.heldTool=toolModel(this.game.tool,this.game.mods.prestigeKnife);
      toolScene.add(this.heldTool);
      this.toolKind=toolName;
    }
    const motion=Math.sin(clamp(swing)*Math.PI), side=reverse?-1:1;
    const arm=this.heldTool!;
    arm.position.set(Math.min(.60,this.toolCamera.aspect*.38)+motion*.2*side,-.44+motion*.22+(reduced?0:Math.cos(stride*2)*.026),-.89-motion*.25);
    arm.rotation.set(-.72-motion*.52,.0+motion*.33*side,-.52+motion*.82*side+(reduced?0:Math.sin(this.frameAge*4)*.025));
    this.renderer.clear();
    this.renderer.render(this.world,this.camera);
    if(!menu&&!drive&&flyover===undefined&&!survey) {
      this.renderer.clearDepth();
      this.renderer.render(toolScene,this.toolCamera);
    }
  }
}

export async function initializePhysics() { await R.init(); }

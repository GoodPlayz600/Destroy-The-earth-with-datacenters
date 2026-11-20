import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { facilities, goods, species, tools, vehicleTypes } from './catalog';
import type { Facility, Good, Tool, VehicleType } from './catalog';
import { hash } from './land';

const materials = new Map<string, T.MeshStandardMaterial>();
export const mat = (color: string, metalness = 0, roughness = .85) => {
  const id = color + metalness + roughness;
  if (!materials.has(id)) materials.set(id, new T.MeshStandardMaterial({ color, metalness, roughness }));
  return materials.get(id)!;
};
const steel = mat('#495653', .57, .65), rubber = mat('#252b28'), timber = mat('#6d513a'), endwood = mat('#c39360');
const amber = mat('#ddb365', .21), dark = mat('#252f2c', .28), glass = mat('#527f7d', .52, .33);
const boxGeo = new T.BoxGeometry(1, 1, 1);
const stoneGeo = new T.IcosahedronGeometry(1, 0);
const flameGeo = new T.ConeGeometry(.30,.95,5);
const foliageGeo = new T.IcosahedronGeometry(1, 1);
const trunkGeo = new T.CylinderGeometry(.7, 1, 1, 8);
const cylinderGeo = new T.CylinderGeometry(1, 1, 1, 12);
const rodGeo = new T.CylinderGeometry(1, 1, 1, 6);

function mesh(parent: T.Object3D, geometry: T.BufferGeometry, material: T.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
  const object = new T.Mesh(geometry, material);
  object.position.set(x, y, z);
  object.scale.set(sx, sy, sz);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}
export const box = (p: T.Object3D, m: T.Material, x: number, y: number, z: number, a: number, b: number, c: number) => mesh(p, boxGeo, m, x,y,z,a,b,c);
export const stone = (p: T.Object3D, m: T.Material, x: number, y: number, z: number, a: number, b: number, c: number) => mesh(p, stoneGeo, m, x,y,z,a,b,c);
const cylinder = (p: T.Object3D, m: T.Material, x: number, y: number, z: number, a: number, b: number, c = a) => mesh(p,cylinderGeo,m,x,y,z,a,b,c);
const segment = (p: T.Object3D, m: T.Material, a: T.Vector3, b: T.Vector3, radius: number) => {
  const center = a.clone().lerp(b,.5), axis = b.clone().sub(a);
  const shape = mesh(p,trunkGeo,m,center.x,center.y,center.z,radius,axis.length(),radius);
  shape.quaternion.setFromUnitVectors(new T.Vector3(0,1,0), axis.normalize());
  return shape;
};

function batch(group: T.Group) {
  const buckets = new Map<T.Material, T.BufferGeometry[]>();
  group.updateMatrixWorld(true);
  group.traverse(object => {
    if (!(object instanceof T.Mesh) || Array.isArray(object.material)) return;
    const source = object.geometry as T.BufferGeometry;
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometry.applyMatrix4(object.matrixWorld);
    const list = buckets.get(object.material) ?? [];
    list.push(geometry);
    buckets.set(object.material, list);
  });
  group.clear();
  for (const [material, shapes] of buckets) {
    const merged = mergeGeometries(shapes);
    if (merged) { merged.userData.ownedMerge=true; mesh(group, merged, material, 0,0,0); }
    for (const geometry of shapes) geometry.dispose();
  }
  return group;
}

function forestModels(low=false) {
return species.map((s, kind) => {
  const group = new T.Group(), wood = mat(s.bark), bare = mat('#9d8059'), leaf = new T.Color(s.leaf);
  const leaves = (low?[-.08,.07]:[-.14,-.07,0,.075,.14]).map(l => mat('#' + leaf.clone().offsetHSL(l * .12, 0, l).getHexString()));
  const h = s.height, bend = (kind - 1.5) * .13;
  segment(group, wood, new T.Vector3(0,0,0), new T.Vector3(bend,h*.54,0), s.radius);
  segment(group, wood, new T.Vector3(bend,h*.49,0), new T.Vector3(bend*3,h*.88,.1), s.radius*.78);
  for (let i = 0; i < 5; i++) {
    const angle = i * 1.255 + kind;
    const root = new T.Vector3(Math.cos(angle)*s.radius*2.65, .06, Math.sin(angle)*s.radius*2.65);
    segment(group,wood,root,new T.Vector3(0,h*.125,0),s.radius*.42);
  }
  for (let i = 0; i < (kind === 2 ? (low?7:10) : (low?6:8)); i++) {
    const angle = i * 2.39 + kind;
    const radius = h * (kind === 3 ? .31 : kind === 2 ? .27 : .22) * (.65 + hash(6,i,kind)*.44);
    const top = h * (.68 + hash(3,kind,i)*.26), x = Math.cos(angle)*radius + bend*2, z = Math.sin(angle)*radius;
    const start = new T.Vector3(bend, kind === 2 ? h*.86 : top-h*.24,0), end = new T.Vector3(x,top,z);
    segment(group,kind === 2 ? bare : wood,start,end,s.radius*(kind === 2 ? .33 : .42));
    if (kind === 2) {
      const tip = new T.Vector3(x*1.42,top-h*.19,z*1.42);
      for (let n = 0; n < (low?4:6); n++) {
        const point = start.clone().lerp(tip,(n+1)/7);
        const geo = mesh(group, low?stoneGeo:foliageGeo, leaves[(i+n)%leaves.length],point.x,point.y,point.z,.23+n*.075,.12,.34+n*.06);
        geo.rotation.y = -angle + n*.12;
        geo.rotation.z = -.35;
      }
    } else {
      for (let n = 0; n < (low?2:3); n++) {
        const spread = h * (.105 + hash(8,n,i)*.055);
        const cluster = mesh(group,low?stoneGeo:foliageGeo,leaves[(i+n)%leaves.length],x + Math.cos(i+n)*spread*.72,top+n*h*.04,z+Math.sin(i+n)*spread*.69,spread*1.32,spread*.66,spread*1.06);
        cluster.rotation.set(n*.21,i*2.1,n*.18);
      }
    }
  }
  return batch(group);
});
}
export const treeModels=forestModels();
export const distantTrees=forestModels(true);

export function stumpModel(kind: number, scale: number) {
  const node = new T.Group(), spec = species[kind];
  const r = spec.radius * scale;
  cylinder(node, mat(spec.bark), 0,.23,0,r*1.19,.49);
  cylinder(node, endwood, 0,.483,0,r*1.04,.024);
  const ring = cylinder(node, mat('#ab7948'), 0,.499,0,r*.59,.01);
  ring.castShadow = false;
  return node;
}
export function logModel(length: number, kind: number, diameterScale = 1) {
  const model = new T.Group(), r = species[kind].radius * diameterScale;
  cylinder(model,mat(species[kind].bark),0,0,0,r,length);
  for (const sign of [-1, 1]) {
    cylinder(model,endwood,0,sign*(length*.5+.006),0,r*.94,.014);
    cylinder(model,mat('#af8050'),0,sign*(length*.5+.014),0,r*.58,.018);
    cylinder(model,mat('#d2a972'),0,sign*(length*.5+.024),0,r*.36,.017);
  }
  for (let n = 0; n < 5; n++) {
    const darkBark = '#'+new T.Color(species[kind].bark).multiplyScalar(.68).getHexString();
    const angle = n * 2.4, ridge = box(model,mat(darkBark),Math.cos(angle)*r,.07,Math.sin(angle)*r,.02,length*.78,.024);
    ridge.rotation.y = -angle;
  }
  return model;
}

const lettering = {
  A:['010','101','111','101','101'],S:['111','100','111','001','111'],H:['101','101','111','101','101'],
  E:['111','100','110','100','111'],X:['101','101','010','101','101'],C:['111','100','100','100','111'],
  N:['101','111','111','111','101'],G:['111','100','101','101','111'],T:['111','010','010','010','010'],
  I:['111','010','010','010','111'],M:['101','111','111','101','101'],B:['110','101','110','101','110'],
  R:['110','101','110','101','101'],F:['111','100','110','100','100'],O:['111','101','101','101','111'],
  D:['110','101','101','101','110'],L:['100','100','100','100','111'],Y:['101','101','010','010','010'],
  W:['101','101','111','111','101'],U:['101','101','101','101','111'],P:['110','101','110','100','100'],
} as Record<string,string[]>;
function sign(p: T.Group, top: string, bottom: string, x: number, z: number, col: T.Material, rotation = 0) {
  const group = new T.Group();
  group.position.set(x,0,z);
  group.rotation.y = rotation;
  const board = new T.Group();
  group.add(board);
  box(board,timber,-.85,1.03,0,.13,2.06,.13);
  box(board,timber,.85,1.03,0,.13,2.06,.13);
  box(board,col,0,2.05,0,2.9,.87,.12);
  box(board,amber,0,2.45,.066,2.82,.023,.014);
  box(board,amber,0,1.65,.066,2.82,.023,.014);
  for (const [txt, y, size] of [[top,2.18,.06],[bottom,1.87,.038]] as const) {
    for (let c=0;c<txt.length;c++) lettering[txt[c]]?.forEach((row, r) => [...row].forEach((bit,k) => {
      if (bit === '1') box(board,mat('#e5cd9c'),(c*4+k-(txt.length*4-1)/2)*size,y+(.5-r)*size,.07,size*.9,size*.9,.015);
    }));
  }
  p.add(group);
}

export type SiteModel = { root: T.Group; moving: T.Object3D[]; glow?: T.PointLight };
export function siteModel(kind: Facility): SiteModel {
  const root = new T.Group(), fixed = new T.Group(), moving: T.Object3D[] = [];
  const spec = facilities[kind], paint = mat(spec.color,.25,.7), size = spec.size;
  root.add(fixed);
  if (kind === 'fire') {
    cylinder(fixed, mat('#534335'),0,.028,0,1.92,.052);
    cylinder(fixed, mat('#312e28'),0,.08,0,1.24,.07);
    for (let n = 0; n < 13; n++) {
      const angle = n * Math.PI * 2 / 13;
      const rock = stone(fixed,mat(['#807a66','#9c9277','#6c695b'][n%3]),Math.cos(angle)*1.28,.18,Math.sin(angle)*1.28,.39,.28,.32);
      rock.rotation.y = angle;
    }
    for (let n = 0; n < 4; n++) {
      const fuel = cylinder(fixed, timber, (n-1.5)*.33,.16,0,.14,1.25);
      fuel.rotation.x = Math.PI*.5;
      fuel.rotation.z = n*.18;
    }
    sign(fixed,'ASH','EXCHANGE',-.1,-2.45,mat('#3c5140'),.13);
    for (let n=0;n<10;n++) {
      const flame = mesh(root,flameGeo,new T.MeshBasicMaterial({color: ['#ffe3a3','#ffbc61','#f38333','#fba347'][n%4], transparent:true, opacity:.76}), Math.sin(n*2.4)*.52,.35,Math.cos(n*2.4)*.52);
      flame.castShadow = false;
      moving.push(flame);
    }
    const glow = new T.PointLight('#ff9b4f',8,12,2);
    glow.position.set(0,.90,0);
    root.add(glow);
    batch(fixed);
    return { root, moving, glow };
  }
  if (['market','timberBuyer','specialistBuyer','tradeHub','depot','railDepot','warehouse','urbanBlock','logisticsHub','loadingPad','roadDepot','railTerminal','intermodal','autoGarage','shippingHub'].includes(kind)) {
    box(fixed,timber,0,.14,0,size*1.68,.28,size*1.4);
    for(let n=-1;n<=1;n+=2) for(let m=-1;m<=1;m+=2) box(fixed,timber,n*size*.71,1.45,m*size*.6,.14,2.65,.14);
    box(fixed,paint,0,2.85,0,size*1.87,.16,size*1.62).rotation.x = -.10;
    box(fixed,paint,0,2.65,0,size*1.87,.22,size*1.62).rotation.x = -.10;
    for(let n=0;n<10;n++) box(fixed,mat('#829184'),(n-4.5)*size*.18,2.96,0,.037,.06,size*1.65).rotation.x = -.10;
    box(fixed,timber,0,.98,-.50,size*1.42,.15,.8);
    box(fixed,mat('#a38660'),0,.8,-.53,size*1.32,.36,.65);
    fixed.add(productModel('crates',2).translateX(size*.43).translateZ(.42));
    fixed.add(productModel('boards',4).translateX(-size*.42).translateZ(.35));
    sign(fixed,kind === 'market' ? 'TIMBER' : kind==='railDepot'?'RAIL':'FREIGHT',kind === 'market' ? 'EXCHANGE' : 'DEPOT',0,-size*.9,paint,0);
    if(kind==='railDepot') {
      for(const x of [-.70,.70])box(fixed,steel,x,.09,size*1.1,.13,.13,5.3);
      for(let i=0;i<7;i++)box(fixed,timber,0,.05,size*1.1+(i-3)*.75,2.1,.11,.17);
    }
  } else if(kind==='ruin'){
    box(fixed,steel,0,.19,0,4.23,.38,3.73);
    box(fixed,paint,-1.73,1.24,0,.16,2.08,3.49);
    box(fixed,paint,0,1.24,-1.59,3.52,2.08,.13);
    for(let i=0;i<5;i++)box(fixed,timber,i*.41-1.2,2.18+i*.035,-.60,.06,.07,2.21);
    box(fixed,dark,.39,.32,.14,1.01,.41,.84).rotation.y=.6;
  } else if(kind==='burnZone'){
    box(fixed,dark,0,.09,0,7.6,.16,7.6);
    for(const x of [-3.65,3.65])for(const z of [-3.65,3.65])stone(fixed,mat('#928371'),x,.24,z,.47,.29,.47);
    for(let i=0;i<10;i++)for(const sign of [-1,1]){
      stone(fixed,mat('#928371'),(i-4.5)*.68,.19,sign*3.50,.48,.27,.37);
      stone(fixed,mat('#928371'),sign*3.50,.19,(i-4.5)*.68,.37,.27,.48);
    }
    const conduit=cylinder(fixed,paint,0,.47,0,.48,.90);
    conduit.rotation.x=Math.PI*.5;
    for(let n=0;n<7;n++){
      const flame=mesh(root,flameGeo,new T.MeshBasicMaterial({color:'#f59150',transparent:true,opacity:.62}),Math.cos(n*2.3)*1.26,.38,Math.sin(n*2.3)*1.24);
      moving.push(flame);
    }
  } else if(kind==='craneYard'){
    box(fixed,steel,0,.22,0,3.63,.43,2.55);
    for(const x of [-.47,.47])for(const z of [-.47,.47])box(fixed,paint,x,2.48,z,.14,4.66,.147);
    const boom=new T.Group();
    boom.position.set(0,4.75,0);
    box(boom,paint,0,.18,-2.5,.51,.37,7.6);
    box(boom,steel,0,-.23,-5.9,.31,.51,.31);
    box(boom,dark,0,-.56,-5.9,.16,.40,.14);
    batch(boom);
    root.add(boom);
    moving.push(boom);
  } else if(kind==='serviceBay'){
    box(fixed,steel,0,.15,0,size*1.66,.31,size*1.32);
    for(const x of [-size*.61,size*.61])for(const z of [-size*.51,size*.51])box(fixed,paint,x,2.20,z,.22,4.1,.24);
    box(fixed,paint,0,4.32,0,size*1.65,.27,size*1.29);
    for(const x of [-1.12,1.12])box(fixed,steel,x,.42,0,.25,.60,3.61);
  } else if(kind==='winch') {
    for(const x of [-.73,.73])box(fixed,steel,x,.41,0,.16,.81,1.25);
    box(fixed,paint,0,.12,0,1.78,.23,1.32);
    const reel=new T.Group();
    reel.position.set(0,.62,0);
    const roller=cylinder(reel,timber,0,0,0,.37,1.08);
    roller.rotation.z=Math.PI*.50;
    for(const x of [-.61,.61])cylinder(reel,steel,x,0,0,.47,.11).rotation.z=Math.PI*.50;
    batch(reel);
    root.add(reel);
    moving.push(reel);
  } else if (kind === 'dronePad') {
    cylinder(fixed,steel,0,.15,0,2.4,.30);
    cylinder(fixed,paint,0,.33,0,2.27,.09);
    for (const x of [-.45,.45]) box(fixed,amber,x,.385,0,.13,.02,1.8);
    box(fixed,amber,0,.386,0,.94,.021,.12);
    for(let n=0;n<8;n++) {
      const angle=n*Math.PI*.25;
      cylinder(fixed,amber,Math.cos(angle)*2.12,.41,Math.sin(angle)*2.12,.11,.12);
    }
    box(fixed,dark,0,.70,-2.0,1.1,.85,.44);
    box(fixed,glass,0,.90,-1.745,.62,.29,.08);
  } else if(kind==='serverRack'||kind==='serverHall'||kind==='data'||kind==='hyperscale') {
    const cabinets=kind==='serverRack'?1:kind==='data'?4:kind==='serverHall'?8:16;
    const deck=kind==='serverRack'?2.5:size*1.57;
    box(fixed,steel,0,.16,0,deck,.31,kind==='serverRack'?1.6:deck*.86);
    if(cabinets>1) {
      for(const x of [-deck*.45,deck*.45])for(const z of [-deck*.37,deck*.37])box(fixed,steel,x,1.44,z,.10,2.70,.11);
      box(fixed,paint,0,2.80,0,deck,.14,deck*.84);
      box(fixed,paint,0,1.47,-deck*.42,deck,2.60,.18);
      box(fixed,paint,-deck*.49,1.47,0,.18,2.60,deck*.78);
      for(let j=0;j<9;j++)box(fixed,steel,0,2.94,(j-4)*deck*.087,deck,.08,.06);
    }
    for(let j=0;j<cabinets;j++) {
      const columns=cabinets>4?cabinets/2:cabinets;
      const x=(j%columns-(columns-1)/2)*Math.min(1.52,deck/(columns+.6));
      const z=cabinets>4?(j<columns?-.66:1.20):0;
      box(fixed,dark,x,1.43,z,kind==='serverRack'?.83:1.04,2.51,.76);
      for(let k=0;k<10;k++){
        box(fixed,steel,x,2.46-k*.192,z+.40,.86,.114,.057);
        box(fixed,mat(k%4===0?'#d8b677':'#70baa6'),x+.26,2.46-k*.192,z+.442,.065,.033,.030);
      }
    }
    if(cabinets>1)for(const x of [-deck*.34,deck*.34]){
      cylinder(fixed,steel,x,3.14,-deck*.21,.55,.5);
      const fan=new T.Group();
      fan.position.set(x,3.41,-deck*.21);
      for(let n=0;n<4;n++)box(fan,steel,0,0,0,.98,.057,.149).rotation.y=n*Math.PI/4;
      root.add(fan);
      moving.push(fan);
    }
  } else if(kind==='coolTower') {
    cylinder(fixed,steel,0,.19,0,4.9,.34);
    for(let n=0;n<7;n++){
      const width=4-(Math.sin(n*Math.PI/6)*1.62);
      cylinder(fixed,paint,0,1+n*1.08,0,width,1.17);
      cylinder(fixed,steel,0,1.54+n*1.08,0,width+.11,.15);
    }
    cylinder(fixed,dark,0,8.02,0,3.65,.16);
    for(const x of [-4.1,4.1])box(fixed,glass,x,1.01,.65,.60,1.46,.22);
  } else if(['pasture','ranch','crop','megaFarm'].includes(kind)) {
    const farm=kind==='crop'||kind==='megaFarm',half=size*.74;
    const soil=mat(farm?'#786952':'#899263');
    box(fixed,soil,0,.035,0,half*2,.07,half*2);
    for(const side of [-1,1]){
      for(let n=0;n<8;n++){
        const p=(n-3.5)*half*.28;
        box(fixed,timber,side*half,.41,p,.102,.83,.103);
        box(fixed,timber,p,.41,side*half,.104,.83,.09);
      }
      for(const y of [.30,.61]){
        box(fixed,timber,side*half,y,0,.05,.09,half*2);
        box(fixed,timber,0,y,side*half,half*2,.09,.052);
      }
    }
    for(let i=0;i<7;i++){
      const x=(i-3)*half*.255;
      if(farm)box(fixed,mat('#625641'),x,.072,0,.26,.08,half*1.83);
      for(let j=0;j<12;j++){
        const z=(j-5.5)*half*.16;
        const size=.080+(i+j)%4*.043;
        if(farm){
          cylinder(fixed,mat('#929957'),x,.17,z,.026,.22);
          const stem=stone(fixed,mat('#c1a66a'),x,.29+size*.25,z,.072,.14,.065);
          stem.rotation.z=.17;
        } else {
          const grass=stone(fixed,mat(j%3?'#a7ac76':'#838e5e'),x,.10,z,size,.083,size*.77);
          grass.rotation.y=i+j;
        }
      }
    }
    if(kind==='ranch'){
      for(let i=0;i<3;i++){
        const p=new T.Group();
        p.position.set((i-1)*.74,0,(i%2-.5)*1.61);
        p.rotation.y=i*2.4;
        const coat=mat(i%2?'#988270':'#70645b');
        box(p,coat,0,.55,0,.32,.39,.66);
        box(p,coat,0,.54,.43,.24,.28,.28);
        for(const x of [-.085,.085])for(const z of [-.22,.21])box(p,dark,x,.21,z,.048,.36,.056);
        fixed.add(p);
      }
    }
  } else if(kind==='climateTower'){
    for(const x of [-.8,.8])for(const z of [-.8,.8])segment(fixed,steel,new T.Vector3(x,0,z),new T.Vector3(x*.38,7.4,z*.38),.065);
    for(let n=0;n<6;n++)box(fixed,paint,0,.6+n*1.17,0,1.40-n*.17,.055,.89-n*.095);
    cylinder(fixed,amber,0,7.72,0,.13,.83);
    for(const x of [-.37,.37])box(fixed,glass,x,7.62,0,.40,.24,.11);
  } else if(kind==='heatDuct'||kind==='heatRelay'||kind==='stormTower'||kind==='dustworks'){
    box(fixed,steel,0,.12,0,size*1.32,.24,size*1.37);
    for(const x of [-size*.38,size*.38]){
      const rise=kind==='stormTower'?size*1.6:size*.90;
      cylinder(fixed,paint,x,rise*.50,0,size*.14,rise);
      cylinder(fixed,steel,x,rise-.08,0,size*.19,.25);
      cylinder(fixed,dark,x,rise+.08,0,size*.127,.09);
      box(fixed,dark,x,.58,.70,.41,.50,1.5);
    }
    const manifold=cylinder(fixed,paint,0,.82,0,.28,size*1.04);
    manifold.rotation.z=Math.PI*.5;
  } else if(kind==='solar'){
    const blue=mat('#425b71',.42,.36);
    for(const x of [-3.24,0,3.24])for(const z of [-2.1,1.87]){
      box(fixed,steel,x,.47,z,.13,.92,.17);
      const panel=new T.Group();
      panel.position.set(x,1.07,z);
      panel.rotation.x=-.30;
      box(panel,steel,0,0,0,2.8,.09,1.79);
      for(let a=0;a<7;a++)for(let b=0;b<4;b++)box(panel,blue,(a-3)*.38,.056,(b-1.5)*.415,.353,.027,.385);
      fixed.add(panel);
    }
  } else if(kind==='wind'){
    segment(fixed,steel,new T.Vector3(0,.12,0),new T.Vector3(0,11.4,0),.27);
    cylinder(fixed,dark,0,.12,0,1.28,.21);
    box(fixed,paint,0,11.31,0,1.13,.62,1.82);
    const hub=new T.Group();
    hub.position.set(0,11.3,.94);
    for(let n=0;n<3;n++){
      const blade=new T.Group();
      blade.rotation.z=n*2*Math.PI/3;
      box(blade,mat('#d3d4b9'),0,1.65,0,.24,3.1,.092).rotation.z=.083;
      box(blade,mat('#b77953'),-.12,3.18,0,.21,.47,.086);
      hub.add(blade);
    }
    cylinder(hub,steel,0,0,.1,.28,.29).rotation.x=Math.PI*.50;
    root.add(hub);
    moving.push(hub);
  } else if(kind==='pole'||kind==='backbone'){
    const height=kind==='pole'?6.3:13.2;
    const span=kind==='pole'?1.12:2.92;
    if(kind==='pole')cylinder(fixed,timber,0,height*.5,0,.16,height);
    else{
      for(const x of [-.72,.72])segment(fixed,steel,new T.Vector3(x,0,0),new T.Vector3(x*.24,height,0),.12);
      for(let i=0;i<7;i++)segment(fixed,steel,new T.Vector3(-.60,height*i/7,0),new T.Vector3(.63,height*(i+1)/7,0),.065);
    }
    box(fixed,steel,0,height-.42,0,span*2,.12,.16);
    for(const x of [-span*.77,0,span*.77])cylinder(fixed,amber,x,height-.25,0,.092,.34);
  } else if(kind==='battery'||kind==='transformer'){
    box(fixed,steel,0,.15,0,size*1.43,.28,size*1.19);
    for(const x of [-size*.46,0,size*.46]){
      box(fixed,paint,x,.81,0,.72,1.29,1.24);
      box(fixed,glass,x,1.03,.652,.44,.25,.11);
      if(kind==='transformer')for(let n=0;n<4;n++)cylinder(fixed,steel,x,1.44+n*.13,0,.22,.11);
    }
  } else if(kind==='handPump'){
    cylinder(fixed,steel,0,.10,0,.79,.19);
    cylinder(fixed,paint,0,.66,0,.18,1.18);
    cylinder(fixed,steel,0,1.26,0,.24,.24);
    const arm=cylinder(fixed,paint,0,1.38,-.48,.064,1.16);
    arm.rotation.x=Math.PI*.50;
    box(fixed,steel,.30,1.0,0,.40,.16,.16);
    box(fixed,steel,.47,.86,0,.12,.28,.15);
  } else if(kind==='ditch'){
    box(fixed,mat('#645a49'),0,.015,0,.57,.03,5.4);
    for(const x of [-.51,.51]){
      const slope=box(fixed,mat('#817360'),x,.08,0,.57,.16,5.4);
      slope.rotation.z=x*.44;
      for(let j=0;j<9;j++)stone(fixed,mat('#87816a'),x*1.39,.14,(j-4)*.55,.32,.18,.24);
    }
  } else if (kind === 'pipe' || kind === 'flowPipe'||kind === 'tank'||kind==='tankFarm') {
    if (kind==='pipe'||kind==='flowPipe') {
      for (const x of [-1.4,1.4]) box(fixed,steel,x,.27,0,.26,.54,.54);
      const body=cylinder(fixed,paint,0,.59,0,kind==='flowPipe'?.32:.24,5.2);
      body.rotation.z=Math.PI*.5;
      for(const x of [-2.53,-1.34,1.34,2.53]) cylinder(fixed,steel,x,.59,0,.32,.15).rotation.z=Math.PI*.5;
    } else {
      cylinder(fixed,dark,0,.20,0,2.3,.32);
      cylinder(fixed,paint,0,1.73,0,1.9,3.12);
      cylinder(fixed,steel,0,3.33,0,1.89,.2);
      for(const y of [.52,1.4,2.4,3.1]) cylinder(fixed,steel,0,y,0,1.94,.08);
      for(let n=0;n<12;n++) box(fixed,steel,.93,.27+n*.23,1.68,.46,.07,.16);
      box(fixed,glass,-.5,1.55,1.88,.18,1.54,.12);
      if(kind==='tankFarm')for(const x of [-2.25,2.25]){
        cylinder(fixed,paint,x,1.23,.24,.92,2.46);
        for(const y of [.77,1.65,2.32])cylinder(fixed,steel,x,y,.24,.96,.10);
      }
    }
  } else if(['road','serviceRoad','pavedRoad','rail','belt','poweredBelt','rollerIntake'].includes(kind)) {
    const rail=kind==='rail',belt=kind==='belt'||kind==='poweredBelt'||kind==='rollerIntake';
    box(fixed,(kind === 'road' ? mat('#726f61') : kind==='pavedRoad'?mat('#555950'):kind==='serviceRoad'?mat('#847961'):dark),0,belt?.34:.04,0,4.05,belt?.24:.08,5.05);
    for (let n=-2;n<=2;n++) {
      if (rail || belt) box(fixed,rail?timber:steel,0,belt?.49:.09,n*.96,4,.11,.17);
      else box(fixed,amber,0,.087,n*.97,.085,.013,.45);
    }
    if (rail || belt) for (const x of [-1.45,1.45]) box(fixed,steel,x,belt?.53:.16,0,.11,.13,5.05);
  } else if(kind==='stackRack'){
    for(const x of [-1.26,1.26])for(const z of [-.76,.76])box(fixed,timber,x,.72,z,.14,1.44,.14);
    for(const x of [-.85,.85])box(fixed,steel,x,.43,0,1.19,.15,1.85);
  } else if(kind==='loadingHopper'){
    for(const x of [-.79,.79])for(const z of [-.70,.70])box(fixed,steel,x,.75,z,.13,1.50,.13);
    cylinder(fixed,paint,0,1.6,0,1.14,.78);
    cylinder(fixed,dark,0,1.99,0,1.08,.061);
    cylinder(fixed,steel,0,.89,0,.47,.68);
  } else if (kind === 'rack' || kind === 'workshop' || kind === 'carpentry' || kind === 'bench') {
    for(const x of [-1.1,1.1]) for(const z of [-.6,.6]) box(fixed,steel,x,.48,z,.14,.96,.15);
    box(fixed,timber,0,.99,0,2.8,.19,1.5);
    box(fixed,paint,0,.88,0,2.85,.17,1.55);
    box(fixed,steel,0,1.09,-.45,2.63,.07,.14);
    if (kind === 'bench') {
      const blade = cylinder(root,steel,0,1.11,.04,.36,.073);
      blade.rotation.z = Math.PI*.5;
      moving.push(blade);
      for(let n=0;n<6;n++) box(fixed,paint,-1.1+n*.42,1.105,.45,.22,.04,.18);
    } else {
      for (const x of [-1.2,1.2]) box(fixed,timber,x,1.55,-.54,.17,1.22,.29);
      for (const y of [1.38,1.91]) box(fixed,paint,0,y,-.31,2.5,.12,.74);
    }
  } else {
    box(fixed,mat('#646759'),0,.15,0,size*1.63,.32,size*1.42);
    box(fixed,paint,0,size*.45,-size*.12,size*1.34,size*.70,size*.92);
    box(fixed,steel,0,size*.83,-size*.12,size*1.48,.21,size*1.04);
    box(fixed,dark,0,size*.41,size*.38,size*.54,size*.50,.14);
    box(fixed,glass,0,size*.55,size*.46,size*.41,.24,.093);
    for (const x of [-size*.59,size*.59]) {
      box(fixed,steel,x,size*.55,size*.37,.12,size*.68,.13);
      for (let n=0;n<5;n++) box(fixed,dark,x,size*.3+n*.125,size*.41,.29,.043,.09);
    }
    if (['thermal','dryer','kiln','quarry','cement','generator','data','pump'].includes(kind)) {
      for (const x of [-size*.42,size*.42]) {
        cylinder(fixed,steel,x,size*.88,-size*.34,size*.13,size*.93);
        cylinder(fixed,paint,x,size*1.38,-size*.34,size*.16,.22);
        cylinder(fixed,dark,x,size*1.514,-size*.34,size*.119,.055);
        cylinder(fixed,amber,x,size*1.24,-size*.34,size*.14,.14);
      }
    }
    if (['data','mill','pulp','pump','generator','thermal'].includes(kind)) {
      const fan = new T.Group();
      fan.position.set(0,size*.65,size*.46);
      for(let n=0;n<4;n++) box(fan,steel,0,0,0,size*.45,.10,.10).rotation.z = n*Math.PI/4;
      root.add(fan);
      moving.push(fan);
    }
    for(let n=0;n<6;n++) box(fixed,n%2 ? dark : amber,(n-2.5)*.22,.34,size*.65,.2,.03,.2);
  }
  batch(fixed);
  return { root, moving };
}

export function productModel(good: Good, quantity: number) {
  const root = new T.Group(), material = mat(goods[good][2]);
  for (let j = 0; j < Math.min(8, quantity); j++) {
    const y = .08 + Math.floor(j / 2) * .145, z = (j%2-.5)*.30;
    if (good === 'crates'||good==='cartons'||good==='packed') {
      box(root,material,(j%2)*.69,.29+Math.floor(j/2)*.55,0,.63,.55,.56);
      for (const x of [-.2,.2]) box(root,timber,(j%2)*.69+x,.29+Math.floor(j/2)*.55,.287,.075,.52,.025);
    } else if(good==='pallet') {
      const h=Math.floor(j/2)*.19,x=(j%2)*1.03;
      for(const offset of [-.37,-.12,.12,.37])box(root,material,x+offset,.16+h,0,.15,.055,.86);
      for(const z of [-.30,0,.30])box(root,timber,x,.075+h,z,.84,.105,.092);
    } else if(good==='turned') {
      const leg=cylinder(root,material,(j%4-.8)*.24,.23+Math.floor(j/4)*.24,z,.08,.57);
      leg.rotation.z=Math.PI*.5;
    } else if(good==='cabinets'||good==='finishedCabinet') {
      const x=(j%3)*.80;
      box(root,material,x,.44,0,.73,.87,.48);
      box(root,mat('#9b7856'),x,.445,.25,.65,.77,.034);
      box(root,steel,x+.22,.43,.28,.05,.17,.04);
      if(j>=2)break;
    } else if (good === 'furniture' || good==='modular') {
      box(root,material,0,.65,0,1.08,.15,.72);
      if(good==='modular')for(const y of [.25,.44])box(root,material,0,y,0,1.05,.05,.64);
      for (const x of [-.44,.44]) for (const j of [-.27,.27]) box(root,material,x,.31,j,.10,.62,.10);
      break;
    } else if(good==='hay'||good==='harvest'||good==='grazingYield'){
      const bale=cylinder(root,material,(j%4-1.5)*.32,.21+Math.floor(j/4)*.3,0,.17,.32);
      bale.rotation.z=Math.PI*.5;
    } else if (good === 'paper' || good === 'pulp'||good==='premiumPaper') {
      const bale = cylinder(root,material,z,.23+j*.10,0,.19,.54);
      bale.rotation.z = Math.PI*.5;
    } else if (['chips','driedChips','briquettes','ash','ashAggregate','mixedOre','sand','concrete','asphalt','ore','charcoal','pellets','cement'].includes(good)) {
      stone(root,material,(j%4-.7)*.23,.17+Math.floor(j/4)*.15,z,.18,.18,.17);
    } else if(good==='timber'||good==='branches'){
      const wood=cylinder(root,material,(j%4-1.5)*.27,.22+Math.floor(j/4)*.26,0,good==='branches'?.065:.14,1.38);
      wood.rotation.x=Math.PI*.5;
    } else {
      box(root,material,0,y,z,good === 'beams'||good==='foundation' ? 1.85 : 1.18,good === 'plywood'?.06:.11,.29);
    }
  }
  return batch(root);
}

export function vehicleModel(type: VehicleType) {
  const def=vehicleTypes[type], root=new T.Group(), fixed=new T.Group(), wheels:T.Object3D[]=[];
  const scale = type==='giantRig'?2.3:['truck','trailer','regionalTruck','flatbed','heavyTruck','forwarder','treeHarvester'].includes(type)?1.6 : type === 'pickup'||type==='towPickup'||type==='dozer' ? 1.25 :
    type === 'atv'||type==='towAtv'||type==='trike' ? .83 : 1;
  const paint = mat(def.color,.32), motor=def.motor;
  let forks:T.Group|undefined;
  root.add(fixed);
  box(fixed,steel,0,.42,.22,1.34,.19,2.07);
  box(fixed,timber,0,.56,.38,1.45,.13,1.75);
  for(const x of [-.70,.70]) box(fixed,paint,x,.76,.39,.10,.43,1.83);
  if (motor) {
    box(fixed,paint,0,.75,-.81,1.42,.56,1.05);
    box(fixed,steel,0,.56,-1.38,1.42,.26,.10);
    for (const x of [-.49,.49]) box(fixed,amber,x,.78,-1.365,.28,.14,.09);
    if(type!=='atv'&&type!=='towAtv') {
      box(fixed,paint,0,1.3,-.60,1.30,.69,.66);
      box(fixed,glass,0,1.43,-.96,1.11,.33,.075);
      box(fixed,glass,-.666,1.43,-.61,.075,.33,.44);
      box(fixed,glass,.666,1.43,-.61,.075,.33,.44);
      box(fixed,paint,0,1.70,-.58,1.42,.11,.76);
    }
    if(type==='mixer'){
      const drum=cylinder(fixed,paint,0,1.02,.32,.65,1.41);
      drum.rotation.x=Math.PI*.42;
      for(const z of [-.10,.58]){
        const rim=cylinder(fixed,steel,0,1.05,z,.65,.060);
        rim.rotation.x=Math.PI*.42;
      }
      box(fixed,steel,0,.70,1.13,.34,.17,.74).rotation.x=.54;
    }
    if(type==='oreTruck')for(const x of [-.72,.72]){
      box(fixed,paint,x,.84,.42,.085,.54,1.59);
      box(fixed,steel,x,.44,.90,.16,.17,.44);
    }
    if(type==='waterCart'){
      const tank=cylinder(fixed,paint,0,.91,.33,.53,1.43);
      tank.rotation.x=Math.PI*.5;
      for(const z of [-.18,.74]){
        const rib=cylinder(fixed,steel,0,.91,z,.55,.098);
        rib.rotation.x=Math.PI*.5;
      }
      box(fixed,glass,.51,.90,.36,.06,.28,.22);
    }
    if(type==='roller'){
      const drum=cylinder(fixed,steel,0,.42,-1.54,.46,1.70);
      drum.rotation.z=Math.PI*.5;
      for(const x of [-.82,.82])box(fixed,paint,x,.62,-1.21,.16,.31,.82);
      box(fixed,amber,0,.95,-1.44,.94,.15,.19);
    }
    if (type === 'dozer'||type==='trackDozer') {
      box(fixed,amber,0,.46,-1.82,1.93,.53,.19).rotation.x = -.19;
      for (const x of [-.64,.64]) box(fixed,steel,x,.53,-1.6,.16,.16,.64);
    }
    if(['trackSkid','trackDozer','giantRig','excavator','demolisher'].includes(type))for(const x of [-.72,.72]){
      box(fixed,dark,x,.31,0,.47,.43,2.62);
      for(let i=0;i<10;i++)box(fixed,steel,x,.56,(i-4.5)*.236,.50,.076,.085);
    }
    if(type==='tractor')box(fixed,steel,0,.64,1.54,.44,.18,.55);
    if(type==='forwarder'||type==='treeHarvester'||type==='giantRig'){
      cylinder(fixed,steel,0,1.14,.54,.24,.67);
      const main=box(fixed,paint,0,2.12,.09,.21,.25,2.02);
      main.rotation.x=-.24;
      box(fixed,steel,0,2.21,-.90,.18,.17,.56).rotation.x=.31;
    }
    if(def.forks) {
      forks=new T.Group();
      forks.position.set(0,.91,-.61);
      for(const x of [-.52,.52]) {
        box(forks,paint,x,-.19,-.73,.19,.17,1.62).rotation.x=.20;
        box(forks,steel,x,-.37,-1.50,.15,.51,.15);
        box(forks,dark,x,-.59,-1.78,.16,.11,.71);
      }
      box(forks,steel,0,-.44,-1.53,1.21,.21,.16);
      if(type==='frontLoader'||type==='scoopLoader'||type==='excavator'){
        box(forks,paint,0,-.62,-1.55,1.57,.16,.67);
        box(forks,steel,0,-.37,-1.24,1.58,.42,.09).rotation.x=-.30;
      } else if(type==='treeHarvester'||type==='giantRig'||type==='shear'||type==='demolisher'){
        cylinder(forks,steel,0,-.50,-1.92,.40,.11).rotation.x=Math.PI*.45;
        for(const x of [-.43,.43])box(forks,paint,x,-.43,-1.81,.18,.27,.57).rotation.y=x;
      }
      batch(forks);
      root.add(forks);
    }
  } else if(def.trailer) {
    for(const x of [-.56,.56]) box(fixed,steel,x,.50,-1.10,.10,.13,1.35).rotation.y=x*.82;
    box(fixed,steel,0,.48,-1.67,.21,.13,.31);
    for(const x of [-.68,.68])for(const z of [-.45,.4,1.17])box(fixed,paint,x,.91,z,.13,.88,.11);
  } else if(type==='trike') {
    box(fixed,paint,0,.49,-.73,.18,.17,1.24);
    box(fixed,timber,0,.94,-.83,.40,.13,.45);
    box(fixed,steel,0,.76,-1.29,.12,.94,.10).rotation.x=-.23;
    box(fixed,steel,0,1.23,-1.36,.82,.079,.087);
    const steering=cylinder(fixed,rubber,0,.36,-1.40,.34,.17);
    steering.rotation.z=Math.PI*.5;
  } else if(type==='wheelbarrow'){
    box(fixed,paint,0,.67,.17,1.35,.16,1.29);
    for(const x of [-.55,.55]){
      box(fixed,steel,x,.91,.22,.083,.43,1.19).rotation.z=-x*.22;
      box(fixed,timber,x,.57,-.61,.065,.081,1.43);
    }
    const hub=new T.Group();
    hub.position.set(0,.37,.96);
    cylinder(hub,rubber,0,0,0,.34,.20).rotation.z=Math.PI*.5;
    cylinder(hub,steel,0,0,0,.145,.24).rotation.z=Math.PI*.5;
    root.add(hub);wheels.push(hub);
  } else if (type === 'sled') {
    for(const x of [-.55,.55]) box(fixed,paint,x,.22,.25,.15,.17,2.43);
  } else {
    for(const x of [-.50,.50]) box(fixed,timber,x,.54,-1.31,.08,.10,1.4);
  }
  if (type !== 'sled'&&type!=='wheelbarrow') for(const x of [-.77,.77]) for(const z of motor ? [-.82,.91] : def.trailer?[.34,.90]:[.43]) {
    const hub=new T.Group();
    hub.position.set(x,.40,z);
    const tire=cylinder(hub,rubber,0,0,0,.4,.23);
    tire.rotation.z=Math.PI*.5;
    cylinder(hub,steel,x<0?-.13:.13,0,0,.19,.055).rotation.z=Math.PI*.5;
    for(let n=0;n<14;n++) {
      const a=n*Math.PI/7;
      const tread=box(hub,dark,0,Math.cos(a)*.40,Math.sin(a)*.40,.235,.044,.09);
      tread.rotation.x=a;
    }
    batch(hub);
    root.add(hub);
    wheels.push(hub);
  }
  batch(fixed);
  root.scale.setScalar(scale);
  return { root,wheels,forks };
}

export function toolModel(tool: Tool, golden = false) {
  const root = new T.Group();
  const item = tools[tool];
  const body = mat(golden ? '#ceac58' : tool === 'knife' ? '#dfd8be' : '#ac713e',.1);
  if (tool === 'knife') {
    box(root,body,0,.15,0,.065,.31,.048);
    box(root,mat(golden?'#e8ce88':'#efead5'),0,.435,0,.105,.32,.028);
    const tip=mesh(root,new T.SphereGeometry(.050,9,5),mat(golden?'#e8ce88':'#efead5'),0,.595,0,1,1,.27);
    tip.rotation.z=.12;
    for(let i=0;i<8;i++) box(root,body,.057,.39+i*.026,0,.016,.011,.028).rotation.z=.3;
  } else if(tool==='breaker'){
    box(root,body,0,.30,0,.097,.60,.081);
    box(root,steel,0,.592,0,.31,.145,.141);
    box(root,dark,.17,.595,0,.055,.094,.108);
  } else if (tool === 'axe') {
    box(root,body,0,.27,0,.087,.61,.064);
    box(root,steel,.073,.58,0,.26,.193,.067);
  } else {
    box(root,steel,0,.45,0,tool==='saw'?.12:.19,.57,.05);
    for(let i=0;i<10;i++) box(root,dark,.09,.25+i*.046,0,.048,.022,.045).rotation.z=.4;
    box(root,item.power>20?amber:body,0,.14,0,.19,.24,.14);
  }
  const sleeve=mat('#59604a'), glove=mat('#a18c68');
  box(root,sleeve,0,-.15,.035,.135,.35,.14);
  box(root,glove,0,.014,0,.126,.14,.105);
  box(root,glove,.072,.059,-.021,.041,.088,.07).rotation.z=.32;
  return batch(root);
}

export const leafBlade = (() => {
  const shape = new T.BufferGeometry();
  shape.setAttribute('position',new T.Float32BufferAttribute([-.08,0,0,.08,0,0,0,.43,.20,0,.23,-.03],3));
  shape.setIndex([0,1,3,1,2,3,2,0,3,0,2,1]);
  shape.computeVertexNormals();
  return shape;
})();
export function ropeModel() {
  const shape=new T.Mesh(rodGeo,mat('#d5bd87'));
  shape.visible=false;
  return shape;
}

export function freightModel(mode:'rail'|'air'|'road',good:Good,quantity:number) {
  const root=new T.Group(), solid=new T.Group(), motion:T.Object3D[]=[];
  root.add(solid);
  if(mode==='road'){
    const truck=vehicleModel('regionalTruck');
    root.add(truck.root);
    const payload=productModel(good,Math.min(quantity,8));
    payload.position.set(-.22,.65,.54);
    truck.root.add(payload);
    return {root,motion:truck.wheels};
  }
  if(mode==='air') {
    box(solid,steel,0,0,0,.80,.26,1.05);
    box(solid,glass,0,-.02,-.55,.68,.17,.13);
    for(const x of [-.72,.72])for(const z of [-.70,.70]){
      box(solid,steel,x*.60,.07,z,.98,.08,.14);
      cylinder(solid,amber,x,.11,z,.19,.12);
      const rotor=new T.Group();
      rotor.position.set(x,.21,z);
      box(rotor,dark,0,0,0,1.1,.022,.06);
      box(rotor,steel,0,0,0,.06,.022,1.1);
      root.add(rotor);
      motion.push(rotor);
    }
    const crate=productModel(good,Math.min(quantity,3));
    crate.scale.setScalar(.57);
    crate.position.y=-.55;
    solid.add(crate);
  } else {
    box(solid,dark,0,.36,-1.8,1.6,.31,4.1);
    box(solid,amber,0,.86,-2.43,1.41,.78,2.1);
    box(solid,amber,0,1.21,-.98,1.44,1.51,1.14);
    box(solid,glass,0,1.57,-1.58,1.12,.39,.13);
    box(solid,steel,0,2,-.98,1.53,.15,1.32);
    box(solid,dark,0,1.35,-3.01,.24,.83,.21);
    box(solid,timber,0,.43,1.68,1.52,.23,3.0);
    box(solid,steel,0,.35,.04,.22,.11,.63);
    for(const x of [-.61,.61]) {
      box(solid,steel,x,.72,1.66,.09,.34,3.05);
      for(const z of [-3.08,-2.13,-1.0,.76,2.75]){
        const wheel=cylinder(solid,dark,x,.33,z,.31,.19);
        wheel.rotation.z=Math.PI*.5;
      }
    }
    const flatbed=productModel(good,Math.min(quantity,6));
    flatbed.position.set(-.27,.59,1.58);
    solid.add(flatbed);
  }
  batch(solid);
  return {root,motion};
}

export function helperModel() {
  const root=new T.Group(), body=new T.Group(), motion:T.Object3D[]=[];
  root.add(body);
  const shirt=mat('#7d855e'), workPants=mat('#566968'), helmet=mat('#d6ae5c'), skin=mat('#b79274');
  box(body,shirt,0,1.10,0,.38,.46,.25);
  box(body,skin,0,1.47,0,.22,.25,.20);
  cylinder(body,helmet,0,1.65,0,.17,.10);
  box(body,helmet,0,1.61,-.085,.38,.067,.32);
  for(const direction of [-1,1]){
    const thigh=new T.Group();
    thigh.position.set(direction*.098,.87,0);
    box(thigh,workPants,0,-.30,0,.137,.60,.119);
    box(thigh,dark,0,-.65,-.041,.147,.106,.22);
    root.add(thigh);
    motion.push(thigh);
    const arm=new T.Group();
    arm.position.set(direction*.244,1.30,0);
    box(arm,shirt,0,-.16,0,.109,.32,.121);
    box(arm,skin,0,-.36,-.01,.101,.15,.12);
    root.add(arm);
    motion.push(arm);
  }
  batch(body);
  return {root,wheels:motion,forks:undefined};
}

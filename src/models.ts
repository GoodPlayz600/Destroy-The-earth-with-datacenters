import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { facilities, goods, species, tools, vehicles } from './catalog';
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
    if (merged) mesh(group, merged, material, 0,0,0);
    for (const geometry of shapes) geometry.dispose();
  }
  return group;
}

export const treeModels = species.map((s, kind) => {
  const group = new T.Group(), wood = mat(s.bark), bare = mat('#9d8059'), leaf = new T.Color(s.leaf);
  const leaves = [-.14, -.07, 0, .075, .14].map(l => mat('#' + leaf.clone().offsetHSL(l * .12, 0, l).getHexString()));
  const h = s.height, bend = (kind - 1.5) * .13;
  segment(group, wood, new T.Vector3(0,0,0), new T.Vector3(bend,h*.54,0), s.radius);
  segment(group, wood, new T.Vector3(bend,h*.49,0), new T.Vector3(bend*3,h*.88,.1), s.radius*.78);
  for (let i = 0; i < 5; i++) {
    const angle = i * 1.255 + kind;
    const root = new T.Vector3(Math.cos(angle)*s.radius*2.65, .06, Math.sin(angle)*s.radius*2.65);
    segment(group,wood,root,new T.Vector3(0,h*.125,0),s.radius*.42);
  }
  for (let i = 0; i < (kind === 2 ? 10 : 8); i++) {
    const angle = i * 2.39 + kind;
    const radius = h * (kind === 3 ? .31 : kind === 2 ? .27 : .22) * (.65 + hash(6,i,kind)*.44);
    const top = h * (.68 + hash(3,kind,i)*.26), x = Math.cos(angle)*radius + bend*2, z = Math.sin(angle)*radius;
    const start = new T.Vector3(bend, kind === 2 ? h*.86 : top-h*.24,0), end = new T.Vector3(x,top,z);
    segment(group,kind === 2 ? bare : wood,start,end,s.radius*(kind === 2 ? .33 : .42));
    if (kind === 2) {
      const tip = new T.Vector3(x*1.42,top-h*.19,z*1.42);
      for (let n = 0; n < 6; n++) {
        const point = start.clone().lerp(tip,(n+1)/7);
        const geo = mesh(group, foliageGeo, leaves[(i+n)%5],point.x,point.y,point.z,.23+n*.075,.12,.34+n*.06);
        geo.rotation.y = -angle + n*.12;
        geo.rotation.z = -.35;
      }
    } else {
      for (let n = 0; n < 3; n++) {
        const spread = h * (.105 + hash(8,n,i)*.055);
        const cluster = mesh(group,foliageGeo,leaves[(i+n)%5],x + Math.cos(i+n)*spread*.72,top+n*h*.04,z+Math.sin(i+n)*spread*.69,spread*1.32,spread*.66,spread*1.06);
        cluster.rotation.set(n*.21,i*2.1,n*.18);
      }
    }
  }
  return batch(group);
});

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
    const angle = n * 2.4, ridge = box(model,mat(species[kind].bark).clone(),Math.cos(angle)*r,.07,Math.sin(angle)*r,.02,length*.78,.024);
    (ridge.material as T.MeshStandardMaterial).color.multiplyScalar(.68);
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
      const flame = mesh(root,new T.ConeGeometry(.30,.95,5),new T.MeshBasicMaterial({color: ['#ffe3a3','#ffbc61','#f38333','#fba347'][n%4], transparent:true, opacity:.76}), Math.sin(n*2.4)*.52,.35,Math.cos(n*2.4)*.52);
      flame.castShadow = false;
      moving.push(flame);
    }
    const glow = new T.PointLight('#ff9b4f',8,12,2);
    glow.position.set(0,.90,0);
    root.add(glow);
    batch(fixed);
    return { root, moving, glow };
  }
  if (kind === 'market' || kind === 'depot') {
    box(fixed,timber,0,.14,0,size*1.68,.28,size*1.4);
    for(let n=-1;n<=1;n+=2) for(let m=-1;m<=1;m+=2) box(fixed,timber,n*size*.71,1.45,m*size*.6,.14,2.65,.14);
    box(fixed,paint,0,2.85,0,size*1.87,.16,size*1.62).rotation.x = -.10;
    box(fixed,paint,0,2.65,0,size*1.87,.22,size*1.62).rotation.x = -.10;
    for(let n=0;n<10;n++) box(fixed,mat('#829184'),(n-4.5)*size*.18,2.96,0,.037,.06,size*1.65).rotation.x = -.10;
    box(fixed,timber,0,.98,-.50,size*1.42,.15,.8);
    box(fixed,mat('#a38660'),0,.8,-.53,size*1.32,.36,.65);
    fixed.add(productModel('crates',2).translateX(size*.43).translateZ(.42));
    fixed.add(productModel('boards',4).translateX(-size*.42).translateZ(.35));
    sign(fixed,kind === 'market' ? 'TIMBER' : 'FREIGHT',kind === 'market' ? 'EXCHANGE' : 'DEPOT',0,-size*.9,paint,0);
  } else if (kind === 'road' || kind === 'rail' || kind === 'belt') {
    const rail = kind === 'rail', belt = kind === 'belt';
    box(fixed,kind === 'road' ? mat('#726f61') : dark,0,belt?.34:.04,0,4.05,belt?.24:.08,5.05);
    for (let n=-2;n<=2;n++) {
      if (rail || belt) box(fixed,rail?timber:steel,0,belt?.49:.09,n*.96,4,.11,.17);
      else box(fixed,amber,0,.087,n*.97,.085,.013,.45);
    }
    if (rail || belt) for (const x of [-1.45,1.45]) box(fixed,steel,x,belt?.53:.16,0,.11,.13,5.05);
  } else if (kind === 'rack' || kind === 'workshop' || kind === 'bench') {
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
    if (good === 'crates') {
      box(root,material,(j%2)*.69,.29+Math.floor(j/2)*.55,0,.63,.55,.56);
      for (const x of [-.2,.2]) box(root,timber,(j%2)*.69+x,.29+Math.floor(j/2)*.55,.287,.075,.52,.025);
    } else if (good === 'furniture') {
      box(root,material,0,.65,0,1.08,.15,.72);
      for (const x of [-.44,.44]) for (const j of [-.27,.27]) box(root,material,x,.31,j,.10,.62,.10);
      break;
    } else if (good === 'paper' || good === 'pulp') {
      const bale = cylinder(root,material,z,.23+j*.10,0,.19,.54);
      bale.rotation.z = Math.PI*.5;
    } else if (['chips','ore','charcoal','pellets','cement'].includes(good)) {
      stone(root,material,(j%4-.7)*.23,.17+Math.floor(j/4)*.15,z,.18,.18,.17);
    } else {
      box(root,material,0,y,z,good === 'beams' ? 1.85 : 1.18,good === 'plywood'?.06:.11,.29);
    }
  }
  return batch(root);
}

export function vehicleModel(type: VehicleType) {
  const def=vehicles[type], root=new T.Group(), fixed=new T.Group(), wheels:T.Object3D[]=[];
  const scale = type === 'truck' ? 1.6 : type === 'pickup' || type === 'dozer' ? 1.25 : type === 'atv' ? .83 : 1;
  const paint = mat(def.color,.32), motor=def.motor;
  root.add(fixed);
  box(fixed,steel,0,.42,.22,1.34,.19,2.07);
  box(fixed,timber,0,.56,.38,1.45,.13,1.75);
  for(const x of [-.70,.70]) box(fixed,paint,x,.76,.39,.10,.43,1.83);
  if (motor) {
    box(fixed,paint,0,.75,-.81,1.42,.56,1.05);
    box(fixed,steel,0,.56,-1.38,1.42,.26,.10);
    for (const x of [-.49,.49]) box(fixed,amber,x,.78,-1.365,.28,.14,.09);
    if(type!=='atv') {
      box(fixed,paint,0,1.3,-.60,1.30,.69,.66);
      box(fixed,glass,0,1.43,-.96,1.11,.33,.075);
      box(fixed,glass,-.666,1.43,-.61,.075,.33,.44);
      box(fixed,glass,.666,1.43,-.61,.075,.33,.44);
      box(fixed,paint,0,1.70,-.58,1.42,.11,.76);
    }
    if (type === 'dozer' || type === 'skid') {
      box(fixed,amber,0,.46,-1.82,1.93,.53,.19).rotation.x = -.19;
      for (const x of [-.64,.64]) box(fixed,steel,x,.53,-1.6,.16,.16,.64);
    }
  } else if (type === 'sled') {
    for(const x of [-.55,.55]) box(fixed,paint,x,.22,.25,.15,.17,2.43);
  } else {
    for(const x of [-.50,.50]) box(fixed,timber,x,.54,-1.31,.08,.10,1.4);
  }
  if (type !== 'sled') for(const x of [-.77,.77]) for(const z of motor ? [-.82,.91] : [.43]) {
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
  return { root,wheels };
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

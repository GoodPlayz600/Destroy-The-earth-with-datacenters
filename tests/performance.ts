import { Campaign } from '../src/campaign';
import { TOTAL } from '../src/catalog';
import { homeDistrict } from '../src/land';
import assert from 'node:assert/strict';

const game=new Campaign(20831,'noCompute');
game.cash=850000;
for(const [kind,x,z]of [['forestry',15,14],['pump',3,14],['thermal',-8,11],['quarry',-12,-7]] as const){
  assert.ok(game.build(kind,{x,z}),kind);
}
for(let i=0;i<64;i++){
  if(i!==homeDistrict)assert.ok(game.buyDistrict(i));
  const kind=(['watershed','quarry','thermal'] as const)[i%3];
  assert.ok(game.startProject(i,kind));
}
const elapsed:number[]=[];
while(!game.won&&elapsed.length<1100){
  const now=performance.now();
  game.tick(1);
  elapsed.push(performance.now()-now);
}
assert.equal(game.desertCount,TOTAL);
assert.ok(game.won);
const durations=elapsed.sort((a,b)=>a-b);
const save=JSON.stringify(game.snapshot());
const reloaded=Campaign.restore(JSON.parse(save));
const continued:number[]=[];
for(let i=0;i<180;i++){
  const now=performance.now();
  reloaded.tick(1);
  continued.push(performance.now()-now);
}
assert.equal(reloaded.desertCount,TOTAL);
assert.equal(reloaded.won,true);
continued.sort((a,b)=>a-b);
console.log(JSON.stringify({
  cells:game.desertCount,ticks:elapsed.length,medianMs:Number(durations[Math.floor(durations.length*.5)].toFixed(2)),
  p95Ms:Number(durations[Math.floor(durations.length*.95)].toFixed(2)),saveMiB:Number((Buffer.byteLength(save)/1048576).toFixed(2)),
  continuedTicks:continued.length,continuedMedianMs:Number(continued[Math.floor(continued.length*.5)].toFixed(2)),
  continuedP95Ms:Number(continued[Math.floor(continued.length*.95)].toFixed(2)),
},null,2));

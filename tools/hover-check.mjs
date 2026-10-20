import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const dist=new URL('../dist/',import.meta.url),context=vm.createContext({});
for(const file of ['element-info.js','shensha-adapter.js'])vm.runInContext(await readFile(new URL(file,dist),'utf8'),context);
const names=Array.from(vm.runInContext('Object.keys(SHENSHA_BY_NAME)',context));
const info=context.YuanjingElementInfo;
assert.equal(names.length,51);
assert.deepEqual(Object.keys(info.omens).sort(),names.sort());
assert.equal(new Set(Object.values(info.omens)).size,51);
for(const name of names)assert.ok(info.omens[name].length>15,'Missing interpretation: '+name);
assert.deepEqual(Object.keys(info.planets),['太阳','水星','金星','地球','火星','木星','土星','天王星','海王星']);

// Exercise the actual canvas hit-test function: coordinates, overlapping hits and labels.
const app=await readFile(new URL('app.js',dist),'utf8');
const start=app.indexOf('function findPlanetAt('),end=app.indexOf('function showPlanetDetails(',start);
assert.ok(start>=0&&end>start);
vm.runInContext(app.slice(start,end),context);
context.scrollY=120;
context.planetHits=[{name:'太阳',x:200,y:500},{name:'水星',x:215,y:500,label:{left:223,right:248,top:491,bottom:508}}];
assert.equal(context.findPlanetAt(200,380).name,'太阳');
assert.equal(context.findPlanetAt(215,380).name,'水星','Choose nearest overlapping hit, not first entry');
assert.equal(context.findPlanetAt(245,380).name,'水星','Labels must be interactive');
assert.equal(context.findPlanetAt(290,380),null);
assert.equal(context.findPlanetAt(215,500),null,'Client Y must account for page scroll');
assert.equal(context.planetHits[0].name,'太阳','Hit testing must not reorder frame data');
context.scrollY=0;assert.equal(context.findPlanetAt(200,500).name,'太阳');
console.log('Hover data checks passed: 51 explanations, 9 celestial bodies, nearest-hit selection, labels and scroll coordinates.');

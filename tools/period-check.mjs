import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const context=vm.createContext({Intl,Date});
for(const f of ['vendor/lunar.js','vendor/shensha.js','shensha-adapter.js','period-elements.js'])vm.runInContext(await readFile(new URL('../dist/'+f,import.meta.url),'utf8'),context);
const run=code=>vm.runInContext(code,context);
run("var chart=Solar.fromYmdHms(1998,8,16,9,30,0).getLunar().getEightChar();var clock=new Date('2026-10-22T03:00:00Z');var male=YuanjingPeriods.build(chart,'male',clock);var female=YuanjingPeriods.build(chart,'female',clock);");
const m=run('male'),f=run('female');assert.ok(m.dayun[0].pillar.includes('癸亥'));assert.ok(m.annual[0].pillar.includes('丙午'));assert.notEqual(m.dayun[0].pillar,f.dayun[0].pillar);
for(const state of [m,f]){
 const ids=[...state.dayun,...state.annual].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 for(const entries of [state.dayun,state.annual]){assert.ok(entries.some(e=>e.family==='god'));assert.ok(entries.some(e=>e.family==='omen'));assert.ok(entries.every(e=>e.origin&&e.pillar));assert.ok(!entries.some(e=>['天赦','德秀'].includes(e.rawName)));}
}
const unknown=run("YuanjingPeriods.build(chart,'',clock)");assert.equal(unknown.dayun.length,0);assert.ok(unknown.annual.length);assert.ok(!unknown.annual.some(e=>e.rawName==='元辰'));
run("var y=chart.getYun(1,1);var boundary=y.getStartSolar().nextYear(20);var before=boundary.nextHour(-1);var after=boundary.nextHour(1);function dateOf(s){return new Date(s.toYmdHms().replace(' ','T')+'+08:00')}");
assert.notEqual(run("YuanjingPeriods.build(chart,'male',dateOf(before)).dayun[0].pillar"),run("YuanjingPeriods.build(chart,'male',dateOf(after)).dayun[0].pillar"),'Exact decade boundary');
assert.equal(run("YuanjingPeriods.build(chart,'male',new Date('1998-08-17T00:00:00Z')).dayun.length"),0);
assert.equal(run("YuanjingPeriods.build(chart,'male',new Date('1997-01-01T00:00:00Z')).annual.length"),0);
assert.notEqual(run("YuanjingPeriods.build(chart,'male',new Date('2026-02-03T00:00:00Z')).annual[0].pillar"),run("YuanjingPeriods.build(chart,'male',new Date('2026-02-05T00:00:00Z')).annual[0].pillar"),'Li Chun annual boundary');
const same=run("[...male.dayun,...male.annual].filter(e=>e.family==='god'&&e.name==='劫财')");assert.ok(same.length>=1);
console.log('Period checks passed: current male/female cycles, all stems and hidden stems, unique carriers, unknown gender, pre-birth/pre-cycle and exact decade/Li Chun boundaries.');

/* Current periods use Asia/Shanghai clock time. natal chart remains the reference. */
(function(root){
 function currentSolar(now=new Date()){
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
  return Solar.fromYmdHms(+parts.year,+parts.month,+parts.day,+parts.hour,+parts.minute,+parts.second);
 }
 function build(eight,gender,now=new Date()){
  const today=currentSolar(now),stamp=today.toYmd(),birth=eight.getLunar().getSolar();
  const result={asOf:stamp,dayun:[],annual:[],dayunLabel:'请选择性别以计算大运',annualLabel:'',start:null,end:null};
  if(today.isBefore(birth)){result.dayunLabel='出生时间尚未到达';result.annualLabel='出生前暂不显示当前流年';return result}
  const reference=['Year','Month','Day','Time'].flatMap(p=>[...eight['get'+p]()]);
  const make=(pair,kind,label,witch)=>{
   const day=eight.getDayGan(),prefix=kind+'-'+pair;
   const entries=[{id:prefix+'-stem',name:LunarUtil.SHI_SHEN[day+pair[0]],family:'god',kind,pillar:label,gan:pair[0],origin:label+' '+pair+' · 天干 '+pair[0]+' 相对日干 '+day}];
   LunarUtil.ZHI_HIDE_GAN[pair[1]].forEach((gan,i)=>entries.push({id:prefix+'-hidden-'+i,name:LunarUtil.SHI_SHEN[day+gan],family:'god',kind,pillar:label,gan,origin:label+' '+pair+' · 地支 '+pair[1]+' 藏干 '+gan+' 相对日干 '+day}));
   [...new Set(queryShenSha(pair,reference,gender==='male',witch,eight.getYearNaYin()))].forEach(short=>{
    // Both predicates describe the natal chart as a whole, not the arriving pillar.
    if(short==='天赦'||short==='德秀'||(short==='元辰'&&!gender))return;
    const rule=SHENSHA_RULES[short];if(!rule)return;
    entries.push({id:prefix+'-omen-'+short,name:rule.name,family:'omen',kind,pillar:label,rawName:short,basis:rule.basis,origin:label+' '+pair+' · 以原命盘为参照 · '+rule.basis});
   });return entries;
  };
  const yearPair=today.getLunar().getYearInGanZhiExact();
  result.annualLabel='流年 '+yearPair+' · '+today.getYear()+'（立春换年）';
  result.annual=make(yearPair,'annual','流年 '+yearPair,6);
  if(gender!=='male'&&gender!=='female')return result;
  const yun=eight.getYun(gender==='male'?1:0,1),start=yun.getStartSolar();
  if(today.isBefore(start)){result.dayunLabel='尚未起运 · '+start.toYmd()+' 起运';return result}
  // Exact anniversary boundaries, rather than switching periods on January 1.
  let index=1;while(index<40&&!today.isBefore(start.nextYear(index*10)))index++;
  const daYun=yun.getDaYun(index+1)[index],from=start.nextYear((index-1)*10),until=start.nextYear(index*10),pair=daYun.getGanZhi();
  result.start=from.toYmd();result.end=until.toYmd();
  result.dayunLabel='大运 '+pair+' · '+result.start+' 至 '+result.end+'（不含结束日）';
  result.dayun=make(pair,'dayun','大运 '+pair,5);return result;
 }
 root.YuanjingPeriods=Object.freeze({build,currentSolar});
})(globalThis);

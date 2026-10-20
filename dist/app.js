const $=id=>document.getElementById(id),gods=['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印'],texts=['同气相应，象征自我与同伴。以双生晶石显化独立与协作。','并肩争流，象征行动与竞争。以双刃映照勇气与边界。','表达与创造之象。花朵舒展，寓意从内在流向外界的才思。','突破与革新之象。流星划破旧有轨迹，象征独特表达。','流动与机遇之象。游走的晶石映照资源与变化。','积累与经营之象。六角灵晶寓意秩序与持久投入。','决断与挑战之象。锋芒星轮映照面对压力时的行动力。','规则与责任之象。灵塔守护边界与承诺。','洞察与领悟之象。月轮映照独特的学习与思考方式。','滋养与庇护之象。以一枚灵玉，承载学习、记忆与内在的安定。'];let eight,active=[],omens=[],stemEntries=[],hiddenEntries=[],omenEntries=[],selectedKey=null,mode='all',birthMs,simDays=0,playing=false,rotation=0,zoom=1,selected='正印';let focusTarget=null,focusOrigin=null,lastInput='pointer';
function selectSymbol(name,entry,preview=false){selected=name;selectedKey=entry?.id||null;const idx=gods.indexOf(name);$('detailname').textContent=name;$('detailicon').style.color='';$('detailicon').innerHTML=idx<0?getOmenIcon(name):YuanjingIcons.svg(name,'god');$('detailicon').dataset.family=idx<0?'omen':'god';$('detailtype').textContent=idx<0?'神煞 · 灵境':'十神 · 星符';$('detailtext').textContent=idx<0?(globalThis.YuanjingElementInfo?.omens[name]||'传统文化的艺术符号。'):texts[idx];$('detailmeta').textContent=idx<0?'命盘中出现 '+omens.filter(n=>n===name).length+' 次 · 常用规则集':active.includes(name)?'命盘中出现 '+active.filter(n=>n===name).length+' 次 · 天干或地支藏干关系':'此命盘未出现 · 十神符号图鉴';if(entry)$('detailmeta').textContent=entry.origin+' · '+(entry.kind==='stem'?'第一圈 · 透干':entry.kind==='hidden'?'第二圈 · 藏干':'第三圈 · 神煞');if(preview){document.querySelectorAll('.symbol').forEach(b=>b.classList.toggle('selected',b.dataset.symbolId===selectedKey))}else renderSymbols()}
function syncVisualFocus(){
 const host=document.querySelector('.world');host.classList.toggle('is-focusing',Boolean(focusTarget));
 document.querySelectorAll('.symbol').forEach(b=>b.classList.toggle('is-focused',focusTarget?.kind==='symbol'&&b.dataset.symbolId===focusTarget.key));
 host.style.cursor=focusTarget?.kind==='planet'?'pointer':'';
}
function focusElement(kind,key,origin='pointer'){
 if(focusTarget?.kind===kind&&focusTarget.key===key&&focusOrigin===origin)return;
 focusTarget={kind,key};focusOrigin=origin;syncVisualFocus();
 if(origin==='tap'&&window.matchMedia('(max-width:1100px)').matches)showCompactDetails();
}
function showCompactDetails(){
 let dialog=$('compact-details');
 if(!dialog){
  dialog=document.createElement('dialog');dialog.id='compact-details';
  dialog.setAttribute('aria-label','星境元素详情');
  const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','关闭详情');close.onclick=()=>dialog.close();
  dialog.append(close,document.createElement('div'));document.body.append(dialog);
  dialog.addEventListener('close',clearElementFocus);
 }
 const detail=document.querySelector('.detail').cloneNode(true);
 detail.removeAttribute('id');detail.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
 dialog.lastElementChild.replaceChildren(detail);
 if(!dialog.open)dialog.showModal();
}
function clearElementFocus(){focusTarget=null;focusOrigin=null;syncVisualFocus()}
function bindSymbolFocus(button,entry){
 button.dataset.symbolId=entry.id;
 const inspect=origin=>{selectSymbol(entry.name,entry,true);focusElement('symbol',entry.id,origin)};
 button.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&!event.buttons)inspect('pointer')});
 button.addEventListener('pointerleave',()=>{if(focusTarget?.key===entry.id&&focusOrigin==='pointer')clearElementFocus()});
 button.addEventListener('focus',()=>{if(lastInput==='keyboard')inspect('keyboard')});
 button.addEventListener('blur',()=>{if(focusTarget?.key===entry.id&&focusOrigin==='keyboard')clearElementFocus()});
 button.onclick=()=>inspect(lastInput==='touch'?'tap':lastInput==='keyboard'?'keyboard':'pointer');
}
document.addEventListener('pointerdown',event=>{lastInput=event.pointerType==='touch'?'touch':'pointer';if(!event.target.closest?.('.symbol'))clearElementFocus()},{capture:true});
document.addEventListener('keydown',event=>{lastInput='keyboard';if(event.key==='Escape')clearElementFocus()});

function renderSymbols(){
 clearElementFocus();
 const box=$('symbols');box.innerHTML='';const w=document.querySelector('.world').clientWidth;
 const rings=[{kind:'stem',entries:stemEntries,rx:Math.min(w*.235,133),ry:138,offset:-Math.PI/2},{kind:'hidden',entries:hiddenEntries,rx:Math.min(w*.34,199),ry:198,offset:-Math.PI/2+.16},{kind:'omen',entries:omenEntries,rx:Math.min(w*.455,272),ry:258,offset:-Math.PI/2-.14}];
 rings.forEach(ring=>{
  const visible=ring.kind==='omen'?mode!=='gods':mode!=='omens';if(!visible)return;
  const orbit=document.createElement('div');orbit.className='symbol-orbit orbit-'+ring.kind;
  orbit.style.cssText=`left:${w/2-ring.rx}px;top:${285-ring.ry}px;width:${ring.rx*2}px;height:${ring.ry*2}px`;
  box.append(orbit);
  ring.entries.forEach((e,i)=>{
   const a=i/ring.entries.length*Math.PI*2+ring.offset,x=w/2+Math.cos(a)*ring.rx,y=285+Math.sin(a)*ring.ry;
   const b=document.createElement('button');b.className='symbol '+(ring.kind==='omen'?'omen ':'god ')+ring.kind+(selectedKey===e.id?' selected':'');
   b.style.cssText=`left:${x}px;top:${y}px;animation-delay:${-i*.65}s`;
   b.innerHTML=`<i>${ring.kind==='omen'?getOmenIcon(e.name):YuanjingIcons.svg(e.name,'god')}</i><span>${e.name}</span><small>${e.pillar} · ${ring.kind==='stem'?'透干':ring.kind==='hidden'?e.gan+'藏干':'神煞'}</small>`;
   b.setAttribute('aria-label',e.name+'，'+e.origin);bindSymbolFocus(b,e);box.append(b);
  });
 });
 if(mode==='omens'&&!omenEntries.length){const note=document.createElement('div');note.className='omen-empty';note.textContent='此命盘未命中当前规则集的神煞';box.append(note)}
}

function update(){const d=$('date').value,t=$('time').value;if(!d||!t)return;const [Y,M,D]=d.split('-').map(Number),[h,m]=t.split(':').map(Number);if(Y<1800||Y>2050){alert('请输入 1800–2050 年的生日。');return}eight=Solar.fromYmdHms(Y,M,D,h,m,0).getLunar().getEightChar();birthMs=Date.UTC(Y,M-1,D,h-Number($('zone').value),m);simDays=0;playing=false;syncPlayButton();const ps=['Year','Month','Day','Time'];active=[];stemEntries=[];hiddenEntries=[];const pillars=ps.map((p,i)=>{const pair=eight['get'+p]();const god=i===2?'日主':eight['get'+p+'ShiShenGan']();const pillar=['年柱','月柱','日柱','时柱'][i];if(i!==2){active.push(god);stemEntries.push({id:'stem-'+i,name:god,kind:'stem',pillar,gan:pair[0],origin:pillar+'天干 '+pair[0]})}const hiddenGods=eight['get'+p+'ShiShenZhi'](),hiddenGans=eight['get'+p+'HideGan']();hiddenGods.forEach((name,j)=>{active.push(name);hiddenEntries.push({id:'hidden-'+i+'-'+j,name,kind:'hidden',pillar,gan:hiddenGans[j],origin:pillar+'地支 '+pair[1]+' · 藏干 '+hiddenGans[j]})});return `<div><small>${['年柱','月柱','日柱','时柱'][i]}</small><b>${pair[0]}<br>${pair[1]}</b><em>${god}</em></div>`});$('pillars').innerHTML=pillars.join('');const counts={木:0,火:0,土:0,金:0,水:0};ps.forEach(p=>[...eight['get'+p+'WuXing']()].forEach(e=>counts[e]++));$('elements').innerHTML=Object.entries(counts).map(([e,n],i)=>`<div><span>${e}</span><i><b style="width:${n/8*100}%;background:${['#85b68f','#ce9274','#c3ae7a','#b8c6c4','#6e9dad'][i]}"></b></i><small>${n}/8</small></div>`).join('');const branches=ps.map(p=>eight['get'+p+'Zhi']()),gan=eight.getDayGan(),zi='子丑寅卯辰巳午未申酉戌亥';omenEntries=computeOmenEntries(eight,$('gender').value);omens=omenEntries.map(e=>e.name);$('omens-summary').textContent='神煞完整清单 · '+omenEntries.length+' 项';
 $('moment').textContent=d.replaceAll('-','.')+' · '+zi[Math.floor((h+1)/2)%12]+'时';const first=stemEntries[0]||hiddenEntries[0];selectSymbol(first.name,first);$('snapshot').textContent='静止于出生时刻';window.dispatchEvent(new CustomEvent('yuanjing:chart-updated',{detail:getReadingChart()}));}

// A snapshot of the chart just generated; unsaved form edits are rejected by the reading UI.
function getReadingChart(){return {
 inputKey:JSON.stringify(['date','time','zone','gender'].map(id=>$(id).value)),
 date:$('date').value,time:$('time').value,zone:$('zone').value,gender:$('gender').value,
 dayMaster:eight.getDayGan(),pillars:['Year','Month','Day','Time'].map((p,i)=>({label:['年柱','月柱','日柱','时柱'][i],value:eight['get'+p]()})),
 stemCount:stemEntries.length,hiddenCount:hiddenEntries.length,omenCount:omenEntries.length,
 entries:[...stemEntries,...hiddenEntries,...omenEntries].map(entry=>({...entry}))
};}
$('birthform').onsubmit=e=>{e.preventDefault();update()};document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{mode=b.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));renderSymbols()});['about'].forEach(id=>$(id).onclick=()=>$('guide').showModal());$('close').onclick=()=>$('guide').close();$('play').onclick=()=>{playing=!playing;syncPlayButton()};$('reset').onclick=()=>{rotation=0;zoom=1;simDays=0;playing=false;syncPlayButton();$('snapshot').textContent='静止于出生时刻'};$('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen?.()};$('save').onclick=()=>{const data={生日:$('date').value,时间:$('time').value,UTC偏移:$('zone').value,四柱:['Year','Month','Day','Time'].map(p=>eight['get'+p]()),十神:active.slice(),神煞:omens,透干十神:stemEntries,藏干十神:hiddenEntries,神煞来源:omenEntries,传统排盘性别:$('gender').value,规则集:'chxb/shensha 51种常用规则（并非问真官方算法）',说明:'传统文化艺术可视化。未指定传统排盘性别时不计算元辰。' };const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='元境-'+$('date').value+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
// NASA/JPL Table 1: a, e, I, L, longitude of perihelion, longitude of ascending node; base and century rate.
const planets=[['水星','#c7bc99',[.38709927,.20563593,7.00497902,252.25032350,77.45779628,48.33076593],[.00000037,.00001906,-.00594749,149472.67411175,.16047689,-.12534081]],['金星','#dbc086',[.72333566,.00677672,3.39467605,181.97909950,131.60246718,76.67984255],[.0000039,-.00004107,-.00078890,58517.81538729,.00268329,-.27769418]],['地球','#79b9bd',[1.00000261,.01671123,-.00001531,100.46457166,102.93768193,0],[.00000562,-.00004392,-.01294668,35999.37244981,.32327364,0]],['火星','#ce9477',[1.52371034,.09339410,1.84969142,-4.55343205,-23.94362959,49.55953891],[.00001847,.00007882,-.00813131,19140.30268499,.44441088,-.29257343]],['木星','#c9b095',[5.202887,.04838624,1.30439695,34.39644051,14.72847983,100.47390909],[-.00011607,-.00013253,-.00183714,3034.74612775,.21252668,.20469106]],['土星','#b8a77c',[9.53667594,.05386179,2.48599187,49.95424423,92.59887831,113.66242448],[-.00125060,-.00050991,.00193609,1222.49362201,-.41897216,-.28867794]],['天王星','#8baeb3',[19.18916464,.04725744,.77263783,313.23810451,170.95427630,74.01692503],[-.00196176,-.00004397,-.00242939,428.48202785,.40805281,.04240589]],['海王星','#718fba',[30.06992276,.00859048,1.77004347,-55.12002969,44.96476227,131.78422574],[.00026291,.00005105,.00035372,218.45945325,-.32241464,-.00508664]]];
function position(p,ms){const T=(ms/86400000+2440587.5-2451545)/36525,v=p[2].map((x,i)=>x+p[3][i]*T),[a,e,I,L,peri,node]=v,r=Math.PI/180,M=((L-peri)%360)*r;let E=M;for(let k=0;k<8;k++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));const x=a*(Math.cos(E)-e),y=a*Math.sqrt(1-e*e)*Math.sin(E),w=(peri-node)*r,O=node*r,inc=I*r;return [(Math.cos(w)*Math.cos(O)-Math.sin(w)*Math.sin(O)*Math.cos(inc))*x+(-Math.sin(w)*Math.cos(O)-Math.cos(w)*Math.sin(O)*Math.cos(inc))*y,(Math.cos(w)*Math.sin(O)+Math.sin(w)*Math.cos(O)*Math.cos(inc))*x+(-Math.sin(w)*Math.sin(O)+Math.cos(w)*Math.cos(O)*Math.cos(inc))*y,Math.sin(w)*Math.sin(inc)*x+Math.cos(w)*Math.sin(inc)*y]}
const canvas=$('space'),ctx=canvas.getContext('2d'),world=document.querySelector('.world'),stars=Array.from({length:210},()=>[Math.random(),Math.random(),Math.random()]);let W,H,last=0,pointer=null,planetHits=[];function resize(){W=document.documentElement.clientWidth;H=Math.max(document.body.scrollHeight,innerHeight);canvas.style.height=H+'px';canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);renderSymbols()}window.addEventListener('resize',resize);world.onpointerdown=e=>{if(e.target.closest('button'))return;pointer=e.clientX;world.setPointerCapture(e.pointerId)};world.onpointermove=e=>{if(pointer!==null){rotation+=(e.clientX-pointer)*.008;pointer=e.clientX}};world.onpointerup=e=>{pointer=null;if(e.target.closest('button'))return;const hit=findPlanetAt(e.clientX,e.clientY);if(hit){showPlanetDetails(hit);focusElement('planet',hit.name,lastInput==='touch'?'tap':'pointer')}};world.onwheel=e=>{e.preventDefault();zoom=Math.max(.65,Math.min(1.45,zoom-e.deltaY*.001))};

function findPlanetAt(clientX,clientY){
 const y=clientY+scrollY;
 return planetHits.filter(p=>Math.hypot(clientX-p.x,y-p.y)<(p.name==='太阳'?18:16)||(p.label&&clientX>=p.label.left&&clientX<=p.label.right&&y>=p.label.top&&y<=p.label.bottom))
  .sort((a,b)=>Math.hypot(clientX-a.x,y-a.y)-Math.hypot(clientX-b.x,y-b.y))[0]||null;
}
function showPlanetDetails(hit){
 const time=hit.days===0?'出生时刻':'出生后 '+hit.days.toFixed(1)+' 天';
 $('detailname').textContent=hit.name;$('detailicon').innerHTML=YuanjingIcons.svg(hit.name==='太阳'?'天赦':hit.name,hit.name==='太阳'?'omen':'planet');
 $('detailicon').dataset.family='planet';$('detailicon').style.color=hit.color;
 $('detailtype').textContent='诞生星辰 · '+(hit.name==='太阳'?'恒星':'行星');
 const facts=globalThis.YuanjingElementInfo?.planets[hit.name]||'';
 const placement=hit.name==='太阳'?'本图采用日心坐标，太阳作为位置参考中心。':time+'，日心黄经约 '+hit.longitude.toFixed(1)+'°，距离太阳约 '+hit.distance.toFixed(3)+' AU。';
 $('detailtext').textContent=facts+' '+placement;
 $('detailmeta').textContent=time+' · '+new Date(hit.ms).toISOString().slice(0,16).replace('T',' ')+' UTC。NASA/JPL 近似轨道模型；显示距离与星体大小不按比例。';
 const link=document.createElement('a');link.href='https://science.nasa.gov/solar-system/planets/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='天体介绍 · NASA ↗';$('detailmeta').append(document.createElement('br'),link);
}
world.addEventListener('pointermove',event=>{
 if(event.pointerType==='touch'||event.buttons||world.classList.contains('dragging'))return;
 if(event.target.closest('.symbol'))return;
 const hit=findPlanetAt(event.clientX,event.clientY);
 if(hit){if(focusTarget?.kind!=='planet'||focusTarget.key!==hit.name||focusOrigin!=='pointer'){focusElement('planet',hit.name,'pointer');showPlanetDetails(hit)}}
 else if(focusTarget?.kind==='planet'&&focusOrigin==='pointer')clearElementFocus();
});
world.addEventListener('pointerleave',()=>{if(focusOrigin==='pointer')clearElementFocus()});
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
function draw(t){
 const dt=Math.min((t-last)/1000,.05);last=t;
 if(playing&&focusTarget?.kind!=='planet'){
  simDays+=dt*15;
  if(new Date(birthMs+simDays*86400000).getUTCFullYear()>2050){playing=false;simDays=0;syncPlayButton()}
  $('snapshot').textContent='出生后 '+Math.floor(simDays)+' 天';
 }
 ctx.clearRect(0,0,W,H);
 const rect=world.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+scrollY+world.clientHeight-118;
 const aura=ctx.createRadialGradient(cx,cy-210,0,cx,cy-210,480);aura.addColorStop(0,'#55784d16');aura.addColorStop(.45,'#3857440c');aura.addColorStop(1,'#0000');ctx.fillStyle=aura;ctx.fillRect(0,0,W,H);
 for(const [x,y,s] of stars){ctx.fillStyle=`rgba(189,207,167,${.12+s*.45})`;ctx.beginPath();ctx.arc(x*W,y*H,.3+s*.8,0,7);ctx.fill()}
 const scale=Math.min(rect.width*.43,290)*zoom,tilt=.29,ms=birthMs+simDays*86400000;
 const pulse=reducedMotion?.matches?1:(1+Math.sin(t/1000*Math.PI*2/1.8)*.12);
 planetHits=[];
 planets.forEach((p,i)=>{
  const focused=focusTarget?.kind==='planet'&&focusTarget.key===p[0],dim=Boolean(focusTarget)&&!focused;
  ctx.save();ctx.globalAlpha=dim ? .2 : 1;
  const rad=scale*(.17+i*.115);ctx.strokeStyle=i===2?'#729e7e30':'#8f9e6e19';ctx.beginPath();ctx.ellipse(cx,cy,rad,rad*tilt,0,0,7);ctx.stroke();
  const pos=position(p,ms),a=Math.atan2(pos[1],pos[0])+rotation,x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad*tilt;
  ctx.shadowColor=p[1];ctx.shadowBlur=focused?30*pulse:13;ctx.fillStyle=p[1];ctx.beginPath();ctx.arc(x,y,(i===4?5:i===5?4:3)*(focused?1.4*pulse:1),0,7);ctx.fill();ctx.shadowBlur=0;
  if(i===5){ctx.strokeStyle=p[1]+'80';ctx.beginPath();ctx.ellipse(x,y,9,2.8,-.3,0,7);ctx.stroke()}
  if(focused){ctx.strokeStyle=p[1];ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,10*pulse,0,7);ctx.stroke()}
  ctx.fillStyle=focused?'#f0e7cd':'#9aaa91';ctx.font=(focused?'10px':'9px')+' sans-serif';ctx.fillText(p[0],x+8,y+3);
  const labelWidth=ctx.measureText(p[0]).width;
  planetHits.push({x,y,name:p[0],color:p[1],longitude:(Math.atan2(pos[1],pos[0])*180/Math.PI+360)%360,distance:Math.hypot(...pos),days:simDays,ms,label:{left:x+8,right:x+8+labelWidth,top:y-9,bottom:y+8}});
  ctx.restore();
 });
 const sunFocused=focusTarget?.kind==='planet'&&focusTarget.key==='太阳';
 ctx.save();ctx.globalAlpha=focusTarget&&!sunFocused ? .2 : 1;ctx.shadowColor='#e8b455';ctx.shadowBlur=sunFocused?48*pulse:30;ctx.fillStyle='#f4d38b';ctx.beginPath();ctx.arc(cx,cy,sunFocused?10*pulse:8,0,7);ctx.fill();ctx.shadowBlur=0;
 if(sunFocused){ctx.strokeStyle='#f4d38b';ctx.beginPath();ctx.arc(cx,cy,16*pulse,0,7);ctx.stroke()}
 ctx.strokeStyle='#c9ad6830';ctx.beginPath();ctx.ellipse(cx,cy-8,scale*.6,scale*.11,0,0,7);ctx.stroke();ctx.restore();
 planetHits.push({x:cx,y:cy,name:'太阳',color:'#f4d38b',days:simDays,ms,distance:0,longitude:null});
 requestAnimationFrame(draw);
}

update();resize();requestAnimationFrame(draw);

$('omens-summary').onclick=()=>{
 $('omens-list').innerHTML='';
 ['年柱','月柱','日柱','时柱'].forEach(pillar=>{
  const section=document.createElement('section'),title=document.createElement('h3');title.textContent=pillar;section.append(title);
  const entries=omenEntries.filter(e=>e.pillar===pillar);
  if(!entries.length){const note=document.createElement('p');note.textContent='未命中当前规则集';section.append(note)}
  entries.forEach(e=>{const b=document.createElement('button');b.className='omen-list-item';const glyph=document.createElement('i');glyph.className='omen-list-icon';glyph.innerHTML=getOmenIcon(e.name);b.append(glyph,document.createTextNode(e.name));const small=document.createElement('small');small.textContent=e.basis;b.append(small);b.onclick=()=>{$('omens-dialog').close();selectSymbol(e.name,e)};section.append(b)});
  $('omens-list').append(section);
 });$('omens-dialog').showModal();
};$('omens-close').onclick=()=>$('omens-dialog').close();

$('back-to-top').onclick=()=>{clearElementFocus();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};

function syncPlayButton(){
 const button=$('play');
 button.setAttribute('aria-pressed',String(playing));
 button.setAttribute('aria-label',playing?'暂停行星轨迹':'播放行星轨迹');
 button.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">'+(playing?'<path d="M8 5v14M16 5v14"/>':'<path d="M8 5l11 7-11 7Z"/>')+'</svg>'+(playing?'暂停':'播放');
}

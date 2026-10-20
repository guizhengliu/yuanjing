/* Font-independent artwork. Never render astrology glyphs through the OS emoji font. */
(function (root) {
  'use strict';
  const path = d => '<path d="' + d + '"/>';
  const circle = (cx, cy, r) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
  const line = (x1, y1, x2, y2) => path('M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2);
  const diamond = (cx, cy, r) => path('M' + cx + ' ' + (cy-r) + 'L' + (cx+r) + ' ' + cy + 'L' + cx + ' ' + (cy+r) + 'L' + (cx-r) + ' ' + cy + 'Z');
  function radial(count, inner, outer, rotation = -Math.PI / 2) {
    return Array.from({ length: count }, (_, i) => {
      const a = rotation + i * Math.PI * 2 / count;
      return line(+(16 + Math.cos(a)*inner).toFixed(3), +(16 + Math.sin(a)*inner).toFixed(3), +(16 + Math.cos(a)*outer).toFixed(3), +(16 + Math.sin(a)*outer).toFixed(3));
    }).join('');
  }
  function star(points, outer, inner) {
    const coords = Array.from({ length: points * 2 }, (_, i) => {
      const a = -Math.PI/2 + i*Math.PI/points, r = i%2 ? inner : outer;
      return (i ? 'L' : 'M') + (16+Math.cos(a)*r).toFixed(3) + ' ' + (16+Math.sin(a)*r).toFixed(3);
    }).join('');
    return path(coords + 'Z');
  }
  const flower = petals => radial(petals, 5, 10) + circle(16,16,3) + Array.from({length:petals},(_,i)=>{
    const a=-Math.PI/2+i*Math.PI*2/petals;
    return circle(+(16+Math.cos(a)*8).toFixed(3),+(16+Math.sin(a)*8).toFixed(3),3.2);
  }).join('');
  const gods = {
    '比肩': diamond(12,16,8) + diamond(20,16,8),
    '劫财': path('M7 5L23 21M25 5L9 21M6 18L14 26M18 26L26 18M7 5L8 12L13 8M25 5L24 12L19 8M9 24L6 27M23 24L26 27'),
    '食神': flower(6),
    '伤官': star(4,12,3.5) + path('M5 27L10 22M3 21L7 17'),
    '偏财': diamond(16,16,6) + path('M4 13A13 10 0 0 1 27 10M23 5L28 10L22 12M28 19A13 10 0 0 1 5 22M9 27L4 22L10 20'),
    '正财': path('M16 4L26.4 10V22L16 28L5.6 22V10ZM16 4V16L5.6 22M16 16L26.4 22M5.6 10L16 16L26.4 10') + circle(16,16,3),
    '七杀': path('M16 3L27 8V16Q26 24 16 29Q6 24 5 16V8ZM16 7V23M11 13L16 8L21 13M12 21H20'),
    '正官': path('M16 3V7M9 8H23L21 13H11ZM7 15H25L22 19H10ZM11 19V25M21 19V25M6 27H26M14 21H18V27M9 8L16 5L23 8'),
    '偏印': path('M23 5A12 12 0 1 0 25 24A10 10 0 0 1 23 5Z') + star(4,3,1.2).replace('d="','transform="translate(6 -7)" d="'),
    '正印': path('M16 4Q26 6 25 16Q24 26 16 28Q8 26 7 16Q6 6 16 4Z') + circle(16,12,3) + path('M11 20Q16 25 21 20M3 13Q1 25 12 29M29 13Q31 25 20 29')
  };
  const omens = {
    '天乙贵人': path('M12 6Q16 1 20 6M9 9H23L21 23H11ZM7 9H25M11 26H21M16 23V26M16 12Q11 17 16 20Q21 17 16 12Z'),
    '太极贵人': circle(16,16,11) + path('M16 5C7 5 7 16 16 16S25 27 16 27') + circle(16,10.5,1.4) + circle(16,21.5,1.4),
    '天德贵人': star(4,11,4) + path('M7 23L11 27L26 10'),
    '月德贵人': path('M22 5A11 11 0 1 0 25 23A10 10 0 0 1 22 5ZM6 23L11 27L26 12'),
    '德秀贵人': flower(5) + diamond(16,16,1.5),
    '天德合': diamond(12,16,8) + diamond(21,16,8) + line(4,16,29,16),
    '月德合': circle(12,16,8) + circle(21,16,8) + path('M17 9A8 8 0 0 0 17 23'),
    '福星贵人': star(5,10,4.5) + path('M4 7V4H7M25 4H28V7M28 25V28H25M7 28H4V25'),
    '文昌贵人': path('M5 6Q10 4 16 8Q22 4 27 6V25Q22 23 16 27Q10 23 5 25ZM16 8V27M8 11L12 12M8 16L12 17M20 12L24 11M20 17L24 16'),
    '学堂': path('M3 12L16 5L29 12L16 19ZM8 15V23Q16 29 24 23V15M28 13V23'),
    '词馆': path('M7 5H25V27H7ZM11 10H21M11 15H21M11 20H18M4 8V24M28 8V24'),
    '魁罡贵人': diamond(16,16,12) + path('M9 10H23L20 15H12ZM12 15L10 23L16 20L22 23L20 15'),
    '国印贵人': path('M6 5H26V27H6ZM10 9H22V23H10ZM13 12H19V20H13M10 16H22'),
    '驿马': path('M4 22L10 18L11 12L20 5L19 11L26 13L28 18L23 20L18 16L16 24L25 27M5 10H10M3 15H7'),
    '华盖': path('M3 16Q16 0 29 16ZM16 5V25Q16 29 12 27M8 16V20M24 16V20M5 16V18M27 16V18'),
    '将星': path('M8 28V5M8 6H26L22 12L26 18H8M5 28H12') + star(4,3,1.5).replace('d="','transform="translate(1 -4)" d="'),
    '金舆': path('M5 10H24L27 22H5ZM9 10V5H20V10M11 10V21M20 10V21M3 22H29') + circle(9,25,2.5) + circle(24,25,2.5),
    '金神': star(7,12,6) + diamond(16,16,3),
    '五鬼': circle(16,16,10) + circle(11,13,1.4) + circle(21,13,1.4) + path('M10 22L13 19L16 22L19 19L22 22M16 4V7'),
    '天医': path('M12 5H20V12H27V20H20V27H12V20H5V12H12Z'),
    '禄神': circle(16,16,9) + diamond(16,16,4) + radial(4,12,14),
    '天赦': circle(16,16,6) + radial(8,9,13),
    '红鸾': path('M16 23Q3 25 4 8Q11 7 16 17Q21 7 28 8Q29 25 16 23ZM8 12L15 21M24 12L17 21M13 27L16 23L19 27'),
    '天喜': circle(10,14,6) + circle(22,14,6) + path('M8 23Q16 30 24 23M16 5V8M7 5L9 8M25 5L23 8'),
    '流霞': path('M3 9C9 2 12 16 18 9S26 4 29 8M3 17C9 10 12 24 18 17S26 12 29 16M3 25C9 18 12 32 18 25S26 20 29 24'),
    '红艳煞': flower(4) + radial(4,11,14,Math.PI/4),
    '天罗': path('M4 24Q16 0 28 24M7 19H25M11 12H21M16 7V25M9 16L13 25M23 16L19 25'),
    '地网': path('M4 8Q16 32 28 8M7 13H25M11 20H21M16 7V25M9 16L13 7M23 16L19 7'),
    '羊刃': path('M11 27L23 7L25 3L19 6L7 23ZM9 20L16 24M7 26L5 29M18 9L22 12'),
    '飞刃': path('M5 24L24 5L27 5L27 8L8 27ZM9 18L14 23M4 10H12M3 15H8M16 4V8'),
    '血刃': path('M8 23L25 6L26 3L22 4L5 21ZM7 18L13 24M22 17C22 17 17 23 17 25A5 5 0 0 0 27 25C27 23 22 17 22 17Z'),
    '八专': path('M10 4H22L28 10V22L22 28H10L4 22V10ZM10 10H22V22H10ZM4 16H10M22 16H28M16 4V10M16 22V28'),
    '九丑': path('M7 5H25V27H7ZM7 12H25M7 20H25M13 5V27M20 5V27M4 16H7M25 16H28'),
    '劫煞': path('M16 3L29 27H3ZM16 11L20 19H12Z') + line(16,22,16,24),
    '灾煞': diamond(16,16,12) + path('M18 7L11 17H17L14 25L22 14H16Z'),
    '元辰': circle(16,16,11) + path('M9 9L23 23M23 9L9 23') + circle(16,16,3),
    '空亡': path('M21 5A12 12 0 1 0 28 17M26 10L28 13M16 8A8 8 0 0 0 8 16M11 23A8 8 0 0 0 23 20'),
    '童子煞': circle(16,8,4) + path('M10 27L12 15H20L22 27ZM7 18L12 15M20 15L25 18M16 16V24'),
    '天厨贵人': path('M4 21H28M6 21Q6 8 16 8Q26 8 26 21M4 26H28M16 5V8M12 5H20'),
    '孤辰': path('M17 5A11 11 0 1 0 17 27A14 14 0 0 1 17 5Z') + circle(25,8,2),
    '寡宿': path('M15 5A11 11 0 1 1 15 27A14 14 0 0 0 15 5Z') + circle(7,24,2),
    '亡神': circle(10,16,7) + circle(22,16,7) + line(16,4,16,28),
    '十恶大败': path('M7 7L25 25M25 7L7 25M7 4H4V7M25 4H28V7M28 25V28H25M7 28H4V25'),
    '桃花': flower(5),
    '孤鸾煞': path('M5 21Q9 5 18 7L26 13L20 16L17 25L11 20L6 27M11 16L17 12M18 7L19 4') + circle(21,11,1),
    '阴差阳错': path('M4 11H25L20 6M28 21H7L12 26M14 5L18 27'),
    '四废': path('M5 5H27V27H5ZM16 5V27M5 16H27M9 9L12 12M20 9L23 12M9 20L12 23M20 20L23 23'),
    '丧门': path('M7 27V5H25V27M12 27V10H20V27M4 27H28M12 18H20'),
    '吊客': path('M6 5H26M16 5V12') + circle(16,17,5) + path('M16 22V28M11 25H21'),
    '披麻': path('M6 5H26V27H6ZM10 5V27M15 5V27M20 5V27M25 5L6 24'),
    '十灵': star(10,12,8) + circle(16,16,4) + radial(4,0,2)
  };
  // Shape-to-meaning mapping is shared with the adjacent interpretation card.
  const motifs = {
    '比肩':'并立双晶 · 自我与同伴','劫财':'交错双刃 · 竞争与行动','食神':'舒展花瓣 · 创造与滋养','伤官':'破空流星 · 表达与突破',
    '偏财':'流转灵晶 · 流动资源与机遇','正财':'稳固六面晶 · 积累与经营','七杀':'锋刃与盾 · 决断、挑战与边界','正官':'层叠灵塔 · 规则与责任','偏印':'月弧与微星 · 洞察与独特思考','正印':'双手护玉 · 学习、支持与安定',
    '天乙贵人':'引路灵灯 · 扶助与善缘','太极贵人':'阴阳相抱 · 思辨与探源','天德贵人':'星芒与善意印记 · 宽和','月德贵人':'月弧与印记 · 包容','德秀贵人':'花中灵印 · 涵养与才思',
    '天德合':'双印交叠 · 善意相接','月德合':'双环相扣 · 关系调和','福星贵人':'四角聚星 · 珍惜日常支持','文昌贵人':'展开书卷 · 学习与表达','学堂':'学冠 · 系统求学','词馆':'有序书页 · 文字与讲述',
    '魁罡贵人':'锐角晶印 · 坚定与棱角','国印贵人':'层叠方印 · 秩序与职责','驿马':'奔马与风痕 · 移动与探索','华盖':'灵伞 · 独处与内观','将星':'引领旗帜 · 组织与方向','金舆':'承载灵车 · 资源与安稳','金神':'凝练金轮 · 专注与锋芒',
    '五鬼':'幽微灵面 · 未知与不确定','天医':'修复十字 · 照料与休整','禄神':'环中灵玉 · 稳定积累','天赦':'舒展日轮 · 舒解与重新开始','红鸾':'相合双翼 · 亲近与相遇','天喜':'相映双环 · 共享喜悦','流霞':'层叠流云 · 感受与流动','红艳煞':'向外绽放的花 · 吸引与表达',
    '天罗':'上覆网纹 · 外部规则与约束','地网':'下收网纹 · 内在牵连与边界','羊刃':'立起刀锋 · 锐气与分寸','飞刃':'疾行刃光 · 速度与反应','血刃':'锋刃与水滴 · 力度与关照','八专':'同心方印 · 集中与专注','九丑':'交错格纹 · 多重期待','劫煞':'三角灵印 · 变化与应对','灾煞':'警醒电纹 · 警觉与准备','元辰':'错位交叉环 · 距离与沟通',
    '空亡':'断环留白 · 尚未成形的空间','童子煞':'小小灵形 · 纯粹与敏感','天厨贵人':'盛食器皿 · 滋养与生活感','孤辰':'孤月与远星 · 独立静处','寡宿':'反向月弧 · 保留与边界','亡神':'相切双环 · 游离与专注','十恶大败':'交错线条 · 失序后的重整','桃花':'五瓣灵花 · 亲和与美感','孤鸾煞':'独羽灵鸟 · 自主与亲近','阴差阳错':'交错方向线 · 时机与错位','四废':'封存方格 · 停顿与蓄势','丧门':'过渡之门 · 告别与开启','吊客':'垂悬之环 · 牵挂与回应','披麻':'交织织纹 · 负重与照顾','十灵':'多芒灵轮 · 感知与联想'
  };
  const fallback = circle(16,16,10) + diamond(16,16,4);
  function svg(name, family = 'god') {
    const catalogue = family === 'omen' ? omens : family === 'god' ? gods : {};
    const names = Object.keys(catalogue), index = names.indexOf(name);
    const key = index < 0 ? 'fallback' : family + '-' + index;
    return '<svg class="symbol-glyph" data-icon-key="' + key + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (index < 0 ? fallback : catalogue[name]) + '</svg>';
  }
  root.YuanjingIcons = Object.freeze({ svg, motifs: Object.freeze(motifs), gods: Object.freeze(Object.keys(gods)), omens: Object.freeze(Object.keys(omens)) });
})(globalThis);

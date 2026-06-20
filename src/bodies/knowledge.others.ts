/**
 * 其他天体知识库 — 水星/金星/泰坦/欧罗巴/冥王星/谷神星（精简真实，中立并陈）。
 */

import type { CelestialBody } from '@/types/body';
import type { BodyKnowledge } from '@/bodies/knowledge';

export const OTHER_BODY_KNOWLEDGE: Partial<Record<CelestialBody, BodyKnowledge>> = {
  mercury: {
    facts: [
      { label: '平均半径', value: '约 2,440 km（最小行星）' },
      { label: '与太阳距离', value: '平均约 0.39 AU（最近）' },
      { label: '一年/一日', value: '公转约 88 地球日；自转 3:2 共振' },
      { label: '表面温度', value: '约 −180 ℃ ~ 430 ℃（昼夜极端）' },
      { label: '大气', value: '极稀薄外逸层' },
      { label: '水冰', value: '两极永久阴影坑内疑有水冰' },
    ],
    geography: [
      { name: '卡洛里斯盆地', nameEn: 'Caloris Planitia', type: '撞击盆地', desc: '直径约 1550km，太阳系最大撞击盆地之一。' },
      { name: '悬崖（叶状陡坎）', nameEn: 'Lobate Scarps', type: '构造', desc: '行星冷却收缩形成的全球性断崖。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [{ title: '欧日合作 BepiColombo', desc: 'ESA 与 JAXA 联合探测，含两个轨道器。' }],
    photos: [{ title: 'NASA · MESSENGER 影像', url: 'https://www.nasa.gov/messenger' }],
    films: [],
    extension: [
      { title: '为何如此致密', desc: '水星金属核占比极大，成因（剧烈撞击剥离地幔？）仍有争议。' },
      { title: '两极水冰', desc: '雷达与 MESSENGER 数据指示永久阴影坑内存在水冰，离太阳最近处却有冰。' },
    ],
  },
  venus: {
    facts: [
      { label: '平均半径', value: '约 6,052 km（地球的 0.95 倍）' },
      { label: '表面温度', value: '约 465 ℃（最热行星，温室效应）' },
      { label: '表面气压', value: '约 92 倍地球（相当于深海 900m）' },
      { label: '大气', value: '96.5% 二氧化碳 + 硫酸云' },
      { label: '自转', value: '逆向自转，约 243 地球日（比其一年还长）' },
    ],
    geography: [
      { name: '麦克斯韦山脉', nameEn: 'Maxwell Montes', type: '山脉', desc: '金星最高峰，位于伊师塔地。' },
      { name: '阿佛洛狄忒地', nameEn: 'Aphrodite Terra', type: '高地', desc: '赤道附近约非洲大小的高地。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [],
    photos: [{ title: 'USSR · 金星 13 号地表彩照', meta: '1982' }],
    films: [],
    extension: [
      { title: '失控温室', desc: '浓密 CO₂ 大气造成失控温室效应，是研究气候演化的极端样本。' },
      { title: '云层生命假说', desc: '高空云层温压相对温和，曾有磷化氢争议，是否存在微生物仍未定论。' },
      { title: '新一轮探测', desc: 'NASA DAVINCI/VERITAS 与 ESA EnVision 计划重返金星。' },
    ],
  },
  titan: {
    facts: [
      { label: '归属', value: '土星最大卫星（太阳系第二大卫星）' },
      { label: '平均半径', value: '约 2,575 km（比水星还大）' },
      { label: '大气', value: '浓密氮气大气（比地球更厚）' },
      { label: '表面', value: '−179 ℃，液态甲烷/乙烷江河湖海' },
      { label: '探索', value: '惠更斯号 2005 年着陆（外太阳系唯一着陆）' },
    ],
    geography: [
      { name: '克拉肯海', nameEn: 'Kraken Mare', type: '液态烃海', desc: '泰坦最大的液态甲烷/乙烷海，位于北极区。' },
      { name: '上都', nameEn: 'Xanadu', type: '亮区', desc: '雷达明亮的大陆级复杂地形区。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [{ title: '卡西尼-惠更斯', desc: 'NASA 与 ESA/ASI 合作的土星系统旗舰任务。' }],
    photos: [{ title: 'ESA · 惠更斯地表影像', url: 'https://www.esa.int/huygens' }],
    films: [],
    extension: [
      { title: '甲烷循环', desc: '泰坦有类似地球水循环的「甲烷循环」：降雨、河流、湖海与蒸发。' },
      { title: '蜻蜓号 Dragonfly', desc: 'NASA 旋翼飞行器，计划 2034 抵达，跨地巡飞寻找前生命化学。' },
    ],
  },
  europa: {
    facts: [
      { label: '归属', value: '木星伽利略卫星之一（木卫二）' },
      { label: '平均半径', value: '约 1,561 km（略小于月球）' },
      { label: '表面', value: '光滑水冰壳，纵横「线纹」裂隙' },
      { label: '冰下海洋', value: '冰壳下疑有全球性液态咸水海洋' },
    ],
    geography: [
      { name: '科纳马拉混沌区', nameEn: 'Conamara Chaos', type: '混沌地形', desc: '冰壳破碎再冻结，暗示冰下活动。' },
      { name: '普威尔坑', nameEn: 'Pwyll', type: '撞击坑', desc: '年轻撞击坑，明亮辐射纹。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [{ title: 'NASA Clipper + ESA JUICE', desc: '两大机构并行勘测木星冰卫星宜居性。' }],
    photos: [{ title: 'NASA/JPL · 伽利略影像' }],
    films: [{ title: '欧罗巴报告 Europa Report', meta: '2013 · 科幻' }],
    extension: [
      { title: '冰下海洋宜居性', desc: '液态水 + 潮汐加热 + 化学能，是太阳系寻找地外生命的首选目标之一。' },
      { title: '水汽羽流', desc: '哈勃等观测到疑似喷发的水汽羽流，或可直接采样冰下海洋。' },
    ],
  },
  pluto: {
    facts: [
      { label: '分类', value: '矮行星（柯伊伯带最著名天体）' },
      { label: '平均半径', value: '约 1,188 km' },
      { label: '表面温度', value: '约 −230 ℃' },
      { label: '卫星', value: '5 颗，最大为冥卫一卡戎' },
      { label: '探索', value: '新视野号 2015 年飞掠' },
    ],
    geography: [
      { name: '汤博区（心形冰原）', nameEn: 'Tombaugh Regio', type: '冰原', desc: '含斯普特尼克平原的「心形」氮冰盆地。' },
      { name: '诺盖山', nameEn: 'Norgay Montes', type: '冰山', desc: '由水冰构成的高山。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [],
    photos: [{ title: 'NASA · 新视野号心形冰原', url: 'https://www.nasa.gov/newhorizons' }],
    films: [],
    extension: [
      { title: '行星定义之争', desc: '2006 年 IAU 重新定义行星，冥王星被划为矮行星，引发广泛讨论。' },
      { title: '氮冰对流', desc: '斯普特尼克平原的氮冰存在缓慢对流，地表年轻、地质活跃出人意料。' },
    ],
  },
  ceres: {
    facts: [
      { label: '分类', value: '矮行星（小行星带最大天体）' },
      { label: '平均半径', value: '约 470 km' },
      { label: '位置', value: '火星与木星之间的小行星带' },
      { label: '成分', value: '富含水冰与含水矿物' },
      { label: '探索', value: '黎明号 2015–2018 环绕' },
    ],
    geography: [
      { name: '奥卡托坑', nameEn: 'Occator', type: '撞击坑', desc: '坑内明亮碳酸钠盐沉积，曾有冰火山活动。' },
      { name: '阿胡纳山', nameEn: 'Ahuna Mons', type: '冰火山', desc: '孤立穹丘状冰火山，地质年轻。' },
    ],
    crewed: [],
    rivalry: [],
    cooperation: [],
    photos: [{ title: 'NASA · 黎明号亮斑影像', url: 'https://www.nasa.gov/dawn' }],
    films: [],
    extension: [
      { title: '地下卤水', desc: '亮斑来自地下盐水上涌蒸发，暗示曾有/仍有液态水活动。' },
      { title: '水世界候选', desc: '富含水冰，是研究含水小天体与生命前体化学的重要目标。' },
    ],
  },
};

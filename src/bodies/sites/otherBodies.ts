/**
 * 其他天体探索痕迹 — 水星/金星/泰坦/欧罗巴/冥王星/谷神星（真实任务档案）
 *
 * 经度东经正（-180..180）。飞掠/环绕类无单一地表点者取代表性「示意」坐标并在摘要标注。
 * 中立并陈各国/机构航天成果。
 */

import type { BodySite, BodyFeature } from '@/types/body';

export const OTHER_BODY_SITES: BodySite[] = [
  // ───────── 水星 Mercury ─────────
  { id: 'messenger', body: 'mercury', layer: 'mercury_orbiters', name: 'MESSENGER', nameEn: 'MESSENGER', agency: 'NASA', lng: -150, lat: 54, date: '2011-03-18', status: 'completed', summary: '首颗环绕水星探测器（2011–2015），全球测绘后受控撞击于此区域。', sourceUrl: 'https://www.nasa.gov/messenger' },
  { id: 'mariner10', body: 'mercury', layer: 'mercury_flyby', name: '水手 10 号', nameEn: 'Mariner 10', agency: 'NASA', lng: -170, lat: 30, date: '1974-03-29', status: 'completed', summary: '人类首次飞掠水星（三次飞掠 1974–75），首获水星近距影像（卡洛里斯盆地）。' },
  { id: 'bepicolombo', body: 'mercury', layer: 'mercury_flyby', name: 'BepiColombo', nameEn: 'BepiColombo', agency: 'ESA/JAXA', lng: 0, lat: 0, date: '2025-12-01', status: 'active', summary: '欧日合作，多次飞掠后计划 2026 年入轨水星（示意）。' },

  // ───────── 金星 Venus（金星号系列真实着陆坐标） ─────────
  { id: 'venera7', body: 'venus', layer: 'venus_landers', name: '金星 7 号', nameEn: 'Venera 7', agency: 'USSR', lng: -9, lat: -5, date: '1970-12-15', status: 'completed', summary: '人类首次从另一行星表面传回数据。' },
  { id: 'venera9', body: 'venus', layer: 'venus_landers', name: '金星 9 号', nameEn: 'Venera 9', agency: 'USSR', lng: -69, lat: 31.7, date: '1975-10-22', status: 'completed', summary: '首次传回金星表面照片。' },
  { id: 'venera13', body: 'venus', layer: 'venus_landers', name: '金星 13 号', nameEn: 'Venera 13', agency: 'USSR', lng: -57, lat: -7.5, date: '1982-03-01', status: 'completed', summary: '首批金星表面彩色照片，工作约 127 分钟。' },
  { id: 'venera14', body: 'venus', layer: 'venus_landers', name: '金星 14 号', nameEn: 'Venera 14', agency: 'USSR', lng: -50, lat: -13.25, date: '1982-03-05', status: 'completed', summary: '金星表面彩照与土壤分析。' },
  { id: 'vega1', body: 'venus', layer: 'venus_landers', name: '维加 1 号', nameEn: 'Vega 1', agency: 'USSR', lng: 177.8, lat: 7.2, date: '1985-06-11', status: 'completed', summary: '着陆器 + 大气气球，途经哈雷彗星。' },
  { id: 'magellan', body: 'venus', layer: 'venus_orbiters', name: '麦哲伦号', nameEn: 'Magellan', agency: 'NASA', lng: 0, lat: 0, date: '1990-08-10', status: 'completed', summary: '雷达测绘金星约 98% 表面（1990–1994，示意）。' },
  { id: 'pioneer-venus', body: 'venus', layer: 'venus_orbiters', name: '先驱者金星', nameEn: 'Pioneer Venus', agency: 'NASA', lng: 30, lat: 20, date: '1978-12-04', status: 'completed', summary: '环绕器与多探针，长期大气观测（示意）。' },

  // ───────── 泰坦 Titan（土卫六） ─────────
  { id: 'huygens', body: 'titan', layer: 'titan_landers', name: '惠更斯号', nameEn: 'Huygens', agency: 'ESA', lng: -167.7, lat: -10.3, date: '2005-01-14', status: 'completed', summary: '人类迄今唯一在外太阳系天体表面着陆，传回泰坦地表影像。', sourceUrl: 'https://www.esa.int/huygens' },
  { id: 'cassini-titan', body: 'titan', layer: 'titan_flyby', name: '卡西尼号', nameEn: 'Cassini', agency: 'NASA/ESA', lng: 0, lat: 0, date: '2004-10-26', status: 'completed', summary: '土星系统轨道器，对泰坦逾百次飞掠雷达测绘（示意）。' },
  { id: 'dragonfly', body: 'titan', layer: 'titan_landers', name: '蜻蜓号', nameEn: 'Dragonfly', agency: 'NASA', lng: -161, lat: 7, date: '2034-01-01', status: 'active', summary: '旋翼飞行器，计划 2034 抵达，于塞尔克坑一带巡飞（示意/规划）。' },

  // ───────── 欧罗巴 Europa（木卫二） ─────────
  { id: 'galileo-europa', body: 'europa', layer: 'europa_flyby', name: '伽利略号', nameEn: 'Galileo', agency: 'NASA', lng: 0, lat: 0, date: '1995-12-07', status: 'completed', summary: '木星轨道器，多次近距飞掠欧罗巴，揭示冰下海洋迹象（示意）。' },
  { id: 'europa-clipper', body: 'europa', layer: 'europa_flyby', name: '欧罗巴快船', nameEn: 'Europa Clipper', agency: 'NASA', lng: 75, lat: -10, date: '2024-10-14', status: 'active', summary: '2024 发射、约 2030 抵达，专门勘测欧罗巴宜居性（在途/示意）。' },
  { id: 'juice-europa', body: 'europa', layer: 'europa_flyby', name: 'JUICE', nameEn: 'JUICE', agency: 'ESA', lng: -86, lat: 9, date: '2023-04-14', status: 'active', summary: '欧空局木星冰卫星探测器，将飞掠欧罗巴并环绕木卫三（在途/示意）。' },

  // ───────── 冥王星 Pluto ─────────
  { id: 'new-horizons', body: 'pluto', layer: 'pluto_flyby', name: '新视野号', nameEn: 'New Horizons', agency: 'NASA', lng: 175, lat: 18, date: '2015-07-14', status: 'completed', summary: '人类首次飞掠冥王星，揭示斯普特尼克平原「心形」冰原。', sourceUrl: 'https://www.nasa.gov/newhorizons' },

  // ───────── 谷神星 Ceres ─────────
  { id: 'dawn-ceres', body: 'ceres', layer: 'ceres_orbiters', name: '黎明号', nameEn: 'Dawn', agency: 'NASA', lng: 0, lat: 0, date: '2015-03-06', status: 'completed', summary: '首个环绕矮行星的探测器（2015–2018），近距勘测奥卡托坑亮斑（示意）。', sourceUrl: 'https://www.nasa.gov/dawn' },
];

export const OTHER_BODY_FEATURES: BodyFeature[] = [
  // 水星
  { id: 'cf-caloris', body: 'mercury', layer: 'mercury_features', name: '卡洛里斯盆地', nameEn: 'Caloris Planitia', type: '撞击盆地', lng: -170, lat: 30, desc: '太阳系最大撞击盆地之一，直径约 1550km。' },
  { id: 'cf-rachmaninoff', body: 'mercury', layer: 'mercury_features', name: '拉赫玛尼诺夫坑', nameEn: 'Rachmaninoff', type: '撞击坑', lng: 57.6, lat: 27.6, desc: '双环撞击坑，坑底可能有较年轻火山平原。' },
  // 金星
  { id: 'vf-maxwell', body: 'venus', layer: 'venus_features', name: '麦克斯韦山脉', nameEn: 'Maxwell Montes', type: '山脉', lng: 3, lat: 65, desc: '金星最高峰，位于伊师塔地。' },
  { id: 'vf-aphrodite', body: 'venus', layer: 'venus_features', name: '阿佛洛狄忒地', nameEn: 'Aphrodite Terra', type: '高地', lng: 105, lat: -5, desc: '赤道附近的大型高地，约非洲大小。' },
  // 泰坦
  { id: 'tf-kraken', body: 'titan', layer: 'titan_features', name: '克拉肯海', nameEn: 'Kraken Mare', type: '液态甲烷海', lng: -50, lat: 68, desc: '泰坦最大的液态烃海洋，位于北极区。' },
  { id: 'tf-xanadu', body: 'titan', layer: 'titan_features', name: '上都', nameEn: 'Xanadu', type: '亮区', lng: 100, lat: -10, desc: '雷达明亮的大陆级区域，地形复杂。' },
  // 欧罗巴
  { id: 'ef-conamara', body: 'europa', layer: 'europa_features', name: '科纳马拉混沌区', nameEn: 'Conamara Chaos', type: '混沌地形', lng: -86, lat: 9, desc: '冰壳破碎再冻结区，冰下海洋活动的证据。' },
  { id: 'ef-pwyll', body: 'europa', layer: 'europa_features', name: '普威尔坑', nameEn: 'Pwyll', type: '撞击坑', lng: -89, lat: -25, desc: '年轻撞击坑，明亮辐射纹。' },
  // 冥王星
  { id: 'pf-tombaugh', body: 'pluto', layer: 'pluto_features', name: '汤博区（心形冰原）', nameEn: 'Tombaugh Regio', type: '冰原', lng: 178, lat: 20, desc: '含斯普特尼克平原的「心形」氮冰盆地。' },
  { id: 'pf-norgay', body: 'pluto', layer: 'pluto_features', name: '诺盖山', nameEn: 'Norgay Montes', type: '冰山', lng: 170, lat: -10, desc: '由水冰构成的高山，邻近心形冰原。' },
  // 谷神星
  { id: 'ceres-occator', body: 'ceres', layer: 'ceres_features', name: '奥卡托坑', nameEn: 'Occator', type: '撞击坑', lng: -120.7, lat: 19.8, desc: '坑内明亮盐沉积（碳酸钠），曾有冰火山活动。' },
  { id: 'ceres-ahuna', body: 'ceres', layer: 'ceres_features', name: '阿胡纳山', nameEn: 'Ahuna Mons', type: '冰火山', lng: -44, lat: -10.5, desc: '孤立穹丘状冰火山，地质年轻。' },
];

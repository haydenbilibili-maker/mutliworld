/**
 * 火星探索痕迹 — 多天体探索 Phase 2（真实档案坐标）
 *
 * 经度东经正（IAU 2000，转为 -180..180）；西经记为负。坐标取自各航天机构公开任务档案，
 * 中立并陈。巡视器行进轨迹（traverse）含大量真实路径点，留待后续阶段以官方公开数据接入。
 */

import type { BodySite } from '@/types/body';

export const MARS_SITES: BodySite[] = [
  // ── 巡视器 ──────────────────────────────────────
  { id: 'spirit', body: 'mars', layer: 'mars_rovers', name: '勇气号', nameEn: 'Spirit (MER-A)', agency: 'NASA', lng: 175.47, lat: -14.57, date: '2004-01-04', status: 'lost', summary: '古谢夫坑；服役逾 6 年，2010 年陷沙失联。', sourceUrl: 'https://mars.nasa.gov/mer/' },
  { id: 'opportunity', body: 'mars', layer: 'mars_rovers', name: '机遇号', nameEn: 'Opportunity (MER-B)', agency: 'NASA', lng: -5.53, lat: -1.95, date: '2004-01-25', status: 'lost', summary: '子午高原；行驶逾 45km，2018 年沙尘暴后失联。', sourceUrl: 'https://mars.nasa.gov/mer/' },
  { id: 'curiosity', body: 'mars', layer: 'mars_rovers', name: '好奇号', nameEn: 'Curiosity (MSL)', agency: 'NASA', lng: 137.44, lat: -4.59, date: '2012-08-06', status: 'active', summary: '盖尔坑/夏普山；核动力，持续在役探测宜居性。', sourceUrl: 'https://mars.nasa.gov/msl/' },
  { id: 'perseverance', body: 'mars', layer: 'mars_rovers', name: '毅力号', nameEn: 'Perseverance', agency: 'NASA', lng: 77.45, lat: 18.44, date: '2021-02-18', status: 'active', summary: '杰泽罗坑古河三角洲；采集样本待取回，携机智号直升机。', sourceUrl: 'https://mars.nasa.gov/mars2020/' },
  { id: 'zhurong', body: 'mars', layer: 'mars_rovers', name: '祝融号', nameEn: 'Zhurong', agency: 'CNSA', lng: 109.93, lat: 25.07, date: '2021-05-15', status: 'completed', summary: '乌托邦平原南部；中国首辆火星车，2022 年起休眠。', sourceUrl: 'https://www.cnsa.gov.cn/' },

  // ── 着陆器 ──────────────────────────────────────
  { id: 'viking1', body: 'mars', layer: 'mars_landers', name: '海盗 1 号', nameEn: 'Viking 1', agency: 'NASA', lng: -47.95, lat: 22.70, date: '1976-07-20', status: 'completed', summary: '克律塞平原；人类首个成功火星表面任务。', sourceUrl: 'https://nssdc.gsfc.nasa.gov/' },
  { id: 'viking2', body: 'mars', layer: 'mars_landers', name: '海盗 2 号', nameEn: 'Viking 2', agency: 'NASA', lng: -134.26, lat: 47.97, date: '1976-09-03', status: 'completed', summary: '乌托邦平原；与海盗 1 号开展生命探测实验。', sourceUrl: 'https://nssdc.gsfc.nasa.gov/' },
  { id: 'pathfinder', body: 'mars', layer: 'mars_landers', name: '火星探路者', nameEn: 'Mars Pathfinder / Sojourner', agency: 'NASA', lng: -33.21, lat: 19.13, date: '1997-07-04', status: 'completed', summary: '阿瑞斯峡谷；携旅居者号，首辆火星巡视器。', sourceUrl: 'https://mars.nasa.gov/' },
  { id: 'phoenix', body: 'mars', layer: 'mars_landers', name: '凤凰号', nameEn: 'Phoenix', agency: 'NASA', lng: -125.75, lat: 68.22, date: '2008-05-25', status: 'completed', summary: '北极平原；首次在火星就地确认水冰。', sourceUrl: 'https://www.nasa.gov/' },
  { id: 'insight', body: 'mars', layer: 'mars_landers', name: '洞察号', nameEn: 'InSight', agency: 'NASA', lng: 135.62, lat: 4.50, date: '2018-11-26', status: 'completed', summary: '埃律西昂平原；地震仪探测火星内部，2022 年退役。', sourceUrl: 'https://mars.nasa.gov/insight/' },
  { id: 'tianwen1', body: 'mars', layer: 'mars_landers', name: '天问一号着陆平台', nameEn: 'Tianwen-1 lander', agency: 'CNSA', lng: 110.08, lat: 25.10, date: '2021-05-15', status: 'completed', summary: '乌托邦平原；携祝融号着陆，中国首次火星软着陆。', sourceUrl: 'https://www.cnsa.gov.cn/' },

  // ── 早期与失败尝试（客观记录）──────────────────────
  { id: 'mars3', body: 'mars', layer: 'mars_landers', name: '火星 3 号', nameEn: 'Mars 3', agency: 'USSR', lng: -158.0, lat: -45.0, date: '1971-12-02', status: 'lost', summary: '人类首次火星软着陆，着陆后约 20 秒即失联。' },
  { id: 'mpl', body: 'mars', layer: 'mars_landers', name: '火星极地着陆者', nameEn: 'Mars Polar Lander', agency: 'NASA', lng: 0, lat: -76.0, date: '1999-12-03', status: 'lost', summary: '南极区域；着陆阶段失联，任务失败。' },
  { id: 'beagle2', body: 'mars', layer: 'mars_landers', name: '猎兔犬 2 号', nameEn: 'Beagle 2', agency: 'ESA/UK', lng: 90.4, lat: 11.5, date: '2003-12-25', status: 'lost', summary: '伊希斯平原；成功着陆但太阳能板未完全展开、失联。' },
  { id: 'schiaparelli', body: 'mars', layer: 'mars_landers', name: '斯基亚帕雷利', nameEn: 'Schiaparelli EDM', agency: 'ESA/Roscosmos', lng: -6.21, lat: -2.07, date: '2016-10-19', status: 'lost', summary: '子午高原；着陆演示器，下降阶段坠毁。' },
];

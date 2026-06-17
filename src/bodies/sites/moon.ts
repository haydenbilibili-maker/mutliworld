/**
 * 月球探索痕迹 — 多天体探索 Phase 1（真实档案坐标）
 *
 * 经度东经正（IAU mean-Earth/polar）；西经记为负。坐标取自各航天机构公开任务档案，
 * 中立并陈、不渲染竞争叙事。月背任务（嫦娥四号/六号）经度 >90° 即位于月球背面。
 */

import type { BodySite } from '@/types/body';

export const MOON_SITES: BodySite[] = [
  // ── 阿波罗载人着陆 ──────────────────────────────
  { id: 'apollo11', body: 'moon', layer: 'moon_apollo', name: '阿波罗 11 号', nameEn: 'Apollo 11', agency: 'NASA', lng: 23.473, lat: 0.674, date: '1969-07-20', status: 'completed', summary: '人类首次载人登月，静海，阿姆斯特朗与奥尔德林。', sourceUrl: 'https://www.nasa.gov/mission/apollo-11/' },
  { id: 'apollo12', body: 'moon', layer: 'moon_apollo', name: '阿波罗 12 号', nameEn: 'Apollo 12', agency: 'NASA', lng: -23.422, lat: -3.012, date: '1969-11-19', status: 'completed', summary: '风暴洋精确着陆于勘测者三号附近。', sourceUrl: 'https://www.nasa.gov/mission/apollo-12/' },
  { id: 'apollo14', body: 'moon', layer: 'moon_apollo', name: '阿波罗 14 号', nameEn: 'Apollo 14', agency: 'NASA', lng: -17.471, lat: -3.645, date: '1971-02-05', status: 'completed', summary: '弗拉·毛罗高地，谢泼德重返月面。', sourceUrl: 'https://www.nasa.gov/mission/apollo-14/' },
  { id: 'apollo15', body: 'moon', layer: 'moon_apollo', name: '阿波罗 15 号', nameEn: 'Apollo 15', agency: 'NASA', lng: 3.633, lat: 26.132, date: '1971-07-30', status: 'completed', summary: '哈德利-亚平宁，首次使用月球车 LRV。', sourceUrl: 'https://www.nasa.gov/mission/apollo-15/' },
  { id: 'apollo16', body: 'moon', layer: 'moon_apollo', name: '阿波罗 16 号', nameEn: 'Apollo 16', agency: 'NASA', lng: 15.500, lat: -8.973, date: '1972-04-21', status: 'completed', summary: '笛卡尔高地，首个月球高地着陆。', sourceUrl: 'https://www.nasa.gov/mission/apollo-16/' },
  { id: 'apollo17', body: 'moon', layer: 'moon_apollo', name: '阿波罗 17 号', nameEn: 'Apollo 17', agency: 'NASA', lng: 30.772, lat: 20.191, date: '1972-12-11', status: 'completed', summary: '陶拉斯-利特罗，迄今最后一次载人登月，含地质学家施密特。', sourceUrl: 'https://www.nasa.gov/mission/apollo-17/' },

  // ── 中国嫦娥计划 ────────────────────────────────
  { id: 'change3', body: 'moon', layer: 'moon_change', name: '嫦娥三号', nameEn: "Chang'e 3", agency: 'CNSA', lng: -19.512, lat: 44.121, date: '2013-12-14', status: 'completed', summary: '虹湾/雨海，玉兔号月球车；中国首次软着陆。', sourceUrl: 'https://www.cnsa.gov.cn/' },
  { id: 'change4', body: 'moon', layer: 'moon_change', name: '嫦娥四号', nameEn: "Chang'e 4", agency: 'CNSA', lng: 177.599, lat: -45.445, date: '2019-01-03', status: 'completed', summary: '冯·卡门坑；人类首次月球背面软着陆，玉兔二号。', sourceUrl: 'https://www.cnsa.gov.cn/' },
  { id: 'change5', body: 'moon', layer: 'moon_change', name: '嫦娥五号', nameEn: "Chang'e 5", agency: 'CNSA', lng: -51.916, lat: 43.058, date: '2020-12-01', status: 'completed', summary: '吕姆克山/风暴洋，采样返回 1731g；44 年来人类首次月球采样返回。', sourceUrl: 'https://www.cnsa.gov.cn/' },
  { id: 'change6', body: 'moon', layer: 'moon_change', name: '嫦娥六号', nameEn: "Chang'e 6", agency: 'CNSA', lng: -153.985, lat: -41.638, date: '2024-06-02', status: 'completed', summary: '南极-艾特肯盆地阿波罗坑；人类首次月球背面采样返回。', sourceUrl: 'https://www.cnsa.gov.cn/' },

  // ── 早期与近年其他任务 ──────────────────────────
  { id: 'luna9', body: 'moon', layer: 'moon_legacy', name: '月球 9 号', nameEn: 'Luna 9', agency: 'USSR', lng: -64.37, lat: 7.08, date: '1966-02-03', status: 'completed', summary: '风暴洋；人类首次月球软着陆并传回照片。' },
  { id: 'luna16', body: 'moon', layer: 'moon_legacy', name: '月球 16 号', nameEn: 'Luna 16', agency: 'USSR', lng: 56.30, lat: -0.68, date: '1970-09-20', status: 'completed', summary: '丰富海；首次机器人采样返回。' },
  { id: 'luna17', body: 'moon', layer: 'moon_legacy', name: '月球 17 号 / 月行者 1 号', nameEn: 'Luna 17 / Lunokhod 1', agency: 'USSR', lng: -35.00, lat: 38.28, date: '1970-11-17', status: 'completed', summary: '雨海；首辆月面巡视器。' },
  { id: 'luna21', body: 'moon', layer: 'moon_legacy', name: '月球 21 号 / 月行者 2 号', nameEn: 'Luna 21 / Lunokhod 2', agency: 'USSR', lng: 30.45, lat: 25.85, date: '1973-01-15', status: 'completed', summary: '勒莫尼耶坑；行驶里程纪录保持数十年。' },
  { id: 'surveyor1', body: 'moon', layer: 'moon_legacy', name: '勘测者 1 号', nameEn: 'Surveyor 1', agency: 'NASA', lng: -43.34, lat: -2.47, date: '1966-06-02', status: 'completed', summary: '风暴洋；美国首次月球软着陆。' },
  { id: 'surveyor3', body: 'moon', layer: 'moon_legacy', name: '勘测者 3 号', nameEn: 'Surveyor 3', agency: 'NASA', lng: -23.34, lat: -2.97, date: '1967-04-20', status: 'completed', summary: '后被阿波罗 12 号造访并取回部件。' },
  { id: 'chandrayaan3', body: 'moon', layer: 'moon_legacy', name: '月船 3 号', nameEn: 'Chandrayaan-3', agency: 'ISRO', lng: 32.32, lat: -69.37, date: '2023-08-23', status: 'completed', summary: '近月球南极；首个着陆南极区域的任务，普拉吉安巡视器。', sourceUrl: 'https://www.isro.gov.in/' },
  { id: 'slim', body: 'moon', layer: 'moon_legacy', name: 'SLIM', nameEn: 'SLIM', agency: 'JAXA', lng: 25.25, lat: -13.32, date: '2024-01-19', status: 'completed', summary: '希奥利坑附近；日本首次月球软着陆，精度着陆验证。', sourceUrl: 'https://global.jaxa.jp/' },
];

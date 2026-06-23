/**
 * 第五轮增密 · 全球主题图层扩展（2026-06-23）
 *
 * 本轮聚焦：制药图层（此前最薄弱，仅 30 条）补齐全球盲区 + 时效性事件。
 *  - 韩国：生物类似药/CDMO 双雄（Celltrion、Samsung Biologics）
 *  - 大洋洲：CSL（澳洲最大药企/血浆龙头）
 *  - 加拿大：Apotex 仿制药、Bausch Health
 *  - GLP-1/肥胖药赛道：Viking Therapeutics、Structure Therapeutics、Innovent
 *  - mRNA 新锐：Arcturus、CureVac 补全
 *  - 印度仿制药集群：Sun、Cipla、Dr. Reddy's、Lupin
 *  - 时效事件：2025-26 GLP-1 口服剂进展、阿尔茨海默抗体药放量、RSV 疫苗二期
 *
 * 所有条目为公开资料示意坐标，非精确/实时数据。整理日：2026-06-23。
 */

import type { ThematicPoint } from './global.thematic';

export const DENSIFY_PHARMACEUTICAL_R5: ThematicPoint[] = [
  // ── 韩国生物类似药 / CDMO ──
  { id: 'r5-ph-celltrion', name: 'Celltrion（三星生物）', layerId: 'pharmaceutical', lng: 126.68, lat: 37.47, note: '松岛，全球生物类似药 + CDMO 龙头', impact: 'high', subKind: 'biotech' },
  { id: 'r5-ph-samsung-bio', name: 'Samsung Biologics', layerId: 'pharmaceutical', lng: 126.65, lat: 37.38, note: '松岛，全球最大 CDMO 产能之一', impact: 'critical', subKind: 'biotech' },
  { id: 'r5-ph-hanmi', name: '韩美药品', layerId: 'pharmaceutical', lng: 127.06, lat: 37.49, note: '首尔，长效技术平台/国际合作', impact: 'medium', subKind: 'biotech' },
  // ── 大洋洲 ──
  { id: 'r5-ph-csl', name: 'CSL Limited', layerId: 'pharmaceutical', lng: 144.96, lat: -37.82, note: '墨尔本，全球血浆制品 + 流感疫苗龙头', impact: 'critical', subKind: 'big_pharma' },
  { id: 'r5-ph-csl-behring', name: 'CSL Behring（研发）', layerId: 'pharmaceutical', lng: 145.03, lat: -37.82, note: '墨尔本波特兰，罕见病/免疫', impact: 'high', subKind: 'biotech' },
  { id: 'r5-ph-medicines-au', name: 'CSL Seqirus', layerId: 'pharmaceutical', lng: 145.0, lat: -37.8, note: '墨尔本，流感疫苗/佐剂技术', impact: 'medium', subKind: 'vaccine' },
  // ── 加拿大 ──
  { id: 'r5-ph-apotex', name: 'Apotex', layerId: 'pharmaceutical', lng: -79.39, lat: 43.65, note: '多伦多，加拿大最大仿制药', impact: 'medium', subKind: 'big_pharma' },
  { id: 'r5-ph-bausch', name: 'Bausch Health', layerId: 'pharmaceutical', lng: -79.38, lat: 43.65, note: '拉瓦尔/多伦多，眼科/胃肠', impact: 'medium', subKind: 'big_pharma' },
  { id: 'r5-ph-verseau', name: 'Knight Therapeutics', layerId: 'pharmaceutical', lng: -73.57, lat: 45.5, note: '蒙特利尔，特药分销', impact: 'low', subKind: 'biotech' },
  // ── GLP-1 / 肥胖药新锐（2025-26 最热赛道）──
  { id: 'r5-ph-viking', name: 'Viking Therapeutics', layerId: 'pharmaceutical', lng: -117.16, lat: 32.92, note: '圣迭戈，VK2735 双靶激动剂', impact: 'high', subKind: 'biotech' },
  { id: 'r5-ph-structure', name: 'Structure Therapeutics', layerId: 'pharmaceutical', lng: 121.47, lat: 31.23, note: '上海/旧金山，口服 GLP-1 小分子', impact: 'high', subKind: 'biotech' },
  { id: 'r5-ph-innovent-glp', name: '信达生物', layerId: 'pharmaceutical', lng: 120.74, lat: 31.27, note: '苏州，玛仕度肽 GLP-1/GCGR', impact: 'high', subKind: 'biotech' },
  { id: 'r5-ph-hengrui', name: '恒瑞医药', layerId: 'pharmaceutical', lng: 119.18, lat: 34.6, note: '连云港，HRS9531 减重 + 肿瘤管线', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-amgen-obesity', name: 'Amgen（减重管线）', layerId: 'pharmaceutical', lng: -118.0, lat: 34.18, note: '千橡市，MariTide 月一针减重药', impact: 'high', subKind: 'big_pharma' },
  // ── mRNA / 疫苗新锐 ──
  { id: 'r5-ph-arcturus', name: 'Arcturus Therapeutics', layerId: 'pharmaceutical', lng: -117.16, lat: 32.87, note: '圣迭戈，自扩增 mRNA / LUNAR 递送', impact: 'medium', subKind: 'biotech' },
  { id: 'r5-ph-curevac', name: 'CureVac', layerId: 'pharmaceutical', lng: 9.0, lat: 48.78, note: '图宾根德国，二代 mRNA 平台', impact: 'medium', subKind: 'biotech' },
  { id: 'r5-ph-gsk-rsv', name: 'GSK RSV', layerId: 'pharmaceutical', lng: -0.34, lat: 51.39, note: '布伦特福德，Arexvy RSV 疫苗', impact: 'high', subKind: 'vaccine' },
  { id: 'r5-ph-pfizer-rsv', name: 'Pfizer RSV/Abrysco', layerId: 'pharmaceutical', lng: -74.0, lat: 40.75, note: '纽约，Abrysco 二价 RSV', impact: 'high', subKind: 'vaccine' },
  // ── 阿尔茨海默抗体药（2024-26 放量）──
  { id: 'r5-ph-eisai-leqembi', name: '卫材（Leqembi）', layerId: 'pharmaceutical', lng: 139.73, lat: 35.69, note: '东京，与渤健合作抗 Aβ 抗体', impact: 'critical', subKind: 'big_pharma' },
  { id: 'r5-ph-biogen-leqembi', name: '渤健 Leqembi 商业化', layerId: 'pharmaceutical', lng: -71.26, lat: 42.36, note: '剑桥 MA，阿尔茨海默抗体药放量', impact: 'critical', subKind: 'biotech' },
  { id: 'r5-ph-ely-lilly-donanemab', name: '礼来 Kisunla', layerId: 'pharmaceutical', lng: -86.16, lat: 39.77, note: '印第安纳波利斯，donanemab 获批', impact: 'critical', subKind: 'big_pharma' },
  // ── 印度仿制药集群（补全）──
  { id: 'r5-ph-sun', name: 'Sun Pharmaceutical', layerId: 'pharmaceutical', lng: 72.88, lat: 19.07, note: '孟买，印度最大仿制药/特药', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-cipla', name: 'Cipla', layerId: 'pharmaceutical', lng: 72.83, lat: 18.97, note: '孟买，呼吸/HIV 仿制药', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-drreddys', name: 'Dr. Reddy\u2019s Laboratories', layerId: 'pharmaceutical', lng: 78.45, lat: 17.45, note: '海得拉巴，仿制药 + 生物类似药', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-lupin', name: 'Lupin Limited', layerId: 'pharmaceutical', lng: 72.83, lat: 19.07, note: '孟买，结核/心血管仿制药', impact: 'medium', subKind: 'big_pharma' },
  { id: 'r5-ph-aurobindo', name: 'Aurobindo Pharma', layerId: 'pharmaceutical', lng: 78.47, lat: 17.38, note: '海得拉巴，抗生素仿制药巨头', impact: 'medium', subKind: 'big_pharma' },
  // ── 欧洲补充 ──
  { id: 'r5-ph-merck-kgaa', name: '默克 KGaA', layerId: 'pharmaceutical', lng: 8.65, lat: 50.0, note: '达姆施塔特德国，生物工艺/特药', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-novartis-basel', name: '诺华巴塞尔', layerId: 'pharmaceutical', lng: 7.57, lat: 47.56, note: '巴塞尔，心血管/基因疗法', impact: 'critical', subKind: 'big_pharma' },
  { id: 'r5-ph-grifols', name: '基立福（Grifols）', layerId: 'pharmaceutical', lng: 2.08, lat: 41.39, note: '巴塞罗那，全球血浆制品三巨头之一', impact: 'high', subKind: 'big_pharma' },
  { id: 'r5-ph-recordati', name: 'Recordati', layerId: 'pharmaceutical', lng: 9.19, lat: 45.46, note: '米兰，罕见病/特药', impact: 'medium', subKind: 'big_pharma' },
  // ── 中国补充 ──
  { id: 'r5-ph-bj-united', name: '石药集团', layerId: 'pharmaceutical', lng: 114.51, lat: 38.04, note: '石家庄，mRNA 疫苗/创新药', impact: 'medium', subKind: 'biotech' },
  { id: 'r5-ph-wuxi-biol', name: '药明生物', layerId: 'pharmaceutical', lng: 114.14, lat: 22.37, note: '无锡/深圳，全球 CRDMO 龙头', impact: 'critical', subKind: 'biotech' },
  { id: 'r5-ph-cspc', name: '石药集团（中枢）', layerId: 'pharmaceutical', lng: 114.51, lat: 38.05, note: '石家庄，中枢神经/肿瘤', impact: 'medium', subKind: 'big_pharma' },
];

// ───────────────────────────────────────────────────────────────
// media_orgs 增密（新兴数字媒体/播客/区域通讯社）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_MEDIA_ORGS_R5: ThematicPoint[] = [
  // ── 数字原生新闻 ──
  { id: 'r5-mo-axios', name: 'Axios', layerId: 'media_orgs', lng: -77.04, lat: 38.9, note: '华盛顿，Smart Brevity 数字新闻', impact: 'medium', subKind: 'news' },
  { id: 'r5-mo-politico', name: 'Politico', layerId: 'media_orgs', lng: -77.04, lat: 38.9, note: '华盛顿，政治/政策专业媒体', impact: 'high', subKind: 'news' },
  { id: 'r5-mo-the-information', name: 'The Information', layerId: 'media_orgs', lng: -122.42, lat: 37.77, note: '旧金山，订阅制科技深度报道', impact: 'medium', subKind: 'tech_media' },
  { id: 'r5-mo-semaphore', name: 'Semafor', layerId: 'media_orgs', lng: -73.99, lat: 40.74, note: '纽约，全球新闻新锐（2022 创立）', impact: 'low', subKind: 'news' },
  // ── 播客/音频媒体（新兴信息渠道）──
  { id: 'r5-mo-spotify-meg', name: 'Spotify/The Joe Rogan Experience', layerId: 'media_orgs', lng: -97.74, lat: 30.27, note: '奥斯汀，全球最大播客独家', impact: 'medium', subKind: 'tech_media' },
  { id: 'r5-mo-ihr', name: 'iHeartMedia', layerId: 'media_orgs', lng: -97.74, lat: 30.27, note: '圣安东尼奥，全美最大广播/播客网络', impact: 'medium', subKind: 'tv' },
  // ── 区域通讯社（补缺）──
  { id: 'r5-mo-ansa', name: '安莎社（ANSA）', layerId: 'media_orgs', lng: 12.48, lat: 41.9, note: '罗马，意大利主要通讯社', impact: 'medium', subKind: 'news' },
  { id: 'r5-mo-dpa', name: '德新社（DPA）', layerId: 'media_orgs', lng: 8.68, lat: 50.11, note: '柏林，德国最大通讯社', impact: 'high', subKind: 'news' },
  { id: 'r5-mo-efe', name: '埃菲社（EFE）', layerId: 'media_orgs', lng: -3.7, lat: 40.42, note: '马德里，西班牙语世界最大通讯社', impact: 'high', subKind: 'news' },
  { id: 'r5-mo-tass', name: '塔斯社（TASS）', layerId: 'media_orgs', lng: 37.62, lat: 55.75, note: '莫斯科，俄罗斯国家通讯社', impact: 'high', subKind: 'news' },
  { id: 'r5-mo-una', name: 'UPI（合众国际社）', layerId: 'media_orgs', lng: -77.04, lat: 38.9, note: '华盛顿，历史悠久的美国通讯社', impact: 'low', subKind: 'news' },
  { id: 'r5-mo-kyodo', name: '时事通信社（Jiji）', layerId: 'media_orgs', lng: 139.77, lat: 35.68, note: '东京，日本第二大通讯社', impact: 'medium', subKind: 'news' },
  { id: 'r5-mo-yonhap', name: '韩联社（Yonhap）', layerId: 'media_orgs', lng: 126.98, lat: 37.57, note: '首尔，韩国国家通讯社', impact: 'high', subKind: 'news' },
  // ── 流媒体新闻（2026 趋势）──
  { id: 'r5-mo-netflix-news', name: 'Netflix Newsroom', layerId: 'media_orgs', lng: -122.42, lat: 37.77, note: '洛杉矶/硅谷，流媒体进军新闻纪实', impact: 'low', subKind: 'tv' },
];

// ───────────────────────────────────────────────────────────────
// auto_brands 增密（新能源补充 + 越南/印度/欧洲 EV 转型）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_AUTO_BRANDS_R5: ThematicPoint[] = [
  // ── 新势力补充 ──
  { id: 'r5-ab-lucid', name: 'Lucid Motors', layerId: 'auto_brands', lng: -112.07, lat: 33.45, note: '亚利桑那卡萨格兰德，豪华电动', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-polestar', name: 'Polestar', layerId: 'auto_brands', lng: 11.97, lat: 57.71, note: '哥德堡，吉利/沃尔沃高性能电动', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-nio', name: '蔚来（NIO）', layerId: 'auto_brands', lng: 117.28, lat: 31.86, note: '合肥，换电 + 高端电动', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-xpeng', name: '小鹏汽车', layerId: 'auto_brands', lng: 113.35, lat: 23.12, note: '广州，智能驾驶/飞行汽车', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-li-auto', name: '理想汽车', layerId: 'auto_brands', lng: 116.48, lat: 39.91, note: '北京，增程式 SUV 销冠', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-vinfast', name: 'VinFast', layerId: 'auto_brands', lng: 105.78, lat: 20.84, note: '海防，越南首家全球化电动车企', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-tata-ev', name: 'Tata Motors EV', layerId: 'auto_brands', lng: 72.88, lat: 19.07, note: '孟买，印度电动车销量领先', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-mahindra-ev', name: 'Mahindra Electric', layerId: 'auto_brands', lng: 77.69, lat: 12.96, note: '班加罗尔，印度三电/微型电动', impact: 'low', subKind: 'ev' },
  // ── 欧洲传统厂商 EV 转型 ──
  { id: 'r5-ab-merc-eq', name: '梅赛德斯-奔驰 EQ', layerId: 'auto_brands', lng: 9.0, lat: 48.78, note: '斯图加特，全电动 EQ 平台转型', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-vw-id', name: '大众 ID 系列', layerId: 'auto_brands', lng: 10.79, lat: 52.43, note: '沃尔夫斯堡，MEB 电动平台', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-audi-e-tron', name: '奥迪 e-tron', layerId: 'auto_brands', lng: 11.58, lat: 48.13, note: '慕尼黑/英戈尔施塔特，PPE 电动平台', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-renault-megane', name: '雷诺 Ampere', layerId: 'auto_brands', lng: 2.2, lat: 48.83, note: '布洛涅，欧洲平价电动 Megane E-Tech', impact: 'medium', subKind: 'ev' },
  { id: 'r5-ab-volvo-ev', name: '沃尔沃 EX 系列', layerId: 'auto_brands', lng: 12.15, lat: 57.71, note: '哥德堡，2030 全电动目标', impact: 'medium', subKind: 'ev' },
  // ── 日韩 EV 转型 ──
  { id: 'r5-ab-toyota-ev', name: '丰田 bZ 系列', layerId: 'auto_brands', lng: 137.15, lat: 35.08, note: '丰田市，固态电池 2027 计划', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-hyundai-ev', name: '现代 E-GMP', layerId: 'auto_brands', lng: 127.13, lat: 37.4, note: '首尔，IONIQ 5/6 电动平台', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-nissan-leaf', name: '日产 Ariya', layerId: 'auto_brands', lng: 139.65, lat: 35.65, note: '横滨，CMF-EV 平台', impact: 'medium', subKind: 'ev' },
  // ── 美国传统厂商 EV ──
  { id: 'r5-ab-gm-ultium', name: '通用 Ultium', layerId: 'auto_brands', lng: -83.25, lat: 42.56, note: '底特律，Ultium 电动平台/Hummer EV', impact: 'high', subKind: 'ev' },
  { id: 'r5-ab-ford-ev', name: '福特 Model e', layerId: 'auto_brands', lng: -83.24, lat: 42.3, note: '迪尔伯恩，F-150 Lightning/Mustang Mach-E', impact: 'high', subKind: 'ev' },
];

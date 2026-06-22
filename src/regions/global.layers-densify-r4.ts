/**
 * 第四轮增密 · 全球主题图层扩展（2026-06-22）
 *
 * 本轮聚焦：填补最薄弱静态图层的覆盖盲区，并补充时效性事件。
 *  - space_companies（商业航天）：补欧洲/印度/日韩主承包商、卫星与星座运营商
 *  - forests（森林生态）：补非洲旱生林、东南亚季风林、南美 cerrado、欧亚草原
 *  - rare_earth（稀土关键矿产）：补非中国精炼、永磁/半导体关键节点
 *  - tech_companies（科技公司）：补欧洲/日韩互联网、半导体设备与晶圆
 *  - intl_orgs（国际组织）：补能源/气候/禁毒等专门机构
 *  - power_plants（火电与其他）：补超大规模水电外风光基地与核电外储能
 *
 * 所有条目为公开资料示意坐标，非精确/实时数据。整理日：2026-06-22。
 */

import type { ThematicPoint } from './global.thematic';

// ───────────────────────────────────────────────────────────────
// space_companies 增密（欧洲/印度/日韩主承包商、星座运营商）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_SPACE_COMPANIES_R4: ThematicPoint[] = [
  // ── 欧洲主承包商 ──
  { id: 'r4-sc-arianegroup', name: 'ArianeGroup', layerId: 'space_companies', lng: 2.25, lat: 48.86, note: '巴黎-萨克莱，阿丽亚娜 6/推进系统主承包', impact: 'high', subKind: 'rocket' },
  { id: 'r4-sc-ohb', name: 'OHB SE', layerId: 'space_companies', lng: 8.59, lat: 53.55, note: '不来梅，德系卫星平台/空间系统', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-thales-alenia', name: '泰雷兹阿莱尼亚宇航', layerId: 'space_companies', lng: 7.11, lat: 43.64, note: '戛纳，法意合资卫星制造商', impact: 'high', subKind: 'satellite' },
  { id: 'r4-sc-airbus-space', name: '空客防务与航天', layerId: 'space_companies', lng: 8.63, lat: 49.4, note: '腓特烈港/图卢兹，卫星/服务舱/火箭', impact: 'high', subKind: 'satellite' },
  { id: 'r4-sc-avio', name: 'Avio S.p.A.', layerId: 'space_companies', lng: 12.47, lat: 41.86, note: '科莱费罗，织女星火箭主承包', impact: 'medium', subKind: 'rocket' },
  { id: 'r4-sc-isar', name: 'Isar Aerospace', layerId: 'space_companies', lng: 11.57, lat: 48.14, note: '慕尼黑，谱系/光谱小型火箭', impact: 'medium', subKind: 'rocket' },
  // ── 印度/日韩/以色列 ──
  { id: 'r4-sc-isro-nsil', name: 'NSIL/ISRO 商业化', layerId: 'space_companies', lng: 77.57, lat: 12.96, note: '班加罗尔，LVM3/GSLV/PSSLV 商业发射', impact: 'critical', subKind: 'rocket' },
  { id: 'r4-sc-skyroot', name: 'Skyroot Aerospace', layerId: 'space_companies', lng: 78.39, lat: 17.45, note: '海得拉巴，维克拉姆系列火箭', impact: 'medium', subKind: 'rocket' },
  { id: 'r4-sc-agnostic', name: 'Agnikul Cosmos', layerId: 'space_companies', lng: 80.23, lat: 13.02, note: '金奈，3D 打印火箭/Agnibaan', impact: 'low', subKind: 'rocket' },
  { id: 'r4-sc-pixxel', name: 'Pixxel', layerId: 'space_companies', lng: 77.59, lat: 12.97, note: '班加罗尔，高光谱星座', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-mitsubishi-h', name: '三菱重工（H3）', layerId: 'space_companies', lng: 139.71, lat: 35.66, note: '东京，H-IIA/H3 主承包', impact: 'high', subKind: 'rocket' },
  { id: 'r4-sc-ihi', name: 'IHI（宇宙航空）', layerId: 'space_companies', lng: 139.69, lat: 35.69, note: '东京，LE 系列发动机/上面级', impact: 'medium', subKind: 'rocket' },
  { id: 'r4-sc-karikh', name: 'KAI/韩华宇航', layerId: 'space_companies', lng: 128.51, lat: 35.21, note: '泗川，韩国世界号（KSLV-II）主承包', impact: 'high', subKind: 'rocket' },
  { id: 'r4-sc-iai', name: '以色列航太工业（IAI）', layerId: 'space_companies', lng: 34.89, lat: 32.02, note: '特拉维夫，Shavit/地平线/观测卫星', impact: 'high', subKind: 'rocket' },
  // ── 星座运营商/新兴（补缺） ──
  { id: 'r4-sc-oneweb', name: 'Eutelsat OneWeb', layerId: 'space_companies', lng: -0.12, lat: 51.5, note: '伦敦，低轨宽带星座（已并入 Eutelsat）', impact: 'high', subKind: 'satellite' },
  { id: 'r4-sc-telesat', name: 'Telesat', layerId: 'space_companies', lng: -75.7, lat: 45.42, note: '渥太华，GEO + Lightspeed LEO 星座', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-ast', name: 'AST SpaceMobile', layerId: 'space_companies', lng: -97.74, lat: 30.27, note: '得州，BlueWalker 直连手机卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-viasat', name: 'Viasat', layerId: 'space_companies', lng: -117.2, lat: 33.12, note: '卡尔斯巴德 CA，宽带 Ka 卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-yahsat', name: 'Yahsat（阿尔耶卫星）', layerId: 'space_companies', lng: 54.55, lat: 24.43, note: '阿布扎比，中东政府/商业卫星', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-gsat', name: 'GSTC 中国卫星', layerId: 'space_companies', lng: 116.32, lat: 39.93, note: '北京，微小卫星与商业星座运营', impact: 'medium', subKind: 'satellite' },
  { id: 'r4-sc-spacex-starlink', name: 'Starlink（星链）', layerId: 'space_companies', lng: -95.09, lat: 29.56, note: 'SpaceX 低轨宽带星座（>6000 星）', impact: 'critical', subKind: 'satellite' },
];

// ───────────────────────────────────────────────────────────────
// forests 增密（非洲旱生林、东南亚季风林、cerrado、草原/稀树）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_FORESTS_R4: ThematicPoint[] = [
  // ── 热带雨林补充 ──
  { id: 'r4-for-sulawesi2', name: '华莱士线雨林', layerId: 'forests', lng: 119.5, lat: -2.0, note: '苏拉威西/马鲁古，物种特有性极高', impact: 'medium', subKind: 'tropical' },
  { id: 'r4-for-philippines', name: '菲律宾雨林', layerId: 'forests', lng: 122.0, lat: 11.0, note: '雨林碎片化严重，特有鸟兽', impact: 'medium', subKind: 'tropical' },
  { id: 'r4-for-srilanka', name: '辛哈拉加雨林', layerId: 'forests', lng: 80.5, lat: 6.4, note: '斯里兰卡低地雨林，世界遗产', impact: 'medium', subKind: 'tropical' },
  // ── 季风林/旱生林 ──
  { id: 'r4-for-mekong', name: '湄公河流域季风林', layerId: 'forests', lng: 104.0, lat: 16.0, note: '中南半岛落叶季风林带', impact: 'medium', subKind: 'tropical' },
  { id: 'r4-for-india-dry', name: '印度干旱落叶林', layerId: 'forests', lng: 78.0, lat: 20.0, note: '德干高原柚木季风林', impact: 'medium', subKind: 'tropical' },
  { id: 'r4-for-miombo', name: '米欧博林地', layerId: 'forests', lng: 28.0, lat: -12.0, note: '非洲南部热带干旱林/稀树草原', impact: 'high', subKind: 'tropical' },
  { id: 'r4-for-madagascar-dry', name: '马达加斯加干旱林', layerId: 'forests', lng: 45.0, lat: -20.0, note: '西部落叶林，特有动植物', impact: 'medium', subKind: 'tropical' },
  // ── 稀树草原/savanna 生态系统 ──
  { id: 'r4-for-serengeti', name: '塞伦盖蒂稀树草原', layerId: 'forests', lng: 34.8, lat: -2.3, note: '坦桑尼亚，角马大迁徙生态', impact: 'high', subKind: 'tropical' },
  { id: 'r4-for-cerrado', name: '塞拉多草原林地', layerId: 'forests', lng: -52.0, lat: -14.0, note: '巴西，世界生物多样性最丰富稀树草原', impact: 'critical', subKind: 'tropical' },
  { id: 'r4-for-caatinga', name: '卡廷加旱生林', layerId: 'forests', lng: -40.0, lat: -9.0, note: '巴西东北部，唯一半干旱林地', impact: 'medium', subKind: 'tropical' },
  // ── 温带/地中海补充 ──
  { id: 'r4-for-mediterranean', name: '地中海硬叶林', layerId: 'forests', lng: 5.0, lat: 40.0, note: '橄榄/栓皮栎，全球生物多样性热点', impact: 'medium', subKind: 'temperate' },
  { id: 'r4-for-baikal', name: '贝加尔湖地区森林', layerId: 'forests', lng: 108.0, lat: 53.5, note: '俄罗斯东西伯利亚针阔混交林', impact: 'medium', subKind: 'temperate' },
  { id: 'r4-for-caucasus', name: '高加索混交林', layerId: 'forests', lng: 44.0, lat: 42.0, note: '黑海/里海间温带雨林，世界遗产', impact: 'medium', subKind: 'temperate' },
  // ── 草原/北方补充 ──
  { id: 'r4-for-eurasian-steppe', name: '欧亚草原带', layerId: 'forests', lng: 70.0, lat: 50.0, note: '匈牙利至满洲的连续草原', impact: 'medium', subKind: 'temperate' },
  { id: 'r4-for-scottish', name: '苏格兰喀里多尼亚林', layerId: 'forests', lng: -4.0, lat: 57.5, note: '残存原生松林，仅存 1%', impact: 'low', subKind: 'boreal' },
  { id: 'r4-for-sakhalin', name: '萨哈林针叶林', layerId: 'forests', lng: 143.0, lat: 50.0, note: '俄远东岛屿，云杉/冷杉', impact: 'medium', subKind: 'boreal' },
];

// ───────────────────────────────────────────────────────────────
// rare_earth 增密（非中国精炼、永磁/半导体关键节点）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_RARE_EARTH_R4: ThematicPoint[] = [
  // ── 开采补充 ──
  { id: 'r4-re-loch-loin', name: '洛恩湖稀土矿', layerId: 'rare_earth', lng: -4.5, lat: 58.0, note: '苏格兰，潜在重稀土资源', impact: 'low', subKind: 'mining' },
  { id: 'r4-re-penouta', name: 'Penouta 矿', layerId: 'rare_earth', lng: -7.1, lat: 42.0, note: '西班牙加利西亚，伴生钽铌稀土', impact: 'low', subKind: 'mining' },
  { id: 'r4-re-uralkali', name: 'Tomtor 北极稀土', layerId: 'rare_earth', lng: 148.0, lat: 70.0, note: '俄罗斯雅库特，巨型稀土未开发矿', impact: 'high', subKind: 'mining' },
  { id: 'r4-re-brazil-ree', name: '阿腊沙稀土矿', layerId: 'rare_earth', lng: -46.5, lat: -19.5, note: '巴西米纳斯吉拉斯，独居石/磷灰石稀土', impact: 'medium', subKind: 'mining' },
  { id: 'r4-re-india-monazite', name: '印度独居石砂矿', layerId: 'rare_earth', lng: 79.0, lat: 13.0, note: '泰米尔纳德/喀拉拉海岸砂矿', impact: 'medium', subKind: 'mining' },
  { id: 'r4-re-vietnam', name: '越南稀土矿', layerId: 'rare_earth', lng: 108.0, lat: 16.0, note: '中部省份，新兴稀土供应国', impact: 'high', subKind: 'mining' },
  // ── 精炼/永磁补充 ──
  { id: 'r4-re-sillamae', name: 'Sillamäe 精炼厂', layerId: 'rare_earth', lng: 27.76, lat: 59.4, note: '爱沙尼亚，欧洲唯一稀土分离厂', impact: 'high', subKind: 'refining' },
  { id: 'r4-re-tdc', name: 'TDK 铁氧体/永磁', layerId: 'rare_earth', lng: 139.65, lat: 35.63, note: '东京，电子永磁/铁氧体龙头', impact: 'high', subKind: 'refining' },
  { id: 'r4-re-hitachi', name: '日立金属（ Proterial ）', layerId: 'rare_earth', lng: 139.68, lat: 35.66, note: '东京，钕铁硼永磁巨头', impact: 'high', subKind: 'refining' },
  { id: 'r4-re-arnold', name: 'Arnold 磁技术', layerId: 'rare_earth', lng: -77.6, lat: 43.16, note: '罗切斯特 NY，特种永磁/稀土合金', impact: 'medium', subKind: 'refining' },
  { id: 'r4-re-mp-magnets', name: 'MP Materials 永磁厂', layerId: 'rare_earth', lng: -95.37, lat: 29.76, note: '得州 Independence，美首个大型稀土磁体厂', impact: 'high', subKind: 'refining' },
  // ── 战略节点补充 ──
  { id: 'r4-re-us-mine-law', name: '美国《国防生产法》稀土', layerId: 'rare_earth', lng: -77.04, lat: 38.9, note: '华盛顿，DPA Title III 稀土/钴战略资助', impact: 'high', subKind: 'strategic' },
  { id: 'r4-re-eu-crma', name: '欧盟《关键原材料法》', layerId: 'rare_earth', lng: 4.35, lat: 50.85, note: '布鲁塞尔，设定稀土战略储备与本地化目标', impact: 'high', subKind: 'strategic' },
  { id: 'r4-re-quad', name: '四国关键矿产伙伴关系', layerId: 'rare_earth', lng: 149.13, lat: -35.28, note: '美日印澳，稀土供应链去风险化', impact: 'medium', subKind: 'strategic' },
];

// ───────────────────────────────────────────────────────────────
// tech_companies 增密（欧洲/日韩互联网、半导体设备/晶圆）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_TECH_COMPANIES_R4: ThematicPoint[] = [
  // ── 欧洲/日韩互联网与软件 ──
  { id: 'r4-tc-samsung', name: '三星电子', layerId: 'tech_companies', lng: 129.36, lat: 36.0, note: '水原/华城，存储/手机/晶圆代工', impact: 'critical', subKind: 'cloud' },
  { id: 'r4-tc-line', name: 'LY Corporation（LINE）', layerId: 'tech_companies', lng: 139.7, lat: 35.68, note: '东京，日韩最大即时通讯/门户', impact: 'medium', subKind: 'internet' },
  { id: 'r4-tc-rakuten-sym', name: '乐天集团', layerId: 'tech_companies', lng: 139.73, lat: 35.65, note: '东京，电商/5G/金融（合并）', impact: 'medium', subKind: 'internet' },
  { id: 'r4-tc-zalando', name: 'Zalando', layerId: 'tech_companies', lng: 13.38, lat: 52.52, note: '柏林，欧洲时尚电商', impact: 'medium', subKind: 'internet' },
  { id: 'r4-tc-deliveroo', name: 'Deliveroo', layerId: 'tech_companies', lng: -0.1, lat: 51.51, note: '伦敦，外卖平台', impact: 'low', subKind: 'internet' },
  { id: 'r4-tc-booking2', name: 'Trivago', layerId: 'tech_companies', lng: 6.8, lat: 51.24, note: '杜塞尔多夫，酒店比价', impact: 'low', subKind: 'internet' },
  { id: 'r4-tc-sap-cloud', name: 'ServiceNow', layerId: 'tech_companies', lng: -122.27, lat: 37.43, note: '圣克拉拉，IT 工作流 SaaS', impact: 'high', subKind: 'software' },
  { id: 'r4-tc-twilio', name: 'Twilio', layerId: 'tech_companies', lng: -122.4, lat: 37.78, note: '旧金山，通信 API', impact: 'medium', subKind: 'software' },
  { id: 'r4-tc-workday', name: 'Workday', layerId: 'tech_companies', lng: -122.13, lat: 37.54, note: '普莱森顿 CA，人力/财务 SaaS', impact: 'medium', subKind: 'software' },
  // ── 半导体设备与晶圆 ──
  { id: 'r4-tc-asml', name: 'ASML', layerId: 'tech_companies', lng: 5.47, lat: 51.43, note: '费尔德霍芬，EUV 光刻机全球垄断', impact: 'critical', subKind: 'cloud' },
  { id: 'r4-tc-applied-materials', name: '应用材料（AMAT）', layerId: 'tech_companies', lng: -122.03, lat: 37.33, note: '圣克拉拉，晶圆制造设备龙头', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-lam', name: '泛林半导体（Lam）', layerId: 'tech_companies', lng: -121.95, lat: 37.4, note: '弗里蒙特 CA，刻蚀/沉积设备', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-kla', name: 'KLA', layerId: 'tech_companies', lng: -121.96, lat: 37.4, note: '米尔皮塔斯 CA，良率检测/量测', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-tokyo-electron', name: '东京电子', layerId: 'tech_companies', lng: 139.69, lat: 35.69, note: '东京，涂胶/显影/热处理设备', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-sk-hynix', name: 'SK 海力士', layerId: 'tech_companies', lng: 126.93, lat: 37.32, note: '利川，DRAM/NAND 双雄', impact: 'critical', subKind: 'cloud' },
  { id: 'r4-tc-micron', name: '美光科技', layerId: 'tech_companies', lng: -116.21, lat: 43.62, note: '博伊西 ID，DRAM/NAND', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-tsmc', name: '台积电（TSMC）', layerId: 'tech_companies', lng: 120.96, lat: 24.8, note: '新竹，全球最大晶圆代工', impact: 'critical', subKind: 'cloud' },
  { id: 'r4-tc-globalfoundries', name: '格芯（GlobalFoundries）', layerId: 'tech_companies', lng: -73.81, lat: 42.72, note: '马耳他 NY，特色工艺代工', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-umc', name: '联电（UMC）', layerId: 'tech_companies', lng: 120.96, lat: 24.8, note: '新竹，成熟制程代工', impact: 'medium', subKind: 'cloud' },
  { id: 'r4-tc-smic', name: '中芯国际（SMIC）', layerId: 'tech_companies', lng: 121.6, lat: 31.2, note: '上海，大陆最大晶圆代工', impact: 'high', subKind: 'cloud' },
  // ── 硅晶圆材料 ──
  { id: 'r4-tc-sumco', name: 'SUMCO', layerId: 'tech_companies', lng: 130.42, lat: 33.59, note: '福冈/佐贺，硅晶圆全球双寡头之一', impact: 'high', subKind: 'cloud' },
  { id: 'r4-tc-shin-etsu', name: '信越化学', layerId: 'tech_companies', lng: 138.24, lat: 36.69, note: '长野，硅晶圆/光刻胶龙头', impact: 'high', subKind: 'cloud' },
];

// ───────────────────────────────────────────────────────────────
// intl_orgs 增密（能源/气候/禁毒/标准化/军控专门机构）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_INTL_ORGS_R4: ThematicPoint[] = [
  { id: 'r4-io-iea', name: '国际能源署（IEA）', layerId: 'intl_orgs', lng: 2.28, lat: 48.85, note: '巴黎，能源政策与数据（OECD 旗下）', impact: 'high', subKind: 'other' },
  { id: 'r4-io-irena', name: '国际可再生能源署（IRENA）', layerId: 'intl_orgs', lng: 54.37, lat: 24.48, note: '阿布扎比，全球可再生能源推广', impact: 'medium', subKind: 'other' },
  { id: 'r4-io-opec', name: '石油输出国组织（OPEC）', layerId: 'intl_orgs', lng: 16.37, lat: 48.21, note: '维也纳，石油产量协调', impact: 'critical', subKind: 'other' },
  { id: 'r4-io-unfccc', name: 'UNFCCC 秘书处', layerId: 'intl_orgs', lng: 7.12, lat: 50.72, note: '波恩，气候公约/COP 主办协调', impact: 'high', subKind: 'un' },
  { id: 'r4-io-ipcc', name: '政府间气候变化专门委员会（IPCC）', layerId: 'intl_orgs', lng: 7.12, lat: 50.72, note: '日内瓦/波恩，气候科学评估', impact: 'high', subKind: 'un' },
  { id: 'r4-io-unodc', name: '联合国毒罪办（UNODC）', layerId: 'intl_orgs', lng: 16.42, lat: 48.23, note: '维也纳，禁毒/有组织犯罪', impact: 'medium', subKind: 'un' },
  { id: 'r4-io-cern', name: '欧洲核子研究中心（CERN）', layerId: 'intl_orgs', lng: 6.05, lat: 46.23, note: '日内瓦，粒子物理/大型对撞机', impact: 'high', subKind: 'other' },
  { id: 'r4-io-esa', name: '欧洲航天局（ESA）', layerId: 'intl_orgs', lng: 2.35, lat: 48.83, note: '巴黎总部，22 国航天合作', impact: 'high', subKind: 'other' },
  { id: 'r4-io-ifc', name: '国际金融公司（IFC）', layerId: 'intl_orgs', lng: -77.04, lat: 38.9, note: '华盛顿，世行私营部门臂膀', impact: 'medium', subKind: 'finance' },
  { id: 'r4-io-shanghai-coop', name: '上海合作组织（SCO）', layerId: 'intl_orgs', lng: 121.45, lat: 31.23, note: '北京秘书处，欧亚安全/经济', impact: 'medium', subKind: 'other' },
  { id: 'r4-io-brics', name: '金砖国家（BRICS）', layerId: 'intl_orgs', lng: -43.2, lat: -22.9, note: '里约轮值，新兴经济体合作机制', impact: 'medium', subKind: 'other' },
  { id: 'r4-io-wipo-pct', name: '海牙国际法院（ICJ）', layerId: 'intl_orgs', lng: 4.3, lat: 52.08, note: '海牙和平宫，联合国主要司法机关', impact: 'high', subKind: 'un' },
  { id: 'r4-io-interpol', name: '国际刑警组织（INTERPOL）', layerId: 'intl_orgs', lng: 4.86, lat: 45.77, note: '里昂，跨国警务合作', impact: 'medium', subKind: 'other' },
  { id: 'r4-io-who-geneva', name: 'WTO 争端解决（DSB）', layerId: 'intl_orgs', lng: 6.14, lat: 46.23, note: '日内瓦，世贸争端仲裁机制', impact: 'medium', subKind: 'un' },
];

// ───────────────────────────────────────────────────────────────
// power_plants 增密（超大规模风光基地、储能与潮汐）
// ───────────────────────────────────────────────────────────────
export const DENSIFY_POWER_PLANTS_R4: ThematicPoint[] = [
  // ── 中国超大风光基地 ──
  { id: 'r4-pp-qinghai-pv', name: '青海塔拉滩光伏园', layerId: 'power_plants', lng: 100.6, lat: 36.1, note: '海南州，约 16GW 全球最大光伏园区', impact: 'critical', subKind: 'renewable' },
  { id: 'r4-pp-golmud', name: '格尔木风光储基地', layerId: 'power_plants', lng: 94.9, lat: 36.4, note: '青海海西，风光储一体化', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-kubuqi', name: '库布其沙漠光伏基地', layerId: 'power_plants', lng: 108.7, lat: 40.4, note: '内蒙古，沙漠光伏+生态治理', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-tianshan-wind', name: '达坂城风电场', layerId: 'power_plants', lng: 87.7, lat: 43.4, note: '新疆，中国最早大型风电基地', impact: 'medium', subKind: 'renewable' },
  // ── 全球超大光伏/风电 ──
  { id: 'r4-pp-bhadla2', name: 'Bhadla 光伏园（拉贾斯坦）', layerId: 'power_plants', lng: 71.9, lat: 27.5, note: '印度，2.2GW 世界最大光伏园之一', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-northeim', name: '诺尔海上风电群', layerId: 'power_plants', lng: 7.0, lat: 54.5, note: '德国北海，Hornsea 总规划超 4GW', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-gansu-yumen', name: '玉门风电基地', layerId: 'power_plants', lng: 97.6, lat: 39.8, note: '甘肃，千万千瓦级风电走廊', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-macarthur', name: 'Macarthur 风电场', layerId: 'power_plants', lng: 142.1, lat: -38.0, note: '维多利亚州，南半球最大风电场之一', impact: 'medium', subKind: 'renewable' },
  { id: 'r4-pp-roscoe', name: 'Roscoe 风电场', layerId: 'power_plants', lng: -100.5, lat: 32.4, note: '得州，美国大型陆上风电场', impact: 'medium', subKind: 'renewable' },
  { id: 'r4-pp-alta-wind', name: 'Alta 风能中心', layerId: 'power_plants', lng: -118.3, lat: 35.0, note: '加州 Tehachapi，美国最大陆上风电', impact: 'high', subKind: 'renewable' },
  // ── 储能/抽蓄/核电外清洁基载 ──
  { id: 'r4-pp-moss-landing', name: 'Moss Landing 储能', layerId: 'power_plants', lng: -121.26, lat: 36.8, note: '加州，全球最大电池储能（>3GWh）', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-bath-county', name: '巴斯县抽水蓄能', layerId: 'power_plants', lng: -79.8, lat: 38.2, note: '弗吉尼亚，3GW 世界最大抽蓄之一', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-fengning', name: '丰宁抽水蓄能电站', layerId: 'power_plants', lng: 116.6, lat: 41.6, note: '河北，3.6GW 世界最大抽蓄电站', impact: 'critical', subKind: 'renewable' },
  // ── 地热/海洋能补充 ──
  { id: 'r4-pp-larderello', name: '拉尔代雷洛地热田', layerId: 'power_plants', lng: 10.9, lat: 43.25, note: '意大利，世界首座商业地热电站', impact: 'medium', subKind: 'renewable' },
  { id: 'r4-pp-olearth', name: 'Olkaria 地热田', layerId: 'power_plants', lng: 36.3, lat: -0.9, note: '肯尼亚，非洲最大地热区', impact: 'high', subKind: 'renewable' },
  { id: 'r4-pp-meygen', name: 'Meygen 潮汐能', layerId: 'power_plants', lng: -3.08, lat: 58.55, note: '苏格兰彭特兰湾，潮流能示范', impact: 'low', subKind: 'renewable' },
];

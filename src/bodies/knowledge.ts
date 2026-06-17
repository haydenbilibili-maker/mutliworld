/**
 * 天体知识库 — 多天体探索信息增密（第 1 轮）
 *
 * 月球 / 火星的星球百科、天文知识、载人探索、航天博弈与国际合作、实拍影像、相关影视。
 * 内容力求真实、中立并陈各国航天成果；后续轮次持续增密。
 */

export interface BodyFact { label: string; value: string }
export interface GeoFeature { name: string; nameEn: string; type: string; desc: string }
export interface KItem { title: string; desc: string }
export interface MediaLink { title: string; meta?: string; url?: string }

export interface BodyKnowledge {
  facts: BodyFact[];
  geography: GeoFeature[];
  crewed: KItem[];
  rivalry: KItem[];
  cooperation: KItem[];
  photos: MediaLink[];
  films: MediaLink[];
}

export const BODY_KNOWLEDGE: Record<'moon' | 'mars', BodyKnowledge> = {
  moon: {
    facts: [
      { label: '平均半径', value: '1,737.4 km（地球的约 0.27 倍）' },
      { label: '表面重力', value: '1.62 m/s²（地球的约 1/6）' },
      { label: '与地球距离', value: '平均约 38.4 万 km' },
      { label: '自转/公转', value: '潮汐锁定，约 27.3 天（始终同一面朝地球）' },
      { label: '一昼夜', value: '约 29.5 地球日' },
      { label: '表面温度', value: '约 −173 ℃ ~ 127 ℃' },
      { label: '大气', value: '几乎真空（极稀薄外逸层）' },
      { label: '水冰', value: '两极永久阴影坑内确认存在水冰' },
    ],
    geography: [
      { name: '风暴洋', nameEn: 'Oceanus Procellarum', type: '月海', desc: '月球最大的月海，覆盖近月正面西部大片区域。' },
      { name: '静海', nameEn: 'Mare Tranquillitatis', type: '月海', desc: '阿波罗 11 号着陆地，人类首次踏足之处。' },
      { name: '雨海', nameEn: 'Mare Imbrium', type: '撞击盆地', desc: '巨大撞击盆地，嫦娥三号着陆于其西北缘。' },
      { name: '第谷坑', nameEn: 'Tycho', type: '撞击坑', desc: '年轻的显著撞击坑，辐射纹遍布近月面。' },
      { name: '哥白尼坑', nameEn: 'Copernicus', type: '撞击坑', desc: '典型的中央峰复杂撞击坑，月面地标。' },
      { name: '南极-艾特肯盆地', nameEn: 'South Pole–Aitken', type: '撞击盆地', desc: '太阳系已知最大最古老撞击盆地之一；嫦娥六号在此采样月背。' },
      { name: '冯·卡门坑', nameEn: 'Von Kármán', type: '撞击坑', desc: '位于月背，嫦娥四号人类首次月背软着陆地。' },
    ],
    crewed: [
      { title: '阿波罗计划（1969–1972）', desc: '美国 6 次成功载人登月、12 人踏足月面，带回 382 kg 月壤月岩。' },
      { title: '阿尔忒弥斯计划 Artemis', desc: 'NASA 主导重返月球，目标含首位女性与有色人种登月，建月球门户 Gateway 与南极可持续驻留。' },
      { title: '中国载人登月', desc: '计划 2030 年前实现航天员登月；新一代载人飞船、登月着陆器与长征十号研制推进中。' },
      { title: '国际月球科研站 ILRS', desc: '中俄牵头倡议，规划月球长期科研基地，多国参与。' },
    ],
    rivalry: [
      { title: '两套月球秩序框架', desc: '美国《阿尔忒弥斯协定》与中俄国际月球科研站 ILRS 并行推进，吸引不同国家参与。' },
      { title: '南极水冰争夺', desc: '月球南极永久阴影区水冰是可持续驻留与推进剂来源，成为各方着陆点选择焦点。' },
      { title: '嫦娥工程稳步推进', desc: '嫦娥三/四/五/六号连续突破软着陆、月背着陆、采样返回、月背采样返回。' },
    ],
    cooperation: [
      { title: '阿尔忒弥斯协定签署国', desc: '数十个国家签署，确立和平探索、透明、可互操作等原则。' },
      { title: '样品与数据共享', desc: '阿波罗月壤曾分发各国研究；嫦娥五号月壤亦开放国际申请研究。' },
      { title: '多国载荷搭载', desc: '嫦娥/阿尔忒弥斯任务搭载多国科学载荷，体现有限合作。' },
    ],
    photos: [
      { title: 'NASA · 月球勘测轨道器 LRO 影像', meta: '高分辨率全月影像', url: 'https://www.nasa.gov/mission/lunar-reconnaissance-orbiter/' },
      { title: 'NASA · 阿波罗影像档案', meta: '历次登月实拍', url: 'https://www.nasa.gov/mission/apollo-11/' },
      { title: 'CNSA · 嫦娥工程影像', meta: '嫦娥/玉兔实拍', url: 'https://www.cnsa.gov.cn/' },
    ],
    films: [
      { title: '阿波罗 13 号', meta: '1995 · 真实救援改编' },
      { title: '登月第一人 First Man', meta: '2018 · 阿姆斯特朗传记' },
      { title: '为全人类 For All Mankind', meta: '剧集 · 架空登月竞赛' },
      { title: '2001 太空漫游', meta: '1968 · 科幻经典' },
      { title: '月球 Moon', meta: '2009 · 月球基地科幻' },
    ],
  },
  mars: {
    facts: [
      { label: '平均半径', value: '3,389.5 km（地球的约 0.53 倍）' },
      { label: '表面重力', value: '3.72 m/s²（地球的约 0.38 倍）' },
      { label: '一火星日 Sol', value: '24 小时 37 分' },
      { label: '一火星年', value: '约 687 地球日' },
      { label: '表面温度', value: '约 −125 ℃ ~ 20 ℃' },
      { label: '大气', value: '稀薄，约 95% CO₂，气压约地球 0.6%' },
      { label: '卫星', value: '火卫一 Phobos、火卫二 Deimos' },
      { label: '水', value: '极冠与地下存在大量水冰；古代曾有液态水' },
    ],
    geography: [
      { name: '奥林匹斯山', nameEn: 'Olympus Mons', type: '盾状火山', desc: '太阳系已知最高火山，高约 22 km，底径约 600 km。' },
      { name: '水手谷', nameEn: 'Valles Marineris', type: '峡谷系', desc: '太阳系最大峡谷系，长约 4,000 km、深达 7 km。' },
      { name: '塔尔西斯火山群', nameEn: 'Tharsis', type: '火山高原', desc: '巨型火山隆起区，含三座排列的盾状火山。' },
      { name: '盖尔坑', nameEn: 'Gale', type: '撞击坑', desc: '含夏普山层状沉积；好奇号探测古代宜居环境。' },
      { name: '杰泽罗坑', nameEn: 'Jezero', type: '古湖三角洲', desc: '古代河流三角洲，毅力号在此采样、寻找古生命迹象。' },
      { name: '乌托邦平原', nameEn: 'Utopia Planitia', type: '平原', desc: '巨大撞击平原，地下富含水冰；祝融号着陆区。' },
      { name: '极冠', nameEn: 'Polar Caps', type: '极地冰盖', desc: '由干冰与水冰组成，随季节消长。' },
    ],
    crewed: [
      { title: 'NASA 载人火星设想', desc: '以「月球到火星 Moon to Mars」路线，经阿尔忒弥斯验证，目标 2030s–2040s 载人火星。' },
      { title: 'SpaceX 星舰 Starship', desc: '以可完全重复使用超重型火箭为核心，提出火星货运与殖民长期愿景。' },
      { title: '火星样本取回 MSR', desc: 'NASA 与 ESA 合作，计划取回毅力号采集样本（方案与预算在调整中）。' },
      { title: '中国载人火星（远期）', desc: '在天问系列绕落巡与采样返回基础上，开展载人火星远期论证。' },
    ],
    rivalry: [
      { title: '天问一号一步到位', desc: '中国首次火星任务即实现「绕、落、巡」三合一，祝融号巡视乌托邦平原。' },
      { title: '样本取回竞速', desc: '美欧 MSR 与中国天问三号采样返回计划并行推进，谁先带回火星样本受关注。' },
      { title: '长期主导与追赶', desc: 'NASA 数十年持续在轨与巡视主导；中国后发加速、印度欧空局阿联酋等多方参与。' },
    ],
    cooperation: [
      { title: '国际中继与测控互助', desc: '各国火星轨道器常互为着陆器/巡视器提供数据中继。' },
      { title: 'ESA 多任务参与', desc: '火星快车、TGO 及与 NASA 的 MSR 合作。' },
      { title: '数据公开', desc: 'NASA 巡视器原始影像每日公开；多国共享火星科学数据。' },
    ],
    photos: [
      { title: 'NASA · 毅力号原始影像', meta: '每日更新实拍', url: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/' },
      { title: 'NASA · 好奇号原始影像', meta: '盖尔坑实拍', url: 'https://mars.nasa.gov/msl/multimedia/raw-images/' },
      { title: 'NASA · MRO HiRISE', meta: '高分辨率轨道成像', url: 'https://www.uahirise.org/' },
      { title: 'CNSA · 天问/祝融影像', meta: '乌托邦平原实拍', url: 'https://www.cnsa.gov.cn/' },
    ],
    films: [
      { title: '火星救援 The Martian', meta: '2015 · 硬科幻生存' },
      { title: '火星任务 Mission to Mars', meta: '2000 · 科幻' },
      { title: '红色星球 Red Planet', meta: '2000 · 科幻' },
      { title: '火星时代 MARS', meta: '剧集 · 半纪录科幻' },
      { title: '流浪地球', meta: '2019/2023 · 中国科幻（行星发动机/航天叙事）' },
    ],
  },
};

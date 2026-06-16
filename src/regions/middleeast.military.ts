/**
 * 双方军事实力对比 Mock 数据
 * 伊朗导弹产能与库存消耗预估、以色列防空能力、美国海空军能力等
 */

import type { MideastMilitarySection } from '@/types/middleeast';

export const MIDEAST_MILITARY_SECTIONS: MideastMilitarySection[] = [
  {
    id: 'iran-missiles',
    side: 'iran',
    title: '伊朗导弹生产能力与库存消耗预估',
    summary: '弹道导弹、巡航导弹及无人机产能与冲突中消耗估算',
    updatedAt: '2026-03-03',
    items: [
      { label: '弹道导弹年产能（估算）', value: '约 200–300 枚', sub: '短中程为主，部分可覆盖以色列' },
      { label: '巡航导弹年产能（估算）', value: '约 100–150 枚', sub: '反舰与对地型' },
      { label: '无人机/巡飞弹年产能', value: '数千架级别', sub: '沙赫德等系列' },
      { label: '战前库存估算（弹道导弹）', value: '约 3,000–5,000 枚', sub: '各型短中程' },
      { label: '冲突以来已发射/消耗估算', value: '约 400–600 枚', sub: '含对以、对美军基地及海湾目标' },
      { label: '库存消耗率（估算）', value: '约 10%–15%', sub: '高烈度持续下 2–3 个月可能见底' },
      { label: '主要型号', value: '法塔赫、齐亚姆、埃马德、霍拉姆沙赫尔、苏马尔等', sub: '射程 300–2000 km' },
      { label: '地下/加固阵地', value: '多处地下发射场与机动发射车', sub: '遭打击后仍可补充与转移' },
      { label: '外国技术来源', value: '朝鲜、俄罗斯等历史合作', sub: '零部件与制导技术受限下维持产能' },
    ],
  },
  {
    id: 'israel-airdefense',
    side: 'us_israel',
    title: '以色列防空能力',
    summary: '多层防空体系与拦截表现',
    updatedAt: '2026-03-03',
    items: [
      { label: '铁穹（Iron Dome）', value: '短程火箭/炮弹拦截', sub: '单营约 3–4 套发射器，拦截率声称 90%+，饱和时下降' },
      { label: '大卫投石索（David\'s Sling）', value: '中程弹道导弹与巡航导弹', sub: '与箭式、爱国者构成中层' },
      { label: '箭式（Arrow 2/3）', value: '中远程弹道导弹拦截', sub: '高层拦截，针对伊朗中程弹' },
      { label: '爱国者（PAC-2/GEM）', value: '中程防空与部分弹道目标', sub: '美军提供加强' },
      { label: '本轮冲突拦截率（以方称）', value: '绝大部分来袭被拦截', sub: '部分漏网击中民用与基地' },
      { label: '弹药消耗与补给', value: '拦截弹库存紧张，依赖美国紧急补充', sub: '铁穹拦截弹单价较低但用量大' },
      { label: '激光与定向能试验', value: '铁束（Iron Beam）等正在部署', sub: '应对无人机与火箭饱和攻击' },
      { label: '海上防空', value: '萨尔级舰艇配备巴拉克等', sub: '地中海与红海方向补充岸基' },
    ],
  },
  {
    id: 'us-naval-air',
    side: 'us_israel',
    title: '美国海空军能力（中东部署）',
    summary: '航母、空军基地与主要作战平台',
    updatedAt: '2026-03-03',
    items: [
      { label: '航母战斗群', value: '艾森豪威尔号、福特号等', sub: '东地中海/阿拉伯海，舰载机 F/A-18、F-35C' },
      { label: '中东空军基地', value: '乌代德、阿里·萨利姆、达夫拉、因吉尔利克等', sub: 'F-15E、F-16、F-22、F-35A、B-1' },
      { label: '宙斯盾舰', value: '多艘伯克级前推', sub: '标准-3/6 弹道导弹防御与对空' },
      { label: '战略轰炸机', value: 'B-1 等可前沿轮驻', sub: '防区外打击与反舰' },
      { label: '加油与 ISR', value: 'KC-135/KC-46、U-2、全球鹰', sub: '支撑远程打击与监视' },
      { label: '本轮投入规模（估算）', value: '舰载机与陆基战机数百架次参与', sub: '对伊朗境内目标与防空节点' },
      { label: '伤亡与损失', value: '科威特 F-15E 坠毁、多名人员伤亡', sub: '无人机与导弹威胁持续' },
      { label: '潜艇与水下战力', value: '美潜艇击沉伊朗舰艇（如 Iris Dena）', sub: '印度洋/斯里兰卡附近' },
    ],
  },
  {
    id: 'iran-navy-hormuz',
    side: 'iran',
    title: '伊朗海军与霍尔木兹封锁能力',
    summary: '快艇、水雷、反舰导弹及海峡封锁风险',
    updatedAt: '2026-03-03',
    items: [
      { label: '海军与革命卫队海军', value: '约 80+ 艘快艇、多型护卫舰与潜艇', sub: '阿巴斯港、恰巴哈尔、布什尔等基地' },
      { label: '反舰导弹', value: '努尔、卡德尔、霍韦伊泽等', sub: '射程 100–300 km，可覆盖海峡与阿曼湾' },
      { label: '水雷与不对称手段', value: '可布设水雷、快艇群狼战术', sub: '海峡最窄处约 33 km，易受封锁' },
      { label: '本轮冲突中表现', value: '富查伊拉等港口遭袭、海峡过境量下降', sub: '美伊互相指责对方袭击商船与油港' },
      { label: '封锁风险对全球油运影响', value: '约 20% 全球石油经霍尔木兹', sub: '长期封锁将推高油价并迫使改道好望角' },
    ],
  },
  {
    id: 'proxy-hezbollah-houthi',
    side: 'iran',
    title: '真主党与地区代理人武装',
    summary: '黎巴嫩真主党、也门胡塞、伊拉克民兵等',
    updatedAt: '2026-03-03',
    items: [
      { label: '黎巴嫩真主党', value: '约 1.5 万枚火箭/导弹、反坦克与无人机', sub: '哈梅内伊身亡后宣布报复，对以北部与基地持续打击' },
      { label: '也门胡塞武装', value: '弹道导弹、无人机、反舰导弹', sub: '红海与亚丁湾袭船，声援伊朗' },
      { label: '伊拉克伊斯兰抵抗组织', value: '多支民兵，火箭与无人机袭美军基地', sub: '阿萨德、坦夫等基地遭袭' },
      { label: '叙利亚 IRGC 与盟军', value: 'T-4、伊玛目阿里等基地', sub: '多次遭以军空袭，仍维持存在' },
      { label: '协调与指挥', value: '圣城旅与革命卫队境外分支协调', sub: '领袖空缺后萨拉米、卡尼等强化代理人行动' },
      { label: '叙利亚政府军与俄驻军', value: '叙政府军配合 IRGC，俄军在赫梅明等', sub: '以军多次打击 T-4 与叙东部' },
      { label: '也门战局与红海', value: '胡塞控制萨那与红海沿岸', sub: '反舰导弹与无人机袭商船，美英护航' },
    ],
  },
]

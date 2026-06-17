import { person } from './helpers';

const SINGAPORE = [103.85, 1.35] as const;
const BANGKOK = [100.50, 13.75] as const;
const JAKARTA = [106.85, -6.21] as const;
const MANILA = [120.98, 14.60] as const;
const HANOI = [105.85, 21.03] as const;
const KUALA = [101.69, 3.14] as const;

/** 东南亚区域人物 */
export const SOUTHEAST_ASIA_PERSONS = [
  person('per-sea-1', '普拉博沃·苏比安托', '印尼总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '东盟最大经济体领导人，延续不结盟外交。', { since: 2024 }),
  person('per-sea-2', '小马科斯', '菲律宾总统', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '菲律宾领导人，强化美菲同盟与南海维权。', { since: 2022 }),
  person('per-sea-3', '洪玛奈', '柬埔寨首相', '政治', ['southeast_asia'], 104.92, 11.56, '柬埔寨领导人，与中国在基建与军事上合作密切。', { since: 2023 }),
  person('per-sea-4', '通伦·西苏里', '老挝国家主席', '政治', ['southeast_asia'], 102.63, 17.98, '老挝最高领导人，参与中老铁路与区域一体化。', { since: 2021 }),
  person('per-sea-5', '范明政', '越南总理', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南政府首脑，推动制造业外资与供应链转移。', { since: 2021 }),
  person('per-sea-6', '阮富仲', '越共中央总书记', '政治', ['southeast_asia'], HANOI[0], HANOI[1], '越南最高政治领导人，2024 年病逝。', { status: 'deceased' }),
  person('per-sea-7', '李显龙', '新加坡前总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '长期执政者，2024 年交棒，奠定新加坡枢纽地位。', { status: 'restricted' }),
  person('per-sea-8', '黄循财', '新加坡总理', '政治', ['southeast_asia'], SINGAPORE[0], SINGAPORE[1], '新加坡第四任总理，延续务实外交与金融中心战略。', { since: 2024 }),
  person('per-sea-9', '赛塔·他威信', '泰国前总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '2024 年被宪法法院解职，泰国政局动荡象征。', { status: 'restricted' }),
  person('per-sea-10', '佩通坦·钦那瓦', '泰国总理', '政治', ['southeast_asia'], BANGKOK[0], BANGKOK[1], '他信之女，2024 年出任总理，面临军方与王室平衡。', { since: 2024 }),
  person('per-sea-11', '安瓦尔·易卜拉欣', '马来西亚总理', '政治', ['southeast_asia'], KUALA[0], KUALA[1], '团结政府领袖，推动多元种族治理与对华经贸。', { since: 2022 }),
  person('per-sea-12', '东姑·伊斯梅尔', '马来西亚国防部长', '军事', ['southeast_asia'], KUALA[0], KUALA[1], '负责南海方向军事合作与装备采购。'),
  person('per-sea-13', '佐科·维多多', '印尼前总统', '政治', ['southeast_asia'], JAKARTA[0], JAKARTA[1], '任内推动新首都建设与镍矿下游化。', { status: 'restricted' }),
  person('per-sea-14', '米歇尔·乔科诺', '菲律宾外长', '政治', ['southeast_asia'], MANILA[0], MANILA[1], '负责南海仲裁与对美安全合作外交。'),
];

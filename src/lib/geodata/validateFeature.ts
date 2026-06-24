/**
 * 地图要素真实性校验 — OmniLens 数据真实性政策
 *
 * r10/r4 批量增密数据必须通过语义一致性检查方可上图，杜绝「随机模板拼接」造成的
 * 内陆城市+海上事件、外交标题+军事图层、标题与摘要语义冲突等幻觉条目。
 * 示意/汇总类 batch 记录须含公开资料汇总免责声明；校验失败记录在构建阶段过滤并计数。
 */

import type { GeoJSONFeature } from '@/types/geo';

export const BATCH_DISCLAIMER = '公开资料汇总·示意坐标·非实时情报';

/** 内陆城市 — 禁止出现海上/海事类事件标题或摘要 */
export const INLAND_CITY_BLOCKLIST = new Set([
  '北京', '成都', '武汉', '重庆', '西安', '合肥', '郑州',
  '柏林', '莫斯科', '马德里', '布拉格', '维也纳', '布达佩斯',
  '华沙', '基辅', '明斯克', '乌兰巴托', '加德满都', '伊斯兰堡', '喀布尔',
  '新德里', '班加罗尔', '海得拉巴', '丹佛', '芝加哥', '达拉斯', '亚特兰大',
  '凤凰城', '蒙特利尔', '卡尔加里', '墨西哥城', '圣保罗', '波哥大',
  '河内', '万象', '塔什干', '阿拉木图', '金沙萨', '卢萨卡', '内罗毕',
  '约翰内斯堡', '亚的斯亚贝巴', '喀土穆', '华盛顿',
]);

/** 标题/摘要中的海事语义关键词 */
export const MARITIME_KEYWORDS = [
  '海上', '海事', '海域', '航道', '护航', '舰艇', '海军', '舰队', '海警', '海缆',
];

/** 标题事件类型 → incident etype 映射 */
const TITLE_ETYPE_MAP: Record<string, string> = {
  军事: 'military',
  外交: 'diplomatic',
  政治: 'political',
  海上: 'military',
  边境: 'military',
};

/** 外交类摘要不应含军事/海事动作词 */
const DIPLOMATIC_INCOMPATIBLE_DESC = ['交火', '演习公告', '护航', '舰队', '炮击'];

/** 军事/海上类摘要不应以纯外交措辞为主（仅谈判/制裁在外交标题下才合理） */
const MILITARY_INCOMPATIBLE_WITH_DIPLOMATIC_TITLE = ['护航行动', '交火报告', '演习公告'];

const BATCH_ID_RE = /^r10|^r4(cn|me|ap|na|la|sea|we|ee|gl)/;

const DISCLAIMER_MARKERS = ['公开资料汇总', '示意坐标', '非实时情报', '公开态势整理'];

export interface FeatureValidationResult {
  valid: boolean;
  reason?: string;
}

export interface FilterValidFeaturesResult {
  features: GeoJSONFeature[];
  filteredCount: number;
  reasons: Record<string, number>;
}

function extractCityFromTitle(title: string): string | null {
  const sep = title.indexOf(' · ');
  if (sep <= 0) return null;
  return title.slice(0, sep).trim();
}

function extractTitleEventKind(title: string): string | null {
  for (const keyword of Object.keys(TITLE_ETYPE_MAP)) {
    if (title.includes(`${keyword}事件`)) return keyword;
  }
  return null;
}

function hasMaritimeSemantics(title: string, description: string): boolean {
  const combined = `${title} ${description}`;
  return MARITIME_KEYWORDS.some((k) => combined.includes(k));
}

function hasBatchDisclaimer(props: Record<string, unknown>): boolean {
  const text = [props.source, props.description, props.note].filter(Boolean).join(' ');
  return DISCLAIMER_MARKERS.some((m) => text.includes(m));
}

function isBatchGeneratedId(id: string): boolean {
  return BATCH_ID_RE.test(id);
}

/**
 * 校验单个 GeoJSON 点/线要素是否可安全展示（语义一致、非幻觉拼接）
 */
export function validateFeature(feature: GeoJSONFeature): FeatureValidationResult {
  const props = feature.properties ?? {};
  const id = String(props.id ?? '');
  const title = String(props.title ?? '');
  const description = String(props.description ?? props.note ?? '');
  const layerId = String(props.layerId ?? props.category ?? '');
  const etype = String(props.etype ?? '');
  const category = String(props.category ?? '');

  if (!title) {
    return { valid: false, reason: 'missing_title' };
  }

  const city = extractCityFromTitle(title);

  // 内陆城市 + 海事语义
  if (city && INLAND_CITY_BLOCKLIST.has(city) && hasMaritimeSemantics(title, description)) {
    return { valid: false, reason: 'inland_maritime_mismatch' };
  }

  // 标题事件类型 vs etype（incident 时间线）
  const titleKind = extractTitleEventKind(title);
  if (titleKind && etype) {
    const expectedEtype = TITLE_ETYPE_MAP[titleKind];
    if (expectedEtype && etype !== expectedEtype) {
      return { valid: false, reason: 'title_etype_mismatch' };
    }
  }

  // 外交标题不应映射到军事图层
  if (titleKind === '外交') {
    if (layerId === 'military' || category === 'military' || etype === 'military') {
      return { valid: false, reason: 'diplomatic_on_military_layer' };
    }
    if (MILITARY_INCOMPATIBLE_WITH_DIPLOMATIC_TITLE.some((k) => description.includes(k))) {
      return { valid: false, reason: 'diplomatic_desc_mismatch' };
    }
  }

  // 外交 etype 摘要不应含军事/海事动作
  if (etype === 'diplomatic') {
    if (DIPLOMATIC_INCOMPATIBLE_DESC.some((k) => description.includes(k))) {
      return { valid: false, reason: 'diplomatic_desc_mismatch' };
    }
    if (layerId === 'military') {
      return { valid: false, reason: 'diplomatic_on_military_layer' };
    }
  }

  // 海上标题必须含海事相关摘要（非外交/政治措辞硬套）
  if (titleKind === '海上') {
    const maritimeDescOk = ['护航', '巡逻', '舰队', '演习', '海域', '舰', '海军', '海事'].some(
      (k) => description.includes(k),
    );
    if (!maritimeDescOk) {
      return { valid: false, reason: 'maritime_desc_mismatch' };
    }
  }

  // category/layer 一致性：maritime 图层不应落在内陆城市点上（无真实水道上下文）
  if ((category === 'maritime' || layerId === 'maritime') && city && INLAND_CITY_BLOCKLIST.has(city)) {
    return { valid: false, reason: 'inland_maritime_category' };
  }

  // batch 生成记录须含免责声明
  if (isBatchGeneratedId(id) && !hasBatchDisclaimer(props)) {
    return { valid: false, reason: 'missing_batch_disclaimer' };
  }

  return { valid: true };
}

/** 过滤无效要素并汇总剔除原因（构建阶段调用） */
export function filterValidFeatures(features: GeoJSONFeature[]): FilterValidFeaturesResult {
  const valid: GeoJSONFeature[] = [];
  const reasons: Record<string, number> = {};

  for (const f of features) {
    const result = validateFeature(f);
    if (result.valid) {
      valid.push(f);
    } else {
      const key = result.reason ?? 'unknown';
      reasons[key] = (reasons[key] ?? 0) + 1;
    }
  }

  return {
    features: valid,
    filteredCount: features.length - valid.length,
    reasons,
  };
}

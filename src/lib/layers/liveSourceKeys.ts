import type { LayerId } from '@/types/geo';
import { LIVE_API_LAYER_IDS } from './liveApiLayers';

/**
 * 实时数据源鉴权方式分类：无 Key / 免费 Key / 付费 Key。
 *
 * 此注册表集中声明每个实时数据源的鉴权要求，取代此前散落在各 API 路由里
 * 对 env 的隐式判断（`noKey`、`reason: 'no_key'`、模拟降级等）。
 * 前端徽标、admin 探针与 README 文档均以本表为准。
 *
 * 注意：sourceId 涵盖实时地图图层源（与 LiveSourceProbe.id 对齐），
 * 也包含非地图的数据源（如 'llm-deepseek' 的简报能力），后者通过
 * getKeyInfoBySource(sourceId) 查询，不进入 keyBadgeForLayer(LayerId)。
 */

/** 实时数据源对 Key 的要求 */
export type KeyRequirement = 'none' | 'free_key' | 'paid_key';

export interface LiveSourceKeyInfo {
  /** 与 LiveSourceProbe.id 对齐的数据源标识 */
  sourceId: string;
  /** 该数据源所服务的图层（非地图源可为空数组，如 AI 简报） */
  layerIds: LayerId[];
  /** 鉴权方式 */
  keyRequirement: KeyRequirement;
  /** 需要的 env 变量名；无 Key 时为 null */
  envVar: string | null;
  /** 该数据源「按定义理论上可用」（none 恒为 true） */
  hasKey: boolean;
}

/**
 * 实时数据源 → Key 需求映射（基于 README 与各 route 探明的鉴权方式）
 *
 * 分类依据：
 *  - `none`：公开免鉴权 API，零配置可用（Open-Meteo / adsb.lol / CelesTrak / pizzint）
 *  - `free_key`：需申请免费 Key，缺失则降级（空数据/模拟/规则兜底）
 *  - `paid_key`：需付费 Key（本项目当前无此类）
 *
 * 注：`hasKey` 是静态声明（true 表示按定义「该数据源理论上可用」）。
 * 实际运行时配置态由 admin 探针（probeLiveSources）在服务端读取 env 后覆盖。
 */
export const LIVE_SOURCE_KEY_INFO: LiveSourceKeyInfo[] = [
  // ── 无 Key（零配置可用） ──
  { sourceId: 'adsb', layerIds: ['live_flights'], keyRequirement: 'none', envVar: null, hasKey: true },
  { sourceId: 'open-meteo', layerIds: ['live_weather'], keyRequirement: 'none', envVar: null, hasKey: true },
  { sourceId: 'rainviewer', layerIds: ['live_weather'], keyRequirement: 'none', envVar: null, hasKey: true },
  { sourceId: 'celestrak-tle', layerIds: ['space_stations', 'satellites', 'space_debris'], keyRequirement: 'none', envVar: null, hasKey: true },
  { sourceId: 'pizzint', layerIds: ['pizza_index'], keyRequirement: 'none', envVar: null, hasKey: true },

  // ── 免费 Key（缺失则降级） ──
  { sourceId: 'firms', layerIds: ['live_fires'], keyRequirement: 'free_key', envVar: 'FIRMS_MAP_KEY', hasKey: true },
  { sourceId: 'aisstream', layerIds: ['live_maritime'], keyRequirement: 'free_key', envVar: 'AISSTREAM_API_KEY', hasKey: true },
  // AI 简报非地图图层，layerIds 为空；仅经 getKeyInfoBySource('llm-deepseek') 供 admin 探针查询
  { sourceId: 'llm-deepseek', layerIds: [], keyRequirement: 'free_key', envVar: 'LLM_API_KEY', hasKey: true },
];

/** 运行时是否已配置该数据源所需的 env Key（服务端调用） */
export function sourceKeyConfigured(sourceId: string): boolean {
  const info = LIVE_SOURCE_KEY_INFO.find((s) => s.sourceId === sourceId);
  if (!info || info.keyRequirement === 'none' || !info.envVar) return true;
  if (typeof process === 'undefined' || !process.env) return true;
  return Boolean(process.env[info.envVar]);
}

/** 按 sourceId 查询 */
export function getKeyInfoBySource(sourceId: string): LiveSourceKeyInfo | undefined {
  return LIVE_SOURCE_KEY_INFO.find((s) => s.sourceId === sourceId);
}

export interface LayerKeyBadge {
  requirement: KeyRequirement;
  /** 已配置 Key（仅 free_key/paid_key 有意义；none 恒为 true） */
  hasKey: boolean;
  /** env 变量名（用于「未配置」提示） */
  envVar: string | null;
  /** 徽标文案 */
  label: string;
  /** 徽标颜色（tailwind 友好的语义 token） */
  tone: 'green' | 'blue' | 'amber' | 'slate';
}

/**
 * 按图层 ID 查询 Key 徽标信息。
 * 若该图层非实时数据源图层，返回 null。
 *
 * 注意：客户端调用时 hasKey 可能因无 env 访问而恒为 true，
 * 需配合 admin 探针数据修正真实配置态。
 */
export function keyBadgeForLayer(layerId: LayerId): LayerKeyBadge | null {
  // 仅实时地图图层有 Key 需求
  if (!(LIVE_API_LAYER_IDS as readonly string[]).includes(layerId)) {
    return null;
  }

  const info = LIVE_SOURCE_KEY_INFO.find((s) =>
    s.layerIds.includes(layerId),
  );

  if (!info) return null;

  if (info.keyRequirement === 'none') {
    return { requirement: 'none', hasKey: true, envVar: null, label: '免费无Key', tone: 'green' };
  }

  // free_key / paid_key：服务端读取真实配置态；客户端无 env 访问则默认已配置
  const configured = sourceKeyConfigured(info.sourceId);
  if (configured) {
    return {
      requirement: info.keyRequirement,
      hasKey: true,
      envVar: info.envVar,
      label: info.keyRequirement === 'free_key' ? '免费Key' : '付费Key',
      tone: 'blue',
    };
  }

  // 未配置 Key（降级态）
  return {
    requirement: info.keyRequirement,
    hasKey: false,
    envVar: info.envVar,
    label: '未配置Key',
    tone: 'amber',
  };
}

/** 简化判定：是否为免鉴权图层 */
export function isNoKeyLayer(layerId: LayerId): boolean {
  return keyBadgeForLayer(layerId)?.requirement === 'none';
}

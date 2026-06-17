/**
 * 事件—行情关联信号（Wave 4 基础设施）
 *
 * 这是「投资建议 / 政策预估」等上层模块的底座：把统一真实事件流与真实能源经济序列
 * 做透明、可溯源的关联观测。原则——只陈述「已观测到的真实关联」，不做编造预测；
 * 每条信号都引用真实事件与真实序列，并给出可核对的依据。
 */

import type { LiveEventCategory } from '@/types/liveEvent';
import type { EconCategory } from '@/types/econ';

/** 信号类型 */
export type SignalKind =
  | 'energy_shock' // 能源冲击：地缘/灾害事件 ↔ 原油/天然气价格异动
  | 'supply_chain' // 供应链扰动：灾害/地震 ↔ 能源实物/股指
  | 'macro_risk' // 宏观风险：收益率曲线倒挂 / 通胀 / 失业
  | 'risk_off'; // 避险情绪：VIX 抬升

/** 置信层级（基于证据强度，非概率预测） */
export type SignalTier = 'observed' | 'emerging' | 'watch';

/** 关联引擎输入引用 */
export interface SignalRef {
  /** 关联到的真实事件 id（来自 /api/events） */
  eventIds: string[];
  /** 关联到的真实序列 id（来自 /api/econ） */
  seriesIds: string[];
}

/** 一条关联信号 */
export interface CorrelationSignal {
  id: string;
  kind: SignalKind;
  tier: SignalTier;
  title: string;
  /** 透明依据：陈述观测到的真实数据关系（含具体数值/变动） */
  rationale: string;
  refs: SignalRef;
  /** 涉及的事件分类 */
  eventCategories: LiveEventCategory[];
  /** 涉及的经济分类 */
  econCategories: EconCategory[];
  /** 主导量化幅度（如相关序列变动 %），无则 null */
  magnitude: number | null;
  asOf: string;
}

export interface InsightsResponse {
  signals: CorrelationSignal[];
  /** 引擎说明 */
  disclaimer: string;
  generatedAt: string;
  count: number;
}

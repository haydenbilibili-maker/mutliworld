/**
 * 能源经济 — 统一真实数据类型（Wave 4 重构）
 *
 * 全部来自真实公开 API：FRED(美联储)、EIA(美国能源署)、World Bank、Stooq。
 * 不含预测/示例/估算；缺源时优雅降级并在 degraded 标记，绝不以假值填充。
 * 为后续「投资建议 / 政策预估」模块提供结构化时间序列底座。
 */

/** 数据分类 */
export type EconCategory =
  | 'commodity' // 大宗商品价格（原油/天然气/金属）
  | 'energy_supply' // 能源实物供需（库存/产量/电力）
  | 'macro' // 宏观经济指标（GDP/CPI/失业率）
  | 'rate' // 利率与金融条件（国债收益率/利差/VIX）
  | 'index' // 股市指数
  | 'fx' // 外汇
  | 'crypto'; // 加密资产

/** 数据提供方 */
export type EconProvider = 'FRED' | 'EIA' | 'WorldBank' | 'Stooq' | 'Frankfurter' | 'CoinGecko';

/** 时间序列点 */
export interface SeriesPoint {
  /** ISO 日期 YYYY-MM-DD 或完整时间戳 */
  date: string;
  value: number;
}

/** 统一经济序列（含最新值与变动，附带历史点用于走势/sparkline） */
export interface EconSeries {
  id: string;
  /** 中文展示名 */
  label: string;
  category: EconCategory;
  provider: EconProvider;
  /** 计量单位（美元/桶、%、点 等） */
  unit: string;
  /** 升序时间序列（最早→最新） */
  points: SeriesPoint[];
  /** 最新值 */
  latest: number;
  /** 较上一观测的绝对变动 */
  change: number | null;
  /** 较上一观测的百分比变动 */
  changePercent: number | null;
  /** 最新观测日期 */
  asOf: string;
  /** 数据来源链接（可点击溯源） */
  sourceUrl: string;
  /** 国别/地区标签（宏观/股指适用） */
  area?: string;
  /** 简短中文释义 */
  note?: string;
}

/** 降级记录：某真实源不可用时如实告知（缺 Key / 网络 / 解析异常） */
export interface EconDegradation {
  provider: EconProvider;
  reason: 'no_key' | 'fetch_error' | 'empty';
  detail?: string;
}

/** /api/econ 聚合响应 */
export interface EconResponse {
  series: EconSeries[];
  /** 各分类是否有可用真实数据 */
  available: Record<EconCategory, boolean>;
  /** 降级的真实源（绝不以假值替代） */
  degraded: EconDegradation[];
  generatedAt: string;
  count: number;
}

# Wave 4 · 实时事件流 + 能源经济 真实化重构

彻底重构两大模块为「真实 API、非预测/非示例/非估算」，并新增关联引擎为投资建议 / 政策预估模块奠基。

## 一、能源经济真实数据基座

四个真实数据源适配器（`src/lib/datasources/`），缺 Key/源失败时**如实降级、绝不造假**：

| 源 | 内容 | Key | 频率 |
|---|---|---|---|
| **FRED**（美联储） | 布伦特/WTI/天然气、VIX、10Y 收益率、10Y-2Y 利差、联邦基金利率、人民币汇率、CPI、失业率 | `FRED_API_KEY`（免费） | 日/月 |
| **EIA**（美国能源署） | 美国原油库存/产量、天然气库存（能源实物供需） | `EIA_API_KEY`（免费） | 周 |
| **World Bank** | 6 国 GDP 增速 / CPI 通胀 / 失业率 | 无需 | 年 |
| **Stooq** | 标普500/纳指/道指/上证/恒生/日经/DAX 真实日收盘 | 无需 | 日 |

- 统一类型 `src/types/econ.ts`（`EconSeries` 含历史点、最新值、涨跌、来源链、降级记录）。
- 聚合 `src/lib/econ/aggregate.ts` → `/api/econ`（CDN 10 分钟）。
- `useEcon` + `EnergyEconPanel`（分类标签 / 迷你走势 sparkline / 涨跌 / 来源溯源 / 降级提示）。
- **股指种子+抖动 → Stooq 真实**：`src/lib/markets/stock-indices.ts` 重写；admin 统计同步改引用。

## 二、统一真实事件管道

四个真实事件源（`src/lib/events/sources.ts`）规范化为统一 `LiveEvent`：

- **USGS** 地震（M4.5+，含坐标/震级）
- **GDACS** 全球灾害预警（RSS，含坐标/预警等级）
- **ReliefWeb**（OCHA）人道危机
- **GDELT 2.0 DOC** 地缘/冲突新闻（24h）

- 聚合 `src/lib/events/aggregate.ts`（去重 / 按时排序 / `providerCounts` 如实反映各源贡献）→ `/api/events`。
- `useLiveEvents` + 重构后的 `LiveEventFeed`：分类筛选、点击地图联动（带坐标事件飞行定位）、原文溯源；**剔除全部种子**。

## 三、关联引擎（投资 / 政策模块底座）

`src/lib/correlation/engine.ts` 纯函数 `deriveSignals(events, series)`，把真实事件 × 真实序列做**透明、可溯源的关联观测**（只陈述已观测关系，不编造预测）：

1. **能源冲击** — 地缘事件(含能源关键词) ↔ 原油价格异动(≥2%)
2. **供应链扰动** — 高烈度灾害/地震 ↔ 股指/能源实物
3. **宏观风险** — 10Y-2Y 收益率曲线倒挂
4. **避险升温** — VIX ≥ 20

- 类型 `src/types/correlation.ts`（信号引用真实事件 id 与序列 id，含量化幅度与置信层级）。
- `/api/insights`（聚合 econ × events → 信号）+ `useInsights` + `InsightsPanel`。
- 每条信号附依据数值与关联计数，便于上层模块核对、扩展。**非投资建议、非预测。**

## 待办（用户侧）

1. 申请并配置 `FRED_API_KEY`（https://fredaccount.stlouisfed.org/apikeys）、`EIA_API_KEY`（https://www.eia.gov/opendata/register.php），均为服务端变量（勿加 `NEXT_PUBLIC_`）。
2. Vercel → Settings → Environment Variables 添加后重新部署。未配置时 World Bank/Stooq 仍提供真实数据，FRED/EIA 序列优雅缺省。

## 验证

`npx tsc --noEmit` → 0 源码错误。建议大版本封板前由 Turing 用 Codex 异源复核回归。

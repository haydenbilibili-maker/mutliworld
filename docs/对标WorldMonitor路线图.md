# Multi World 对标 World Monitor · 多轮路线图

> 对标对象：[worldmonitor.app](https://www.worldmonitor.app/)（开源 OSINT 大屏，2M+ 用户，WIRED 报道，AGPL-3.0）
> 原则：**对标功能、自研实现**，不抄 AGPL 代码（避免许可证污染）。
> 生成：2026-06-16

---

## 一、World Monitor 能力清单（对标基线）

| 类别 | World Monitor | Multi World 现状 |
|------|---------------|------------------|
| 地图 | **3D 地球**（globe）+ 平面 | 平面 maplibre + 国界 + 经纬网 |
| 图层 | **56 种**图层 | 11 种（conflicts/military/…）✅ 命名已对齐 |
| 实时数据 | ACLED/UCDP 冲突、USGS 地震、NASA FIRMS 火点、OpenSky 飞机、AISStream 船舶、FRED/IMF/BIS 宏观 | 静态/种子 dataset + /api/geodata 管线（已有缓存机制）|
| 新闻 | **500+ RSS** 聚合 | 社媒面板（静态）+ 跑马灯 ✅ |
| 市场 | 全球市场/央行/外汇/加密 | 能源油价（中东）|
| 追踪 | 飞机 + 船舶 + 地震 + 火点 + 停电 + 抗议 | 设施/事件点（静态）|
| AI | **AI 国家简报** + Pro 分析师 + MCP | 区域简报（规则化合成）✅ R1 |
| 区域/搜索 | 国家详情、搜索、URL 深链 | 8 区域切换 + URL 状态 ✅ |
| 多变体 | 6 个面板（World/Tech/Finance/Commodity/Happy/Energy）| 单一态势大屏 |

**结论**：Multi World 的**架构骨架与图层命名已对齐** WM，差距主要在 ①真实实时数据源 ②3D 地球 ③数据广度（图层/新闻/市场）。

---

## 二、已对齐 / 已具备（无需追赶）

- 区域模块化 + RegionDataset 通用能力沉淀（新区域即插即用）
- 面板停靠系统（可开关、Tab 化）+ 跑马灯 + 实时事件流 + 数据新鲜度条
- /api/geodata 服务端管线（种子 dataset + 静态缓存合并 + 时间窗过滤）
- URL 深链（lat/lon/zoom/region/timeRange/layers）
- 8 区域真实/种子数据 + 军力/外交/能源/社媒/趋势/简报

---

## 三、多轮路线（按"高价值 + 可行性"排序）

### ✅ Round 1（已完成）：区域 AI 简报
从结构化数据**规则化合成**态势简报（覆盖概览/军力要点/近期动态/外交立场），对标 WM「国家简报」。诚实合成不编造。

### ✅ Round 2（已完成）：真实实时数据源 — USGS 地震
- `src/lib/geodata/usgs.ts`：服务端拉取 USGS M4.5+ 过去一天 GeoJSON（免费无 key），按区域 bounds 过滤、按震级定影响等级，转为平台 feature（layerId `natural`）。
- `/api/geodata`：'natural' 图层激活时拉取并合并；Next fetch 缓存 5 分钟；meta 加 `liveQuakeCount`。
- 中国/全球默认开启 `natural` → **进站即见全球实时地震**，自动流向地图/事件流/跑马灯。

### ✅ Round 3（已完成）：GDACS 全球灾害实时源
- `src/lib/geodata/gdacs.ts`：拉取 GDACS 公开 GeoJSON（免费无 key），覆盖**洪水/热带气旋/火山/干旱/野火**（地震排除，由 USGS 提供）；按 eventid 去重、只取 Point、按 bounds 过滤；alertlevel(Red/Orange/Green)→影响等级。
- `/api/geodata`：与 USGS **并行拉取**（Promise.all）合并入 'natural'；缓存 10 分钟；meta 加 `liveDisasterCount`。
- 现 'natural' 层 = USGS 地震 + GDACS 灾害两个真实实时源。

- **下一实时源候选**：NASA FIRMS 火点（需 MAP_KEY）、OpenSky 飞机（匿名 bbox 可用、限频）。

### Round 3：3D 地球
- 升级 maplibre-gl 4.7 → 5.x，启用 `projection: 'globe'`。
- 风险：major 版本升级 + 与现有地图代码兼容性，需回归测试（建议单独分支）。

### ✅ Round 4（已完成）：RSS 实时新闻聚合
- `src/lib/news/rss.ts`：服务端聚合 BBC World / 半岛 / UN News 公开 RSS（免费无 key），轻量正则解析 item，去重排序，只存标题+链接+来源+时间（尊重版权）。
- `/api/news` + `useNews`（SWR 5 分钟刷新）+ `NewsPanel`（dock「新闻」按钮，默认收起）。
- 服务端抓取（无 CORS），CDN 缓存 5 分钟。对标 WM 的"500+ RSS 新闻流"。

### ✅ Round 5（已完成）：实时市场数据 — 外汇 + 加密
- `src/lib/markets/markets.ts`：服务端聚合**外汇**（Frankfurter / ECB，免费无 key，用近 10 日序列算日涨跌幅）+ **加密**（CoinGecko，含 24h 涨跌）。两源 `Promise.allSettled` 独立 try/catch，任一失败不影响其余。
- `/api/markets` + `useMarkets`（SWR 2 分钟刷新）+ `MarketsPanel`（dock「市场」按钮，默认收起）：USD 基准主要货币 + BTC/ETH/SOL，涨跌红绿标注，标注"仅供参考非投资建议"。
- 对标 WM 的 Finance 变体——避开了需 key 的 FRED，改用免费无 key 源即时见效。
- **后续可加**：油价/大宗（多数需 key）、央行利率、A股/美股指数。

### ✅ Round 6（已完成）：图层扩展（11 → 14）+ 分组导航
- 新增 3 个**事实型**图层：`aviation` 航空枢纽 / `maritime` 海运要道 / `cables` 海底光缆——均为公开地理事实（非时效、非敏感），不涉编造。
- `src/regions/global.infrastructure.ts`：全球机场/港口与海上咽喉/海缆登陆点档案（霍尔木兹、马六甲、苏伊士、马赛、亚历山大走廊等）；`getGlobalInfrastructureForRegion` 按区域 bounds 过滤后叠加（复用全球核设施同款模式）。
- `buildRegionGeoJSON` 新增 `infraToFeatures`（无时间窗过滤）+ category 映射（airport/strait/cable）。
- `LayerToggle` 重构为**主题分组**（冲突与安全 / 基础设施与通道 / 经济与自然），对标 WM 的归类导航；全球基础设施层 `ALWAYS_ON` 不受区域限制。
- 配色/图标：与 Linus 并行搭建的 `markerStyle.ts`（emoji 雪碧图 + 光晕 + 图例）无缝集成，新层已含图标与图例。
- 补齐此前漏配色的 `sanctions` / `outages`。

### Round 7：AI 简报 LLM 化
- 区域简报从"规则合成"升级为 LLM 生成（可用 askClaude/MCP），但保留来源可核实。

### ✅ Round 8（已完成）：全局搜索 + 区域详情卡
- `src/lib/search/searchIndex.ts`：跨全部已注册区域聚合可定位条目（区域 / 事件 / 冲突 / 设施 + 全球基础设施 + 全球核设施），懒构建一次、同名同坐标去重；`searchEntries(q)` 子串 + 权重排序（区域 > 标题前缀 > 标题含 > 描述含，叠加 impact 加权）。
- `src/components/ui/SearchBox.tsx`：顶部搜索框，下拉结果带类别色点、键盘 ↑↓/Enter/Esc、点击外部关闭；选区域→`setRegion` + 弹详情卡，选点位→飞地图（`setCenter/setZoom`，MapContainer 自动 flyTo）+ 开侧栏。
- `src/store/useRegionDetailStore.ts` + `src/components/region/RegionDetailCard.tsx`：区域画像卡——数据覆盖统计（监测点/冲突/设施/军力/外交/社媒/目标/能源）、默认图层、重点动态（按 impact 排序、可点击飞行）。结构化合成、不编造。
- 对标 WM 的「搜索 + 国家详情」。

---

## 四、风险与边界

- **许可证**：WM 是 AGPL，只对标功能、不复制代码。
- **数据真实性**：实时源带来时效与准确性收益，但需处理限频/key/合规；敏感冲突数据坚持"带来源、标时效、不编造"。
- **3D 升级**：maplibre v5 是 breaking change，单独评估。
- **范围**：WM 6 变体是长期目标；Multi World 先做透"世界态势"单变体。

> 下一步建议：Round 2（USGS 地震实时源）——免费无 key、即时见效、最贴 WM"实时"内核。

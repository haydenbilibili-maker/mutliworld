# PRD · 多天体探索（月球 / 火星）

> 万象幻测 · OmniLens —— 大版本 **v2.0「寰宇·多天体」** 产品需求与分阶段实现方案
> 在「包罗万象、变幻可测」的产品定位下，把态势感知从地球延伸到月球与火星，呈现人类探索痕迹与在轨实时存在。

---

## 1. 愿景与目标

OmniLens 现已覆盖地球的「天 / 地 / 海」三位一体态势。多天体探索把视野扩展到**地外天体**，让用户在同一引擎里在 **地球 → 月球 → 火星** 之间切换，叠加人类历次任务的**真实探索痕迹**与**在轨实时存在**。

核心目标：

- **新增「天体世界」维度**：地图列表（顶部世界/区域切换）新增 **月球** 与 **火星**，切换即换天体底图与专属图层。
- **人类探索痕迹**：月球的阿波罗计划、嫦娥计划、Luna/Surveyor；火星的勇气号/机遇号/好奇号/毅力号/祝融号、各着陆器，均以**真实坐标 + 任务日期 + 机构 + 来源**呈现。
- **在轨实时**：绕月 / 绕火卫星的**真实星下点**（基于权威星历），带历元标注；不编造轨道。
- **零回归**：默认仍为地球；多天体为特性开关，地球体验不受影响。
- **延续诚实原则**：历史痕迹=真实档案；实时=权威星历驱动并标注时效；坐标统一标「示意/选源」，标注来源，不臆造。

非目标（本版不做）：登月/登火的 3D 漫游、实景影像拼接重建、商用售卖天体数据。

---

## 2. 与现有架构的关系

现有两个正交维度：

- **Region**（地球区域）：global / china / asia_pacific / …（`src/regions`，注册表 `registry.ts`）。
- **SpatialTier**（地球三层）：space / surface / subsurface（`src/tiers`）。

新增**第三个正交维度 CelestialBody（天体）**：

```
CelestialBody = 'earth' | 'moon' | 'mars'
```

- `earth`：保持现状（Region × Tier 全功能）。
- `moon` / `mars`：各自拥有**天体底图**与**探索图层集**；不套用地球的 Region/Tier（或仅复用「探索痕迹 / 在轨」两类轻量层）。

切换天体时：换 basemap tiles、换坐标参考系（月面/火面经纬）、换可用图层、换默认视野。地球相关图层与数据**不参与**月/火渲染，反之亦然。

---

## 3. 数据图层清单

### 3.1 月球 🌙

| 图层 | 内容 | 代表条目（真实坐标） | 性质 |
|------|------|------|------|
| `moon_apollo` | 阿波罗载人着陆点 | A11 静海 0.67°N 23.47°E · A12 风暴洋 3.01°S 23.42°W · A14 · A15 哈德利 26.13°N 3.63°E · A16 · A17 陶拉斯-利特罗 20.19°N 30.77°E | 历史痕迹（静态真实） |
| `moon_change` | 中国嫦娥计划 | 嫦娥三号 44.12°N 19.51°W · 嫦娥四号（首次月背）冯·卡门坑 45.45°S 177.6°E · 嫦娥五号 43.06°N 51.92°W · 嫦娥六号（月背采样 2024）南极-艾特肯盆地 | 历史痕迹 |
| `moon_legacy` | 苏美早期探测 | Luna 9/13/16/17/21/24 · Surveyor 1/3/5/6/7 · Chandrayaan-3（南极 2023 69.37°S） · SLIM（日本 2024） | 历史痕迹 |
| `moon_orbiters` | 实时绕月卫星 | LRO · CAPSTONE · Danuri(KPLO) · 鹊桥二号中继 · Chandrayaan-2 轨道器 | 在轨实时（星历驱动） |
| `moon_features` | 地名地貌（可选） | 主要月海 / 大坑 / 极区永久阴影区 | 参考底图标注 |

### 3.2 火星 🔴

| 图层 | 内容 | 代表条目（真实坐标） | 性质 |
|------|------|------|------|
| `mars_rovers` | 巡视器 | 勇气号 Spirit 古谢夫坑 14.57°S 175.47°E · 机遇号 Opportunity 子午高原 1.95°S 354.47°E · 好奇号 Curiosity 盖尔坑 4.59°S 137.44°E · 毅力号 Perseverance 杰泽罗坑 18.44°N 77.45°E · 祝融号 Zhurong 乌托邦平原 25.1°N 109.9°E | 历史/在役痕迹 |
| `mars_landers` | 着陆器 | Viking 1/2 · Pathfinder · Phoenix · InSight · 天问一号着陆平台 | 历史痕迹 |
| `mars_traverse` | 巡视行进轨迹 | 各巡视器已公开的 traverse 路径（折线） | 历史痕迹（静态折线） |
| `mars_orbiters` | 实时绕火卫星 | MRO · MAVEN · Mars Odyssey · Mars Express · ExoMars TGO · 天问一号环绕器 · 希望号(EMM) | 在轨实时（星历驱动） |
| `mars_features` | 地名地貌（可选） | 奥林匹斯山 / 水手谷 / 主要撞击坑 | 参考底图标注 |

> 痕迹条目均含：名称、机构（NASA/CNSA/ISRO/ESA/JAXA）、任务日期、状态（在役/完成/失联）、坐标与来源链接、简介。

---

## 4. 数据来源与合规

### 4.1 真实数据源（优先无 Key / 公开权威）

- **月球底图**：NASA **Moon Trek** WMTS（LRO LROC WAC 全月镶嵌、LOLA 地形）；**OpenPlanetaryMap (OPM)** 月球 XYZ 瓦片；USGS Astrogeology。
- **火星底图**：NASA **Mars Trek**；**OpenPlanetaryMap** 火星底图（MOLA 彩色晕渲、Viking MDIM、CTX 镶嵌）；USGS。
- **探索痕迹坐标**：NASA / CNSA / ISRO / ESA / JAXA 公开任务档案（选源经纬、固定真实）。
- **巡视器行进轨迹**：各任务公开 traverse 数据（如 NASA Analyst's Notebook、HiRISE 标注）。
- **在轨实时星历**：**JPL Horizons** API（提供航天器历元位置/星下经纬）；服务端聚合并缓存，前端按历元插值展示。

### 4.2 合规与诚实原则（延续现有红线）

- **历史痕迹 = 真实档案**：坐标/日期/机构均可溯源；状态客观标注，不渲染主权或竞争叙事。
- **实时 = 权威星历驱动**：星下点来自 Horizons，**标注历元/时效**；无法获取时**留空并提示**，绝不编造轨道或位置。
- **坐标统一标「选源/示意」**，标注参考系（月面 mean-Earth/polar、火面 IAU 2000），附来源链接。
- **中立表述**：多国任务并列呈现，尊重各航天机构成果；中国嫦娥/天问/祝融与各国任务一视同仁、客观并陈。
- **底图版权**：遵循 NASA/USGS/OPM 使用条款并标注来源；商用前复核 ToS。

---

## 5. 交互设计

- **世界切换**：顶部区域切换器升级为「世界 · 区域」两级——先选 🌍地球 / 🌙月球 / 🔴火星；选地球时展开原有区域列表，选月/火时进入该天体视图。
- **天体底图**：切换天体即换 basemap，相机飞至该天体默认视野（如月球正面、火星全球）。
- **痕迹标记**：着陆点/巡视器以机构配色的图标标记；点击弹出信息卡（名称/机构/日期/状态/坐标/来源/简介），并可联动「关联洞察」式的任务时间轴。
- **行进轨迹**：巡视器 traverse 以折线呈现，可高亮起止与里程。
- **在轨实时**：绕月/绕火卫星以星下点标记 + 轨迹弧；标注历元与刷新时间；点击看高度/倾角/任务方简介。
- **底部条复用**：时间范围、图层、视图、搜索沿用现有底部控制条；图层下拉按当前天体动态切换可选项。
- **跨天体联动（增强）**：地球宇宙层的「发射」与月/火任务可关联（发射场→巡航→在轨→着陆），形成探索链路。

---

## 6. 技术架构与扩展点

### 6.1 类型与状态

- `src/types/body.ts`：`CelestialBody`、`BodyModule`（id/name/icon/basemap/center/zoom/layers/sites/defaultLayers）。
- `useMapStore`：新增 `activeBody: CelestialBody` + `setBody()`；切换时重置 center/zoom/activeLayers 为该天体默认（参照现有 `setRegion/setTier` 模式）。
- 新增 `BodyId` 痕迹/图层 id 命名空间（`moon_*` / `mars_*`），与现有 `LayerId` 解耦或扩展。

### 6.2 注册表与数据

- `src/bodies/registry.ts`：`registerBody/getBody/listBodies`（仿 `regions/registry.ts`、`tiers/registry.ts`）。
- `src/bodies/moon.ts`、`src/bodies/mars.ts`：天体定义 + 探索痕迹数据集（静态真实坐标）。
- `src/bodies/sites/*`：阿波罗、嫦娥、巡视器、着陆器等条目（可被管理后台编辑）。

### 6.3 底图

- `src/lib/map/bodyBasemap.ts`：`buildLunarStyle()` / `buildMarsStyle()`，maplibre **raster source** 指向 NASA Trek / OPM XYZ 瓦片；globe 投影复用（视觉为球面，半径仅影响标注密度，不影响可用性）。
- basemap.ts 增加按 `activeBody` 分流：earth 走现有逻辑，moon/mars 走天体样式。

### 6.4 在轨实时（星历）

- `src/lib/ephemeris/horizons.ts`：封装 JPL Horizons 查询（指定航天器 + 历元 → 星下经纬/高度）。
- `src/app/api/horizons/route.ts`：服务端聚合 + 缓存（避 CORS、控配额）；返回各绕月/绕火卫星的当前历元星下点与轨迹采样。
- `useBodyOrbiters` Hook + `BodyOrbiterLayer`：展示星下点与轨迹弧；标注历元。

### 6.5 渲染层

- `src/components/map/body/*`：`BodySiteLayer`（痕迹标记）、`BodyTraverseLayer`（行进折线）、`BodyOrbiterLayer`（在轨星下点），均门控于 `activeBody !== 'earth' && activeLayers.includes(...)`。
- 复用现有 live-layer 模式（source + 圆点/符号层 + style.load 重建 + popup 主题）。

### 6.6 兼容与开关

- 特性开关 `NEXT_PUBLIC_BODIES_ENABLED`（或灰度）；默认地球，月/火渐进开放，**零回归**。

---

## 7. 分阶段实现方案

> 每阶段独立可上线、可回滚；先骨架后填充，先静态痕迹后实时星历。

### Phase 0 · 架构骨架（地基）
- 落地 `CelestialBody` 维度、`useMapStore.activeBody`、`bodies/registry`、世界切换 UI（地球/月球/火星），月/火先用占位底图。默认地球，零回归。
- **验收**：能在三天体间切换、相机飞至默认视野、地球功能不受影响。

### Phase 1 · 月球痕迹（首个地外天体）
- 接入月球真实底图（NASA Trek / OPM）；上 `moon_apollo`（6 点）+ `moon_change`（嫦娥 3/4/5/6）+ `moon_legacy`（Luna/Surveyor/Chandrayaan-3/SLIM）静态痕迹 + 信息卡（坐标/日期/机构/来源）。
- **验收**：月球底图清晰、痕迹点位真实可溯源、信息卡完整、中立并陈。

### Phase 2 · 火星痕迹
- 火星真实底图；`mars_rovers`（勇气/机遇/好奇/毅力/祝融）+ `mars_landers`（Viking/Pathfinder/Phoenix/InSight/天问着陆平台）+ `mars_traverse`（已知行进折线）。
- **验收**：五大巡视器与着陆器真实点位 + traverse 折线 + 信息卡。

### Phase 3 · 在轨实时（星历驱动）
- JPL Horizons 服务端聚合 → `moon_orbiters`（LRO/CAPSTONE/Danuri/鹊桥二号/Chandrayaan-2）、`mars_orbiters`（MRO/MAVEN/Odyssey/Mars Express/TGO/天问环绕器/希望号）星下点 + 轨迹弧，标注历元/时效。
- **验收**：星下点位置随历元更新、来源与时效清晰、缺数据优雅降级不造假。

### Phase 4 · 增强体验
- 巡视器行进动画与里程、任务时间轴联动、MOLA/LOLA 地形晕渲（3D）、巡视器影像/成果外链、跨天体探索链路（地球发射→巡航→在轨→着陆）。

### Phase 5 · 运维与商用
- 管理后台编辑天体痕迹库；性能与瓦片缓存优化；版权/ToS 复核；敏感度评估（多为公开科学数据，敏感度低）。

---

## 8. 风险与依赖

- **天体瓦片可用性/投影**：NASA Trek/OPM 瓦片方案与 maplibre 投影适配需验证（Phase 1 先验证最小可用）。
- **实时星历复杂度**：Horizons 查询/解析与配额、历元插值精度——Phase 3 单独攻坚，前期以静态痕迹先交付价值。
- **坐标参考系一致性**：月面（mean-Earth/polar）与火面（IAU 2000）需统一约定并标注。
- **底图版权**：商用前复核 NASA/USGS/OPM ToS 与署名要求。
- **性能**：天体瓦片与多痕迹/轨迹层的渲染与缓存。

---

## 9. 里程碑与验收总览

| 阶段 | 交付物 | 关键验收 |
|------|--------|----------|
| P0 | 天体维度骨架 + 世界切换 | 三天体切换、零回归 |
| P1 | 月球底图 + 阿波罗/嫦娥/早期痕迹 | 真实点位、信息卡、可溯源 |
| P2 | 火星底图 + 巡视器/着陆器/轨迹 | 五大巡视器 + traverse |
| P3 | 绕月/绕火实时星下点 | 历元标注、缺数据降级不造假 |
| P4 | 动画/时间轴/地形/探索链路 | 体验增强、跨天体联动 |
| P5 | 后台编辑 + 商用合规 | 可维护、ToS 合规 |

---

## 10. 异源验证（项目惯例）

大版本封板由 Turing 用 Codex / 非 Claude 通道复核回归；痕迹坐标抽样核对权威来源；星历结果与官方任务页交叉验证。

> 备注：本 PRD 为设计底稿，落地以各阶段实现说明与 `tsc` 绿为准。坐标示例取自公开任务档案，工程实现时以引用源最终核定。

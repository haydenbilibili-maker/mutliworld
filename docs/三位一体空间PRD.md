# Multi World · 三位一体空间态势 PRD（共创底稿 v0.1）

> 作者：Linus（CTO，Claude 实现）｜共创：Hayden（董事长）、Jobs（CPO）、Bezos（CXO）｜异源验证：Turing（须用 Codex/非 Claude）
> 日期：2026-06-16｜状态：**草案，待共创定稿**
> 原则继承：对标功能自研实现（不抄 AGPL 代码）；敏感军事数据"带来源、标时效、不编造、坐标示意"；新能力优先复用既有抽象（RegionModule / LayerId / markerStyle / GeodataLayer / 搜索 / 面板）。

---

## 1. 背景与愿景

当前 Multi World 已是一张成熟的**地表层**态势大屏：8 区域、~25 图层（实时 USGS/GDACS/RSS + 事实型基础设施/半导体/海外基地/发射场/主题层）、分组图层面板、交互式图例、全局搜索、区域详情卡、市场面板、简报/跑马灯/事件流。

但真实的全球态势是**三维垂直分层**的。同一片地理坐标上，垂直方向叠着三套互相牵动的博弈：

- **🛰 宇宙空间层**：卫星星座、轨道拥堵、反卫星（ASAT）、地面测控站、发射活动——决定通信、导航、侦察与"制天权"。
- **🌍 地表层**（现有）：冲突、军事、经济、能源、灾害、舆情。
- **🌊 地下 / 洋底空间层**：海底光缆、海底管线、潜艇活动、板块/断层与震源深度、深海采矿、海床传感网——"看不见的命脉与暗战"。

**愿景**：把 Multi World 从"地表态势大屏"升维为**全域垂直态势引擎（Vertical Situational Engine）**——用户可在三层之间自由切换/叠加，理解"天—地—海"如何在同一坐标上联动（例：海缆被切 → 地表通信中断 → 卫星链路承压）。这是 World Monitor 等竞品**尚未覆盖**的差异化空间。

---

## 2. 目标与非目标

### 2.1 目标（本 PRD 范围）

1. 建立 **SpatialTier（空间层）** 一级抽象，与现有 RegionId（地理）正交：地理选"在哪"，空间层选"在哪个高度/深度"。
2. 三层各自的**图层清单、数据源、可视化范式、面板**。
3. 三层之间的**联动与跨层视图**（垂直剖面、跨层关联高亮）。
4. 不破坏现有地表层体验：地表层 = 现有全部能力，平滑纳入新框架。
5. 分阶段路线：MVP（数据+切换）→ 增强（动效/剖面）→ 3D（轨道与海床立体）。

### 2.2 非目标（本期不做）

- 不做精确轨道力学预报引擎（用公开 TLE 近似/可视化即可，不自研 SGP4 高精度服务）。
- 不做潜艇实时追踪等敏感军事情报（仅公开、非实时、示意性信息）。
- 不强制上 3D 地球；3D 作为可选演进分支，不阻塞前两层落地。
- 不做付费墙数据源（Space-Track 需账号的部分降级为可选）。

---

## 3. 核心概念：SpatialTier 模型

```
SpatialTier = 'space' | 'surface' | 'subsurface'
```

新增一条与 `RegionId` **正交**的维度。组合语义：`(region, tier)` 共同决定地图取数与渲染。

| 维度 | 取值 | 类比现有 |
|------|------|----------|
| Region（地理范围） | china / middleeast / … | 已有 RegionId |
| **Tier（垂直层）** | **space / surface / subsurface** | **本 PRD 新增** |

### 3.1 每层声明（TierModule，仿 RegionModule）

```ts
interface TierModule {
  id: SpatialTier;
  name: string;            // 宇宙空间 / 地表 / 洋底空间
  icon: string;            // 🛰 / 🌍 / 🌊
  layers: LayerId[];       // 该层可用图层
  defaultLayers: LayerId[];
  basemap: BasemapPreset;  // 该层底图风格（星空 / 国界 / 海床等深线）
  renderMode: 'flat' | 'orbit' | 'depth'; // 渲染范式（见 §5）
  altitudeBand?: [number, number]; // 高度/深度区间（km，正=高空，负=水深）
  note?: string;
}
```

> 设计要点：**Tier 不替换 Region**，而是为同一 Region 提供"换一层看"。切 Tier 时，切换 `layers/basemap/renderMode`，地理视野（center/zoom/bounds）尽量保持，给用户"原地上天/下海"的垂直穿越感。

---

## 4. 三层定义

### 4.1 🛰 宇宙空间层（space）

**核心问题**：谁掌握轨道？哪条链路在头顶？制天权与轨道安全态势如何？

| 图层 | 内容 | 数据源（免费优先） |
|------|------|--------------------|
| `sat_constellations` 卫星星座 | Starlink / OneWeb / GPS / 北斗 / Galileo / GLONASS 等星座规模与覆盖 | CelesTrak TLE（免费）、公开星座资料 |
| `sat_active` 在轨卫星 | LEO/MEO/GEO 代表卫星当前星下点（ground track） | CelesTrak/​N2YO（免费，限频）、Space-Track（需账号，可选） |
| `ground_stations` 测控/地面站 | 主要 TT&C 与信关站（含深空网 DSN） | 公开资料 |
| `launch_sites` 航天发射场 | **已有**——归入本层 | 已有 |
| `space_debris` 轨道碎片/拥堵 | 碎片密集轨道带、近期解体事件 | 公开 OSINT / ESA DISCOS 摘要 |
| `space_events` 空天事件 | ASAT 试验、交会抵近、发射窗口、失效再入 | 新闻 RSS（已有管线）+ 公开记录 |

**可视化范式（renderMode='orbit'）**：
- v1（平面降维）：在现有平面地图上画卫星**星下点 + 地面覆盖圈**，星座用不同颜色，GEO 卫星标在赤道带；发射场/地面站为点。
- v2：时间轴驱动星下点沿 ground track 动起来（复用跑马灯/时间窗机制）。
- v3（3D 分支）：真实轨道环绕 3D 地球（需 maplibre v5 globe 或 three.js 叠加层）。

**面板**：`SpaceBriefingPanel`（头顶过境卫星 Top N、星座规模对比、近期空天事件）。

### 4.2 🌍 地表层（surface）= 现有

直接将现有全部图层归入 surface tier，`renderMode='flat'`，basemap=现有国界+经纬网。**零回归**：不切 Tier 时行为与今天完全一致（surface 为默认 Tier）。

### 4.3 🌊 地下 / 洋底空间层（subsurface）

**核心问题**：看不见的命脉（海缆/管线）与暗战（潜艇/深海争夺）在哪？地下结构如何放大灾害？

| 图层 | 内容 | 数据源 |
|------|------|--------|
| `cables` 海底光缆 | **已有**（登陆点 + 路由线）——本层主角，强化为连续路由 | 已有 + 公开海缆图 |
| `cable_incidents` 海缆中断 | 断缆/疑似破坏事件（红海、波罗的海、台湾海峡近年案例） | 新闻 RSS + 公开通报 |
| `seabed_pipelines` 海底管线 | **复用 pipelines 中的海底段**（北溪/Medgaz 等） | 已有 |
| `tectonics` 板块与断层 | 主要板块边界、活动断层带 | 公开地质数据（USGS/GEM 摘要） |
| `quake_depth` 震源深度 | **复用 USGS 实时地震**，按**深度**着色（浅/中/深源） | 已有 USGS（depth 字段） |
| `deep_sea_mining` 深海采矿 | ISA 勘探合同区（克拉里昂-克利珀顿带等） | 公开 ISA 资料 |
| `submarine_bases` 潜艇基地 | 公开已知的潜艇/海军基地（仅公开、示意） | 公开资料（克制） |
| `bathymetry` 海底地形 | 海沟/洋脊/海台底图 | GEBCO 等深线（免费） |

**可视化范式（renderMode='depth'）**：
- basemap 切换为**海床/等深线**风格（深蓝渐变 + 海沟标注）。
- 点/线按**深度**而非影响着色（新增 depth→色 映射，复用 markerStyle 思路）。
- 海缆/管线作为本层主线要素（已支持 LineString 渲染）。

**面板**：`SeabedBriefingPanel`（区域内海缆条数与断缆事件、最深海沟、ISA 合同区计数、深源地震）。

**⚠ 合规红线**：潜艇活动/部署一律不做实时或推断；仅静态、公开、广为人知的设施，坐标标"示意"，与现有 garrisons 同口径。

---

## 5. 架构设计（嵌入现有体系）

复用为主、新增最小。映射到现有代码：

| 现有机制 | 三层化改造 |
|----------|-----------|
| `RegionModule` 注册表 | 新增**平行的 `TierModule` 注册表**（`src/tiers/`），结构同构 |
| `useMapStore` | 新增 `activeTier: SpatialTier` + `setTier()`；切 Tier 应用该层 layers/basemap/renderMode |
| `LayerId` 联合类型 | 扩充本 PRD 新图层 ID；每个 LayerId 标注所属 tier（`LAYER_TIER: Record<LayerId, SpatialTier>`） |
| `LayerToggle` 分组 | 图层面板按 **Tier → 分组 → 图层** 三级；或随 Tier 切换只显本层图层 |
| `markerStyle.ts` | 新增各新图层的 emoji/halo/legend；新增 **depth 色阶**（洋底层）与 **orbit 色阶**（星座） |
| `GeodataLayer.tsx` | 已支持 point+line；新增**轨道圈/覆盖圈**（circle/line）与**等深底图层**切换 |
| `buildRegionGeoJSON` | 各新图层走既有"全局档案 + bounds 过滤 + toFeatures"模式（同 garrisons/semiconductors） |
| `/api/geodata` | 新增 tier 参数（或按 layers 自动判定）；空间/洋底实时源（TLE、断缆 RSS）走既有 fetch+merge |
| `searchIndex` | 三层要素统一纳入搜索（已验证可扩展，复用 SearchKind） |
| `MapContainer` basemap | 按 renderMode 切换 style（星空 / 国界 / 等深线三套底图预设） |

**关键设计决策：渲染范式**
平面地图（maplibre flat）即可承载三层的 v1/v2（星下点、覆盖圈、海缆、等深线都是 2D 可投影要素）。**3D（真实轨道环绕、海床立体）作为独立演进分支**，不阻塞本 PRD 主体落地。这与既有"3D 地球单独评估"的风险判断一致。

---

## 6. 交互设计

1. **Tier 切换器（TierSwitcher）**：地图一角的垂直三段控件（🛰 上 / 🌍 中 / 🌊 下），点击如"电梯"在三层间穿越；切换有上升/下沉的动效隐喻。
2. **跨层叠加（可选）**：允许"地表 + 洋底"双层叠加（海缆叠在地表上），或"地表 + 头顶卫星"。用透明度区分主/辅层。
3. **垂直剖面视图（Profile，进阶）**：选定一个坐标/走廊，弹出一张"天—地—海"垂直剖面卡：上方过境卫星、地表事件、下方海缆/震源深度——一眼看全三层在该点的叠加态势。这是本 PRD 的**招牌交互**。
4. **跨层关联高亮**：点击一条海缆 → 高亮其登陆城市（地表）→ 提示该区域头顶通信卫星。体现"天地海联动"。
5. 搜索/图例/详情卡：均带 Tier 标识，搜索结果可跨层。

---

## 7. 数据源与合规

| 层 | 免费无 key | 需 key/降级 | 合规要点 |
|----|-----------|------------|----------|
| 空间 | CelesTrak TLE、N2YO（限频）、新闻 RSS | Space-Track（账号） | 卫星为公开编目；ASAT/抵近仅引用公开报道 |
| 地表 | 已有（USGS/GDACS/RSS/Frankfurter…） | FRED（已评估） | 现有口径 |
| 洋底 | GEBCO、USGS depth、ISA 公开区、新闻 RSS | 商业海缆 DB | **潜艇/军事克制**：仅公开静态、示意坐标、不推断部署 |

- **TLE 实时性**：星下点随时间漂移，需服务端定时刷新 + 客户端按当前 UTC 近似传播（v1 可只画"当前快照"，不做连续动画）。
- **异源验证**：空间轨道计算与洋底深度着色等"易出静默错误"的逻辑，由 Turing 用 **Codex/非 Claude** 复核（Claude 不自证）。

---

## 8. 分阶段路线

**Phase 0 · 框架（地基）** ✅ 已落地（2026-06-16）
TierModule 抽象（`src/types/tier.ts` + `src/tiers/`：registry + 三层模块 + LAYER_TIER）+ `useMapStore.activeTier/setTier` + `TierSwitcher`（垂直三段电梯）+ **敏感图层一键下架**（`src/lib/layers/sensitivity.ts` + `hideSensitive`，决策点 #7）。地表层零回归。basemap 三套预设已声明，实际切换留待各层 Phase。
> 决策已定：①先洋底；②宇宙层用 3D（Phase 2/5 分支）；③敏感条目项目自用不设边界，已内置 hideSensitive 一键下架（商用用）。

**Phase 1 · 洋底层** ✅ 已完成（2026-06-16）
海缆/海底管线为主线 + `deep_sea_mining`（ISA 勘探区，结核/硫化物/钴结壳分类）+ `tectonics`（板块边界/断层，汇聚/离散/转换分类）+ `cable_incidents`（红海/波罗的海/台海等公开断缆事件，带日期来源）+ `quake_depth`（复用 USGS 实时地震，按震源深度浅/中/深分带着色）+ `bathymetry`（EMODnet 海床栅格，进入洋底层 tier 自动铺开）。全部挂入 subsurface tier，搜索/图例/图层面板「洋底空间」分组均已接入。
海缆已升级为**连续路由线**（`global.submarineCables.ts` + `cableRoutesToFeatures`，LineString）。
`SeabedBriefingPanel`（洋底专属简报）✅ 已补齐：进入洋底层自动显示，合成海缆登陆/路由数、深海采矿按资源细分、近期断缆事件（可点击飞行）、实时震源深度浅/中/深统计。**洋底层全部图层优化完成。**

**Phase 2 · 空间层 MVP** ✅ 已完成（2026-06-16）
✅ launch_sites 归位 · ✅ `launch_log`（发射任务记录）· ✅ `ground_stations`（深空网/测控站）· ✅ `sat_constellations`（GEO 气象/通信/北斗导航，赤道同步轨道带）· ✅ `space_events`（ASAT/在轨相撞/解体/再入/抵近，公开历史事件带日期来源；ASAT 等列为敏感、可一键下架）· ✅ `SpaceBriefingPanel`（进入宇宙层自动显示：发射场/测控/GEO/发射记录统计 + GEO 分类 + 近期空天事件，敏感下架时隐藏）。
✅ **3D 地球**前向兼容就绪（GlobeController + 星空 + 大气 + 轨道环），升级 `npm i maplibre-gl@^5` 即点亮。
✅ **实时卫星 + 空间站高亮**：`/api/satellites`（wheretheiss.at，免费无 key，缓存 8s）+ `useLiveSatellites`（12s 刷新）+ `LiveSatellitesLayer`（普通卫星圆点 + ISS/天宫 DOM 脉冲标记与标签高亮，点击出实时星下点详情）+ `LiveStationsPanel`（ISS/天宫 实时经纬/高度/速度，进入宇宙层自动显示）。NORAD：ISS 25544 / 天宫天和 48274。
待办（v5 后）：更多 LEO 真实星历（TLE/satellite.js 客户端传播）· 球面下「天—地—海」垂直剖面联动。

**Phase 3 · 实时与动效**
CelesTrak TLE 接入 → 卫星当前星下点；时间轴驱动 ground track。

**Phase 4 · 垂直剖面视图**（招牌）
天—地—海三层剖面卡 + 跨层关联高亮。

**Phase 5 · 3D 分支（可选）**
maplibre v5 globe 或 three.js 叠加：真实轨道环绕 + 海床立体。

> 建议先做 **Phase 0 + Phase 1（洋底）**：洋底层与现有海缆/地震/管线高度复用，落地快、风险低、立刻拉开与竞品差距。

---

## 9. 共创决策点（待 Hayden / Jobs / Bezos 拍板）

1. **落地顺序**：先洋底（复用最多、最快）还是先宇宙（视觉最炫、最具"升维"叙事）？（Linus 建议：先洋底）
2. **渲染范式**：v1 全部用平面地图承载，3D 留作后续分支？还是这次就为空间层直接上 3D（成本/风险显著上升）？
3. **Tier 与 Region 的关系**：切 Tier 时保持当前地理视野（推荐），还是各 Tier 有独立默认视野？
4. **跨层叠加**：是否要"双层同显"（地表+洋底叠加），还是同一时刻只看一层（更干净）？
5. **垂直剖面视图**优先级：作为招牌尽早做，还是后置到 Phase 4？
6. **空间层数据深度**：仅静态星座/覆盖圈即可，还是必须做 TLE 实时星下点（需定时任务+传播计算）？
7. **敏感边界**：潜艇基地、ASAT 这类条目是否纳入？纳入到何种克制程度？（涉及合规与品牌调性）
8. **命名**：三层中文定名——「宇宙空间 / 地表 / 洋底空间」？还是「太空 / 地表 / 深海」等更口语的叫法？

---

## 10. 风险

- **复杂度膨胀**：三层 × 多区域 × 多图层组合爆炸 → 必须靠 TierModule/registry 抽象收敛，避免散落 if/else。
- **数据时效与准确**：轨道/深度等易出静默错误 → 异源（Codex）复核 + 单元测试。
- **性能**：星座点 + 覆盖圈 + 海缆线在低 zoom 可能上万要素 → 需按 zoom/视野裁剪与聚合。
- **3D 升级风险**：maplibre 大版本升级与现有地图代码兼容性 → 单独分支评估，不阻塞主线。
- **合规与调性**：军事/潜艇内容的克制边界需 Hayden 明确，宁可少做不可越界。

---

> **下一步**：请就 §9 决策点逐条给意见（尤其 1/2/7）。定稿后由 Linus 拆 Phase 0 任务卡开工，Turing 用 Codex 异源验证关键计算。

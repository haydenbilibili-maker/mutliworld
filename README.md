# Multi World · 寰宇态势感知平台

> Global Situation Awareness Dashboard —— 一个**三位一体（天 / 地 / 海）**的全球态势实时可视化引擎。
> 在同一张地图上垂直贯通 **🛰 宇宙空间 / 🌍 地表 / 🌊 洋底** 三层，叠加冲突、军事、经济、能源、灾害、舆情、基础设施、卫星与海底命脉，支持 **3D 地球**、实时数据源与「天—地—海垂直剖面」招牌交互。
>
> 对标 [World Monitor](https://www.worldmonitor.app/)（开源 OSINT 大屏，AGPL-3.0）——**对标功能、自研实现**，不复制其代码。

---

## ✨ 核心特性

- **三位一体空间模型**：宇宙 / 地表 / 洋底三层正交于地理区域，一键在三层之间「原地穿越」。
- **3D 地球（maplibre v5 globe）**：进入宇宙层自动球面 + 星空 + 大气辉光 + GEO/LEO 轨道环；地表/洋底走平面。
- **40+ 语义图层**：分主题分组（冲突安全 / 基础设施 / 经济自然 / 社会时空 / 洋底空间 / 宇宙空间），每层独立图标、配色、图例。
- **实时数据源（免费无 key）**：USGS 地震、GDACS 灾害、RSS 新闻、外汇/加密行情、CelesTrak TLE 卫星（SGP4 客户端传播）、ISS/天宫实时星下点。
- **8 大区域模块**：中国 / 中东 / 亚太 / 北美 / 拉美 / 东南亚 / 西欧 / 东欧（俄乌），即插即用、缺字段自动隐藏。
- **招牌交互「天—地—海垂直剖面」**：点击任一坐标，垂直钻取三层最近态势 + 地图跨层连线 + 按真实高度/深度的剖面侧视图。
- **全局搜索 / 区域详情卡 / 交互式图例 / 实时事件流 / 信息流跑马灯 / 区域简报 / 市场面板**。
- **商用合规开关**：敏感图层（军事 / 核 / 海外基地 / ASAT）**一键下架**；坐标统一标注「示意」，敏感冲突数据带来源、标时效、不编造。

---

## 🧱 技术栈

| 领域 | 选型 |
|------|------|
| 框架 | Next.js 14（App Router）+ React 18 + TypeScript（strict） |
| 地图 | MapLibre GL JS **v5**（globe 投影） |
| 状态 | Zustand 5 |
| 数据 | SWR + GeoJSON + 服务端 `/api/*` 路由 |
| 轨道 | satellite.js（SGP4/TLE 传播） |
| 图表 | ECharts 6 |
| 动效/样式 | Framer Motion + Tailwind CSS |

---

## 🛰🌍🌊 三位一体空间模型

`SpatialTier = 'space' | 'surface' | 'subsurface'`，与 `RegionId`（地理）**正交**：地理选"在哪"，空间层选"在哪个高度/深度"。仿区域注册表实现平行的 `TierModule` 注册表（`src/tiers/`）。

| 层 | 渲染 | 代表图层 |
|----|------|---------|
| 🛰 宇宙空间 | 3D 球面（orbit） | 发射场、发射记录、测控站、GEO 卫星带、**实时在轨卫星/空间站(TLE)**、空天事件(ASAT/相撞/解体/再入) |
| 🌍 地表（默认，零回归） | 平面 | 冲突、军事、海外基地、核、制裁、经济、经济中心、矿产、数据中心、半导体、灾害、气象、气候、抗议… |
| 🌊 洋底空间 | 平面 + 海床栅格 | 海底光缆(登陆点+连续路由)、断缆事件、海底管线、板块/断层、震源深度、深海采矿(ISA) |

`LAYER_TIER` 把每个图层映射到所属层；新增图层只需登记一处。

---

## 📡 实时数据源（全部免费、无 key、服务端抓取避 CORS）

| 源 | 用途 | 刷新 |
|----|------|------|
| USGS Earthquakes | 全球地震（`natural`）+ 按震源深度（`quake_depth`） | 5 分钟 |
| GDACS | 洪水/气旋/火山/干旱/野火灾害 | 10 分钟 |
| RSS（BBC/半岛/UN News） | 实时新闻流 | 5 分钟 |
| Frankfurter / CoinGecko | 外汇 / 加密行情 | 2 分钟 |
| CelesTrak TLE + satellite.js | 在轨卫星/碎片 SGP4 星下点 | 本地传播，60s |
| wheretheiss.at | ISS / 天宫实时星下点（备用） | 12s |

实时源遵循「拉取失败 → 优雅降级、不崩」。

---

## 🏗 架构要点

- **RegionModule 注册表**（`src/regions/`）：每区域声明视野/图层/数据集（events / military / energy / facilities / incidents / diplomacy / social / trend…），平台据此自动生成区域切换与面板。
- **TierModule 注册表**（`src/tiers/`）：三层声明各自图层/底图/渲染范式。
- **统一 GeoJSON 管线** `/api/geodata` → `buildRegionGeoJSON`：区域 dataset + 全球档案（核设施/基础设施/半导体/基地/发射场/卫星/板块/海缆…）按区域 bounds 过滤合并，叠加实时源。
- **markerStyle**（`src/lib/geodata/markerStyle.ts`）：单一数据源决定每个 `layerId`/子类的 emoji 图标、光晕色、图例。
- **GeodataLayer**：消费 `/api/geodata`，点（图标+光晕）+ 线（海缆/管线/晨昏线）统一渲染；`GlobeController` 控制球面投影（前向兼容 shim）。
- **全局搜索**（`src/lib/search/searchIndex.ts`）：跨区域 + 全球图层构建索引，子串+权重排序。
- **垂直剖面**（`src/lib/profile/`）：`computeProfileBuckets` 按 `tierForLayer` 分天地海 + 示意高度/深度，供面板侧视图与地图跨层连线共用。

---

## 📁 目录结构

```
src/
  app/
    page.tsx                 # Suspense → HomeDashboard
    api/
      geodata/route.ts       # 统一 GeoJSON（区域+全球档案+实时源）
      news|markets|satellites|orbital-objects/route.ts
    admin/                   # 数据/功能管理页
  components/
    map/                     # MapContainer, GeodataLayer, GlobeController,
                             #   BathymetryLayer, OrbitRings, OrbitalObjectsLayer,
                             #   StarfieldBackdrop, ProfilePicker, CrossLayerLinks …
    region/                  # 各信息面板 + 简报 + 垂直剖面/侧视图
    ui/                      # TierSwitcher, RegionSwitcher, SearchBox,
                             #   LayerToggle, MapLegend, LiveEventFeed …
  regions/                   # 8 区域模块 + 全球事实档案（核/基础设施/半导体/基地/
                             #   发射场/卫星/板块/海缆/深海采矿/空天事件…）
  tiers/                     # 三层 TierModule 注册表 + LAYER_TIER
  store/                     # useMapStore（区域/层/视野/敏感开关/3D），useProfileStore …
  lib/                       # geodata/ search/ profile/ space/ orbital/ layers/ map/ globe/
  hooks/                     # useGeodata, useNews, useMarkets, useLiveSatellites,
                             #   useOrbitalObjects, useSyncStateToUrl …
  types/                     # geo.ts(LayerId), region.ts, tier.ts, orbital.ts
scripts/                     # fetch-geodata.js, fetch-tle.js, fetch-launches.js
data/orbital/                # tle.json（CelesTrak 抓取缓存）
docs/                        # PRD、对标路线图、三位一体 PRD、3D 评估与迁移
```

---

## 🚀 快速开始

```bash
npm install
npm run dev          # http://localhost:3000
```

URL 深链支持 `lat / lon / zoom / view / timeRange / layers` 等查询参数（与 World Monitor 对齐）。

### 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` / `build` / `start` | 开发 / 构建 / 生产 |
| `npm run lint` | ESLint |
| `npm run data:fetch` | 抓取地理实时缓存（可选） |
| `npm run data:tle` | 从 CelesTrak 抓取 TLE 写入 `data/orbital/tle.json`（宇宙层实时卫星） |
| `npm run data:launches` | 抓取发射记录 |

> ⚠ 升级到 maplibre v5 后需**重启 dev server**；无 TLE 缓存时使用种子兜底（ISS/天宫等）。

---

## 🔭 招牌交互：天—地—海垂直剖面

1. 在 `TierSwitcher` 点「📊 天地海垂直剖面」开启。
2. 点击地图任一点（或某条海缆/设施）→ 落点涟漪反馈 + 钻取标记。
3. **地图**：从该点向天/地/海三层各自最近要素连线 + 高亮环（例：点海缆 → 连到登陆城市 → 连到头顶卫星）。
4. **面板**：三层最近态势列表 + **垂直高度侧视图**（GEO 36,000km → ISS → 地表 0 → 海床 → 海沟/震源，按真实示意高度/深度），补足球面看不出的垂直维度。

---

## 🛡 数据伦理与合规

- **敏感图层一键下架**：`hideSensitive` 开启即从地图与数据层隐藏军事/核/海外基地/ASAT 等；自用默认全开，商用一键切换。
- **示意坐标**：聚合类/军事类坐标统一标注「示意」，非精确目标。
- **不编造**：进行中的真实冲突（如俄乌）数据带来源、标时效；结构化简报为"合成不编造"。
- **许可证**：对标 World Monitor（AGPL-3.0）功能，**不复制其代码**。

---

## 📚 文档

| 文档 | 内容 |
|------|------|
| `docs/三位一体空间PRD.md` | 天地海三层产品需求与分阶段路线 |
| `docs/对标WorldMonitor路线图.md` | 对标功能多轮开发记录 |
| `docs/3D地球评估与迁移.md` | maplibre 4→5 升级评估与 3D 启用 |
| `docs/PRD-寰宇态势感知平台.md` | 初版产品需求 |

---

## ✅ 当前状态

三位一体三层数据 + 3D 球面 + 实时卫星(SGP4) + ISS/天宫高亮 + 垂直剖面（含跨层连线与高度侧视图）+ 全局搜索 + 区域详情卡 + 交互式图例 + 市场/简报/事件流面板 —— 均已落地，`maplibre-gl@5.24.0`，`tsc --noEmit` 源码 0 错误。

> 异源验证（Turing/Codex 复核）建议在大版本升级（如 maplibre v5）后跑一轮回归：切层 / 弹窗 / 飞行 / 区域边界 / 球面缩放 / 实时卫星贴球 / 垂直剖面连线。

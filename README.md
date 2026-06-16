# Multi World · 寰宇态势感知平台

> **Global Situation Awareness Dashboard** — 一个**三位一体（天 / 地 / 海）**的全球态势实时可视化引擎。  
> 在同一张地图上垂直贯通 **宇宙空间 / 地表 / 洋底** 三层，叠加冲突、军事、经济、能源、灾害、舆情、基础设施、卫星与海底命脉，支持 **3D 地球**、实时数据源与「天—地—海垂直剖面」交互。

[![GitHub](https://img.shields.io/badge/GitHub-mutliworld-181717?logo=github)](https://github.com/haydenbilibili-maker/mutliworld.git)

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [npm 脚本](#npm-脚本)
- [项目结构](#项目结构)
- [区域与图层](#区域与图层)
- [数据管道](#数据管道)
- [管理后台](#管理后台)
- [宇宙空间层](#宇宙空间层)
- [战略研究半屏面板](#战略研究半屏面板)
- [招牌交互：天地海垂直剖面](#招牌交互天地海垂直剖面)
- [部署说明](#部署说明)
- [数据伦理与合规](#数据伦理与合规)
- [文档](#文档)
- [截图](#截图)
- [贡献与许可证](#贡献与许可证)
- [English](#english)

---

## 项目简介

**Multi World（寰宇态势感知）** 是基于 Next.js 14 与 MapLibre GL v5 构建的地理空间态势感知 Web 应用。平台以 **RegionModule（地理区域）** 与 **TierModule（空间层）** 两套正交注册表驱动，将全球 9 个重点区域、40+ 语义图层与实时公开数据源统一呈现在一张可交互地图上。

对标 [World Monitor](https://www.worldmonitor.app/) 的 OSINT 大屏能力，**自研实现、不复制其代码**。

---

## 功能特性

### 地图与空间模型

- **三位一体空间模型**：`space`（宇宙）/ `surface`（地表）/ `subsurface`（洋底）三层正交于地理区域，一键在层间切换
- **3D 地球（MapLibre v5 Globe）**：宇宙层自动切换球面投影，附带星空背景、大气辉光、GEO/LEO 轨道环
- **地球自转动效**：宇宙层支持可暂停/调速的自转（1× / 10× / 100×），暂停后可手动拖拽拨动地球
- **图标标记系统**：统一 `markerStyle` 驱动 emoji 图标、光晕色与图例，点/线要素分层渲染
- **全局搜索**：跨区域 + 全球图层构建索引，子串匹配 + 权重排序
- **URL 深链**：支持 `lat` / `lon` / `zoom` / `view` / `timeRange` / `layers` / `region` 查询参数

### 区域模块（9 个）

| 区域 ID | 名称 | 说明 |
|---------|------|------|
| `global` | 全球 | 默认全球视野 |
| `china` | 中国 | 中国地缘态势 |
| `middle_east` | 中东 | 冲突、能源、外交等专题面板 |
| `asia_pacific` | 亚太 | 航道、基地与经济节点 |
| `north_america` | 美国 | 核力量、海外驻军、印太/北约 |
| `latin_america` | 拉美 | 资源、运河与热点 |
| `southeast_asia` | 东南亚 | 马六甲、东盟经济与南海航道 |
| `western_europe` | 西欧 | 防务、能源、对俄安全 |
| `eastern_europe` | 东欧·俄乌 | 俄乌战线与制裁态势 |

### 图层系统（40+）

按空间层分组，每层独立默认图层与底图范式：

| 空间层 | 代表图层 |
|--------|----------|
| 地表 | 冲突、军事、基地、核、制裁、经济、数据中心、半导体、灾害、气象、抗议… |
| 洋底 | 海底光缆、海底管线、深海采矿、板块断层、震源深度、海缆中断、洋流、渔业… |
| 宇宙 | 发射场、发射日志、测控站、GEO 卫星、空间站、在轨卫星（TLE）、空间碎片、空天事件 |

- **图层开关**：`LayerToggle` 按主题分组显隐
- **交互式图例**：`MapLegend` 随激活图层动态更新
- **敏感图层开关**：`hideSensitive` 一键下架军事/核/海外基地/ASAT 等图层

### 数据面板与工具

- **实时事件流** / **信息流跑马灯** / **区域简报** / **市场面板** / **新闻面板**
- **发射日志面板**：近一年全球航天发射记录（Launch Library 2）
- **轨道物体面板**：在轨卫星/空间站/碎片实时星下点列表（宇宙层）
- **战略研究半屏抽屉**：右侧 50vw 深度阅读面板（见下文）
- **天—地—海垂直剖面**：点击地图钻取三层最近态势 + 跨层连线 + 高度侧视图

### 管理后台

- 只读 MVP 仪表盘：区域/图层/空间层配置、发射日志、TLE、Geodata 缓存统计
- 开发环境默认启用；生产需显式开启（见[管理后台](#管理后台)）

---

## 技术栈

| 领域 | 选型 |
|------|------|
| 框架 | **Next.js 14**（App Router）+ React 18 + TypeScript（strict） |
| 地图 | **MapLibre GL JS v5**（Globe 球面投影） |
| 状态管理 | **Zustand 5** |
| 数据获取 | **SWR** + GeoJSON + 服务端 `/api/*` 路由 |
| 轨道传播 | **satellite.js**（SGP4 / TLE） |
| 图表 | **ECharts 6** |
| 动效 / 样式 | Framer Motion + Tailwind CSS |

---

## 快速开始

### 环境要求

- **Node.js** ≥ 18
- **npm** ≥ 9（或兼容的包管理器）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/haydenbilibili-maker/mutliworld.git
cd mutliworld

# 安装依赖
npm install

# （可选）配置环境变量
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

### 构建与生产预览

```bash
npm run build
npm run start
```

### 数据初始化（可选）

宇宙层实时卫星、发射日志等依赖本地 JSON 缓存，首次使用建议执行：

```bash
npm run data:tle       # 从 CelesTrak 抓取 TLE → data/orbital/tle.json
npm run data:launches  # 从 Launch Library 2 抓取发射记录 → data/launch-log/launches.json
npm run data:fetch     # 抓取公开 GeoJSON/RSS 缓存 → public/cache/
```

> 无 TLE 缓存时平台使用种子数据兜底（ISS、天宫等）；升级到 MapLibre v5 后若地图异常，请**重启 dev server**。

---

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `NEXT_PUBLIC_ADMIN_ENABLED` | 否 | `false` | 设为 `true` 时在生产环境开放 `/admin` 管理后台 |

> 开发模式（`NODE_ENV=development`）下管理后台自动启用，无需配置。  
> 其余数据源均为免费公开 API，**无需 API Key**。

`.env.local` 模板：

```env
# 生产环境开放管理后台时设为 true
NEXT_PUBLIC_ADMIN_ENABLED=false
```

---

## npm 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Next.js 开发服务器（`http://localhost:3000`） |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务器（需先 `build`） |
| `npm run lint` | ESLint 检查 |
| `npm run data:fetch` | 抓取地理实时缓存写入 `public/cache/` |
| `npm run data:fetch:dry` | 同上，仅打印不写文件 |
| `npm run data:tle` | 从 CelesTrak 抓取 TLE 写入 `data/orbital/tle.json` |
| `npm run data:launches` | 从 Launch Library 2 抓取发射记录写入 `data/launch-log/launches.json` |

**数据脚本附加参数**（直接传给 Node）：

```bash
npm run data:fetch -- --region china    # 仅抓取指定区域
npm run data:fetch -- --dry-run         # 干跑
npm run data:tle -- --dry-run
npm run data:launches -- --since 2y     # 自定义回溯年限
```

---

## 项目结构

```
.
├── data/
│   ├── orbital/              # TLE 星历缓存（tle.json）
│   └── launch-log/           # 发射记录缓存（launches.json）
├── docs/                     # PRD、路线图、架构说明
├── public/
│   └── cache/                # Geodata 静态抓取缓存
├── scripts/
│   ├── fetch-geodata.js      # 地理数据抓取
│   ├── fetch-tle.js          # TLE 抓取
│   └── fetch-launches.js     # 发射日志抓取
└── src/
    ├── app/
    │   ├── page.tsx          # 首页 → HomeDashboard
    │   ├── admin/            # 管理后台页面
    │   └── api/              # 服务端 API 路由
    ├── components/
    │   ├── map/              # MapContainer, GeodataLayer, GlobeController,
    │   │                     #   BathymetryLayer, OrbitalObjectsLayer, CosmicGlobeAnimator …
    │   ├── region/           # 区域面板、简报、垂直剖面、战略研究
    │   ├── ui/               # TierSwitcher, RegionSwitcher, LayerToggle, MapLegend …
    │   └── admin/            # 管理后台组件
    ├── regions/              # 9 区域模块 + 全球事实档案 + 战略研究数据
    ├── tiers/                # 三层 TierModule 注册表 + LAYER_TIER 映射
    ├── store/                # Zustand stores（地图、面板、战略研究 …）
    ├── lib/                  # geodata / orbital / search / profile / globe / admin …
    ├── hooks/                # useGeodata, useLaunchLog, useOrbitalObjects, useSyncStateToUrl …
    ├── context/              # MapContext, GeodataContext
    └── types/                # geo.ts, region.ts, tier.ts, orbital.ts …
```

---

## 区域与图层

### 架构要点

- **RegionModule 注册表**（`src/regions/`）：每区域声明视野中心、缩放、边界、可用图层与 dataset；平台据此自动生成区域切换器与信息面板
- **TierModule 注册表**（`src/tiers/`）：三层各自声明图层列表、默认图层、底图与渲染模式（`flat` / `depth` / `orbit`）
- **LAYER_TIER 映射**：每个 `LayerId` 登记所属空间层；未登记图层默认归地表

### 新增区域 / 图层

1. 在 `src/regions/` 新建 dataset 与 `RegionModule`
2. 在 `src/regions/index.ts` 注册
3. 新图层在 `src/types/geo.ts` 扩展 `LayerId`，并在 `src/tiers/index.ts` 的 `LAYER_TIER` 登记所属层

---

## 数据管道

### API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/geodata` | GET | 统一 GeoJSON 出口：区域 dataset + 全球档案 + 实时源合并 |
| `/api/launch-log` | GET | 全球航天发射日志 |
| `/api/orbital-objects` | GET | 在轨物体 TLE 传播后的实时位置 |
| `/api/satellites` | GET | ISS / 天宫等空间站实时星下点 |
| `/api/news` | GET | RSS 新闻聚合 |
| `/api/markets` | GET | 外汇 / 加密行情 |
| `/api/admin/stats` | GET | 管理后台统计数据 |

### Geodata 管线

```
区域 dataset + 全球档案（核/基础设施/海缆/发射场/卫星…）
        ↓
buildRegionGeoJSON（按区域 bounds 过滤合并）
        ↓
叠加实时源（USGS 地震、GDACS 灾害 …）
        ↓
/api/geodata → GeodataLayer 渲染
```

可选静态缓存：`npm run data:fetch` 写入 `public/cache/geodata-{region}.json`，供 API 优先读取。

### 实时数据源（免费、无 Key）

| 源 | 用途 | 刷新间隔 |
|----|------|----------|
| USGS Earthquakes | 全球地震 + 震源深度 | ~5 分钟 |
| GDACS | 洪水/气旋/火山/干旱/野火 | ~10 分钟 |
| RSS（BBC / 半岛 / UN News） | 新闻流 | ~5 分钟 |
| Frankfurter / CoinGecko | 外汇 / 加密 | ~2 分钟 |
| CelesTrak TLE + satellite.js | 在轨卫星 SGP4 星下点 | 客户端 60s 传播 |
| wheretheiss.at | ISS / 天宫实时位置（备用） | ~12s |
| Launch Library 2 | 发射记录（本地 JSON 缓存） | 脚本手动/定时更新 |

拉取失败时优雅降级，不阻塞页面渲染。

### 离线数据脚本

| 脚本 | 输出路径 | 数据源 |
|------|----------|--------|
| `data:fetch` | `public/cache/geodata-*.json` | GDELT、USGS 等 |
| `data:tle` | `data/orbital/tle.json` | CelesTrak GP 元素集 |
| `data:launches` | `data/launch-log/launches.json` | Launch Library 2 |

---

## 管理后台

### 访问方式

| 环境 | 地址 | 条件 |
|------|------|------|
| 开发 | [http://localhost:3000/admin](http://localhost:3000/admin) | `npm run dev` 自动启用 |
| 生产 | `https://<your-domain>/admin` | `.env.local` 设置 `NEXT_PUBLIC_ADMIN_ENABLED=true` |

也可从地图控制条 **「更多」菜单** 进入（开发/启用时显示入口）。

### 功能页面

| 路径 | 说明 |
|------|------|
| `/admin` | 仪表盘与数据摘要 |
| `/admin/data/launch-log` | 发射日志统计 |
| `/admin/data/orbital` | TLE 数据库分类统计 |
| `/admin/data/geodata` | Geodata 静态缓存状态 |
| `/admin/features/layers` | 图层与区域配置总览 |
| `/admin/features/regions` | 各区域种子数据要素统计 |
| `/admin/features/strategic-research` | 战略研究主题注册表 |
| `/admin/features/tiers` | 地表 / 洋底 / 宇宙三层配置 |

> 当前为**只读 MVP**，用于运维观测与配置查阅，不含在线编辑写回。

---

## 宇宙空间层

切换到 **宇宙空间** 层（`TierSwitcher` → 🛰）后：

1. **3D 球面投影**：`GlobeController` 激活 MapLibre Globe，叠加 `StarfieldBackdrop` 星空与 `OrbitRings` 轨道环
2. **地球自转**：`CosmicGlobeAnimator` 以 `requestAnimationFrame` 驱动 bearing 旋转；可通过 `CosmicMotionControls` 暂停或切换 1× / 10× / 100× 速度
3. **实时轨道物体**：
   - `OrbitalObjectsLayer`：读取 `/api/orbital-objects`，基于 `data/orbital/tle.json` 用 **satellite.js SGP4** 计算星下点，约 60 秒刷新
   - `LiveSatellitesLayer`：ISS / 天宫等高亮空间站实时位置
4. **发射日志图层**：`launch_log` 图层展示 `data/launch-log/launches.json` 中的历史发射点位

离开宇宙层时自动恢复平面投影与默认 bearing/pitch。

---

## 战略研究半屏面板

**战略研究**是以地图为上下文的深度阅读模块，采用右侧 **50vw 半屏抽屉**（`StrategicResearchPanel`）。

### 使用方式

1. 在地图控制条打开 **战略研究** 菜单（`StrategicResearchMenu`）
2. 选择可用主题（随当前区域过滤）
3. 左侧模块导航 + 右侧长文阅读；支持 **「在地图上显示」** 跳转到关联视野与图层

### 已启用主题

| ID | 标题 | 可用区域 |
|----|------|----------|
| `china-us` | 中美博弈 | 全球、中国、美国 |

更多主题（美国未来态势、南海未来走向等）已在注册表中预留，`enabled: false` 筹备中。  
新增主题见 `src/regions/strategic-research/registry.ts`。

---

## 招牌交互：天地海垂直剖面

1. 在 `TierSwitcher` 开启 **「天地海垂直剖面」** 模式
2. 点击地图任一点 → 落点涟漪 + 钻取标记
3. **地图**：从该点向天/地/海三层最近要素绘制跨层连线与高亮环
4. **面板**（`VerticalProfilePanel`）：三层最近态势列表 + **垂直高度侧视图**（GEO 36,000 km → ISS → 地表 → 海床 → 震源深度）

---

## 部署说明

标准 **Next.js 14** 应用，可部署至任意支持 Node.js 的平台：

### Vercel（推荐）

```bash
npm run build   # 本地验证构建
# 连接 GitHub 仓库后 Vercel 自动构建
```

生产环境如需管理后台，在 Vercel 项目设置中添加环境变量 `NEXT_PUBLIC_ADMIN_ENABLED=true`。

### 自托管（Docker / VPS）

```bash
npm ci
npm run build
npm run start   # 默认端口 3000
```

**部署前建议**：

```bash
npm run data:tle
npm run data:launches
```

确保宇宙层与发射日志有本地数据缓存。可配合 cron 定期执行数据脚本。

---

## 数据伦理与合规

- **敏感图层一键下架**：`hideSensitive` 开启即隐藏军事/核/海外基地/ASAT 等；商用场景可默认关闭敏感层
- **示意坐标**：聚合类/军事类坐标标注为「示意」，非精确目标
- **不编造**：进行中冲突数据带来源与时效标注；战略研究内容为种子分析，仅供研判参考
- **许可证**：对标 World Monitor 功能方向，**不复制其 AGPL 代码**

---

## 文档

| 文档 | 内容 |
|------|------|
| [`docs/三位一体空间PRD.md`](docs/三位一体空间PRD.md) | 天地海三层产品需求与路线 |
| [`docs/对标WorldMonitor路线图.md`](docs/对标WorldMonitor路线图.md) | 对标功能开发记录 |
| [`docs/3D地球评估与迁移.md`](docs/3D地球评估与迁移.md) | MapLibre 4→5 升级与 3D 启用 |
| [`docs/PRD-寰宇态势感知平台.md`](docs/PRD-寰宇态势感知平台.md) | 初版产品需求 |
| [`docs/LIFEOS-005_阶段1_平台化_实现说明.md`](docs/LIFEOS-005_阶段1_平台化_实现说明.md) | 平台化实现说明 |

---

## 截图

> 截图占位 — 欢迎补充实际界面截图至 `docs/screenshots/` 并在下方引用。

| 截图 | 说明 |
|------|------|
| `docs/screenshots/home-global.png` | 全球地表默认视图 |
| `docs/screenshots/tier-space-globe.png` | 宇宙层 3D 地球 + 轨道物体 |
| `docs/screenshots/tier-subsurface.png` | 洋底层海缆与深海图层 |
| `docs/screenshots/strategic-research.png` | 战略研究半屏面板 |
| `docs/screenshots/admin-dashboard.png` | 管理后台仪表盘 |

---

## 贡献与许可证

欢迎通过 [GitHub Issues](https://github.com/haydenbilibili-maker/mutliworld/issues) 提交 Bug 报告与功能建议，或通过 Pull Request 贡献代码。

**许可证**：MIT（待定）— 正式发布前以仓库根目录 `LICENSE` 文件为准。

---

## English

**Multi World** is a geospatial situational awareness platform built with Next.js 14 and MapLibre GL v5. It visualizes global events across three orthogonal spatial tiers — **space**, **surface**, and **subsurface** — with 9 regional modules, 40+ semantic layers, real-time public data feeds, 3D globe rendering, orbital object propagation (SGP4/TLE), launch logs, and a strategic research side panel.

```bash
git clone https://github.com/haydenbilibili-maker/mutliworld.git
cd mutliworld
npm install
npm run dev
```

Optional data bootstrap: `npm run data:tle && npm run data:launches`

Admin dashboard: `/admin` (enabled in development, or set `NEXT_PUBLIC_ADMIN_ENABLED=true` in production).

See the Chinese sections above for full architecture, API, and deployment details.

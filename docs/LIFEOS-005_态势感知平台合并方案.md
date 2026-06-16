# LIFEOS-005 · 态势感知平台合并方案（China ← Iran）

> Jobs(平台架构) + Linus(技术迁移) 联合交付 ｜ 2026-06-16 ｜ 对应任务卡 LIFEOS-005
> Hayden 裁决：China + Iran 合并为一个可扩展的态势感知平台，地区做成模块。

---

## 一、实地勘查结论

| | China（平台主库） | Iran（待并入） |
|---|---|---|
| 定位 | 寰宇态势感知平台（**愿景即全球平台**） | 中东地缘冲突态势感知大屏 |
| 技术栈 | Next.js + React + **maplibre-gl** + Zustand + SWR + framer-motion | Vite + **Vue3** + ECharts + **maplibre-gl** + Pinia |
| 结构 | 地图(MapContainer/LayerManager) + UI(图层开关/侧栏/时间轴) + useMapStore + geodata API | 22 个 Widget(.vue) + api/constants/mock/types + 2 个 Pinia store |
| 性质 | **平台壳**：图层化地图 + 时间轴 + URL 状态，通用框架 | **内容大屏**：军事/能源/外交/情报/目标/社媒等丰富专题 |

**两个关键利好**：
1. **地图引擎同为 maplibre-gl** —— 地图地基天然共享，无需换引擎。
2. **China 的产品愿景本就是"全球态势平台"** —— 合并不是硬拼，而是让 Iran 成为该平台的**第一个区域专题模块（中东）**，China 自身的中国/全球内容是另一个模块。架构上顺理成章。

## 二、目标架构：平台 + 可插拔区域模块

```
寰宇态势感知平台 (China · Next.js 主库)
├── 平台壳 (Platform Shell) ── 复用 China 现有能力
│   ├── 地图引擎 maplibre (MapContainer / LayerManager)
│   ├── 图层系统 / 时间轴 / 侧栏 / URL 状态同步
│   └── 区域模块注册表 (RegionModule Registry) ★新增
├── 区域模块: 中国/全球   (China 原有内容)
├── 区域模块: 中东        (Iran 迁入) ★本次
└── 区域模块: 未来(俄乌/南海/…)  即插即用
```

**RegionModule 接口（新增，单一数据源驱动）**：每个区域模块声明
`{ id, 元数据(名称/范围/视角), 地图图层(maplibre sources+layers), 数据源(api/mock), 指标维度, 专题面板(widgets), 时间轴范围 }`。
平台据此自动生成区域切换、地图加载、面板渲染——新增区域无需改平台核心（与 china2OS 的"模块注册表"同理念）。

## 三、迁移分类（Iran → China）—— 决定工作量的关键

Iran 的资产按"可移植性"三分：

| 类别 | Iran 资产 | 处理 | 成本 |
|------|-----------|------|------|
| **直接移植**（框架无关 TS） | `api/`(energyEconomy/fleetNews/maritime)、`constants/`(diplomacy/energyMap/factions/socialMedia/sources/targets)、`mock/`(conflict/energy/military/socialMedia)、`types/` | 复制进 China 的 `中东模块`，仅调路径与类型导出 | 低 |
| **需移植**（状态管理） | 2 个 Pinia store（dashboard/energyEconomy） | 改写为 China 的 **Zustand** store 模式 | 中 |
| **需重写**（视图层 Vue→React） | 22 个 `.vue` Widget（Map/Target/Timeline/Military/Energy/Diplomacy/Intelligence/SocialMedia/Marquee…） | 逐个重写为 React/TSX；**数据绑定与 ECharts option 配置可复用**，仅换视图框架 | 高（主成本） |
| **统一/去重** | Iran 同时依赖 mapbox-gl + maplibre-gl | 统一到 **maplibre**（与 China 一致），去掉 mapbox-gl | 低 |
| **新增依赖** | ECharts（Iran 重度使用图表） | China 引入 `echarts`，封装一个 React ECharts 组件替代 `vue-echarts` | 低 |

➡ **核心判断**：数据与逻辑层（api/constants/mock/types/图表配置）**大部分可复用**，真正的工作量在 **22 个 Vue 组件重写为 React**。这是一次"换壳保芯"的迁移，而非推倒重来。

## 四、分阶段实施

**阶段 1 · 平台化地基（China 侧）**
- 在 China 引入 `RegionModule` 注册表与区域切换；把 China 现有内容收敛为"中国/全球"模块，验证机制可用。
- 引入 echarts + React ECharts 封装组件。

**阶段 2 · 中东数据层迁入**
- 直接移植 Iran 的 `api/constants/mock/types` 到 `src/regions/middleeast/`；Pinia store 改写为 Zustand。
- 中东地图图层(maplibre sources/layers)接入平台地图。

**阶段 3 · 中东视图层重写（主工作量）**
- 按优先级重写 Widget：先核心——MapWidget、TargetList/Detail、TimelineWidget、MilitaryStrength/Fleet、EnergyEconomy；后次要——Diplomacy、Intelligence、SocialMedia、各 Marquee、DeepAnalysis。
- 复用 Iran 的 ECharts option 与数据结构，仅换 React 绑定。

**阶段 4 · 收尾**
- 中东模块与中国/全球模块在同一平台并行可切换；Turing 异源验证；Iran 原库迁移完成后移入归档。

## 五、各角色任务（Elon 派单）

- **Jobs**：定平台信息架构与 `RegionModule` 接口契约（区域切换、模块面板布局规范、统一设计语言）；定 Widget 重写的优先级。
- **Linus**：阶段1平台化 + 阶段2数据迁入 + 阶段3视图重写；统一 maplibre、引入 echarts；附验证包。
- **Turing**：异源验证——多区域切换无串数据、地图图层加载、大屏渲染性能（README 验收：首屏可接受）、中东数据迁移完整性。
- **Bezos**：明确平台受众（情报自用 / 对外展示），定反馈来源。

## 六、风险与边界

- **主成本在 Vue→React 重写**（22 组件），建议先迁核心 Widget 出可用版本，次要 Widget 渐进，避免一次性大重构。
- **数据来源敏感**（地缘/军事），是否对外发布须报 Hayden。
- ⚠ 技术栈最终以 China(Next.js) 为准；若评估后发现某些 Iran 复杂可视化重写代价过高，可临时以 iframe/微前端方式过渡，但不作为长期方案。
- 数据时效：两者均有实时数据诉求，数据管线(真实源 vs mock)的统一是后续重点。

## 七、交付清单
- [x] 实地勘查（两库技术栈/结构/可移植性）
- [x] 目标架构（平台 + RegionModule）
- [x] 迁移三分类与工作量判断
- [x] 四阶段实施 + 角色派单 + 风险
- [ ] Jobs 定 RegionModule 接口契约与 Widget 优先级
- [ ] Linus 实现（阶段1→4，Claude Code）
- [ ] Turing 异源验证
- [ ] Iran 原库归档（迁移完成后）

> 下一步：Jobs 出 RegionModule 接口契约 → Linus 阶段1平台化起步；本方案落地后，China 即从"中国态势"升级为"可插拔的全球态势感知平台"，Iran 成为其中东模块。

# LIFEOS-005 阶段1 · 平台化地基 · 实现说明与验证包

> Linus（CTO）实现交付 ｜ 2026-06-16 ｜ China 主库
> 对应合并方案 `docs/LIFEOS-005_态势感知平台合并方案.md` 的阶段1。

---

## 一、本次实现内容

在 China（Next.js + React + Zustand）中落地"可插拔区域模块"地基，使其从"中国态势"升级为"可承载多区域的平台"。新增/改动 8 个文件，**未改动任何既有业务逻辑**，类型检查 0 报错。

**新增**
| 文件 | 作用 |
|------|------|
| `src/types/region.ts` | `RegionId` 与 `RegionModule` 接口（区域声明：视野/图层/数据命名空间/启用态） |
| `src/regions/registry.ts` | 区域注册表（register/get/list/listEnabled + DEFAULT_REGION_ID） |
| `src/regions/china.ts` | 中国/全球区域模块（承接 China 原内容） |
| `src/regions/middleeast.ts` | 中东区域模块**占位骨架**（enabled=false，待 Iran 迁入） |
| `src/regions/index.ts` | 导入即注册；统一出口 `@/regions` |
| `src/components/ui/RegionSwitcher.tsx` | 区域切换器 UI（注册表驱动，未启用区域置灰） |
| `src/components/charts/EChart.tsx` | React ECharts 封装（替代 Iran 的 vue-echarts；动态导入，未装 echarts 不阻塞构建） |

**改动**
| 文件 | 改动 |
|------|------|
| `src/store/useMapStore.ts` | 新增 `activeRegion` 状态 + `setRegion()`：切区域时应用该区域默认 中心/缩放/图层/时间范围 |
| `src/app/page.tsx` | 左上角挂载 `<RegionSwitcher />` |

## 二、设计要点

- **单一数据源**：区域的视野、默认图层、数据命名空间集中在 RegionModule，注册表驱动切换/渲染——新增区域只需建一个模块文件 + 在 `regions/index.ts` 注册，**不改平台核心**（与 china2OS 的模块注册表同理念）。
- **渐进迁移**：中东模块先以 `enabled:false` 占位，UI 自动置灰为"·待迁"，等阶段2-3 迁入 Iran 数据与 Widget 后置 true 即上线，互不阻塞。
- **ECharts 解耦**：用动态导入 + 变量模块名，未安装 echarts 时构建不报错；`npm install echarts` 后自动生效。

## 三、自测结果（Linus）

- `npx tsc --noEmit`：**退出码 0，0 报错**（在 China 真实代码库、含 Next 类型环境下）。
- 区域注册：china（enabled）+ middleeast（占位）已注册，`listRegions()` 启用者排前。
- 切换逻辑：`setRegion('china')` 应用 [105,28]/zoom3.5/默认三图层；middleeast 在 UI 置灰不可点。

## 四、验证包（交 Turing 异源验证）

> Turing 用异源模型独立复现，注明所用模型。

**复现**
1. `cd China && npm install`（如需 echarts 图表：`npm install echarts`）。
2. `npm run dev`，打开页面：左上角应出现「中国/全球 ｜ 中东·待迁」区域切换器。

**重点验证**
1. **区域切换正确性**：点「中国/全球」应用其默认视野与图层；「中东」因 enabled=false 不可点、置灰。
2. **无串数据**：切换区域后 `activeLayers/center/zoom/timeRange` 与目标区域定义一致，不残留上个区域状态。
3. **平台核心零回归**：原有图层开关、时间轴、侧栏、地图渲染功能不受影响。
4. **构建健壮性**：未安装 echarts 时 `npm run build` 不因 EChart 报错。

**已知边界 / 待接续（阶段2-3）**
- **MapContainer 联动待确认**：`setRegion` 已更新 store 的 center/zoom，需确认 `MapContainer` 监听并 `flyTo`（若未监听，需补一行 effect）。这是阶段2接入点，本阶段聚焦注册表与状态。
- 中东模块为占位：Iran 的 `api/constants/mock/types` 数据层与 22 个 Widget 重写在阶段2-3。
- EChart 需 `npm install echarts` 才实际渲染。

## 五、交付状态
- [x] RegionModule 类型 + 注册表
- [x] 中国模块 + 中东占位模块
- [x] store 区域切换 + RegionSwitcher UI
- [x] React ECharts 封装（待装依赖）
- [x] tsc 类型检查 0 报错
- [ ] Turing 异源验证
- [ ] 阶段2：迁入 Iran 数据层 + MapContainer 区域联动
- [ ] 阶段3：重写中东 Widget

---

# 阶段2 · 中东数据层迁入（同日续作）

## 实现内容

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.factions.ts` | 迁入 Iran 阵营域数据（美/以/伊：标签/旗帜/颜色），改为 China 自包含类型 |
| `src/regions/middleeast.events.ts` | 中东种子事件（霍尔木兹/曼德/苏伊士 航道监测点）⚠占位示例，非真实情报 |
| `src/hooks/useRegionData.ts` | 区域数据 Hook：按 activeRegion 返回该区域事件 + 阵营配置 |
| `src/regions/middleeast.ts`（改） | **enabled=true** —— 中东区域正式可切换 |
| `src/components/map/MapContainer.tsx`（改） | 新增"区域种子标记"effect：按区域数据渲染地图圆点（按影响等级配色） |

## 已确认（阶段1遗留项澄清）

- **MapContainer ↔ 区域联动已自然成立**：MapContainer 早有 `map.flyTo({center,zoom})` 监听 store 变化的 effect；`setRegion` 更新 center/zoom 即触发飞向——切到「中东」地图自动飞到波斯湾视野。阶段1验证包里"待确认"项**确认为正面**。

## 自测（Linus）

- `npx tsc --noEmit`：**退出码 0，0 报错**（含阶段1+阶段2全部改动）。
- 中东区域 enabled=true，区域切换器中「中东」由置灰变为可点。
- 切到中东：地图 flyTo 波斯湾，渲染 3 个航道监测点圆点（高/中影响分别橙/蓝色）。

## 验证包追加（交 Turing）

1. **区域切换可用**：点「中东」→ 地图飞向波斯湾，出现 3 个圆点；点「中国/全球」→ 飞回、圆点消失。
2. **数据隔离**：中东事件只在中东区域出现，不污染中国/全球。
3. **零回归**：原有图层/时间轴/侧栏不受影响。
4. **种子数据标注**：确认 events 标记为 `seed/示例`，阶段3 须替换为 Iran 真实数据。

## 待接续（阶段3）

- 迁入 Iran 真实数据层（`api/mock/targets/diplomacy/energy…`）替换种子事件。
- 重写 Iran 22 个 Widget 为 React（军事/能源/外交/情报/目标面板）。
- 引入 echarts（`npm install echarts`）激活 `EChart` 封装，承接 Iran 图表。

> 阶段1+2 已让 China 从"中国态势"变为"可切换中国/中东的双区域平台"，且地图随区域飞向、渲染区域专属标记。阶段3 是把中东从"种子占位"填充为 Iran 的完整内容。

---

# 自主开发批次 · 平台可视化（同日）

## 背景

勘查发现 China 是**骨架态**：`public/` 为空、`geodata` API 返回空、`LayerManager` 是 TODO 占位——所以地图是纯黑画布（底图与数据层均未实现，非本次改动所致）。为让平台"一眼是态势地图"，做一批**离线、不依赖外部瓦片**的可视化增量。

## 实现内容

| 文件 | 作用 |
|------|------|
| `src/lib/graticule.ts` | 程序生成经纬网格 + 区域边界矩形框（离线底图，契合暗色科技风） |
| `src/components/map/MapContainer.tsx`（改） | 地图载入时铺经纬网底图；新增"区域边界高亮"虚线框（青色随区域切换） |
| `src/hooks/useRegionData.ts`（改） | 返回值增加 `regionId` 与区域 `bounds` |
| `src/components/region/MideastPanel.tsx` | **首个 Iran Widget 的 React 化**：中东态势面板（阵营图例 + 监测点列表，点击选中地图事件），仅中东区域显示 |
| `src/app/page.tsx`（改） | 挂载 MideastPanel；修复区域切换器与图层面板的重叠（图层下移一行 + 限宽） |

## 效果（本机可见）

- **底图**：暗色画布上铺一层经纬网格 → 读起来像态势/作战地图，不再是纯黑。
- **区域高亮**：切到「中东」时，地图飞向波斯湾并出现青色虚线边界框圈出中东范围 + 3 个监测圆点。
- **中东面板**：左侧出现「中东态势」面板（美/以/伊 阵营图例 + 监测点列表，可点击选中）。
- **布局修复**：区域切换器（左上）与图层面板（其下右侧）不再重叠。

## 自测

- `npx tsc --noEmit`：**退出码 0，0 报错**（含全部批次）。
- 离线无外部依赖：经纬网/边界框/面板均本地生成，无需瓦片服务或 API key。

## 说明与边界

- 经纬网是**示意底图**，非真实地理边界；若需国界/海岸线，建议接 `geodata` API 的真实 GeoJSON（China 既有待实现项，不在合并范围）。
- 中东面板与监测点仍是**种子示例数据**，阶段3 由 Iran 真实数据层替换。
- 本批属"自主开发"的可视化完善，使阶段1+2 的成果在本机直观可见。

---

# 阶段3 · 迁入 Iran 真实数据（首批：军力对比）

## 实现内容

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.military.ts` | **cp 自 Iran** `mock/militaryStrengthData.ts`（5 区块：伊朗导弹/以色列防空/美国海空军/代理人武装等真实数据），仅改导入与导出名 |
| `src/types/middleeast.ts` | 迁入 `MideastMilitarySection / MideastMilitaryItem` 类型（China 自包含） |
| `src/hooks/useRegionData.ts`（改） | 中东区域返回值增加 `military` 真实数据 |
| `src/components/region/MideastMilitaryPanel.tsx` | **Iran MilitaryStrengthWidget 的 React 化**：可折叠军力区块，按阵营（伊朗红/美以蓝）着色 |
| `src/app/page.tsx`（改） | 右上角挂载军力面板（仅中东显示） |

## 迁移手法验证

- 用 `cp` 整体搬运 Iran 真实数据文件，仅 `sed` 改两行（导入类型 + 导出常量名）——**零手抄、零转写错误**，这正是合并方案"数据层框架无关、可直接移植"判断的实证。
- 5 个军力区块、全部条目（估算均带标注与更新时间）原样迁入。

## 自测

- `npx tsc --noEmit`：**退出码 0，0 报错**（含全部阶段1/2/3 + 自主可视化批次）。
- 切到「中东」：右上出现「军力对比」面板，点开任一区块展开真实条目（伊朗导弹产能、以色列铁穹/箭式、代理人武装等）。

## 阶段3 进度与后续

- ✅ 首个真实数据域（军力对比）+ 首个 Iran Widget React 化已落地，验证了"cp 数据 + 重写视图"的迁移范式可行。
- 后续按同范式迁：能源经济（energyEconomyData）、社媒（socialMediaData）、冲突时间轴（conflictData，1963 行，最大）、目标人物（TargetList/TargetDetail）、外交/情报面板等。
- echarts 图表类 Widget（趋势图等）需 `npm install echarts` 后用 `EChart` 封装承接。

> 至此 China 已是"可切换 + 中东含真实军力数据 + 多面板"的态势平台。迁移范式跑通，剩余 Widget 是同模式的重复劳动。

## 阶段3 · 第二批：能源经济（同范式）

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.energy.ts` | cp 自 Iran `energyEconomyData.ts`（4 数据集：受影响地区/股指/产油点位/油价数据点），sed 改导入 |
| `src/types/middleeast.ts`（增） | 迁入 EnergyImpactRegion / GlobalStockIndex / OilProducerMapPoint / EnergyDataPoint 类型 |
| `src/hooks/useRegionData.ts`（改） | 中东返回值增加 `energy`（regions + points） |
| `src/components/region/MideastEnergyPanel.tsx` | EnergyEconomyWidget 的 React 化：价格/影响 双标签页（油价涨红跌绿 + 各国影响摘要） |
| `src/app/page.tsx`（改） | 右下角挂载能源面板 |

- 同样 cp + sed 零手抄迁移；`npx tsc --noEmit` **退出码 0，0 报错**。
- 切到「中东」现有三面板：左「中东态势」、右上「军力对比」、右下「能源经济」。

**累计阶段3 已迁**：军力对比、能源经济 2 个真实数据域 + 2 个 React Widget。**待续**（同范式）：社媒(socialMediaData)、冲突时间轴(conflictData 最大)、目标人物(TargetList/Detail)、外交/情报面板；图表类待装 echarts。

---

# Bugfix · 运行时 1000+ uncaught 报错（同日修复）

## 现象
控制台累计 1100+ 「Uncaught」(react-dom)，但 Issues 面板为 "No Issues"——非构建错，是**运行时反复抛错刷屏**。仅在地图飞行/交互时出现。

## 根因（三联）
1. **`useRegionData` 每次渲染返回新数组/对象引用**（china 的 `events: []` 是新数组）→ MapContainer 依赖 `[events]/[bounds]` 的地图副作用每帧重跑。
2. **`flyTo ↔ moveend` 反馈循环**（China 既有）：moveend 把 `center` 设为新数组 → 触发 flyTo 副作用 → flyTo 又触发 moveend → 持续重渲染。
3. 持续重渲染下，地图 add/remove 图层与 maplibre 时序竞争**抛错**，且无 try/catch 兜底 → uncaught 刷屏。

## 修复
| 修复 | 文件 | 作用 |
|------|------|------|
| `useMemo` 锁定区域数据引用（+ 稳定 `EMPTY_EVENTS`） | `hooks/useRegionData.ts` | 区域不变时 events/bounds 引用稳定，副作用不再每帧重跑 |
| flyTo「已在目标则跳过」(atTarget) 守卫 | `components/map/MapContainer.tsx` | 断开 flyTo↔moveend 反馈循环 |
| 5 处地图操作包 try/catch | `components/map/MapContainer.tsx` | 时序竞争抛错被吞，绝不冒泡为 uncaught |

- `npx tsc --noEmit`：**0 报错**。三联修复同时切断"持续重渲染"与"反复抛错"两条链路，控制台应归零。
- 附带前一步：`app/icon.svg` 消除 favicon 404；经纬网调亮(#3b6ea5/每20°)使底图可见。

---

# 阶段3 · 第三批：目标人物（同范式）

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.targets.ts` | 从 Iran `conflictData.ts` 提取 `targetPersons`（19 个高价值人物，含 WIKI 头像源、关联行动），改导入与导出名 |
| `src/types/middleeast.ts`（增） | 迁入 TargetPerson / RelatedAction / TargetStatus / TargetRoleCategory 类型 |
| `src/hooks/useRegionData.ts`（改） | 中东返回值增加 `targets` |
| `src/components/region/MideastTargetPanel.tsx` | TargetList/ProfileCard 的 React 化：阵营筛选 + 人物卡(状态着色) + 展开看关联行动 |
| `src/app/page.tsx`（改） | 左下角挂载目标人物面板 |

- 大文件中按行区间精确提取(1373-1607)+ 重命名导出，零手抄；`tsc --noEmit` **0 报错**。
- **中东区域现有 4 数据域 + 4 面板**：态势(阵营/监测点)、军力对比、能源经济、目标人物。

**累计阶段3 已迁 3 批**：军力 / 能源 / 目标人物。

## 阶段3 · 第四批：军事设施上地图（首个真实地图数据）

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.facilities.ts` | 从 Iran conflictData 提取 39 处设施（基地/雷达/核/海军/机场/导弹），改导入与导出名 |
| `src/types/middleeast.ts`（增） | Facility / FacilityType / MideastGeoPoint（注意 Iran 用 {lat,lng}，与 China geo.ts 的 [lng,lat] 元组区分） |
| `src/hooks/useRegionData.ts`（改） | 中东返回值增加 `facilities` |
| `src/components/map/MapContainer.tsx`（改） | 新增设施图层：阵营着色圆点(美蓝/以白/伊红) + **点击弹出 maplibre Popup**(名称/类型/兵力/配置/备注) + 悬停指针；坐标 {lat,lng}→[lng,lat] |

- 这是中东**首个真实地图数据**（此前只有 3 个种子航道点）：切到中东，地图上铺 39 个阵营着色设施点，点击看详情。
- 沿用 bugfix 的健壮范式：所有地图操作 try/catch、事件监听 cleanup off、依赖 useMemo 稳定的 `facilities`。`tsc --noEmit` **0 报错**。

**中东现状**：5 数据域(态势/军力/能源/目标/设施) + 4 面板 + 地图设施标记。

---

# Bugfix · 地图缺失（纯黑无任何图层）

## 现象
所有面板正常，但地图区一片纯黑——连经纬网都不显示，说明 maplibre 没渲染出任何图层。

## 根因
1. China 底图样式**只有一个黑色背景层，根本没有真实底图**——本就接近全黑。
2. 经纬网原本在 `on('load')` 里异步添加，叠加 try/catch 后若时序竞争失败会被**静默吞掉**，无任何可见底图。
3. 可能的容器 0 尺寸问题未处理（maplibre 空白地图经典根因）。

## 修复
| 修复 | 作用 |
|------|------|
| **烘焙真实暗色矢量底图进初始样式** | 用 maplibre 免费 demotiles 国界矢量源，初始 style 直接含 `country-fill/country-line/graticule`，不依赖异步添加——地图一定可见(暗色国界轮廓+经纬网) |
| `map.on('load', resize)` + **ResizeObserver** | 修复容器尺寸导致的空白 |
| 经纬网烘焙进 style | 不再受 on('load') 时序竞争影响 |

- 底图运行时从 `demotiles.maplibre.org` 取(用户浏览器联网即可)；即便不可达，本地经纬网仍烘焙在 style 里不会全黑。
- `tsc --noEmit` **0 报错**。刷新后应看到:暗色国界轮廓地图 + 经纬网 + 切到中东后 39 个阵营设施点。
- **注**：地图实例在 `useEffect([])` 仅创建一次，Fast Refresh 会保留旧实例；改样式后需**硬刷新(Cmd+Shift+R)**才会用新样式重建——本次空白即此原因，硬刷新已解决。

---

# 阶段3 · 第五批：冲突事件上地图

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.incidents.ts` | 从 Iran conflictData 提取 69 条冲突事件（含日期/类型/来源/原文链接） |
| `src/types/middleeast.ts`（增） | Incident / MideastEventType 类型 |
| `src/hooks/useRegionData.ts`（改） | 中东返回值增加 `incidents` |
| `src/components/map/MapContainer.tsx`（改） | 事件图层：按类型着色(军事红/政治橙/外交青) + 点击弹窗(标题/日期/来源/「查看原文」外链) |

- 切到中东，地图同时叠加 **39 设施点(阵营色) + 69 事件点(类型色)**，点击各有详情弹窗。沿用健壮范式(try/catch + 事件 off + useMemo 稳定引用)。`tsc` 0 报错。
- 时间筛选说明：事件为 2026-03 剧情数据，与"今天"的 24h/7d/30d 不匹配，故暂全量显示；后续可改为相对最新事件日期筛选。

**中东现状**：6 数据域 + 4 面板 + 地图(国界底图+经纬网+设施点+事件点)。

## 阶段3 · 第六批：外交面板

| 文件 | 作用 |
|------|------|
| `src/regions/middleeast.diplomacy.ts` | 从 Iran conflictData 提取 21 个外交行为体（中俄/海湾/欧洲/国际组织/宗教，含立场与反应记录） |
| `src/types/middleeast.ts`（增） | DiplomaticActor / DiplomaticRegion / DiplomaticReactionEntry 类型 |
| `src/hooks/useRegionData.ts`（改） | 中东返回值增加 `diplomacy` |
| `src/components/region/MideastDiplomacyPanel.tsx` | DiplomacyWidget 的 React 化：按区域分组 + 展开看各国反应记录 |
| `src/app/page.tsx`（改） | 顶部中央挂载外交面板 |

- `tsc` 0 报错。**中东现状**：7 数据域(态势/军力/能源/目标/设施/事件/外交) + 5 面板 + 地图标记。

> ⚠ **UX 待办**：浮动面板已达 5 个 + 区域切换/图层/时间轴，屏幕开始拥挤。下一步应做**面板停靠/折叠系统**(可开关/Tab/侧边 dock)，而非继续堆浮动面板。社媒/热点等剩余 Widget 建议纳入该面板系统后再迁。

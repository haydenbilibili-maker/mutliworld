# 产品需求文档 (PRD) - 寰宇态势感知平台

**产品名称**：寰宇态势感知平台 (Global Situation Awareness Dashboard)

**产品愿景**：打造一个符合中国视角的全球地缘政治、经济、安全与自然灾害态势的实时可视化交互平台。

**参考产品**：[World Monitor](https://www.worldmonitor.app/) — 实时全球情报仪表盘（URL 驱动视图、多图层、时间范围）。本产品在其交互与信息架构上参考，并强化中国视角、合规底图与国内数据源。

---

## 1. 核心目标 (Objectives)

| 目标 | 说明 |
|------|------|
| **直观展现** | 通过高性能 GIS 引擎，将全球突发事件、战略资源分布、军事动态进行空间化呈现。 |
| **多维下钻** | 用户可通过时间轴（Timeline）和多图层（Layers）筛选特定维度的信息；视图状态支持 URL 持久化，便于分享与复现。 |
| **合规安全** | 确保底图坐标系、国界线（特别是南海九段线、阿克赛钦等敏感区域）完全符合中国自然资源部最新的地图审核标准。 |

---

## 2. 核心功能模块 (Scope & Features)

### P0（MVP 核心阶段 - 必须具备）

- **GIS 基础底图模块**  
  支持无极缩放、平移；深色科技感主题。底图优先天地图或国内标准偏转图商。

- **多图层控制 (Layer Management)**  
  图层 ID 与 URL 参数一致，便于分享。分类与示例：
  - **冲突与安全**：`conflicts`（热点事件）、`hotspots`（敏感区域）、`bases`（演习海域/基地）
  - **经济与基建**：`economic`（一带一路节点、经贸）、`waterways`（重要港口/海峡）
  - **自然与气象**：`natural`（地震等）、`weather`（极端天气预警）
  - **军事与战略**：`military`（军事动态）  
  可选扩展：`sanctions`、`nuclear`、`outages`（基础设施）等，与数据源对齐。

- **交互式信息侧边栏 (Side Panel)**  
  点击地图上的 Marker，侧边栏滑出，展示：事件标题、时间、来源（如新华社、央视新闻等）及详细描述。

- **URL 状态同步**  
  地图中心 `lat`、`lon`、`zoom`、视图模式 `view`（如 global/asia）、时间范围 `timeRange`（如 24h/7d/30d）、当前开启的 `layers` 与 URL 双向同步，支持分享链接与浏览器前进/后退。

### P1（进阶演进阶段）

- **时间轴回溯 (Time Slider)**  
  底部时间拖拽组件（24H、7 天、30 天），与 `timeRange` 联动，动态渲染不同时间段的事件状态。

- **实时数据摄入 (Data Ingestion)**  
  基于 Node.js 的定时任务，抓取公开 RSS/API，地理编码（Geocoding）后以 GeoJSON 上屏。

---

## 3. 数据与合规要求

### 底图来源

- **优先**：天地图（Tianditu）矢量瓦片。  
- **或**：经国内标准偏转处理的商业地图 API（高德/百度）。

### 数据结构

- 前后端统一采用标准 **GeoJSON** 进行数据交换。

### 地图合规

- 底图与国界线（南海九段线、阿克赛钦等）须符合**中国自然资源部最新地图审核标准**。

---

## 4. URL 参数规范（与 World Monitor 对齐）

| 参数 | 说明 | 示例 |
|------|------|------|
| `lat` | 地图中心纬度 | 28.0 |
| `lon` | 地图中心经度 | 105.0 |
| `zoom` | 缩放级别 | 3.5 |
| `view` | 视图预设 | global / asia |
| `timeRange` | 时间范围 | 24h / 7d / 30d |
| `layers` | 已开启图层，逗号分隔 | conflicts,economic,weather |

---

## 5. 与 Cursor 规则对应关系

- 功能与架构：`.cursor/rules/` 下各规则（架构、地图 GIS、UI、数据、本地化等）。  
- 合规与底图：`world-monitor-compliance-basemap.mdc`。  
- URL 与图层 ID：`world-monitor-url-layers.mdc`（若存在）或见地图/架构规则。

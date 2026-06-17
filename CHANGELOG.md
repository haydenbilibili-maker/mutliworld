# Changelog

## v1.2.0 — 2026-06-17

### 修复
- 3D 地球：`setStyle` / 底图切换后于 `idle` 重应用 globe 投影（`src/lib/map/globeProjection.ts`）
- 航班/Geodata 图层：`styleEpoch` 变更后重置数据指纹，确保 overlay 正确 remount
- 披萨指数：pizzint.watch 地址无坐标时回退本地门店种子（`venueCoords.ts`）

### 新增
- 地图 geodata SWR 加载/空数据提示（`GeodataFetchIndicator`）
- 全局 ESC 关闭战略研究抽屉与事件侧栏（`useGlobalEscape`）
- 简报模块扩展图层映射（`conflict_zones`、实时图层等）
- 战略研究「在地图上查看」：自动切换地表层 + flyTo + 开启图层
- 管理后台 TLE 过期（>72h）与发射日志时效告警
- 全球种子数据 +3（红海航运、北极航道、台积电节点）
- 实时海运 `live_maritime`（AISStream 可选 / 航运通道模拟）
- 区域人物 `persons` 与区域态势 `regional-situation` 面板（9 区域）
- 管理后台运维：API 健康、缓存策略、功能开关；数据页扩展
- 烃类储备图层、股市指数、新闻 feed 种子数据

### 优化
- 实时航班视口 bbox 450ms 防抖，减少 OpenSky 请求
- Geodata / 航班 `setData` 仅在数据指纹变化时执行
- `StrategicResearchHost` 动态 import 延迟加载
- 移动端 PanelDock / MapControlBar 响应式布局
- 区域默认图层增加 `conflict_zones`（中国、中东、东欧、全球等）

### 开发
- `npm run typecheck`：build + tsc 联合类型检查

## v1.1.0 — 2026-06

- 实时天气、航班、冲突区、披萨指数 OSINT
- 中国/美国专题简报、战略研究半屏面板
- MapLibre v5 Globe、Terrarium 地形增强

## v1.0.0

- 三位一体空间模型（宇宙 / 地表 / 洋底）
- 9 区域模块、40+ 图层、管理后台 MVP

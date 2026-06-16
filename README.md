# 寰宇态势感知平台 (Global Situation Awareness Dashboard)

中国视角的全球地缘政治、经济、安全与自然灾害态势实时可视化交互平台。参考 [World Monitor](https://www.worldmonitor.app/) 的 URL 驱动与多图层设计，并强化合规底图与国内数据源。

## 技术栈

- **前端**：Next.js 14 (App Router)、React、Tailwind CSS、Framer Motion
- **地图**：MapLibre GL JS
- **状态**：Zustand
- **数据**：SWR、GeoJSON
- **脚本**：Node.js (npm)

## 项目结构

```
src/
  app/                    # App Router
    layout.tsx
    page.tsx
    globals.css
    api/geodata/route.ts  # GeoJSON API 占位
  components/
    map/                   # 地图与渲染
      MapContainer.tsx
      LayerManager.tsx
    ui/                    # 界面逻辑
      SidePanel.tsx
      LayerToggle.tsx
      TimelineSlider.tsx
  store/
    useMapStore.ts         # 全局状态（Zustand）
  hooks/
    useSyncStateToUrl.ts   # URL 与 store 双向同步
    useGeodata.ts          # GeoJSON 拉取与过滤
  types/
    geo.ts                 # GeoPoint、LayerConfig、EventDetail、GeoJSON
  lib/
    constants.ts           # 默认视野、图层 ID 与中文标签
scripts/
  fetch-geodata.js         # 数据拉取脚本占位 (npm run data:fetch)
docs/
  PRD-寰宇态势感知平台.md  # 产品需求文档
.cursor/rules/             # Cursor 开发规则
```

## 开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。链接支持查询参数：`lat`、`lon`、`zoom`、`view`、`timeRange`、`layers`，与 [World Monitor](https://www.worldmonitor.app/?lat=28.0000&lon=45.0000&zoom=3.50&view=global&timeRange=7d&layers=conflicts%2Cbases%2Chotspots%2Cnuclear%2Csanctions%2Cweather%2Ceconomic%2Cwaterways%2Coutages%2Cmilitary%2Cnatural%2CiranAttacks) 对齐。

## 脚本

- `npm run dev` — 本地开发
- `npm run build` / `npm run start` — 构建与生产
- `npm run data:fetch` — 拉取地理数据（占位，P1 实现）

## 合规与底图

底图与国界线须符合中国自然资源部地图审核标准。优先接入天地图或经国内标准偏转的高德/百度。详见 `docs/PRD-寰宇态势感知平台.md` 与 `.cursor/rules/world-monitor-compliance-basemap.mdc`。

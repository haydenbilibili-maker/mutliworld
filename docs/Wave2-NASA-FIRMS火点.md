# Wave 2 · 实时活跃火点（NASA FIRMS VIIRS）

地表层新增 `live_fires` 实时图层，接入 NASA FIRMS 近实时活跃火点（VIIRS_SNPP_NRT）。

## 数据链路（live-source triplet）

- `src/types/fires.ts` — `FirePoint` / `LiveFiresResponse` 类型
- `src/lib/fires/firms.ts` — `fetchActiveFires(dayRange)`，按表头列名解析 CSV，按 FRP 降序取前 800 点；无 KEY 或异常返回 `[]`
- `src/app/api/fires/route.ts` — `GET /api/fires`，返回 `{points, generatedAt, count, noKey}`，CDN 缓存 10 分钟，异常 502
- `src/hooks/useLiveFires.ts` — SWR，10 分钟自动刷新，输出 GeoJSON
- `src/components/map/FireLayer.tsx` — 圆点热力（按置信度着色、按 FRP 定半径），点击弹出详情并写入选中事件

## 注册点（与 live_flights 对齐）

`types/geo.ts`(LayerId) · `lib/constants.ts`(标签/提示) · `tiers/index.ts`(surface) ·
`lib/layers/liveApiLayers.ts` · `components/ui/LayerToggle.tsx`(分组+ALWAYS_ON) ·
`components/ui/MapLegend.tsx`(LIVE_OVERLAY) · `lib/geodata/markerStyle.ts`(图标/halo/legend) ·
`app/api/geodata/route.ts`(ALL_LAYERS) · `lib/map/briefingLayers.ts`(surface) ·
`regions/global.ts` · `components/map/MapContainer.tsx`(挂载 `<FireLayer/>`)

## 待办（用户侧）

1. 免费申请 FIRMS MAP_KEY：https://firms.modaps.eosdis.nasa.gov/api/area/
2. 配置服务端环境变量 `FIRMS_MAP_KEY`（**勿**加 `NEXT_PUBLIC_` 前缀，避免暴露给客户端）
3. Vercel 项目 → Settings → Environment Variables 添加后重新部署

## 时间轴

`TimelineSlider`（`src/components/ui/TimelineSlider.tsx`）已存在，Wave 2 的"时间轴"部分无需新建，
火点 `acqDate/acqTime` 字段已具备未来按时间过滤的能力。

## 验证

`npx tsc --noEmit` → 0 源码错误。异源验证（Turing/Codex）回归留待大版本封板。

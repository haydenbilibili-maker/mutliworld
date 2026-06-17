# Wave 1 · 合规底图：天地图接入 + 九段线审核

> 目标：国界（含南海九段线、藏南、台湾等）由国家「天地图」官方瓦片渲染，符合自然资源部地图审核标准。
> 状态：**代码已接入（token-gated）**，待补：① 天地图 token；② 审图号标注。

---

## 已完成（代码）

- 新增 `src/lib/map/tianditu.ts`：天地图 WMTS 瓦片（vec/cva/img/cia，Web Mercator）helpers + `buildTiandituStyle()`，全部 `NEXT_PUBLIC_TIANDITU_TOKEN` 门控。
- `src/lib/map/basemap.ts` 三处带国界底图接入合规分支：
  - **political 政区** → 配 token 用天地图矢量 `vec+cva`（含九段线）；否则回退 OpenFreeMap Liberty。
  - **hybrid 混合**（默认） → 卫星影像 + 天地图注记 `cva`（合规国界/标注）覆盖；否则回退 demotiles 国界。
  - **dark 深色**（seabed/space 遗留） → 天地图 `cva` 半透明叠加；否则回退 demotiles。
- 无 token 时全部回退现状，**开发不阻塞**。maplibre v5 globe 下天地图栅格可正常贴球。
- `tsc --noEmit` 源码 0 错误。

> 关键：**九段线不自绘**——自绘极易出错/违规；用官方瓦片即合规。

---

## 待补（你来做 / 我来补）

### 1. 天地图 token（外部前提，必须）
- 注册 https://console.tianditu.gov.cn → 创建应用 → 取「浏览器端」密钥。
- 配置环境变量（本地 `.env.local` + Vercel 项目环境变量）：
  ```
  NEXT_PUBLIC_TIANDITU_TOKEN=你的密钥
  ```
- 配好后默认 hybrid 模式国界即由天地图渲染。

### 2. 审图号 + 来源标注（对外发布必备）
- 申请自然资源部审图号（`GS(年份)xxxx号`）——监管备案，平行进行。
- 页面角落标注（取得号后填入；天地图源 attribution 已随瓦片自动显示）：
  ```tsx
  <div className="absolute bottom-1 left-1 z-10 text-[9px] text-dashboard-neutral/50">
    © 天地图 · GS(2024)XXXX号
  </div>
  ```
  建议放进 HomeDashboard 地图容器内。

---

## 验收清单
- [ ] token 配好，hybrid/political 国界由天地图渲染（含九段线/藏南/台湾正确）。
- [ ] 暗色大屏对比度 OK（天地图浅色，已对叠加层降透明度）。
- [ ] 3D 球面下天地图瓦片正常。
- [ ] 页面标注天地图来源 + 审图号。
- [ ] 自然资源部审图号申请（监管）。

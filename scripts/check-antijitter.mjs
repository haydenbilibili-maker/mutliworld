#!/usr/bin/env node
/**
 * 防抖回归静态扫描 — 提交前必跑（npm run check:antijitter）。
 *
 * 扫描本会话定位过的「UI 闪烁/抖动」已知反模式，防止刷新/视野同步等再次引入抖动：
 *  [ERROR] 视野同步用 router.replace/push（应改 window.history.replaceState，避免 RSC 软导航重渲染）
 *  [WARN ] requestAnimationFrame 内 setPaintProperty/setData/setStyle 且无 idle 门控（持续重绘）
 *  [WARN ] new ResizeObserver 无尺寸阈值守卫（细微尺寸变化触发重排）
 *  [WARN ] 组件内直接 map.setStyle（应仅由 BasemapController 统一调用）
 *
 * ERROR 阻断提交；WARN 需人工确认（已知安全可在此登记豁免）。
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const files = execSync('grep -rl "" src --include=*.ts --include=*.tsx', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

/** 已知安全、经评审的豁免（文件 → 原因） */
const WARN_EXEMPT = new Set([
  'src/components/map/FlowLayer.tsx', // 连线流光：已 idle 门控 + 可见性 + reduced-motion
  'src/components/map/BasemapController.tsx', // 唯一允许 setStyle 的处所
  'src/lib/map/basemap.ts',
  'src/components/admin/AdminApiHealthPanel.tsx', // setData 为 React 状态(非地图源)，且为后台轮询
  'src/components/map/ConflictZonesLayer.tsx', // 冲突区呼吸脉冲：既有、低频，已评审
  'src/components/map/DaynightLayer.tsx', // 60s tick + 页面可见性门控
]);

let errors = 0;
let warns = 0;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const isMapOrHook = f.includes('/components/map/') || f.includes('/hooks/') || f.includes('SyncStateToUrl');

  // [ERROR] 视野同步用 router
  if (/router\.(replace|push)\s*\(/.test(src) && /\b(lat|lon|lng|zoom|viewport|center|bbox)\b/.test(src) && isMapOrHook) {
    console.error(`  [ERROR] ${f}: 视野相关 router.replace/push → 改用 window.history.replaceState`);
    errors++;
  }

  // [WARN] rAF 内重绘无 idle 门控
  if (/requestAnimationFrame/.test(src) && /(setPaintProperty|setData|setStyle)\s*\(/.test(src) && !/\bidle\b/.test(src) && !WARN_EXEMPT.has(f)) {
    console.warn(`  [WARN ] ${f}: rAF 内 setPaintProperty/setData/setStyle 且未见 idle 门控 → 确认是否持续重绘`);
    warns++;
  }

  // [WARN] setInterval 驱动地图重绘无 idle/可见性门控
  if (/setInterval/.test(src) && /(setPaintProperty|setData)\s*\(/.test(src) && !/(idle|visibilityState|moving)/.test(src) && !WARN_EXEMPT.has(f)) {
    console.warn(`  [WARN ] ${f}: setInterval 驱动地图重绘且未见 idle/可见性门控`);
    warns++;
  }

  // [WARN] ResizeObserver 无尺寸阈值守卫
  if (/new ResizeObserver/.test(src) && !/(Math\.abs|threshold|< ?2|> ?2|lastWidth|prevSize)/.test(src)) {
    console.warn(`  [WARN ] ${f}: ResizeObserver 未见尺寸阈值守卫 → 细微变化可能触发抖动`);
    warns++;
  }

  // [WARN] 组件内直接 setStyle（BasemapController 之外）
  if (/\.setStyle\s*\(/.test(src) && f.includes('/components/') && !WARN_EXEMPT.has(f)) {
    console.warn(`  [WARN ] ${f}: 组件内 map.setStyle → 应仅由 BasemapController 统一调用`);
    warns++;
  }
}

console.log(`\n防抖回归扫描完成：${errors} 个 ERROR，${warns} 个 WARN（${files.length} 文件）`);
if (errors > 0) {
  console.error('✗ 存在阻断性防抖反模式，请修复后再提交。');
  process.exit(1);
}
console.log('✓ 无阻断性防抖反模式。WARN 项请人工确认（已知安全可登记豁免）。');

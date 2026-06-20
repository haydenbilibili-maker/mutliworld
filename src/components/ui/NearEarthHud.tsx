'use client';

/**
 * 已弃用：原近地左下角弹窗 HUD 已被三维方案替代——
 *  动画流场 → 「视图」菜单(ViewMenu)，标量叠加 → 「图层」模块(LayerToggle)，
 *  数据 + 浓度色阶图例 → 底部控制栏上方的 NearEarthDataBar。
 * 保留此文件仅作向后兼容再导出，避免旧引用断裂。
 */

export { NearEarthDataBar as NearEarthHud } from '@/components/ui/NearEarthDataBar';

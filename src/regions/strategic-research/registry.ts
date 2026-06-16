/**
 * 战略研究主题注册表
 *
 * ## 如何新增研究主题
 * 1. 在 `src/regions/<topic>/` 下编写模块数据（参考 `china-us-strategic/`）
 * 2. 在本文件 `STRATEGIC_RESEARCH_PANELS` 追加一项：`id`、`title`、`regions`、`getModules` 等
 * 3. 将 `enabled` 设为 `true`；`StrategicResearchMenu` 与 `StrategicResearchHost` 会自动拾取
 * 4. 若需定制渲染，可在 `StrategicResearchHost` 中为该 `id` 挂载专用面板组件
 */

import { CHINA_US_STRATEGIC_MODULES } from '@/regions/china-us-strategic';
import type {
  StrategicResearchPanelDef,
  StrategicResearchPanelId,
} from '@/types/strategic-research';
import type { RegionId } from '@/types/region';

const PANELS: StrategicResearchPanelDef[] = [
  {
    id: 'china-us',
    title: '中美博弈',
    subtitle: '战略研究 · 深度阅读',
    icon: '⚔',
    regions: ['global', 'china', 'north_america'],
    enabled: true,
    defaultModuleId: 'overview',
    getModules: () => CHINA_US_STRATEGIC_MODULES,
    footer: '种子战略分析 · 仅供研判参考 · 整理日 2026-06-16',
  },
  {
    id: 'future-us',
    title: '美国未来态势',
    subtitle: '战略研究 · 筹备中',
    icon: '🇺🇸',
    regions: ['global', 'north_america'],
    enabled: false,
    defaultModuleId: 'overview',
    getModules: () => [],
    footer: '内容筹备中',
  },
  {
    id: 'future-scs',
    title: '南海未来走向',
    subtitle: '战略研究 · 筹备中',
    icon: '🌊',
    regions: ['global', 'china', 'southeast_asia'],
    enabled: false,
    defaultModuleId: 'overview',
    getModules: () => [],
    footer: '内容筹备中',
  },
];

const PANEL_MAP = new Map<StrategicResearchPanelId, StrategicResearchPanelDef>(
  PANELS.map((p) => [p.id, p]),
);

export function getStrategicResearchPanel(
  id: StrategicResearchPanelId,
): StrategicResearchPanelDef | undefined {
  return PANEL_MAP.get(id);
}

export function listStrategicResearchPanels(): StrategicResearchPanelDef[] {
  return [...PANELS];
}

/** 当前区域下可用且已启用的研究主题 */
export function listAvailableStrategicResearchPanels(
  regionId: RegionId,
): StrategicResearchPanelDef[] {
  return PANELS.filter((p) => p.enabled && p.regions.includes(regionId));
}

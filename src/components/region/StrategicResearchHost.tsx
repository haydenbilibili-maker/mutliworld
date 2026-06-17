'use client';

/**
 * 战略研究面板宿主 — 根据 store.panelId 渲染对应主题的半屏抽屉
 */

import { useMapStore } from '@/store/useMapStore';
import { useStrategicResearchStore } from '@/store/useStrategicResearchStore';
import { getStrategicResearchPanel } from '@/regions/strategic-research/registry';
import { StrategicResearchPanel } from '@/components/region/StrategicResearchPanel';

export function StrategicResearchHost() {
  const activeRegion = useMapStore((s) => s.activeRegion);
  const panelId = useStrategicResearchStore((s) => s.panelId);
  const open = useStrategicResearchStore((s) => s.open);
  const activeModuleId = useStrategicResearchStore((s) => s.activeModuleId);
  const setActiveModule = useStrategicResearchStore((s) => s.setActiveModule);
  const close = useStrategicResearchStore((s) => s.close);

  if (!open || !panelId) return null;

  const def = getStrategicResearchPanel(panelId);
  if (!def || !def.enabled || !def.regions.includes(activeRegion)) return null;

  const modules = def.getModules();
  if (modules.length === 0) return null;

  return (
    <StrategicResearchPanel
      open={open}
      onClose={close}
      title={def.title}
      subtitle={def.subtitle}
      modules={modules}
      activeModuleId={activeModuleId}
      onModuleChange={setActiveModule}
      footer={def.footer}
      ariaLabel={`${def.title}研究`}
      parentPanelId={def.parentPanelId}
      relatedPanels={def.relatedPanels}
    />
  );
}

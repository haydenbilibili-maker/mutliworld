'use client';

import { useEffect } from 'react';
import { useMapStore } from '@/store/useMapStore';
import { useStrategicResearchStore } from '@/store/useStrategicResearchStore';

/**
 * 全局 ESC：依次关闭战略研究抽屉、事件侧栏（不拦截已打开的下拉菜单，由其自身处理）
 */
export function useGlobalEscape() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-escape-local]')) return;

      const research = useStrategicResearchStore.getState();
      if (research.open) {
        e.preventDefault();
        research.close();
        return;
      }

      const map = useMapStore.getState();
      if (map.sidePanelOpen || map.selectedEvent) {
        e.preventDefault();
        map.selectEvent(null);
        map.focusOnMap(null);
      } else if (map.mapTooltip) {
        e.preventDefault();
        map.focusOnMap(null);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}

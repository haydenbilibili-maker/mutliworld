'use client';

/**
 * 地表实时态势计数条 — 由 BottomDock 级联叠放于底部控制栏正上方（与近地数据条共用
 * DockDataCard 外壳与弹簧动效），汇总各实时点层的事件计数（地震/火山/风暴/洪水/沙尘/海冰）。
 * 与各图层共享 SWR（dedupe），仅统计已开启的层；至少一层开启才出现。真实数据·中立并陈。
 * 仅地表层显示；挂载于 MapContainer（BottomDock 已在 MapProvider 内）。
 * 定位与入场动效由 BottomDock 统一管理；本组件仅返回裸卡片。
 */

import useSWR from 'swr';
import type { FeatureCollection } from 'geojson';
import { useMapStore } from '@/store/useMapStore';
import type { LayerId } from '@/types/geo';
import { DockDataCard } from '@/components/ui/DockDataCard';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const swrOpts = { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000, dedupingInterval: 60_000 };

interface ChipDef { layer: LayerId; endpoint: string; icon: string; label: string; color: string }
const CHIPS: ChipDef[] = [
  { layer: 'earthquakes', endpoint: '/api/earthquakes', icon: '📳', label: '地震', color: 'text-rose-300' },
  { layer: 'volcanoes', endpoint: '/api/volcanoes', icon: '🌋', label: '火山', color: 'text-orange-300' },
  { layer: 'storms', endpoint: '/api/storms', icon: '🌪️', label: '风暴', color: 'text-sky-300' },
  { layer: 'floods', endpoint: '/api/floods', icon: '🌊', label: '洪水', color: 'text-blue-300' },
  { layer: 'dusthaze', endpoint: '/api/dusthaze', icon: '🌫️', label: '沙尘', color: 'text-amber-300' },
  { layer: 'seaice', endpoint: '/api/seaice', icon: '🧊', label: '海冰', color: 'text-cyan-200' },
];

function Chip({ def }: { def: ChipDef }) {
  const { data } = useSWR<FeatureCollection>(def.endpoint, fetcher, swrOpts);
  const n = data?.type === 'FeatureCollection' ? data.features.length : 0;
  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span aria-hidden>{def.icon}</span>
      <span className="text-dashboard-neutral/70">{def.label}</span>
      <span className={`tabular-nums font-semibold ${def.color}`}>{n}</span>
    </span>
  );
}

export function SurfaceLiveBar() {
  const inSurface = useMapStore((s) => s.activeBody === 'earth' && s.activeTier === 'surface');
  const layers = useMapStore((s) => s.activeLayers);

  if (!inSurface) return null;
  const active = CHIPS.filter((c) => layers.includes(c.layer));
  if (active.length === 0) return null;

  return (
    <DockDataCard
      footer={
        <div className="w-full border-t border-dashboard-neutral/10 pt-1 text-[9px] text-dashboard-neutral/45">
          各层计数每 5 分钟刷新 · 真实数据·中立并陈
        </div>
      }
    >
      <span className="text-[10px] font-medium text-dashboard-neutral/55">实时态势</span>
      {active.map((c) => <Chip key={c.layer} def={c} />)}
    </DockDataCard>
  );
}

'use client';

/**
 * 嵌入视图（embed widget）— 供外部页面 iframe 嵌入的精简态势地图。
 * 复用主地图与全部数据图层，并经 URL 视图态（tier/proj/layers/center/zoom 等）还原指定场景；
 * 去除头部 / 左右轨 / 面板等 chrome，仅保留地图、轻量署名与「在 OmniLens 打开」回链。
 */

import { MapContainer } from '@/components/map/MapContainer';
import { StarfieldBackdrop } from '@/components/map/StarfieldBackdrop';
import { GeodataProvider } from '@/context/GeodataContext';
import { BRAND } from '@/lib/brand';

export function EmbedView() {
  return (
    <GeodataProvider>
      <main className="relative h-screen w-full overflow-hidden bg-[#0A0E17]">
        <StarfieldBackdrop />
        <MapContainer chromeless className="absolute inset-0 z-0" />

        {/* 左下署名 */}
        <div className="pointer-events-none absolute bottom-2 left-3 z-20 rounded bg-dashboard-bg/70 px-2 py-1 text-[10px] text-dashboard-neutral/70 backdrop-blur-sm">
          真实数据·中立并陈
        </div>

        {/* 右下回链：在完整应用打开当前视图（携带同一 URL 查询态） */}
        <a
          href={`/${typeof window !== 'undefined' ? window.location.search : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-3 z-20 rounded-md border border-brand-cyan/40 bg-dashboard-bg/80 px-2.5 py-1 text-[11px] font-medium text-brand-cyan backdrop-blur-sm transition-colors hover:bg-brand-cyan/15"
          title={`在 ${BRAND.full} 打开`}
        >
          {BRAND.full} ↗
        </a>
      </main>
    </GeodataProvider>
  );
}

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { EmbedView } from '@/components/EmbedView';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: `${BRAND.full} · 嵌入视图`,
  description: `${BRAND.description} — 可嵌入的实时态势地图挂件。`,
};

/**
 * /embed — 外部 iframe 嵌入入口。
 * 用法：<iframe src="https://<host>/embed?tier=surface&layers=earthquakes,volcanoes&lat=..&lon=..&zoom=.." />
 * 视图态完全由 URL 查询参数驱动（与主应用「分享当前视图」生成的链接通用）。
 */
export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen w-full items-center justify-center bg-[#0A0E17] text-sm text-dashboard-neutral/60">
          加载嵌入视图…
        </main>
      }
    >
      <EmbedView />
    </Suspense>
  );
}

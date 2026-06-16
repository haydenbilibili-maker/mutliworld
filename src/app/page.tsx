import { Suspense } from 'react';
import { HomeDashboard } from '@/components/HomeDashboard';

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen w-full items-center justify-center bg-[#0A0E17] text-sm text-dashboard-neutral/60">
          加载态势地图…
        </main>
      }
    >
      <HomeDashboard />
    </Suspense>
  );
}

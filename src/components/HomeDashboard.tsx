'use client';

import dynamic from 'next/dynamic';
import { MapContainer } from '@/components/map/MapContainer';
import { StarfieldBackdrop } from '@/components/map/StarfieldBackdrop';
import { SidePanel } from '@/components/ui/SidePanel';
import { MapHudStack } from '@/components/ui/MapHudStack';
import { MapControlBar } from '@/components/ui/MapControlBar';
import { AppHeader } from '@/components/ui/AppHeader';
import { MideastPanel } from '@/components/region/MideastPanel';
import { MideastMilitaryPanel } from '@/components/region/MideastMilitaryPanel';
import { PersonsPanel } from '@/components/region/PersonsPanel';
import { MideastDiplomacyPanel } from '@/components/region/MideastDiplomacyPanel';
import { RegionalSituationPanel } from '@/components/region/RegionalSituationPanel';
import { GeodataProvider } from '@/context/GeodataContext';
import { LiveEventFeed } from '@/components/ui/LiveEventFeed';
import { LaunchLogPanel } from '@/components/ui/LaunchLogPanel';
import { MarqueeTicker } from '@/components/region/MarqueeTicker';
import { RegionBriefingPanel } from '@/components/region/RegionBriefingPanel';
import { ChinaBriefingPanel } from '@/components/region/ChinaBriefingPanel';
import { UsBriefingPanel } from '@/components/region/UsBriefingPanel';
import { NewsPanel } from '@/components/region/NewsPanel';
import { MarketsPanel } from '@/components/region/MarketsPanel';
import { EnergyEconPanel } from '@/components/region/EnergyEconPanel';
import { InsightsPanel } from '@/components/region/InsightsPanel';
import { AboutPanel } from '@/components/ui/AboutPanel';
import { RegionDetailCard } from '@/components/region/RegionDetailCard';
import { SeabedBriefingPanel } from '@/components/region/SeabedBriefingPanel';
import { SpaceBriefingPanel } from '@/components/region/SpaceBriefingPanel';
import { OrbitalListHost } from '@/components/ui/OrbitalListHost';
import { PizzaIndexHost } from '@/components/ui/PizzaIndexHost';
import { VerticalProfilePanel } from '@/components/region/VerticalProfilePanel';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { LiveLayerPerformanceGuard } from '@/components/ui/LiveLayerPerformanceGuard';
import { BodyTimelinePanel } from '@/components/ui/BodyTimelinePanel';
import { BodyOverviewPanel } from '@/components/ui/BodyOverviewPanel';
import { BodyViewControls } from '@/components/ui/BodyViewControls';
import { useMapStore } from '@/store/useMapStore';

const StrategicResearchHost = dynamic(
  () =>
    import('@/components/region/StrategicResearchHost').then((m) => ({
      default: m.StrategicResearchHost,
    })),
  { ssr: false },
);

export function HomeDashboard() {
  useGlobalEscape();
  const isEarth = useMapStore((s) => s.activeBody === 'earth');

  return (
    <GeodataProvider>
      <main className="flex h-screen w-full flex-col overflow-hidden max-sm:overflow-x-hidden">
        <AppHeader />
        <div className="relative flex-1 overflow-hidden">
          <StarfieldBackdrop />
          <MapContainer className="absolute inset-0 z-0" />
          <AboutPanel />

          {!isEarth && <BodyTimelinePanel className="absolute top-3 left-4 z-20 w-[min(20rem,calc(100vw-2rem))]" />}
          {!isEarth && <BodyOverviewPanel className="absolute top-3 right-4 z-20 w-[min(20rem,calc(100vw-2rem))]" />}
          {!isEarth && <BodyViewControls className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2" />}

          {isEarth && (
          <>
          {/* 左轨：区域 / 简报 / 态势 / 外交 / 新闻 / 人物（flex-col 堆叠，自动避让，整体滚动） */}
          <div className="pointer-events-none absolute bottom-16 left-4 top-3 z-20 flex w-[min(19rem,calc(100vw-2rem))] flex-col items-start gap-2 overflow-y-auto overscroll-contain pr-1 [&>*]:pointer-events-auto">
            <RegionDetailCard className="!w-full" />
            <RegionBriefingPanel className="!w-full !max-h-[46vh]" />
            <ChinaBriefingPanel className="!w-full !max-h-[46vh]" />
            <UsBriefingPanel className="!w-full !max-h-[46vh]" />
            <MideastPanel className="!w-full !max-h-[46vh]" />
            <RegionalSituationPanel className="!w-full !max-h-[46vh]" />
            <MideastDiplomacyPanel className="!w-full !max-h-[46vh]" />
            <NewsPanel className="!w-full !max-h-[46vh]" />
            <PersonsPanel className="!w-full !max-h-[46vh]" />
          </div>

          {/* 居中：仅地图 + 实时事件流 + 招牌剖面 */}
          <LiveEventFeed className="absolute top-3 left-1/2 z-10 w-[19rem] -translate-x-1/2 max-h-[min(52vh,24rem)] max-sm:w-[min(20rem,calc(100vw-2rem))]" />
          <VerticalProfilePanel className="absolute top-12 left-1/2 -translate-x-1/2 z-30 max-h-[80vh] overflow-y-auto" />

          {/* 右轨：市场 / 能源经济 / 关联洞察 / 军力 / 简报 / 发射 / 披萨指数 */}
          <div className="pointer-events-none absolute bottom-16 right-4 top-3 z-20 flex w-[min(22rem,calc(100vw-2rem))] flex-col items-end gap-2 overflow-y-auto overscroll-contain pl-1 [&>*]:pointer-events-auto">
            <PizzaIndexHost className="!static !w-full" />
            <MarketsPanel className="!w-full !max-h-[46vh]" />
            <EnergyEconPanel className="!w-full !max-h-[46vh]" />
            <InsightsPanel className="!w-full !max-h-[46vh]" />
            <MideastMilitaryPanel className="!w-full !max-h-[46vh]" />
            <SeabedBriefingPanel className="!w-full !max-h-[46vh]" />
            <SpaceBriefingPanel className="!w-full !max-h-[46vh]" />
            <LaunchLogPanel className="!w-full !max-h-[46vh]" />
          </div>

          <OrbitalListHost />
          <MapControlBar className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 max-sm:bottom-16 max-sm:max-w-[calc(100vw-1rem)]" />
          <MapHudStack className="absolute bottom-[4.75rem] left-4 z-20 max-sm:bottom-[5.25rem] max-sm:left-2" />
          <MarqueeTicker className="absolute bottom-0 left-0 right-0 z-20" />
          <SidePanel />
          <StrategicResearchHost />
          <LiveLayerPerformanceGuard />
          </>
          )}
        </div>
      </main>
    </GeodataProvider>
  );
}

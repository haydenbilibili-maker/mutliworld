'use client';

import { MapContainer } from '@/components/map/MapContainer';
import { StarfieldBackdrop } from '@/components/map/StarfieldBackdrop';
import { SidePanel } from '@/components/ui/SidePanel';
import { MapLegend } from '@/components/ui/MapLegend';
import { MapControlBar } from '@/components/ui/MapControlBar';
import { DataFreshnessBar } from '@/components/ui/DataFreshnessBar';
import { RegionSwitcher } from '@/components/ui/RegionSwitcher';
import { MideastPanel } from '@/components/region/MideastPanel';
import { MideastMilitaryPanel } from '@/components/region/MideastMilitaryPanel';
import { MideastEnergyPanel } from '@/components/region/MideastEnergyPanel';
import { MideastTargetPanel } from '@/components/region/MideastTargetPanel';
import { MideastDiplomacyPanel } from '@/components/region/MideastDiplomacyPanel';
import { MideastSocialPanel } from '@/components/region/MideastSocialPanel';
import { MideastTrendPanel } from '@/components/region/MideastTrendPanel';
import { PanelDock } from '@/components/region/PanelDock';
import { GeodataProvider } from '@/context/GeodataContext';
import { LiveEventFeed } from '@/components/ui/LiveEventFeed';
import { LaunchLogPanel } from '@/components/ui/LaunchLogPanel';
import { MarqueeTicker } from '@/components/region/MarqueeTicker';
import { RegionBriefingPanel } from '@/components/region/RegionBriefingPanel';
import { ChinaBriefingPanel } from '@/components/region/ChinaBriefingPanel';
import { UsBriefingPanel } from '@/components/region/UsBriefingPanel';
import { NewsPanel } from '@/components/region/NewsPanel';
import { MarketsPanel } from '@/components/region/MarketsPanel';
import { RegionDetailCard } from '@/components/region/RegionDetailCard';
import { TierSwitcher } from '@/components/ui/TierSwitcher';
import { SeabedBriefingPanel } from '@/components/region/SeabedBriefingPanel';
import { StrategicResearchHost } from '@/components/region/StrategicResearchHost';

export default function Home() {
  return (
    <GeodataProvider>
    <main className="relative w-full h-screen overflow-hidden">
      <StarfieldBackdrop />
      <MapContainer className="absolute inset-0" />
      <RegionSwitcher className="absolute top-4 left-4 z-20" />
      <TierSwitcher className="absolute top-1/2 left-4 z-20 -translate-y-1/2" />
      <RegionDetailCard className="absolute top-28 left-4 z-30" />
      <PanelDock className="absolute top-4 left-1/2 -translate-x-1/2 z-20" />
      <DataFreshnessBar className="absolute top-4 right-4 z-10 max-w-[min(28rem,calc(100vw-12rem))]" />
      <LiveEventFeed className="absolute top-[4.25rem] right-4 z-10 w-72 max-h-[min(40vh,18rem)]" />
      <LaunchLogPanel className="absolute top-[4.25rem] right-4 z-20 w-[min(28rem,calc(100vw-2rem))]" />
      {/* 信息面板（开关由 PanelDock 控制；外交默认收起，开启后居中显示） */}
      <RegionBriefingPanel className="absolute top-20 left-4 z-10" />
      <ChinaBriefingPanel className="absolute top-20 left-4 z-10" />
      <UsBriefingPanel className="absolute top-20 left-4 z-10" />
      <MideastPanel className="absolute top-20 left-4 z-10" />
      <MideastTargetPanel className="absolute bottom-14 left-4 z-10" />
      <MideastDiplomacyPanel className="absolute top-20 left-1/2 -translate-x-1/2 z-10" />
      <MideastSocialPanel className="absolute top-36 left-1/2 -translate-x-1/2 z-10" />
      <NewsPanel className="absolute top-20 left-1/2 -translate-x-1/2 z-10" />
      <MarketsPanel className="absolute top-36 left-4 z-10" />
      <SeabedBriefingPanel className="absolute top-28 right-4 z-30" />
      <MideastMilitaryPanel className="absolute top-28 right-4 z-10" />
      <MideastEnergyPanel className="absolute bottom-14 right-4 z-10" />
      <MideastTrendPanel className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10" />
      <MapControlBar className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2" />
      <MapLegend className="absolute bottom-[4.75rem] left-4 z-20" />
      {/* 信息流跑马灯：底部全宽，受 dock 的「跑马灯」开关控制 */}
      <MarqueeTicker className="absolute bottom-0 left-0 right-0 z-20" />
      <SidePanel />
      <StrategicResearchHost />
    </main>
    </GeodataProvider>
  );
}

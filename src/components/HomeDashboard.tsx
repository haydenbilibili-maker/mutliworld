'use client';

import dynamic from 'next/dynamic';
import { MapContainer } from '@/components/map/MapContainer';
import { StarfieldBackdrop } from '@/components/map/StarfieldBackdrop';
import { SidePanel } from '@/components/ui/SidePanel';
import { MapHudStack } from '@/components/ui/MapHudStack';
import { MapControlBar } from '@/components/ui/MapControlBar';
import { RegionSwitcher } from '@/components/ui/RegionSwitcher';
import { MideastPanel } from '@/components/region/MideastPanel';
import { MideastMilitaryPanel } from '@/components/region/MideastMilitaryPanel';
import { MideastEnergyPanel } from '@/components/region/MideastEnergyPanel';
import { PersonsPanel } from '@/components/region/PersonsPanel';
import { MideastDiplomacyPanel } from '@/components/region/MideastDiplomacyPanel';
import { RegionalSituationPanel } from '@/components/region/RegionalSituationPanel';
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
import { EnergyEconPanel } from '@/components/region/EnergyEconPanel';
import { RegionDetailCard } from '@/components/region/RegionDetailCard';
import { TierSwitcher } from '@/components/ui/TierSwitcher';
import { SeabedBriefingPanel } from '@/components/region/SeabedBriefingPanel';
import { SpaceBriefingPanel } from '@/components/region/SpaceBriefingPanel';
import { OrbitalListHost } from '@/components/ui/OrbitalListHost';
import { SurfaceLayerStatusStack } from '@/components/ui/SurfaceLayerStatusStack';
import { VerticalProfilePanel } from '@/components/region/VerticalProfilePanel';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';
import { LiveLayerPerformanceGuard } from '@/components/ui/LiveLayerPerformanceGuard';

const StrategicResearchHost = dynamic(
  () =>
    import('@/components/region/StrategicResearchHost').then((m) => ({
      default: m.StrategicResearchHost,
    })),
  { ssr: false },
);

export function HomeDashboard() {
  useGlobalEscape();

  return (
    <GeodataProvider>
      <main className="relative h-screen w-full overflow-hidden max-sm:overflow-x-hidden">
        <StarfieldBackdrop />
        <MapContainer className="absolute inset-0 z-0" />
        <div className="pointer-events-none absolute top-4 left-4 z-30">
          <RegionSwitcher className="pointer-events-auto" />
        </div>
        <TierSwitcher className="absolute top-1/2 left-4 z-20 -translate-y-1/2" />
        <RegionDetailCard className="absolute top-16 left-4 z-30" />
        <PanelDock className="absolute top-4 left-1/2 z-20 -translate-x-1/2 max-sm:top-[3.5rem] max-sm:max-w-[calc(100vw-1rem)] max-sm:px-1" />
        <LiveEventFeed className="absolute top-[4.25rem] right-4 z-10 w-72 max-h-[min(40vh,18rem)] max-sm:right-2 max-sm:w-[min(18rem,calc(100vw-5.5rem))]" />
        <LaunchLogPanel className="absolute top-[4.25rem] right-4 z-30 w-[min(28rem,calc(100vw-2rem))]" />
        <RegionBriefingPanel className="absolute top-20 left-4 z-25" />
        <ChinaBriefingPanel className="absolute top-20 left-4 z-25" />
        <UsBriefingPanel className="absolute top-20 left-4 z-25" />
        <MideastPanel className="absolute top-20 left-4 z-25" />
        <PersonsPanel className="absolute bottom-14 left-4 z-25" />
        <MideastDiplomacyPanel className="absolute top-20 left-1/2 -translate-x-1/2 z-25" />
        <RegionalSituationPanel className="absolute top-36 left-1/2 -translate-x-1/2 z-25" />
        <NewsPanel className="absolute top-20 left-1/2 -translate-x-1/2 z-25" />
        <MarketsPanel className="absolute top-36 left-4 z-25" />
        <EnergyEconPanel className="absolute top-36 right-4 z-25" />
        <SeabedBriefingPanel className="absolute top-28 right-4 z-30" />
        <SpaceBriefingPanel className="absolute top-28 right-4 z-30" />
        <OrbitalListHost />
        <SurfaceLayerStatusStack />
        <VerticalProfilePanel className="absolute top-28 left-1/2 -translate-x-1/2 z-30 max-h-[80vh] overflow-y-auto" />
        <MideastMilitaryPanel className="absolute top-28 right-4 z-25" />
        <MideastEnergyPanel className="absolute bottom-14 right-4 z-25" />
        <MapControlBar className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 max-sm:bottom-16 max-sm:max-w-[calc(100vw-1rem)]" />
        <MapHudStack className="absolute bottom-[4.75rem] left-4 z-20 max-sm:bottom-[5.25rem] max-sm:left-2" />
        <MarqueeTicker className="absolute bottom-0 left-0 right-0 z-20" />
        <SidePanel />
        <StrategicResearchHost />
        <LiveLayerPerformanceGuard />
      </main>
    </GeodataProvider>
  );
}

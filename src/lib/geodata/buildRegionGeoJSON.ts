import type {
  EventDetail,
  GeoJSONFeature,
  GeodataResponse,
  ImpactLevel,
  LayerId,
  TimeRange,
} from '@/types/geo';
import type { RegionId } from '@/types/region';
import type { Facility, Incident } from '@/types/middleeast';
import type { Person, PersonDomain } from '@/types/person';
import { getRegionDataset } from '@/lib/geodata/datasets';
import { getGlobalNuclearForRegion } from '@/lib/geodata/globalNuclear';
import { getGlobalInfrastructureForRegion } from '@/lib/geodata/globalInfrastructure';
import { getGlobalLaunchSitesForRegion } from '@/lib/geodata/globalLaunchSites';
import { getGlobalLaunchLogForRegion, LAUNCH_LOG_WINDOW_MS } from '@/lib/geodata/globalLaunchLog';
import { getGlobalSemiconductorsForRegion } from '@/lib/geodata/globalSemiconductors';
import { getGlobalGarrisonsForRegion } from '@/lib/geodata/globalGarrisons';
import { getGlobalDeepSeaMiningForRegion } from '@/lib/geodata/globalDeepSeaMining';
import { getGlobalTectonicsForRegion } from '@/lib/geodata/globalTectonics';
import { getGlobalCableIncidentsForRegion } from '@/lib/geodata/globalCableIncidents';
import { getGlobalGroundStationsForRegion } from '@/lib/geodata/globalGroundStations';
import { getGlobalSatellitesForRegion } from '@/lib/geodata/globalSatellites';
import { getGlobalSpaceEventsForRegion } from '@/lib/geodata/globalSpaceEvents';
import {
  getMarineArchaeologyForRegion,
  getOceanCurrentsForRegion,
  getFisheriesForRegion,
  getMonsoonForRegion,
  getAtmosphericCirculationForRegion,
  getDeepExplorationForRegion,
  oceanPointsToFeatures,
  oceanCurrentsToFeatures,
} from '@/lib/geodata/globalOcean';
import {
  cableRouteToFeature,
  getSubmarineCablesForRegion,
} from '@/lib/geodata/globalSubmarineCables';
import {
  buildDaynightFeatures,
  getPipelinesForRegion,
  getThematicPointsForRegion,
  pipelineToFeature,
  thematicPointToFeature,
} from '@/lib/geodata/globalThematic';
import { GLOBAL_THEMATIC_POINTS } from '@/regions/global.thematic';
import type { InfraPoint } from '@/regions/global.infrastructure';
import type { LaunchSitePoint } from '@/regions/global.launchSites';
import type { LaunchLogEntry } from '@/regions/global.launchLog';
import type { SemiconductorFab } from '@/regions/global.semiconductors';
import type { GarrisonBase } from '@/regions/global.garrisons';
import type { SeabedMiningArea } from '@/regions/global.deepSeaMining';
import type { TectonicFeature } from '@/regions/global.tectonics';
import type { CableIncident } from '@/regions/global.cableIncidents';
import type { GroundStation } from '@/regions/global.groundStations';
import type { SatellitePoint } from '@/regions/global.satellites';
import type { SpaceEvent } from '@/regions/global.spaceEvents';
import { NUCLEAR_KIND_LABEL } from '@/regions/global.nuclear';
import {
  TIME_RANGE_MS,
  isWithinTimeWindow,
  opacityByAge,
  parseIsoMs,
  shiftTimestampToNow,
} from '@/lib/timeRange';
import { resolveMarkerStyle } from '@/lib/geodata/markerStyle';
import { resolvePersonAvatar } from '@/lib/person/avatar';
import { getGlobalHydrocarbonForRegion } from '@/lib/geodata/globalHydrocarbon';
import type { HydrocarbonReserveSite } from '@/regions/global.hydrocarbon';
import { getHighHeatSituation } from '@/regions/regional-situation';
import { situationToEvent } from '@/lib/regional-situation/toEvent';

export interface BuildGeoJSONOptions {
  regionId: RegionId;
  timeRange: TimeRange;
  layers: LayerId[];
}

function parseLayersParam(layers: LayerId[]): Set<LayerId> {
  return new Set(layers);
}

function incidentLayerId(
  incident: Incident,
  active: Set<LayerId>,
): LayerId | null {
  if (incident.type === 'military') {
    return active.has('military') ? 'military' : null;
  }
  if (active.has('conflicts')) return 'conflicts';
  if (active.has('hotspots')) return 'hotspots';
  return null;
}

function facilityLayerId(f: Facility, active: Set<LayerId>): LayerId | null {
  const isNuclear = f.type === 'nuclear' || Boolean(f.nuclearKind);
  if (isNuclear && active.has('nuclear')) return 'nuclear';
  if (active.has('bases')) return 'bases';
  return null;
}

/** 事件 category → 图层 ID 映射（含扩展语义类别） */
const CATEGORY_LAYER_MAP: Record<string, LayerId> = {
  waterways: 'waterways',
  economic: 'economic',
  natural: 'natural',
  weather: 'weather',
  hotspots: 'hotspots',
  conflicts: 'conflicts',
  military: 'military',
  sanctions: 'sanctions',
  nuclear: 'nuclear',
  outages: 'outages',
  bases: 'bases',
  aviation: 'aviation',
  maritime: 'maritime',
  cables: 'cables',
  econ_hubs: 'econ_hubs',
  minerals: 'minerals',
  daynight: 'daynight',
  pipelines: 'pipelines',
  datacenters: 'datacenters',
  protests: 'protests',
  climate: 'climate',
  launch_sites: 'launch_sites',
  launch_log: 'launch_log',
  semiconductors: 'semiconductors',
  garrisons: 'garrisons',
  deep_sea_mining: 'deep_sea_mining',
  tectonics: 'tectonics',
  cable_incidents: 'cable_incidents',
  quake_depth: 'quake_depth',
  ground_stations: 'ground_stations',
  sat_constellations: 'sat_constellations',
  space_events: 'space_events',
  marine_archaeology: 'marine_archaeology',
  ocean_currents: 'ocean_currents',
  fisheries: 'fisheries',
  monsoon: 'monsoon',
  atmospheric_circulation: 'atmospheric_circulation',
  deep_exploration: 'deep_exploration',
  // 扩展语义 → 标准图层
  security: 'military',
  defense: 'military',
  frontline: 'conflicts',
  diplomatic: 'conflicts',
  capital: 'hotspots',
  contested: 'hotspots',
  city: 'hotspots',
  port: 'waterways',
  airport: 'aviation',
  strait: 'maritime',
  cable: 'cables',
};

function eventCategoryLayer(category: string | undefined): LayerId | null {
  const c = category ?? 'waterways';
  return CATEGORY_LAYER_MAP[c] ?? null;
}

function impactFromIncident(type: Incident['type']): ImpactLevel {
  if (type === 'military') return 'critical';
  if (type === 'political') return 'high';
  return 'medium';
}

function impactFromFacility(f: Facility): ImpactLevel {
  if (f.nuclearKind === 'contamination') return 'high';
  if (f.type === 'nuclear' || f.nuclearKind) return 'critical';
  if (f.type === 'missile' || f.type === 'base' || f.type === 'airfield' || f.type === 'naval') {
    return 'high';
  }
  return 'medium';
}

function collectTimestamps(
  dataset: NonNullable<ReturnType<typeof getRegionDataset>>,
  active: Set<LayerId>,
): number[] {
  const times: number[] = [];
  for (const e of dataset.events ?? []) {
    const ms = parseIsoMs(e.timestamp);
    if (ms != null) times.push(ms);
  }
  for (const it of dataset.incidents ?? []) {
    const ms = parseIsoMs(it.date);
    if (ms != null) times.push(ms);
  }
  for (const p of dataset.energy?.points ?? []) {
    const ms = parseIsoMs(p.updatedAt);
    if (ms != null) times.push(ms);
  }
  for (const p of dataset.energy?.oilProducers ?? []) {
    const ms = parseIsoMs(p.updatedAt);
    if (ms != null) times.push(ms);
  }
  if (active.has('protests') || active.has('climate')) {
    for (const p of GLOBAL_THEMATIC_POINTS) {
      if (p.updatedAt) {
        const ms = parseIsoMs(p.updatedAt);
        if (ms != null) times.push(ms);
      }
    }
  }
  return times;
}

function makePointFeature(
  props: Record<string, unknown>,
  lng: number,
  lat: number,
): GeoJSONFeature {
  const marker = resolveMarkerStyle({
    layerId: String(props.layerId ?? ''),
    impact: String(props.impact ?? ''),
    nuclearKind: String(props.nuclearKind ?? ''),
    ftype: String(props.ftype ?? ''),
    etype: String(props.etype ?? ''),
    production: String(props.production ?? ''),
    subKind: String(props.subKind ?? ''),
    launchStatus: String(props.launchStatus ?? ''),
    mag: typeof props.mag === 'number' ? props.mag : undefined,
    live: props.live === true,
  });

  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lng, lat] },
    properties: { ...props, ...marker },
  };
}

function eventsToFeatures(
  events: EventDetail[],
  active: Set<LayerId>,
  windowMs: number,
  latestMs: number | null,
): GeoJSONFeature[] {
  const out: GeoJSONFeature[] = [];
  for (const e of events) {
    const layerId = eventCategoryLayer(e.category);
    if (!layerId || !active.has(layerId)) continue;

    const eventMs = parseIsoMs(e.timestamp);
    if (!isWithinTimeWindow(eventMs, latestMs, windowMs)) continue;

    const ageMs =
      eventMs != null && latestMs != null ? latestMs - eventMs : windowMs * 0.5;
    const timestamp =
      eventMs != null && latestMs != null
        ? shiftTimestampToNow(eventMs, latestMs)
        : e.timestamp;

    out.push(
      makePointFeature(
        {
          id: e.id,
          title: e.title,
          source: e.source,
          timestamp,
          impact: e.impact_level,
          category: e.category ?? layerId,
          layerId,
          description: e.description ?? '',
          opacity: opacityByAge(ageMs, windowMs),
          lng: e.location[0],
          lat: e.location[1],
        },
        e.location[0],
        e.location[1],
      ),
    );
  }
  return out;
}

function incidentsToFeatures(
  incidents: Incident[],
  active: Set<LayerId>,
  windowMs: number,
  latestMs: number | null,
): GeoJSONFeature[] {
  const out: GeoJSONFeature[] = [];
  for (const it of incidents) {
    const layerId = incidentLayerId(it, active);
    if (!layerId) continue;

    const eventMs = parseIsoMs(it.date);
    if (!isWithinTimeWindow(eventMs, latestMs, windowMs)) continue;

    const ageMs =
      eventMs != null && latestMs != null ? latestMs - eventMs : windowMs * 0.5;
    const timestamp =
      eventMs != null && latestMs != null
        ? shiftTimestampToNow(eventMs, latestMs)
        : it.date;

    out.push(
      makePointFeature(
        {
          id: it.id,
          title: it.title,
          source: it.source ?? '',
          timestamp,
          impact: impactFromIncident(it.type),
          category: layerId,
          layerId,
          description: it.description,
          link: it.link ?? '',
          etype: it.type,
          faction: it.faction,
          opacity: opacityByAge(ageMs, windowMs),
          lng: it.location.lng,
          lat: it.location.lat,
        },
        it.location.lng,
        it.location.lat,
      ),
    );
  }
  return out;
}

function facilitiesToFeatures(
  facilities: Facility[],
  active: Set<LayerId>,
): GeoJSONFeature[] {
  const out: GeoJSONFeature[] = [];
  for (const f of facilities) {
    const layerId = facilityLayerId(f, active);
    if (!layerId) continue;

    out.push(
      makePointFeature(
        {
          id: f.id,
          title: f.name,
          source: '核设施档案',
          timestamp: f.updatedAt ?? '',
          impact: impactFromFacility(f),
          category: layerId,
          layerId,
          description: f.notes ?? '',
          ftype: f.type,
          nuclearKind: f.nuclearKind ?? '',
          nuclearKindLabel: f.nuclearKind ? (NUCLEAR_KIND_LABEL[f.nuclearKind] ?? f.nuclearKind) : '',
          nuclearStatus: f.status ?? '',
          faction: f.faction,
          troop: f.troopEstimate ?? '',
          forces: (f.forces ?? []).join('、'),
          weapons: (f.weapons ?? []).join('、'),
          opacity: f.nuclearKind === 'contamination' ? 0.75 : 0.9,
          lng: f.position.lng,
          lat: f.position.lat,
        },
        f.position.lng,
        f.position.lat,
      ),
    );
  }
  return out;
}

const PERSON_DOMAIN_EMOJI: Record<PersonDomain, string> = {
  政治: '🏛️',
  经济: '💹',
  社会: '👥',
  文化: '🎭',
  军事: '⚔️',
};

function personsToFeatures(
  persons: Person[],
  active: Set<LayerId>,
): GeoJSONFeature[] {
  if (!active.has('persons') || !persons.length) return [];

  const out: GeoJSONFeature[] = [];
  for (const p of persons) {
    out.push(
      makePointFeature(
        {
          id: p.id,
          title: p.name,
          source: p.role,
          timestamp: p.since ? String(p.since) : '',
          impact: 'medium' as ImpactLevel,
          category: 'persons',
          layerId: 'persons',
          description: p.bio,
          personDomain: p.domain,
          personRole: p.role,
          personStatus: p.status ?? 'active',
          personAvatar: resolvePersonAvatar(p),
          subKind: p.domain,
          markerEmoji: PERSON_DOMAIN_EMOJI[p.domain],
          markerLabel: p.domain,
          opacity: p.status === 'deceased' ? 0.55 : 0.92,
          lng: p.lng,
          lat: p.lat,
        },
        p.lng,
        p.lat,
      ),
    );
  }
  return out;
}

/** 高热度区域态势 → hotspots 图层标记 */
function situationToFeatures(
  regionId: RegionId,
  active: Set<LayerId>,
  windowMs: number,
  latestMs: number | null,
): GeoJSONFeature[] {
  if (!active.has('hotspots')) return [];

  const out: GeoJSONFeature[] = [];
  for (const item of getHighHeatSituation(regionId, 75)) {
    const e = situationToEvent(item);
    const eventMs = parseIsoMs(e.timestamp);
    if (!isWithinTimeWindow(eventMs, latestMs, windowMs)) continue;

    const ageMs =
      eventMs != null && latestMs != null ? latestMs - eventMs : windowMs * 0.5;
    const timestamp =
      eventMs != null && latestMs != null
        ? shiftTimestampToNow(eventMs, latestMs)
        : e.timestamp;

    out.push(
      makePointFeature(
        {
          id: e.id,
          title: e.title,
          source: e.source,
          timestamp,
          impact: e.impact_level,
          category: 'hotspots',
          layerId: 'hotspots',
          description: e.description ?? '',
          situationType: item.type,
          situationHeat: item.heat,
          opacity: opacityByAge(ageMs, windowMs),
          lng: item.lng,
          lat: item.lat,
        },
        item.lng!,
        item.lat!,
      ),
    );
  }
  return out;
}

function oilProducersToFeatures(
  oilProducers: NonNullable<
    NonNullable<ReturnType<typeof getRegionDataset>>['energy']
  >['oilProducers'],
  active: Set<LayerId>,
  windowMs: number,
  latestMs: number | null,
  energyPointTimes: number[],
): GeoJSONFeature[] {
  if (!active.has('economic') || !oilProducers?.length) return [];

  const latestEnergyMs = energyPointTimes.length ? Math.max(...energyPointTimes) : latestMs;
  const thresholdMs = latestEnergyMs != null ? latestEnergyMs - windowMs : null;
  const deltaMs = latestEnergyMs != null ? Date.now() - latestEnergyMs : 0;

  const out: GeoJSONFeature[] = [];
  for (const p of oilProducers) {
    const producerMs = parseIsoMs(p.updatedAt);
    if (thresholdMs != null && producerMs != null && producerMs < thresholdMs) {
      continue;
    }

    const eventMs = producerMs ?? latestEnergyMs ?? Date.now();
    const ageMs =
      latestEnergyMs != null ? latestEnergyMs - eventMs : windowMs * 0.5;
    const timestamp = new Date(eventMs + deltaMs).toISOString();

    out.push(
      makePointFeature(
        {
          id: p.id,
          title: p.name,
          source: '能源/经济数据',
          timestamp,
          impact: 'high' as ImpactLevel,
          category: 'economic',
          layerId: 'economic',
          description: p.note ?? '',
          production: p.production,
          opacity: opacityByAge(ageMs, windowMs),
          lng: p.lng,
          lat: p.lat,
        },
        p.lng,
        p.lat,
      ),
    );
  }
  return out;
}

/** 全球基础设施点（航空/海运/海缆）→ feature；公开地理事实，不做时间窗过滤 */
function infraToFeatures(
  points: InfraPoint[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  const out: GeoJSONFeature[] = [];
  for (const p of points) {
    if (!active.has(p.layerId)) continue;
    out.push(
      makePointFeature(
        {
          id: p.id,
          title: p.name,
          source: '公开基础设施资料',
          timestamp: generatedAt,
          impact: p.impact,
          category: p.layerId,
          layerId: p.layerId,
          description: p.note,
          opacity: 0.9,
          lng: p.lng,
          lat: p.lat,
        },
        p.lng,
        p.lat,
      ),
    );
  }
  return out;
}

const LAUNCH_STATUS_LABEL: Record<string, string> = {
  active: '运行中',
  retired: '已退役',
  planned: '规划/建设中',
};

/** 全球航天发射场 → feature；公开地理事实，不做时间窗过滤 */
function launchSitesToFeatures(
  sites: LaunchSitePoint[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('launch_sites')) return [];
  const out: GeoJSONFeature[] = [];
  for (const s of sites) {
    const statusLabel = LAUNCH_STATUS_LABEL[s.status] ?? s.status;
    out.push(
      makePointFeature(
        {
          id: s.id,
          title: s.name,
          source: '公开航天资料',
          timestamp: generatedAt,
          impact: s.impact,
          category: 'launch_sites',
          layerId: 'launch_sites',
          description: `${s.operator} · ${statusLabel} — ${s.note}`,
          opacity: s.status === 'retired' ? 0.65 : 0.9,
          subKind: s.subKind ?? '',
          operator: s.operator,
          launchStatus: s.status,
          lng: s.lng,
          lat: s.lat,
        },
        s.lng,
        s.lat,
      ),
    );
  }
  return out;
}

const LAUNCH_LOG_STATUS_LABEL: Record<string, string> = {
  success: '成功',
  failure: '失败',
  partial: '部分成功',
  scheduled: '计划中',
  scrubbed: '推迟/中止',
};

function impactFromLaunchStatus(status: string): ImpactLevel {
  if (status === 'failure') return 'critical';
  if (status === 'partial') return 'high';
  if (status === 'scheduled') return 'medium';
  return 'low';
}

/** 全球发射日志 → feature；按时间窗过滤 */
function launchLogToFeatures(
  entries: LaunchLogEntry[],
  active: Set<LayerId>,
  windowMs: number,
): GeoJSONFeature[] {
  if (!active.has('launch_log')) return [];
  const now = Date.now();
  const out: GeoJSONFeature[] = [];
  for (const e of entries) {
    const eventMs = parseIsoMs(e.launchTime);
    if (!isWithinTimeWindow(eventMs, now, windowMs)) continue;

    const statusLabel = LAUNCH_LOG_STATUS_LABEL[e.status] ?? e.status;
    const ageMs = eventMs != null ? now - eventMs : windowMs * 0.5;
    const parts = [e.provider, statusLabel];
    if (e.orbit) parts.push(e.orbit);
    if (e.payload) parts.push(e.payload);
    const description = parts.join(' · ') + (e.note ? ` — ${e.note}` : '');

    out.push(
      makePointFeature(
        {
          id: e.id,
          title: e.title,
          source: e.provider,
          timestamp: e.launchTime,
          impact: impactFromLaunchStatus(e.status),
          category: 'launch_log',
          layerId: 'launch_log',
          description,
          opacity: opacityByAge(Math.abs(ageMs), windowMs),
          subKind: e.status,
          launchStatus: e.status,
          provider: e.provider,
          orbit: e.orbit ?? '',
          payload: e.payload ?? '',
          siteId: e.siteId ?? '',
          lng: e.location.lng,
          lat: e.location.lat,
        },
        e.location.lng,
        e.location.lat,
      ),
    );
  }
  return out;
}

const SEMI_KIND_LABEL: Record<string, string> = {
  foundry: '晶圆代工',
  memory: '存储芯片',
  idm: 'IDM',
};

/** 全球半导体晶圆厂 → feature；公开企业资料，不做时间窗过滤 */
function semiconductorsToFeatures(
  fabs: SemiconductorFab[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('semiconductors')) return [];
  const out: GeoJSONFeature[] = [];
  for (const f of fabs) {
    const kindLabel = SEMI_KIND_LABEL[f.kind] ?? f.kind;
    const statusLabel = f.status === 'planned' ? '建设/规划中' : '运行中';
    out.push(
      makePointFeature(
        {
          id: f.id,
          title: f.name,
          source: '公开半导体资料',
          timestamp: generatedAt,
          impact: f.impact,
          category: 'semiconductors',
          layerId: 'semiconductors',
          description: `${f.operator} · ${kindLabel} · ${statusLabel} — ${f.note}`,
          opacity: f.status === 'planned' ? 0.65 : 0.9,
          subKind: f.kind,
          operator: f.operator,
          lng: f.lng,
          lat: f.lat,
        },
        f.lng,
        f.lat,
      ),
    );
  }
  return out;
}

const GARRISON_COUNTRY_LABEL: Record<string, string> = {
  us: '美国',
  china: '中国',
  russia: '俄罗斯',
  france: '法国',
  uk: '英国',
};

/** 全球海外军事基地 → feature；公开资料，不做时间窗过滤 */
function garrisonsToFeatures(
  bases: GarrisonBase[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('garrisons')) return [];
  const out: GeoJSONFeature[] = [];
  for (const b of bases) {
    const countryLabel = GARRISON_COUNTRY_LABEL[b.country] ?? b.country;
    out.push(
      makePointFeature(
        {
          id: b.id,
          title: b.name,
          source: '公开军事地理资料',
          timestamp: generatedAt,
          impact: b.impact,
          category: 'garrisons',
          layerId: 'garrisons',
          description: `${countryLabel} · ${b.role}`,
          opacity: 0.9,
          subKind: b.country,
          operator: countryLabel,
          lng: b.lng,
          lat: b.lat,
        },
        b.lng,
        b.lat,
      ),
    );
  }
  return out;
}

const DSM_RESOURCE_LABEL: Record<string, string> = {
  nodules: '多金属结核',
  sulphides: '多金属硫化物',
  crusts: '富钴结壳',
};

/** 全球深海采矿 / ISA 勘探区 → feature；公开资料，不做时间窗过滤 */
function deepSeaMiningToFeatures(
  areas: SeabedMiningArea[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('deep_sea_mining')) return [];
  const out: GeoJSONFeature[] = [];
  for (const a of areas) {
    const resourceLabel = DSM_RESOURCE_LABEL[a.resource] ?? a.resource;
    out.push(
      makePointFeature(
        {
          id: a.id,
          title: a.name,
          source: '公开海底资源资料（ISA 等）',
          timestamp: generatedAt,
          impact: a.impact,
          category: 'deep_sea_mining',
          layerId: 'deep_sea_mining',
          description: `${resourceLabel} · ${a.note}`,
          opacity: 0.85,
          subKind: a.resource,
          lng: a.lng,
          lat: a.lat,
        },
        a.lng,
        a.lat,
      ),
    );
  }
  return out;
}

/** 全球板块 / 断层 → feature；公开地质事实，不做时间窗过滤 */
function tectonicsToFeatures(
  feats: TectonicFeature[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('tectonics')) return [];
  const out: GeoJSONFeature[] = [];
  for (const t of feats) {
    out.push(
      makePointFeature(
        {
          id: t.id,
          title: t.name,
          source: '公开地质资料',
          timestamp: generatedAt,
          impact: t.impact,
          category: 'tectonics',
          layerId: 'tectonics',
          description: t.note,
          opacity: 0.85,
          subKind: t.kind,
          lng: t.lng,
          lat: t.lat,
        },
        t.lng,
        t.lat,
      ),
    );
  }
  return out;
}

/** 海底光缆中断事件 → feature；带真实日期与出处（不做时间窗过滤，保留为参考事件） */
function cableIncidentsToFeatures(
  incidents: CableIncident[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('cable_incidents')) return [];
  const out: GeoJSONFeature[] = [];
  for (const c of incidents) {
    out.push(
      makePointFeature(
        {
          id: c.id,
          title: c.name,
          source: c.source,
          timestamp: generatedAt,
          impact: c.impact,
          category: 'cable_incidents',
          layerId: 'cable_incidents',
          description: `${c.date.slice(0, 10)} · ${c.note}`,
          opacity: 0.9,
          lng: c.lng,
          lat: c.lat,
        },
        c.lng,
        c.lat,
      ),
    );
  }
  return out;
}

const GS_KIND_LABEL: Record<string, string> = {
  deep_space: '深空网',
  tracking: '测控站',
};

/** 全球地面测控站 → feature；公开航天资料，不做时间窗过滤 */
function groundStationsToFeatures(
  stations: GroundStation[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('ground_stations')) return [];
  const out: GeoJSONFeature[] = [];
  for (const s of stations) {
    const kindLabel = GS_KIND_LABEL[s.kind] ?? s.kind;
    out.push(
      makePointFeature(
        {
          id: s.id,
          title: s.name,
          source: '公开航天测控资料',
          timestamp: generatedAt,
          impact: s.impact,
          category: 'ground_stations',
          layerId: 'ground_stations',
          description: `${s.operator} · ${kindLabel} — ${s.note}`,
          opacity: 0.9,
          subKind: s.kind,
          operator: s.operator,
          lng: s.lng,
          lat: s.lat,
        },
        s.lng,
        s.lat,
      ),
    );
  }
  return out;
}

const SAT_KIND_LABEL: Record<string, string> = {
  weather: '气象',
  comms: '通信',
  navigation: '导航',
};

/** 在轨 GEO 卫星 → feature（纬度固定 0，赤道同步轨道带）；公开资料，不做时间窗过滤 */
function satellitesToFeatures(
  sats: SatellitePoint[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('sat_constellations')) return [];
  const out: GeoJSONFeature[] = [];
  for (const s of sats) {
    const kindLabel = SAT_KIND_LABEL[s.kind] ?? s.kind;
    out.push(
      makePointFeature(
        {
          id: s.id,
          title: s.name,
          source: '公开航天资料',
          timestamp: generatedAt,
          impact: s.impact,
          category: 'sat_constellations',
          layerId: 'sat_constellations',
          description: `${s.operator} · GEO ${kindLabel}卫星 · 定点 ${s.lng}°E — ${s.note}`,
          opacity: 0.95,
          subKind: s.kind,
          operator: s.operator,
          lng: s.lng,
          lat: 0,
        },
        s.lng,
        0,
      ),
    );
  }
  return out;
}

const SPACE_EVENT_KIND_LABEL: Record<string, string> = {
  asat: '反卫星',
  collision: '在轨相撞',
  breakup: '解体/碎片',
  reentry: '再入',
  closeapproach: '抵近/规避',
};

/** 空天事件 → feature；带真实日期与出处（不做时间窗过滤，保留为参考事件） */
function spaceEventsToFeatures(
  events: SpaceEvent[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('space_events')) return [];
  const out: GeoJSONFeature[] = [];
  for (const e of events) {
    const kindLabel = SPACE_EVENT_KIND_LABEL[e.kind] ?? e.kind;
    out.push(
      makePointFeature(
        {
          id: e.id,
          title: e.name,
          source: e.source,
          timestamp: generatedAt,
          impact: e.impact,
          category: 'space_events',
          layerId: 'space_events',
          description: `${e.date.slice(0, 10)} · ${kindLabel} · ${e.note}`,
          opacity: 0.9,
          subKind: e.kind,
          lng: e.lng,
          lat: e.lat,
        },
        e.lng,
        e.lat,
      ),
    );
  }
  return out;
}

const TIMED_THEMATIC_LAYERS = new Set<LayerId>(['protests', 'climate']);

const HYDROCARBON_TYPE_LABEL: Record<string, string> = {
  石油: '石油',
  天然气: '天然气',
  油气: '油气',
};

/** 全球油气储藏 → feature；公开资料示意点，不做时间窗过滤 */
function hydrocarbonToFeatures(
  sites: HydrocarbonReserveSite[],
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('hydrocarbon_reserves')) return [];
  const out: GeoJSONFeature[] = [];
  for (const s of sites) {
    const typeLabel = HYDROCARBON_TYPE_LABEL[s.type] ?? s.type;
    const description = [
      `${s.nameZh}（${typeLabel}）`,
      `储量：${s.estimatedReserves}`,
      `国家/地区：${s.country} · ${s.status}`,
      s.note,
    ].join('\n');

    out.push(
      makePointFeature(
        {
          id: s.id,
          title: `${s.nameZh} · ${typeLabel}`,
          source: '公开油气资料（种子）',
          timestamp: generatedAt,
          impact: s.impact,
          category: 'hydrocarbon_reserves',
          layerId: 'hydrocarbon_reserves',
          description,
          production: s.estimatedReserves,
          hydrocarbonType: s.type,
          hydrocarbonCountry: s.country,
          hydrocarbonStatus: s.status,
          reserveTier: s.reserveTier,
          subKind: s.reserveTier,
          opacity: 0.88,
          lng: s.lng,
          lat: s.lat,
        },
        s.lng,
        s.lat,
      ),
    );
  }
  return out;
}

/** 全球主题图层点（经济中心 / 矿产 / 数据中心 / 抗议 / 气候） */
function thematicToFeatures(
  regionId: RegionId,
  active: Set<LayerId>,
  windowMs: number,
  latestMs: number | null,
  generatedAt: string,
): GeoJSONFeature[] {
  const effectiveLatest = latestMs ?? Date.now();
  const out: GeoJSONFeature[] = [];

  for (const p of getThematicPointsForRegion(regionId)) {
    if (!active.has(p.layerId)) continue;

    const eventMs = parseIsoMs(p.updatedAt ?? '');
    if (TIMED_THEMATIC_LAYERS.has(p.layerId)) {
      if (!isWithinTimeWindow(eventMs, effectiveLatest, windowMs, false)) continue;
    }

    const ageMs =
      eventMs != null ? effectiveLatest - eventMs : windowMs * 0.5;
    const timestamp =
      eventMs != null ? shiftTimestampToNow(eventMs, effectiveLatest) : generatedAt;

    out.push(
      thematicPointToFeature(p, {
        timestamp,
        opacity: TIMED_THEMATIC_LAYERS.has(p.layerId)
          ? opacityByAge(ageMs, windowMs)
          : 0.92,
        updatedAt: p.updatedAt ?? '',
      }),
    );
  }

  return out;
}

function pipelinesToFeatures(
  regionId: RegionId,
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('pipelines')) return [];
  return getPipelinesForRegion(regionId).map((p) => pipelineToFeature(p, generatedAt));
}

function cableRoutesToFeatures(
  regionId: RegionId,
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  if (!active.has('cables')) return [];
  return getSubmarineCablesForRegion(regionId).map((c) => cableRouteToFeature(c, generatedAt));
}

function daynightToFeatures(active: Set<LayerId>, generatedAt: string): GeoJSONFeature[] {
  if (!active.has('daynight')) return [];
  return buildDaynightFeatures(generatedAt);
}

/** 全球海洋空间信息图层 → feature；公开地理事实，不做时间窗过滤 */
function oceanLayersToFeatures(
  regionId: RegionId,
  active: Set<LayerId>,
  generatedAt: string,
): GeoJSONFeature[] {
  return [
    ...oceanPointsToFeatures(getMarineArchaeologyForRegion(regionId), 'marine_archaeology', active, generatedAt),
    ...oceanCurrentsToFeatures(getOceanCurrentsForRegion(regionId), active, generatedAt),
    ...oceanPointsToFeatures(getFisheriesForRegion(regionId), 'fisheries', active, generatedAt),
    ...oceanPointsToFeatures(getMonsoonForRegion(regionId), 'monsoon', active, generatedAt),
    ...oceanPointsToFeatures(getAtmosphericCirculationForRegion(regionId), 'atmospheric_circulation', active, generatedAt),
    ...oceanPointsToFeatures(getDeepExplorationForRegion(regionId), 'deep_exploration', active, generatedAt),
  ];
}

/**
 * 将区域 dataset 聚合为 GeoJSON FeatureCollection（服务端 /api/geodata 使用）
 */
export function buildRegionGeoJSON({
  regionId,
  timeRange,
  layers,
}: BuildGeoJSONOptions): GeodataResponse {
  const dataset = getRegionDataset(regionId);
  const active = parseLayersParam(layers);
  const windowMs = TIME_RANGE_MS[timeRange];
  const generatedAt = new Date().toISOString();

  if (!dataset) {
    return {
      type: 'FeatureCollection',
      features: [],
      meta: {
        region: regionId,
        timeRange,
        layers,
        generatedAt,
        featureCount: 0,
        latestEventAt: null,
      },
    };
  }

  const allTimes = collectTimestamps(dataset, active);
  const latestMs = allTimes.length ? Math.max(...allTimes) : null;
  const energyPointTimes = (dataset.energy?.points ?? [])
    .map((p) => parseIsoMs(p.updatedAt))
    .filter((ms): ms is number => ms != null);

  const regionalFacilities = dataset.facilities ?? [];
  const globalNuclear = getGlobalNuclearForRegion(regionId, regionalFacilities);
  const mergedFacilities = [...regionalFacilities, ...globalNuclear];

  const features: GeoJSONFeature[] = [
    ...eventsToFeatures(dataset.events ?? [], active, windowMs, latestMs),
    ...incidentsToFeatures(dataset.incidents ?? [], active, windowMs, latestMs),
    ...facilitiesToFeatures(mergedFacilities, active),
    ...personsToFeatures(dataset.persons ?? [], active),
    ...situationToFeatures(regionId, active, windowMs, latestMs),
    ...oilProducersToFeatures(
      dataset.energy?.oilProducers,
      active,
      windowMs,
      latestMs,
      energyPointTimes,
    ),
    ...infraToFeatures(
      getGlobalInfrastructureForRegion(regionId),
      active,
      generatedAt,
    ),
    ...launchSitesToFeatures(
      getGlobalLaunchSitesForRegion(regionId),
      active,
      generatedAt,
    ),
    ...launchLogToFeatures(
      getGlobalLaunchLogForRegion(regionId),
      active,
      LAUNCH_LOG_WINDOW_MS,
    ),
    ...semiconductorsToFeatures(
      getGlobalSemiconductorsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...garrisonsToFeatures(
      getGlobalGarrisonsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...deepSeaMiningToFeatures(
      getGlobalDeepSeaMiningForRegion(regionId),
      active,
      generatedAt,
    ),
    ...tectonicsToFeatures(
      getGlobalTectonicsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...cableIncidentsToFeatures(
      getGlobalCableIncidentsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...groundStationsToFeatures(
      getGlobalGroundStationsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...satellitesToFeatures(
      getGlobalSatellitesForRegion(regionId),
      active,
      generatedAt,
    ),
    ...spaceEventsToFeatures(
      getGlobalSpaceEventsForRegion(regionId),
      active,
      generatedAt,
    ),
    ...cableRoutesToFeatures(regionId, active, generatedAt),
    ...thematicToFeatures(regionId, active, windowMs, latestMs, generatedAt),
    ...pipelinesToFeatures(regionId, active, generatedAt),
    ...daynightToFeatures(active, generatedAt),
    ...oceanLayersToFeatures(regionId, active, generatedAt),
    ...hydrocarbonToFeatures(
      getGlobalHydrocarbonForRegion(regionId),
      active,
      generatedAt,
    ),
  ];

  const featureTimes = features
    .map((f) => parseIsoMs(String(f.properties?.timestamp ?? '')))
    .filter((ms): ms is number => ms != null);
  const latestEventAt =
    featureTimes.length > 0
      ? new Date(Math.max(...featureTimes)).toISOString()
      : null;

  return {
    type: 'FeatureCollection',
    features,
    meta: {
      region: regionId,
      timeRange,
      layers,
      generatedAt,
      featureCount: features.length,
      latestEventAt,
    },
  };
}

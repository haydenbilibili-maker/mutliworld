import type { Feature, FeatureCollection } from 'geojson';
import type { BboxFilter } from '@/lib/maritime/simulate';
import { formatCourse, formatSpeedKnots, simulateVessels } from '@/lib/maritime/simulate';
import { getAisVessels } from '@/lib/maritime/aisstream';
import type { MaritimeSource, VesselState } from '@/types/maritime';

export interface FetchMaritimeOptions {
  bbox?: BboxFilter | null;
  limit?: number;
}

export interface FetchMaritimeResult {
  vessels: VesselState[];
  source: MaritimeSource;
  sourceLabel: string;
  total: number;
  capped: boolean;
  simulated: boolean;
  error?: string;
}

function filterBbox(vessels: VesselState[], bbox: BboxFilter | null): VesselState[] {
  if (!bbox) return vessels;
  return vessels.filter(
    (v) =>
      v.lng >= bbox.lomin &&
      v.lng <= bbox.lomax &&
      v.lat >= bbox.lamin &&
      v.lat <= bbox.lamax,
  );
}

function capVessels(vessels: VesselState[], limit: number): { vessels: VesselState[]; capped: boolean } {
  const capped = vessels.length > limit;
  return { vessels: capped ? vessels.slice(0, limit) : vessels, capped };
}

/** 拉取海运船舶（AIS 实时优先，否则结构化模拟） */
export async function fetchMaritimeVessels(
  options: FetchMaritimeOptions = {},
): Promise<FetchMaritimeResult> {
  const { bbox = null, limit = 600 } = options;
  const apiKey = process.env.AISSTREAM_API_KEY?.trim();

  if (apiKey) {
    const { vessels: aisRaw, error } = await getAisVessels(apiKey);
    if (aisRaw.length > 0) {
      const filtered = filterBbox(aisRaw, bbox);
      const { vessels, capped } = capVessels(filtered, limit);
      return {
        vessels,
        source: 'aisstream',
        sourceLabel: 'AISStream AIS（近实时）',
        total: filtered.length,
        capped,
        simulated: false,
        error: error ?? undefined,
      };
    }
  }

  const simulated = simulateVessels({ bbox, limit });
  return {
    vessels: simulated,
    source: apiKey ? 'aisstream+simulated' : 'simulated',
    sourceLabel: apiKey
      ? '航运通道模拟（AISStream 暂不可用）'
      : '航运通道模拟（配置 AISSTREAM_API_KEY 可切换实时 AIS）',
    total: simulated.length,
    capped: false,
    simulated: true,
    error: apiKey ? 'AISStream 未返回数据，已回退模拟' : undefined,
  };
}

/** 转为 GeoJSON FeatureCollection */
export function vesselsToGeoJSON(vessels: VesselState[]): FeatureCollection {
  const features: Feature[] = vessels.map((v) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
    properties: {
      mmsi: v.mmsi,
      name: v.name,
      vesselType: v.vesselType,
      vesselTypeLabel: v.vesselTypeLabel,
      flag: v.flag,
      speedKnots: v.speedKnots,
      speedLabel: formatSpeedKnots(v.speedKnots),
      course: v.course ?? 0,
      courseLabel: formatCourse(v.course),
      destination: v.destination,
      heading: v.course ?? 0,
    },
  }));

  return { type: 'FeatureCollection', features };
}

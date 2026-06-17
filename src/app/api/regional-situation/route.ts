import type { RegionId } from '@/types/region';
import {
  getSituationCountsByRegion,
  getSituationForRegion,
  getSituationTypeCounts,
} from '@/regions/regional-situation';

const REGION_IDS: RegionId[] = [
  'global',
  'china',
  'middleeast',
  'asia_pacific',
  'north_america',
  'latin_america',
  'southeast_asia',
  'western_europe',
  'eastern_europe',
];

function isRegionId(value: string | null): value is RegionId {
  return value != null && REGION_IDS.includes(value as RegionId);
}

/**
 * GET /api/regional-situation?region=china
 * 返回指定区域的统一态势 feed（社媒 + 趋势 + 态势）。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('region');
  const region: RegionId = isRegionId(raw) ? raw : 'global';
  const items = getSituationForRegion(region);

  return Response.json(
    {
      region,
      items,
      count: items.length,
      typeCounts: getSituationTypeCounts(region),
      countsByRegion: getSituationCountsByRegion(),
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}

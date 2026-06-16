import { getTleMeta } from '@/lib/orbital/tleMeta.server';

/** GET /api/orbital/tle/meta — TLE 数据库元信息（只读） */
export async function GET() {
  return Response.json(getTleMeta(), {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}

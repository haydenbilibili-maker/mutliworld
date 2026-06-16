import { NextRequest, NextResponse } from 'next/server';
import { LAUNCH_LOG_SINCE_MS, LAUNCH_LOG_WINDOW_MS } from '../../../../data/launch-log/schema';
import { queryLaunchRecords } from '@/lib/launch-log/store';
import { recordToLogEntry } from '@/lib/launch-log/convert';
import type { LaunchLogEntry } from '@/regions/global.launchLog';

export const dynamic = 'force-dynamic';

function parseSince(value: string | null): number {
  if (value && LAUNCH_LOG_SINCE_MS[value] != null) return LAUNCH_LOG_SINCE_MS[value];
  if (value?.endsWith('d')) {
    const days = Number.parseInt(value.slice(0, -1), 10);
    if (Number.isFinite(days) && days > 0) return days * 24 * 60 * 60 * 1000;
  }
  return LAUNCH_LOG_WINDOW_MS;
}

/**
 * GET /api/launch-log?since=1y&limit=100&offset=0
 *
 * Response:
 * {
 *   launches: LaunchLogEntry[],
 *   meta: { total, limit, offset, since, generatedAt }
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sinceMs = parseSince(searchParams.get('since'));
  const limit = Math.min(
    Math.max(Number.parseInt(searchParams.get('limit') ?? '200', 10) || 200, 1),
    1000,
  );
  const offset = Math.max(Number.parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0);
  const sinceLabel = searchParams.get('since') ?? '1y';

  const { launches, total } = queryLaunchRecords({ sinceMs, limit, offset });
  const entries: LaunchLogEntry[] = launches.map(recordToLogEntry);

  return NextResponse.json({
    launches: entries,
    meta: {
      total,
      limit,
      offset,
      since: sinceLabel,
      sinceMs,
      generatedAt: new Date().toISOString(),
    },
  });
}

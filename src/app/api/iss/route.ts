import { NextResponse } from 'next/server';
import { fetchWtiPosition } from '@/lib/space/wheretheiss.server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * 国际空间站(ISS)实时星下点 — 宇宙层。
 * 真实数据：wheretheiss.at 公开 API（NORAD 25544）；不可达时 TLE 传播兜底。
 */
export async function GET() {
  try {
    const body = await fetchWtiPosition(25544, {
      label: 'ISS',
      liveSource: 'wheretheiss.at（NORAD 25544 实时）',
    });
    return NextResponse.json(body, {
      headers: { 'Cache-Control': body.stale ? 'no-store' : 'public, s-maxage=5' },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'ISS 获取失败' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

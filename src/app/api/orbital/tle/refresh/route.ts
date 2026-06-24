export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { refreshTleData } from '@/lib/orbital/tleRefresh';

/** POST /api/orbital/tle/refresh — 执行 node scripts/fetch-tle.js 拉取最新 TLE */
export async function POST() {
  if (!isAdminEnabled()) {
    return NextResponse.json(
      { ok: false, error: '未授权：仅开发环境或启用管理后台时可用' },
      { status: 403 },
    );
  }

  try {
    const result = await refreshTleData();
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'TLE 刷新失败';
    return NextResponse.json(
      { ok: false, error: message, count: 0, fetchedAt: new Date().toISOString(), counts: { station: 0, satellite: 0, debris: 0 }, source: '', summary: message },
      { status: 500 },
    );
  }
}

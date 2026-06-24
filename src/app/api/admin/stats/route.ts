export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { getAdminStats } from '@/lib/admin/stats';

/** 管理后台聚合统计（只读 MVP） */
export async function GET() {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: '管理后台未启用' }, { status: 403, headers: { 'Cache-Control': 'no-store, private' } });
  }

  try {
    const stats = getAdminStats();
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'no-store, private' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '统计获取失败';
    return NextResponse.json(
      { error: message, generatedAt: new Date().toISOString() },
      { status: 500, headers: { 'Cache-Control': 'no-store, private' } },
    );
  }
}

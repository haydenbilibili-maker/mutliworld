import { NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { getAdminStats } from '@/lib/admin/stats';

/** 管理后台聚合统计（只读 MVP） */
export async function GET() {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: '管理后台未启用' }, { status: 403 });
  }

  const stats = getAdminStats();
  return NextResponse.json(stats);
}

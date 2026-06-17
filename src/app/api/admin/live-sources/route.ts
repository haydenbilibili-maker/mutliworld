import { NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { probeLiveSources } from '@/lib/admin/live-sources';

/** 管理后台实时数据源探测 */
export async function GET() {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: '管理后台未启用' }, { status: 403 });
  }

  const sources = await probeLiveSources();
  const okCount = sources.filter((s) => s.status === 'ok').length;
  const degradedCount = sources.filter((s) => s.status === 'degraded').length;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: {
      total: sources.length,
      ok: okCount,
      degraded: degradedCount,
      error: sources.length - okCount - degradedCount,
    },
    sources,
  });
}

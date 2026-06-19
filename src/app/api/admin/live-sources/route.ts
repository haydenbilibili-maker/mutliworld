import { NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { probeLiveSources } from '@/lib/admin/live-sources';

/** 管理后台实时数据源探测 */
export async function GET() {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: '管理后台未启用' }, { status: 403, headers: { 'Cache-Control': 'no-store, private' } });
  }

  try {
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
    }, {
      headers: { 'Cache-Control': 'no-store, private' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '数据源探测失败';
    return NextResponse.json(
      { error: message, generatedAt: new Date().toISOString(), summary: { total: 0, ok: 0, degraded: 0, error: 0 }, sources: [] },
      { status: 502, headers: { 'Cache-Control': 'no-store, private' } },
    );
  }
}

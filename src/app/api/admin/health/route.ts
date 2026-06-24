export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { isAdminEnabled } from '@/lib/admin/config';
import { runAdminHealthChecks } from '@/lib/admin/health';

/** 管理后台 API 健康探测（服务端 ping 各公开路由） */
export async function GET(req: NextRequest) {
  if (!isAdminEnabled()) {
    return NextResponse.json({ error: '管理后台未启用' }, { status: 403, headers: { 'Cache-Control': 'no-store, private' } });
  }

  try {
    const results = await runAdminHealthChecks(req);
    const okCount = results.filter((r) => r.ok).length;

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      summary: {
        total: results.length,
        ok: okCount,
        failed: results.length - okCount,
      },
      endpoints: results,
    }, {
      headers: { 'Cache-Control': 'no-store, private' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '健康检查失败';
    return NextResponse.json(
      { error: message, generatedAt: new Date().toISOString(), summary: { total: 0, ok: 0, failed: 0 }, endpoints: [] },
      { status: 502, headers: { 'Cache-Control': 'no-store, private' } },
    );
  }
}

import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { isAdminEnabled } from '@/lib/admin/config';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enabled = isAdminEnabled();

  return (
    <div className="flex min-h-screen flex-col bg-dashboard-bg text-white lg:flex-row">
      <AdminSidebar />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="hidden items-center justify-between border-b border-dashboard-neutral/15 px-6 py-3 lg:flex">
          <p className="text-xs text-dashboard-neutral/55">
            只读 MVP · 开发/显式开启时可用
          </p>
          <Link
            href="/"
            className="rounded-lg border border-dashboard-military/25 bg-dashboard-military/10 px-3 py-1.5 text-xs font-medium text-dashboard-military hover:bg-dashboard-military/20"
          >
            ← 返回态势地图
          </Link>
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {!enabled ? (
            <div className="mx-auto max-w-lg rounded-xl border border-dashboard-neutral/20 bg-white/[0.02] p-6 text-center">
              <h1 className="text-lg font-semibold text-white">管理后台未启用</h1>
              <p className="mt-2 text-sm text-dashboard-neutral/70">
                请设置环境变量 <code className="text-dashboard-military">NEXT_PUBLIC_ADMIN_ENABLED=true</code>{' '}
                或在开发模式下访问。
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm text-dashboard-military hover:underline"
              >
                返回地图
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';

export default function AdminCachePage() {
  const { cachePolicies } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="缓存策略"
        description="服务端与静态文件缓存说明：Geodata、TLE、发射日志及各实时 API 代理的 TTL 与刷新方式。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '运维' },
          { label: '缓存策略' },
        ]}
      />

      <div className="space-y-4">
        {cachePolicies.map((policy) => (
          <article
            key={policy.id}
            className="rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5"
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-medium text-white">{policy.name}</h2>
              <span className="rounded bg-dashboard-neutral/10 px-2 py-0.5 font-mono text-[10px] text-dashboard-neutral/60">
                {policy.id}
              </span>
            </div>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-dashboard-neutral/55">存储位置</dt>
                <dd className="font-mono text-xs text-dashboard-neutral/75">{policy.location}</dd>
              </div>
              <div>
                <dt className="text-xs text-dashboard-neutral/55">TTL / 刷新</dt>
                <dd className="text-dashboard-neutral/80">{policy.ttl}</dd>
              </div>
            </dl>
            {policy.refreshCommand && (
              <p className="mt-2 font-mono text-xs text-dashboard-military">{policy.refreshCommand}</p>
            )}
            {policy.notes && (
              <p className="mt-2 text-xs text-dashboard-neutral/55">{policy.notes}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

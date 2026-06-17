import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminBadge } from '@/components/admin/AdminBadge';
import { getAdminStats } from '@/lib/admin/stats';
import { isAdminEnabled } from '@/lib/admin/config';

const CATEGORY_LABELS = {
  admin: '管理后台',
  runtime: '运行时',
  integration: '第三方集成',
} as const;

export default function AdminFeatureFlagsPage() {
  const { featureFlags } = getAdminStats();
  const adminOn = isAdminEnabled();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="功能开关"
        description="环境变量与运行时开关：管理后台门禁、第三方 API 覆盖等（只读展示）。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '运维' },
          { label: '功能开关' },
        ]}
      />

      <div className="mb-6 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white">当前管理后台状态</span>
          <AdminBadge
            variant={adminOn ? 'success' : 'danger'}
            label={adminOn ? '已启用' : '未启用'}
          />
        </div>
        <p className="mt-2 text-xs text-dashboard-neutral/55">
          开发模式（NODE_ENV=development）自动可用；生产环境需设置 NEXT_PUBLIC_ADMIN_ENABLED=true
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">变量</th>
              <th className="px-3 py-2 font-medium">当前值</th>
              <th className="px-3 py-2 font-medium">分类</th>
              <th className="px-3 py-2 font-medium">说明</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {featureFlags.map((flag) => (
              <tr key={flag.key} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-xs text-dashboard-military">{flag.key}</td>
                <td className="px-3 py-2 font-mono text-xs text-white">{flag.value}</td>
                <td className="px-3 py-2 text-xs text-dashboard-neutral/60">
                  {CATEGORY_LABELS[flag.category]}
                </td>
                <td className="px-3 py-2 text-xs text-dashboard-neutral/70">{flag.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getAdminStats } from '@/lib/admin/stats';

export default function AdminMarketsPage() {
  const { markets } = getAdminStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="股市指数"
        description="STOCK_INDEX_SEEDS 种子：A 股 / 港股 / 美股主要股指，带 regionIds 供 contentFilter 区域过滤。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '股市指数' },
        ]}
      />

      <p className="mb-6 text-xs text-dashboard-neutral/55">
        共 {markets.stockIndexCount} 个指数 · FX/加密货币为全球通用项（不在此表）
      </p>

      <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
            <tr>
              <th className="px-3 py-2 font-medium">名称</th>
              <th className="px-3 py-2 font-medium">代码</th>
              <th className="px-3 py-2 font-medium">市场</th>
              <th className="px-3 py-2 font-medium">regionIds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-neutral/10">
            {markets.indices.map((idx) => (
              <tr key={idx.id} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 text-white">{idx.label}</td>
                <td className="px-3 py-2 font-mono text-xs text-dashboard-neutral/60">{idx.symbol}</td>
                <td className="px-3 py-2 text-dashboard-neutral/75">{idx.region}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {idx.regionIds.map((rid) => (
                      <span
                        key={rid}
                        className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-dashboard-neutral/70"
                      >
                        {rid}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

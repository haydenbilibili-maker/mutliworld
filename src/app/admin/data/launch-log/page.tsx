import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatBytes, formatDateTime } from '@/lib/admin/format';
import { getLaunchLogDbMeta } from '@/lib/admin/stats';
import { queryLaunchRecords } from '@/lib/launch-log/store';

const STATUS_LABELS: Record<string, string> = {
  success: '成功',
  failure: '失败',
  partial: '部分成功',
  scheduled: '计划',
  scrubbed: '取消',
};

export default function AdminLaunchLogPage() {
  const meta = getLaunchLogDbMeta();
  const { launches } = queryLaunchRecords({ limit: 20 });

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="发射日志数据"
        description="本地结构化数据库 data/launch-log/launches.json，供地图发射日志图层与侧栏使用。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '发射日志' },
        ]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaBox label="记录总数" value={String(meta.count)} />
        <MetaBox label="文件状态" value={meta.exists ? '已存在' : '种子兜底'} />
        <MetaBox label="抓取时间" value={formatDateTime(meta.fetchedAt)} />
        <MetaBox
          label="最近发射"
          value={
            launches[0]?.launchTime
              ? formatDateTime(launches[0].launchTime)
              : '—'
          }
          warn={
            launches[0]?.launchTime
              ? Date.now() - Date.parse(launches[0].launchTime) > 45 * 24 * 3600_000
              : false
          }
          hint="若超过 45 天无新记录，建议 npm run data:launches"
        />
        <MetaBox label="文件大小" value={meta.fileSize ? formatBytes(meta.fileSize) : '—'} />
      </div>

      <section className="mb-8 rounded-xl border border-dashboard-neutral/15 bg-white/[0.02] p-4 sm:p-5">
        <h2 className="mb-2 text-sm font-medium text-white">刷新数据</h2>
        <p className="mb-3 text-sm text-dashboard-neutral/70">
          在项目根目录执行以下命令，从 Launch Library 2 拉取最新发射记录并写入本地 JSON：
        </p>
        <pre className="overflow-x-auto rounded-lg bg-black/40 px-4 py-3 font-mono text-sm text-dashboard-military">
          npm run data:launches
        </pre>
        <p className="mt-3 text-xs text-dashboard-neutral/50">
          数据源：{meta.source} · MVP 仅支持命令行刷新，不提供在线写入 API。
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-white">最近 20 条发射</h2>
        <div className="overflow-x-auto rounded-xl border border-dashboard-neutral/15">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-dashboard-neutral/15 bg-white/[0.03] text-xs text-dashboard-neutral/60">
              <tr>
                <th className="px-3 py-2 font-medium">时间</th>
                <th className="px-3 py-2 font-medium">任务</th>
                <th className="px-3 py-2 font-medium">火箭</th>
                <th className="px-3 py-2 font-medium">发射场</th>
                <th className="px-3 py-2 font-medium">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-neutral/10">
              {launches.map((launch) => (
                <tr key={launch.id} className="hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums text-dashboard-neutral/80">
                    {formatDateTime(launch.launchTime)}
                  </td>
                  <td className="max-w-[12rem] truncate px-3 py-2 text-white" title={launch.name}>
                    {launch.name}
                  </td>
                  <td className="px-3 py-2 text-dashboard-neutral/80">{launch.rocket}</td>
                  <td className="px-3 py-2 text-dashboard-neutral/80">{launch.siteName}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={launch.status} />
                  </td>
                </tr>
              ))}
              {launches.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-dashboard-neutral/50">
                    暂无发射记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetaBox({
  label,
  value,
  warn,
  hint,
}: {
  label: string;
  value: string;
  warn?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={[
        'rounded-xl border bg-white/[0.02] p-4',
        warn ? 'border-amber-500/40' : 'border-dashboard-neutral/15',
      ].join(' ')}
    >
      <p className="text-xs text-dashboard-neutral/55">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${warn ? 'text-amber-300' : 'text-white'}`}>{value}</p>
      {hint && <p className="mt-1 text-[10px] text-dashboard-neutral/50">{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const color =
    status === 'success'
      ? 'text-green-400'
      : status === 'failure'
        ? 'text-red-400'
        : 'text-dashboard-neutral/70';
  return <span className={color}>{label}</span>;
}

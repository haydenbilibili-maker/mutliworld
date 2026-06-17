import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminRegionsTable } from '@/components/admin/AdminRegionsTable';
import { getRegionFeatureStats } from '@/lib/admin/stats';

export default function AdminRegionsPage() {
  const regions = getRegionFeatureStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="区域数据集"
        description="九区域 ALL_REGION_IDS 注册表：dataNamespace、dataset 挂载、种子要素统计与地图预览链接。"
        breadcrumbs={[
          { label: '管理后台', href: '/admin' },
          { label: '数据管理' },
          { label: '区域数据集' },
        ]}
      />

      <AdminRegionsTable regions={regions} />
    </div>
  );
}

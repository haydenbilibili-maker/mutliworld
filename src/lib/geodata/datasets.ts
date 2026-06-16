import type { RegionDataset } from '@/types/region';
import type { RegionId } from '@/types/region';
import { getRegion } from '@/regions';

/** 服务端 GeoJSON 聚合用的区域数据集（从区域注册表读取） */
export function getRegionDataset(regionId: RegionId): RegionDataset | null {
  return getRegion(regionId)?.dataset ?? null;
}

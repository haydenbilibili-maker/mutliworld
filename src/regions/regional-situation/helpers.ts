import type {
  RegionalSituationItem,
  SituationDomain,
  SituationItemType,
  SituationSentiment,
} from '@/types/regional-situation';
import type { RegionId } from '@/types/region';

/** 相对当前（2026-06-17）的 ISO 时间戳 */
export function ts(daysAgo: number, hour = 8, minute = 0): string {
  const d = new Date(Date.UTC(2026, 5, 17 - daysAgo, hour, minute));
  return d.toISOString();
}

type SituationOpts = Partial<
  Pick<RegionalSituationItem, 'lng' | 'lat' | 'platform' | 'engagement'>
>;

/** 快捷构造区域态势条目 */
export function situation(
  id: string,
  regionId: RegionId,
  type: SituationItemType,
  title: string,
  summary: string,
  sentiment: SituationSentiment,
  heat: number,
  tags: SituationDomain[],
  timestamp: string,
  extra?: SituationOpts,
): RegionalSituationItem {
  return {
    id,
    regionId,
    type,
    title,
    summary,
    sentiment,
    heat,
    tags,
    timestamp,
    ...extra,
  };
}

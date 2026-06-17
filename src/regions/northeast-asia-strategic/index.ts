import type { NortheastAsiaModule } from '@/types/northeast-asia-strategic';
import { OVERVIEW_MODULE } from './overview';
import { FIVE_POWERS_MODULE } from './five-powers';
import { US_ALLIANCE_MODULE } from './us-alliance';
import { PENINSULA_MODULE } from './peninsula';
import { JAPAN_RUSSIA_MODULE } from './japan-russia';
import { CHINA_US_REBALANCE_MODULE } from './china-us-rebalance';

/** 东北亚地缘博弈 · 全部深度阅读模块（有序） */
export const NORTHEAST_ASIA_STRATEGIC_MODULES: NortheastAsiaModule[] = [
  OVERVIEW_MODULE,
  FIVE_POWERS_MODULE,
  US_ALLIANCE_MODULE,
  PENINSULA_MODULE,
  JAPAN_RUSSIA_MODULE,
  CHINA_US_REBALANCE_MODULE,
];

export const NORTHEAST_ASIA_STRATEGIC_MODULE_MAP: Record<string, NortheastAsiaModule> =
  Object.fromEntries(NORTHEAST_ASIA_STRATEGIC_MODULES.map((m) => [m.id, m]));

export {
  OVERVIEW_MODULE,
  FIVE_POWERS_MODULE,
  US_ALLIANCE_MODULE,
  PENINSULA_MODULE,
  JAPAN_RUSSIA_MODULE,
  CHINA_US_REBALANCE_MODULE,
};

export {
  NORTHEAST_ASIA_EVENTS,
  NORTHEAST_ASIA_INCIDENTS,
  NORTHEAST_ASIA_FACILITIES,
  NORTHEAST_ASIA_BOUNDS,
} from './geodata';

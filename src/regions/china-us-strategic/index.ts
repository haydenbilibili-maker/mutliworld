import type { StrategicModule } from '@/types/china-us-strategic';
import { OVERVIEW_MODULE } from './overview';
import { TRADE_TECH_MODULE } from './trade-tech';
import { MILITARY_MODULE } from './military';
import { ALLIANCE_MODULE } from './alliance';
import { DIPLOMACY_MODULE } from './diplomacy';
import { SCENARIOS_MODULE } from './scenarios';

/** 中美战略博弈 · 全部深度阅读模块（有序） */
export const CHINA_US_STRATEGIC_MODULES: StrategicModule[] = [
  OVERVIEW_MODULE,
  TRADE_TECH_MODULE,
  MILITARY_MODULE,
  ALLIANCE_MODULE,
  DIPLOMACY_MODULE,
  SCENARIOS_MODULE,
];

export const CHINA_US_STRATEGIC_MODULE_MAP: Record<string, StrategicModule> =
  Object.fromEntries(CHINA_US_STRATEGIC_MODULES.map((m) => [m.id, m]));

export {
  OVERVIEW_MODULE,
  TRADE_TECH_MODULE,
  MILITARY_MODULE,
  ALLIANCE_MODULE,
  DIPLOMACY_MODULE,
  SCENARIOS_MODULE,
};

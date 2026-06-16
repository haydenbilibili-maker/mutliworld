/**
 * 区域模块入口 — LIFEOS-005
 *
 * 导入即注册所有区域；其余代码统一从 '@/regions' 取注册表 API。
 */

import { registerRegion } from './registry';
import { globalRegion } from './global';
import { chinaRegion } from './china';
import { middleEastRegion } from './middleeast';
import {
  asiaPacificRegion,
  northAmericaRegion,
  latinAmericaRegion,
  southeastAsiaRegion,
  westernEuropeRegion,
  easternEuropeRegion,
} from './world-regions';

// 注册（新增区域：建文件 + 在此注册）
registerRegion(globalRegion);
registerRegion(chinaRegion);
registerRegion(middleEastRegion);
registerRegion(asiaPacificRegion);
registerRegion(northAmericaRegion);
registerRegion(latinAmericaRegion);
registerRegion(southeastAsiaRegion);
registerRegion(westernEuropeRegion);
registerRegion(easternEuropeRegion);

export * from './registry';
export {
  globalRegion,
  chinaRegion,
  middleEastRegion,
  asiaPacificRegion,
  northAmericaRegion,
  latinAmericaRegion,
  southeastAsiaRegion,
  westernEuropeRegion,
  easternEuropeRegion,
};

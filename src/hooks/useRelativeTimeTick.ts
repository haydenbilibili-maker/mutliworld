'use client';

/**
 * 相对时间自动刷新 Hook（信息增密 · 时效性提升专项）
 *
 * 解决核心痛点：页面长时间停留后，「3 分钟前」这类相对时间标签不会自动更新，
 * 仍停留在旧值，丧失「实时」语义。本 hook 提供一个周期性递增的 tick，
 * 驱动依赖 `timeAgo` / `ageLabel` / `countdown` 的组件重算相对时间。
 *
 * 设计要点：
 *  - 单 tick 即可驱动一个组件内多处相对时间重算，避免每处各起 setInterval。
 *  - 严格遵守防抖约束：tick 仅触发 React 状态更新（轻量数字），不触碰地图源；
 *    且挂载/卸载干净（clearInterval），页面不可见时暂停以省电。
 *  - 精度自适应：默认 30s（分钟级龄期足够），高频场景（如卫星 12s 轮询）可传更短间隔。
 */

import { useEffect, useState } from 'react';

/**
 * 返回一个每 `intervalMs` 毫秒（默认 30s）递增的数字。
 * 组件以其为依赖，使 `useMemo(() => timeAgo(ts, tick * 0 + Date.now()), [tick])`
 * 这类计算周期性重算。
 *
 * @param intervalMs 刷新间隔，默认 30000（30 秒，分钟级龄期足够且省电）
 * @param enabled 是否启用，默认 true（可按层级/可见性条件关闭）
 */
export function useRelativeTimeTick(intervalMs = 30_000, enabled = true): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    // 页面不可见时暂停轮询（省电、避免后台无效刷新），可见时立即补一次
    let timer: number | undefined;
    const start = () => {
      if (timer != null) return;
      setTick((t) => t + 1); // 立即补算一次（从后台切回时龄期可能已陈旧）
      timer = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    };
    const stop = () => {
      if (timer == null) return;
      window.clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    if (document.visibilityState === 'visible') start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, enabled]);

  return tick;
}

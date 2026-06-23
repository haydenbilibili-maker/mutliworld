'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 数字滚动到目标值（缓出 cubic；尊重 prefers-reduced-motion 则直接落定）。
 * 独立 RAF，无第三方依赖。target 变化时从当前显示值平滑过渡。
 */
export function useCountUp(target: number | null, ms = 700): number {
  const [v, setV] = useState(0);
  const raf = useRef<number | null>(null);
  const curRef = useRef(0);

  useEffect(() => {
    if (target == null) { setV(0); curRef.current = 0; return; }
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setV(target); curRef.current = target; return; }
    const from = curRef.current;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const next = from + (target - from) * (1 - Math.pow(1 - p, 3));
      curRef.current = next;
      setV(next);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, ms]);

  return v;
}


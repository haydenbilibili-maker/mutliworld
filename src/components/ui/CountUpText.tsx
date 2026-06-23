'use client';

import { useMemo } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

/**
 * 数字滚动文本 — 解析字符串值开头数字并 count-up，保留非数字后缀。
 * 例：'7.8' → '0.0…7.8'；'100k' → '0…100k'；'G4' 不解析（无前导数字）原样返回。
 */
export function CountUpText({ value, className, decimals }: { value: string; className?: string; decimals?: number }) {
  const parsed = useMemo(() => {
    const m = /^(-?\d+(?:\.\d+)?)(.*)$/.exec(value.trim());
    if (!m) return null;
    const num = parseFloat(m[1]);
    if (!Number.isFinite(num)) return null;
    const dec = decimals ?? (m[1].includes('.') ? m[1].split('.')[1].length : 0);
    return { num, suffix: m[2], dec };
  }, [value, decimals]);

  const animated = useCountUp(parsed ? parsed.num : null, 700);

  if (!parsed) return <span className={className}>{value}</span>;
  return <span className={className}>{animated.toFixed(parsed.dec)}{parsed.suffix}</span>;
}

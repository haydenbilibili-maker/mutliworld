'use client';

/**
 * 品牌标识 — 万象幻测 · OmniLens（页面左上角品牌位）
 * 青金配色：钴青光环 + 鎏金内核，象征「包罗万象的观测之镜」。点击打开「关于/致敬」面板。
 */

import { BRAND } from '@/lib/brand';
import { useBrandStore } from '@/store/useBrandStore';

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = '' }: BrandMarkProps) {
  const setAboutOpen = useBrandStore((s) => s.setAboutOpen);

  return (
    <button
      type="button"
      onClick={() => setAboutOpen(true)}
      title={`${BRAND.full} — 关于与致敬`}
      aria-label={`${BRAND.full}，点击查看关于`}
      className={`group flex items-center gap-2 rounded-lg border border-brand-gold/25 bg-dashboard-bg/80 px-2.5 py-1.5 shadow-lg backdrop-blur-sm transition-colors hover:border-brand-gold/55 ${className}`}
    >
      {/* 镜·象 标记 */}
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <defs>
          <radialGradient id="bm-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F4D08A" />
            <stop offset="100%" stopColor="#E8B563" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="13" fill="none" stroke="#3FC8E0" strokeWidth="1.6" opacity="0.85" />
        <circle cx="16" cy="16" r="9" fill="none" stroke="#1B6E8C" strokeWidth="1.1" opacity="0.8" />
        {/* 经纬十字 */}
        <path d="M16 3 V29 M3 16 H29" stroke="#3FC8E0" strokeWidth="0.7" opacity="0.45" />
        <circle cx="16" cy="16" r="4.4" fill="url(#bm-core)" />
        <circle cx="16" cy="16" r="4.4" fill="none" stroke="#0A0E17" strokeWidth="0.8" />
      </svg>

      <span className="flex flex-col items-start leading-none">
        <span className="bg-gradient-to-r from-brand-gold-bright to-brand-gold bg-clip-text text-[15px] font-semibold tracking-[0.18em] text-transparent">
          {BRAND.nameZh}
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-brand-cyan/80">
          {BRAND.nameEn}
        </span>
      </span>
    </button>
  );
}

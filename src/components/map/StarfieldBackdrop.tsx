'use client';

/**
 * 星空背景 — 3D 地球太空视觉增强（三位一体宇宙层）
 *
 * 置于地图画布之下。当（手动 globe 或进入宇宙层）时显示。
 * 前向兼容：v5 球面外为透明 → 透出星空；v4 地图背景不透明 → 自然遮住，零副作用。
 * 纯 CSS 星点，无外部依赖。
 */

import { useMapStore } from '@/store/useMapStore';

interface StarfieldBackdropProps {
  className?: string;
}

export function StarfieldBackdrop({ className = '' }: StarfieldBackdropProps) {
  const globe = useMapStore((s) => s.globe);
  const activeTier = useMapStore((s) => s.activeTier);
  const show = globe || activeTier === 'space';

  if (!show) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #0b1224 0%, #060a16 55%, #02040a 100%)',
      }}
    >
      {/* 多层星点（不同密度/亮度），用 radial-gradient 平铺 */}
      <div
        className="absolute inset-0 star-layer-a"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #fff, transparent), radial-gradient(1px 1px at 80px 120px, #cde3ff, transparent), radial-gradient(1.5px 1.5px at 160px 60px, #fff, transparent), radial-gradient(1px 1px at 240px 180px, #e8f0ff, transparent)',
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 250px',
          opacity: 0.7,
        }}
      />
      <div
        className="absolute inset-0 star-layer-b"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 60px 90px, #fff, transparent), radial-gradient(1px 1px at 200px 40px, #bcd2ff, transparent), radial-gradient(2px 2px at 120px 200px, #fff, transparent)',
          backgroundRepeat: 'repeat',
          backgroundSize: '420px 360px',
          opacity: 0.5,
        }}
      />
      <style>{`
        @keyframes twinkleA { 0%,100% { opacity: 0.7 } 50% { opacity: 0.35 } }
        @keyframes twinkleB { 0%,100% { opacity: 0.5 } 50% { opacity: 0.8 } }
        .star-layer-a { animation: twinkleA 6s ease-in-out infinite; }
        .star-layer-b { animation: twinkleB 9s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

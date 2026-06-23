'use client';

/**
 * 骨架屏 — 加载态占位，shimmer 流光（纯 CSS，尊重 reduced-motion）。
 * 替代「加载中…」文字，降低等待焦虑、提升质感。独立于地图重绘。
 */

export function SkeletonLine({ w = '100%', h = 10, className = '' }: { w?: string | number; h?: number; className?: string }) {
  return <span className={`sk-shimmer block rounded ${className}`} style={{ width: w, height: h }} aria-hidden />;
}

export function SkeletonRows({ rows = 4, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5">
          <span className="sk-shimmer h-2 w-2 shrink-0 rounded-full" />
          <span className="sk-shimmer h-2.5 flex-1 rounded" style={{ maxWidth: `${70 - i * 6}%` }} />
          <span className="sk-shimmer h-2.5 w-8 shrink-0 rounded" />
        </div>
      ))}
      <style jsx global>{`
        .sk-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.05) 63%);
          background-size: 400% 100%;
          animation: skShimmer 1.4s ease-in-out infinite;
        }
        @keyframes skShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
        @media (prefers-reduced-motion: reduce) { .sk-shimmer { animation: none; } }
      `}</style>
    </div>
  );
}

/** 表格骨架屏 — 列对齐的等宽占位，适合发射日志等表格加载态 */
export function SkeletonTable({ rows = 6, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-3 px-2 py-1.5">
          {Array.from({ length: cols }).map((__, c) => (
            <span
              key={c}
              className="sk-tbl-shimmer h-2.5 rounded"
              style={{ flex: c === 0 ? '0 0 3.5rem' : c === cols - 1 ? '0 0 3rem' : '1 1 auto', maxWidth: c === 0 ? undefined : `${60 + ((r + c) % 3) * 12}%` }}
            />
          ))}
        </div>
      ))}
      <style jsx global>{`
        .sk-tbl-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.05) 63%);
          background-size: 400% 100%;
          animation: skShimmer 1.4s ease-in-out infinite;
        }
        @keyframes skShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
        @media (prefers-reduced-motion: reduce) { .sk-tbl-shimmer { animation: none; } }
      `}</style>
    </div>
  );
}

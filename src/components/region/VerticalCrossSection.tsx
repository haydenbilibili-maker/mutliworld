'use client';

/**
 * 垂直剖面侧视图 — 球面/平面通用的「天—地—海」高度剖面
 *
 * 把剖面点附近三层要素按真实示意高度/深度画在一根纵轴上：
 * GEO(36000km) → LEO/ISS → 地表(0) → 海床 → 海沟/震源(-km)。
 * 这是球面地图本身看不出的「垂直」维度，补足招牌交互。
 */

import type { ProfileBuckets, ProfileItem } from '@/lib/profile/computeProfile';
import type { SpatialTier } from '@/types/tier';

interface VerticalCrossSectionProps {
  buckets: ProfileBuckets;
  onPick?: (it: ProfileItem) => void;
}

const W = 268;
const H = 196;
const RAIL_X = 30;
const SURFACE_Y = 108;

const TIER_COLOR: Record<SpatialTier, string> = {
  space: '#38bdf8',
  surface: '#facc15',
  subsurface: '#2dd4bf',
};

/** 高度/深度(km) → y 像素（分段压缩，GEO 顶 / 海沟底） */
function yForAlt(a: number): number {
  if (a >= 2000) {
    const t = (Math.log10(a) - Math.log10(2000)) / (Math.log10(36000) - Math.log10(2000));
    return 45 - Math.max(0, Math.min(1, t)) * 33; // 45..12
  }
  if (a >= 0) {
    return SURFACE_Y - (a / 2000) * (SURFACE_Y - 48); // 108..48
  }
  const t = Math.sqrt(Math.min(-a, 700) / 700);
  return SURFACE_Y + t * (190 - SURFACE_Y); // 108..190
}

function altLabel(a: number): string {
  if (a >= 1000) return `${Math.round(a).toLocaleString()}km`;
  if (a > 0) return `${Math.round(a)}km`;
  if (a === 0) return '0';
  return `-${Math.round(-a)}km`;
}

export function VerticalCrossSection({ buckets, onPick }: VerticalCrossSectionProps) {
  // 每层取最近 2 项，合并后按 y 排序错位避免重叠
  const items: ProfileItem[] = [
    ...buckets.space.slice(0, 2),
    ...buckets.surface.slice(0, 2),
    ...buckets.subsurface.slice(0, 2),
  ];

  const placed = items
    .map((it) => ({ it, y: yForAlt(it.altKm) }))
    .sort((a, b) => a.y - b.y);

  // 防重叠：相邻标签至少间隔 16px
  for (let i = 1; i < placed.length; i++) {
    if (placed[i].y - placed[i - 1].y < 16) placed[i].y = placed[i - 1].y + 16;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="天地海垂直剖面侧视图">
      <defs>
        <linearGradient id="vcsBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="35%" stopColor="#0b1530" />
          <stop offset="52%" stopColor="#13233f" />
          <stop offset="55%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#021018" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="url(#vcsBg)" rx="6" />

      {/* 区带标注 */}
      <text x={W - 6} y="16" textAnchor="end" fontSize="8" fill="#38bdf8" opacity="0.7">
        GEO 36,000km
      </text>
      <text x={W - 6} y="60" textAnchor="end" fontSize="8" fill="#7dd3fc" opacity="0.6">
        LEO / 空间站
      </text>
      <text x={W - 6} y={H - 6} textAnchor="end" fontSize="8" fill="#2dd4bf" opacity="0.6">
        海沟 / 深源
      </text>

      {/* 地表参考线 */}
      <line x1="6" y1={SURFACE_Y} x2={W - 6} y2={SURFACE_Y} stroke="#facc15" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
      <text x="8" y={SURFACE_Y - 3} fontSize="8" fill="#facc15" opacity="0.85">地表 0</text>

      {/* 纵向钻轴 */}
      <line x1={RAIL_X} y1="10" x2={RAIL_X} y2={H - 8} stroke="#94a3b8" strokeWidth="1" opacity="0.35" />

      {/* 要素点 + 引线 + 标签 */}
      {placed.map(({ it, y }) => {
        const yReal = yForAlt(it.altKm);
        const color = TIER_COLOR[it.tier];
        return (
          <g
            key={it.id}
            onClick={onPick ? () => onPick(it) : undefined}
            style={{ cursor: onPick ? 'pointer' : 'default' }}
          >
            {/* 真实高度处的点 */}
            <circle cx={RAIL_X} cy={yReal} r="3.5" fill={color} stroke="#0A0E17" strokeWidth="0.8" />
            {/* 引线到错位后的标签行 */}
            <line x1={RAIL_X + 3} y1={yReal} x2={RAIL_X + 14} y2={y} stroke={color} strokeWidth="0.6" opacity="0.5" />
            <text x={RAIL_X + 17} y={y + 3} fontSize="8.5" fill="#e6edf3">
              <tspan>{it.emoji} </tspan>
              <tspan fill="#cbd5e1">{it.title.length > 16 ? it.title.slice(0, 16) + '…' : it.title}</tspan>
              <tspan fill={color} dx="3">{altLabel(it.altKm)}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

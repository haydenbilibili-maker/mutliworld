'use client';

/**
 * 详情页内联可视化零件（原创·纯 SVG·无第三方依赖）。
 * 提供：影响量规、坐标迷你地球、火花线/柱状微图、指标芯片。
 * 仅做展示，不引入数据，不编造。
 */

import type { EventSeries, ImpactLevel } from '@/types/geo';

export const IMPACT_THEME: Record<ImpactLevel, { name: string; color: string; soft: string; rank: number }> = {
  low: { name: '低', color: '#38bdf8', soft: 'rgba(56,189,248,0.15)', rank: 1 },
  medium: { name: '中', color: '#fbbf24', soft: 'rgba(251,191,36,0.15)', rank: 2 },
  high: { name: '高', color: '#fb923c', soft: 'rgba(251,146,60,0.16)', rank: 3 },
  critical: { name: '极高', color: '#f43f5e', soft: 'rgba(244,63,94,0.16)', rank: 4 },
};

/** 影响量规 — 四档弧形仪表 */
export function ImpactGauge({ level }: { level: ImpactLevel }) {
  const t = IMPACT_THEME[level];
  const frac = t.rank / 4;
  const R = 26, CX = 32, CY = 30;
  const a0 = Math.PI, a1 = Math.PI * (1 - frac); // 半圆从左到右
  const arc = (start: number, end: number) => {
    const x0 = CX + R * Math.cos(start), y0 = CY - R * Math.sin(start);
    const x1 = CX + R * Math.cos(end), y1 = CY - R * Math.sin(end);
    const large = Math.abs(end - start) > Math.PI ? 1 : 0;
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden className="shrink-0">
      <path d={arc(a0, 0)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" strokeLinecap="round" />
      <path d={arc(a0, a1)} fill="none" stroke={t.color} strokeWidth="5" strokeLinecap="round" />
      <text x="32" y="30" textAnchor="middle" fill={t.color} fontSize="13" fontWeight="700">{t.name}</text>
    </svg>
  );
}

/** 坐标迷你地球 — 经纬网格 + 标记点（等距圆柱投影简版） */
export function MiniGlobe({ lng, lat, color = '#38bdf8' }: { lng: number; lat: number; color?: string }) {
  const W = 96, H = 56;
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  const verts = [-120, -60, 0, 60, 120].map((l) => ((l + 180) / 360) * W);
  const horiz = [-60, -30, 0, 30, 60].map((la) => ((90 - la) / 180) * H);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden className="shrink-0 rounded-md" style={{ background: 'rgba(56,189,248,0.06)' }}>
      <rect x="0" y="0" width={W} height={H} fill="none" stroke="rgba(255,255,255,0.12)" rx="6" />
      {verts.map((vx, i) => <line key={`v${i}`} x1={vx} y1="0" x2={vx} y2={H} stroke="rgba(255,255,255,0.08)" />)}
      {horiz.map((hy, i) => <line key={`h${i}`} x1="0" y1={hy} x2={W} y2={hy} stroke="rgba(255,255,255,0.08)" />)}
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.18)" strokeDasharray="2 3" />
      <circle cx={x} cy={y} r="7" fill="none" stroke={color} strokeWidth="1" opacity="0.5">
        <animate attributeName="r" values="3;9;3" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r="2.6" fill={color} stroke="#fff" strokeWidth="0.8" />
    </svg>
  );
}

/** 火花线 / 柱状微图 */
export function MiniChart({ series, color = '#38bdf8' }: { series: EventSeries; color?: string }) {
  const pts = series.points.filter((n) => Number.isFinite(n));
  if (pts.length === 0) return null;
  const W = 220, H = 44, P = 4;
  const min = Math.min(...pts), max = Math.max(...pts);
  const span = max - min || 1;
  const sx = (i: number) => P + (i / Math.max(1, pts.length - 1)) * (W - 2 * P);
  const sy = (v: number) => H - P - ((v - min) / span) * (H - 2 * P);

  if (series.kind === 'bars') {
    const bw = (W - 2 * P) / pts.length;
    return (
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
        {pts.map((v, i) => {
          const h = Math.max(1, ((v - min) / span) * (H - 2 * P));
          return <rect key={i} x={P + i * bw + bw * 0.15} y={H - P - h} width={bw * 0.7} height={h} fill={color} opacity={0.5 + 0.5 * ((v - min) / span)} rx="1" />;
        })}
      </svg>
    );
  }

  const line = pts.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
  const area = `${P},${H - P} ${line} ${(W - P)},${H - P}`;
  const last = pts[pts.length - 1];
  const mean = pts.reduce((s, v) => s + v, 0) / pts.length;
  const fmt = (n: number) => (Math.abs(n) >= 100 ? Math.round(n).toString() : n.toFixed(1));
  const lastTopPct = (sy(last) / H) * 100;
  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden style={{ display: 'block' }}>
        {/* 均值基线 */}
        <line x1={P} y1={sy(mean)} x2={W - P} y2={sy(mean)} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 3" />
        <polygon points={area} fill={color} opacity="0.12" />
        <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={sx(pts.length - 1)} cy={sy(last)} r="2.6" fill={color} />
      </svg>
      {/* 极值/末值刻度：HTML 叠层，避免 SVG 非等比缩放拉伸文字 */}
      <span style={{ position: 'absolute', left: 2, top: 0, fontSize: 8, color: 'rgba(255,255,255,0.45)' }}>{fmt(max)}</span>
      <span style={{ position: 'absolute', left: 2, bottom: 0, fontSize: 8, color: 'rgba(255,255,255,0.45)' }}>{fmt(min)}</span>
      <span style={{ position: 'absolute', right: 2, top: `${lastTopPct}%`, transform: 'translateY(-130%)', fontSize: 8.5, fontWeight: 600, color }}>{fmt(last)}</span>
    </div>
  );
}

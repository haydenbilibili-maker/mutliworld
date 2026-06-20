'use client';

/**
 * 视图菜单 — 底部控制条下拉，收纳原 TierSwitcher 的辅助控件
 * 底图样式 · 3D 地球 · 天地海垂直剖面 · 态势简报 · 宇宙运动 · 敏感图层下架。
 * 提升首页坪效：左侧竖向面板拆解后，辅助控件统一收进此下拉。
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useProfileStore } from '@/store/useProfileStore';
import { usePanelStore } from '@/store/usePanelStore';
import type { PanelId } from '@/store/usePanelStore';
import { BasemapModeSwitcher } from '@/components/ui/BasemapModeSwitcher';
import { CosmicMotionControls } from '@/components/ui/CosmicMotionControls';
import { COLOR_SCHEME_LABELS, type ColorScheme } from '@/lib/map/scalarColor';

interface ViewMenuProps {
  className?: string;
  embedded?: boolean;
}

function MenuToggle({
  active,
  onClick,
  icon,
  label,
  tone = 'military',
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  tone?: 'military' | 'amber' | 'sky' | 'rose';
  title?: string;
}) {
  const toneClass =
    tone === 'amber'
      ? 'bg-amber-400/20 text-amber-200'
      : tone === 'sky'
        ? 'bg-sky-500/20 text-sky-200'
        : tone === 'rose'
          ? 'bg-rose-500/20 text-rose-200'
          : 'bg-dashboard-military/20 text-white';
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={active}
      onClick={onClick}
      title={title}
      className={[
        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] transition active:scale-[0.98]',
        active ? toneClass : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      <span aria-hidden className="shrink-0 text-sm">{icon}</span>
      <span className="min-w-0 flex-1 font-medium">{label}</span>
    </button>
  );
}

export function ViewMenu({ className = '', embedded = false }: ViewMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const activeTier = useMapStore((s) => s.activeTier);
  const hideSensitive = useMapStore((s) => s.hideSensitive);
  const setHideSensitive = useMapStore((s) => s.setHideSensitive);
  const globe = useMapStore((s) => s.globe);
  const setGlobe = useMapStore((s) => s.setGlobe);
  const flowSpeed = useMapStore((s) => s.flowSpeed);
  const setFlowSpeed = useMapStore((s) => s.setFlowSpeed);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const overlayScheme = useMapStore((s) => s.overlayScheme);
  const setOverlayScheme = useMapStore((s) => s.setOverlayScheme);
  const profileActive = useProfileStore((s) => s.active);
  const setProfileActive = useProfileStore((s) => s.setActive);

  const tierBriefingId: PanelId | null =
    activeTier === 'space' ? 'space-briefing' : activeTier === 'subsurface' ? 'seabed-briefing' : null;
  const briefingOpen = usePanelStore((s) => (tierBriefingId ? s.open[tierBriefingId] : false));
  const toggleBriefing = usePanelStore((s) => s.toggle);

  const globeActive = globe || activeTier === 'space';
  const anyActive = profileActive || globeActive || hideSensitive || briefingOpen;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={['relative', className].join(' ')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-pressed={anyActive}
        aria-label="视图设置"
        title="底图 / 3D 地球 / 垂直剖面 / 态势简报 / 敏感图层"
        className={[
          'flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm',
          embedded
            ? open || anyActive
              ? 'bg-dashboard-military/25 text-white'
              : 'text-dashboard-neutral hover:bg-dashboard-neutral/20 hover:text-white'
            : 'rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/85 px-3 py-2 text-dashboard-neutral shadow-lg backdrop-blur-sm',
        ].join(' ')}
      >
        <span aria-hidden>🌐</span>
        <span>视图</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={['shrink-0 transition-transform duration-150', open ? 'rotate-180' : ''].join(' ')}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="视图设置"
            className="absolute bottom-full right-0 z-50 mb-1.5 w-[13rem] overflow-hidden rounded-lg border border-dashboard-neutral/25 bg-dashboard-bg/95 p-1.5 shadow-xl backdrop-blur-md"
          >
            <BasemapModeSwitcher className="mb-1" />
            {/* 投影选择器（maplibre 引擎实际支持：平面墨卡托 / 球面正射） */}
            <div className="px-2.5 py-1.5">
              <div className="mb-1 flex items-center gap-2 text-[12px] text-dashboard-neutral">
                <span aria-hidden className="shrink-0 text-sm">🌐</span>
                <span className="font-medium">投影</span>
              </div>
              <div className="flex gap-1" role="group" aria-label="地图投影">
                {([['平面', false], ['球面', true]] as const).map(([label, g]) => {
                  const on = globeActive === g;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setGlobe(g)}
                      aria-pressed={on}
                      disabled={activeTier === 'space' && !g}
                      className={[
                        'flex-1 rounded-md px-2 py-1 text-[12px] transition-colors disabled:opacity-40',
                        on ? 'bg-sky-500/20 text-sky-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                      ].join(' ')}
                    >
                      {label === '平面' ? '平面墨卡托' : '球面正射'}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[9px] leading-snug text-dashboard-neutral/40">更多投影(等距方位/温克尔三重等)需 D3 自绘引擎，可按需扩展</p>
            </div>
            {activeTier === 'near_earth' && (
              <div className="px-2.5 py-1.5">
                <div className="mb-1 flex items-center gap-2 text-[12px] text-dashboard-neutral">
                  <span aria-hidden className="shrink-0 text-sm">🌬️</span>
                  <span className="font-medium">动画 · 流场</span>
                </div>
                <div className="flex gap-1" role="group" aria-label="流场动画">
                  {([['wind_flow', '风'], ['ocean_flow', '洋流'], ['wave_flow', '波浪']] as const).map(([id, label]) => {
                    const on = activeLayers.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleLayer(id)}
                        aria-pressed={on}
                        className={[
                          'flex-1 rounded-md px-2 py-1 text-[12px] transition-colors',
                          on ? 'bg-sky-500/20 text-sky-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTier === 'near_earth' && (
              <div className="px-2.5 py-1.5">
                <div className="mb-1 flex items-center gap-2 text-[12px] text-dashboard-neutral">
                  <span aria-hidden className="shrink-0 text-sm">💨</span>
                  <span className="font-medium">动画速度</span>
                </div>
                <div className="flex gap-1" role="group" aria-label="流场动画速度">
                  {([['慢', 0.3], ['中', 0.55], ['快', 0.9]] as const).map(([label, val]) => {
                    const active = Math.abs(flowSpeed - val) < 0.08;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setFlowSpeed(val)}
                        aria-pressed={active}
                        className={[
                          'flex-1 rounded-md px-2 py-1 text-[12px] transition-colors',
                          active ? 'bg-sky-500/20 text-sky-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTier === 'near_earth' && (
              <div className="px-2.5 py-1.5">
                <div className="mb-1 flex items-center gap-2 text-[12px] text-dashboard-neutral">
                  <span aria-hidden className="shrink-0 text-sm">🎨</span>
                  <span className="font-medium">叠加配色</span>
                </div>
                <div className="grid grid-cols-2 gap-1" role="group" aria-label="叠加配色方案">
                  {(Object.keys(COLOR_SCHEME_LABELS) as ColorScheme[]).map((s) => {
                    const on = overlayScheme === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setOverlayScheme(s)}
                        aria-pressed={on}
                        className={[
                          'rounded-md px-2 py-1 text-[12px] transition-colors',
                          on ? 'bg-sky-500/20 text-sky-200' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white',
                        ].join(' ')}
                      >
                        {COLOR_SCHEME_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <MenuToggle
              active={profileActive}
              onClick={() => setProfileActive(!profileActive)}
              icon="📊"
              tone="amber"
              label={profileActive ? '垂直剖面：取点中' : '天地海垂直剖面'}
              title="开启后点击地图任一点，垂直钻取三层叠加态势"
            />
            {tierBriefingId && (
              <MenuToggle
                active={briefingOpen}
                onClick={() => toggleBriefing(tierBriefingId)}
                icon="📋"
                label={briefingOpen ? '态势简报：开' : '态势简报：关'}
                title="显示或隐藏当前空间层态势简报"
              />
            )}
            <CosmicMotionControls />
            <div className="my-1 border-t border-dashboard-neutral/15" />
            <MenuToggle
              active={hideSensitive}
              onClick={() => setHideSensitive(!hideSensitive)}
              icon={hideSensitive ? '🔒' : '🛡️'}
              tone="rose"
              label={hideSensitive ? '敏感图层已下架' : '敏感图层正常'}
              title="商用模式：一键下架军事/核/海外基地等敏感图层"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

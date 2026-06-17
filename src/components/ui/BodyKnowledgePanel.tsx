'use client';

/**
 * 天体百科面板 — 多天体探索信息增密
 * 概况 / 地理 / 载人 / 博弈 / 合作 / 影像 / 影视，分标签呈现。真实、中立并陈。
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMapStore } from '@/store/useMapStore';
import { useBodyStore } from '@/store/useBodyStore';
import { getBody } from '@/bodies';
import { BODY_KNOWLEDGE } from '@/bodies/knowledge';

type Tab = '概况' | '地理' | '载人' | '博弈' | '合作' | '影像' | '影视';
const TABS: Tab[] = ['概况', '地理', '载人', '博弈', '合作', '影像', '影视'];

export function BodyKnowledgePanel() {
  const activeBody = useMapStore((s) => s.activeBody);
  const open = useBodyStore((s) => s.knowledgeOpen);
  const setOpen = useBodyStore((s) => s.setKnowledgeOpen);
  const [tab, setTab] = useState<Tab>('概况');
  const mod = getBody(activeBody);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (activeBody === 'earth' || !mod) return null;
  const kn = BODY_KNOWLEDGE[activeBody];
  if (!kn) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <motion.div
            role="dialog"
            aria-label={`${mod.name} 百科`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 flex max-h-[86vh] w-[min(40rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-brand-cyan/25 bg-dashboard-bg/95 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2 border-b border-dashboard-neutral/12 px-4 py-3">
              <span className="text-lg" aria-hidden>{mod.icon}</span>
              <span className="text-base font-semibold text-white">{mod.name} · 百科</span>
              <span className="text-xs text-dashboard-neutral/55">{mod.tagline}</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="关闭" className="ml-auto rounded px-2 py-1 text-sm text-dashboard-neutral/60 hover:bg-white/10 hover:text-white">✕</button>
            </div>

            <div className="flex flex-wrap gap-1 border-b border-dashboard-neutral/12 px-3 py-2">
              {TABS.map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-2.5 py-1 text-xs transition-colors ${tab === t ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-dashboard-neutral hover:bg-white/5 hover:text-white'}`}>{t}</button>
              ))}
            </div>

            <div className="overflow-y-auto px-4 py-3 text-sm">
              {tab === '概况' && (
                <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {kn.facts.map((f) => (
                    <li key={f.label} className="rounded-md bg-white/[0.03] px-3 py-2">
                      <div className="text-[10px] text-dashboard-neutral/50">{f.label}</div>
                      <div className="text-[12px] text-dashboard-neutral/90">{f.value}</div>
                    </li>
                  ))}
                </ul>
              )}

              {tab === '地理' && (
                <ul className="space-y-1.5">
                  {kn.geography.map((g) => (
                    <li key={g.nameEn} className="rounded-md border border-dashboard-neutral/12 px-3 py-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] font-medium text-white">{g.name}</span>
                        <span className="text-[10px] text-dashboard-neutral/45">{g.nameEn}</span>
                        <span className="ml-auto rounded bg-brand-gold/15 px-1.5 text-[10px] text-brand-gold">{g.type}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-dashboard-neutral/80">{g.desc}</div>
                    </li>
                  ))}
                </ul>
              )}

              {(tab === '载人' || tab === '博弈' || tab === '合作') && (
                <ul className="space-y-2">
                  {(tab === '载人' ? kn.crewed : tab === '博弈' ? kn.rivalry : kn.cooperation).map((k, i) => (
                    <li key={i} className="rounded-md border border-dashboard-neutral/12 px-3 py-2">
                      <div className="text-[13px] font-medium text-white">{k.title}</div>
                      <div className="mt-0.5 text-[11px] leading-relaxed text-dashboard-neutral/80">{k.desc}</div>
                    </li>
                  ))}
                </ul>
              )}

              {tab === '影像' && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-dashboard-neutral/55">NASA / CNSA 等机构公开实拍影像（外链官方源）：</div>
                  {kn.photos.map((p) => (
                    <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-brand-cyan/20 bg-brand-cyan/[0.04] px-3 py-2 transition-colors hover:border-brand-cyan/45">
                      <div className="flex items-center gap-1.5 text-[12px] text-brand-cyan">{p.title} <span aria-hidden>↗</span></div>
                      {p.meta && <div className="text-[10px] text-dashboard-neutral/60">{p.meta}</div>}
                    </a>
                  ))}
                </div>
              )}

              {tab === '影视' && (
                <ul className="space-y-1.5">
                  {kn.films.map((f) => (
                    <li key={f.title} className="flex items-baseline gap-2 rounded-md bg-white/[0.03] px-3 py-2">
                      <span aria-hidden className="text-dashboard-neutral/50">🎬</span>
                      <span className="text-[12px] text-white">{f.title}</span>
                      <span className="ml-auto text-[10px] text-dashboard-neutral/50">{f.meta}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-dashboard-neutral/12 px-4 py-2 text-[10px] text-dashboard-neutral/45">
              内容力求真实、中立并陈各国航天成果 · 持续增密中
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

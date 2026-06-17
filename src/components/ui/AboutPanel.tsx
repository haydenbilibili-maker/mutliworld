'use client';

/**
 * 关于 / 致敬面板 — 万象幻测 · OmniLens
 * 承载品牌定位、版权与致敬（开源精神 / 先行者 WorldMonitor / 中国视角 / 超级个体+多agent协作）、
 * 版本说明与友好外链。由品牌标识点击触发。
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRAND, CREDITS, FRIENDLY_LINKS } from '@/lib/brand';
import { useBrandStore } from '@/store/useBrandStore';

function CreditItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md border border-dashboard-neutral/15 bg-white/[0.02] p-2.5">
      <div className="mb-1 text-[11px] font-medium text-brand-gold">{title}</div>
      <div className="text-[11px] leading-relaxed text-dashboard-neutral/85">{body}</div>
    </div>
  );
}

export function AboutPanel() {
  const open = useBrandStore((s) => s.aboutOpen);
  const setAboutOpen = useBrandStore((s) => s.setAboutOpen);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setAboutOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setAboutOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="关于 万象幻测"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative z-10 max-h-[86vh] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-brand-gold/25 bg-dashboard-bg/95 shadow-2xl backdrop-blur-md"
          >
            {/* 顶部品牌带 */}
            <div className="relative overflow-hidden border-b border-brand-gold/15 px-5 py-4">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-cyan/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-brand-gold/10 blur-2xl" />
              <div className="relative flex items-end gap-3">
                <div>
                  <h2 className="bg-gradient-to-r from-brand-gold-bright to-brand-gold bg-clip-text text-2xl font-bold tracking-[0.16em] text-transparent">
                    {BRAND.nameZh}
                  </h2>
                  <div className="mt-1 text-xs uppercase tracking-[0.28em] text-brand-cyan/85">
                    {BRAND.nameEn}
                  </div>
                </div>
                <div className="mb-0.5 ml-auto text-right">
                  <div className="text-[11px] text-dashboard-neutral/70">{BRAND.tagline}</div>
                  <div className="text-[10px] text-dashboard-neutral/40">v{BRAND.version} · {BRAND.versionName}</div>
                </div>
              </div>
              <p className="relative mt-3 text-[12px] leading-relaxed text-dashboard-neutral/85">
                {BRAND.description}。
              </p>
              <p className="relative mt-1 text-[11px] text-brand-cyan/70">{BRAND.authorship}</p>
            </div>

            {/* 致敬与版权 */}
            <div className="space-y-2 px-5 py-4">
              <div className="mb-1 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
                致敬 · 版权 · 立场
              </div>
              <CreditItem title="致敬开源精神" body={CREDITS.openSource} />
              <CreditItem title="致敬先行者 WorldMonitor" body={CREDITS.predecessor} />
              <CreditItem title="中国视角" body={CREDITS.perspective} />
              <CreditItem title="超级个体 ✕ 多 agent 协作" body={CREDITS.collaboration} />
            </div>

            {/* 友好外链 */}
            <div className="px-5 pb-4">
              <div className="mb-1.5 text-[10px] uppercase tracking-wide text-dashboard-neutral/40">
                友情链接
              </div>
              <div className="space-y-1.5">
                {FRIENDLY_LINKS.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md border border-brand-cyan/20 bg-brand-cyan/[0.04] px-3 py-2 transition-colors hover:border-brand-cyan/45"
                  >
                    <div className="flex items-center gap-1.5 text-[12px] text-brand-cyan">
                      {l.label} <span aria-hidden>↗</span>
                    </div>
                    <div className="text-[10px] text-dashboard-neutral/60">{l.desc}</div>
                  </a>
                ))}
                <a
                  href={BRAND.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md border border-dashboard-neutral/20 px-3 py-2 text-[11px] text-dashboard-neutral/70 transition-colors hover:border-dashboard-neutral/40 hover:text-white"
                >
                  GitHub 源码仓库 ↗
                </a>
              </div>
            </div>

            {/* 页脚版权 */}
            <div className="border-t border-dashboard-neutral/10 px-5 py-3 text-[10px] leading-relaxed text-dashboard-neutral/45">
              © {new Date().getFullYear()} {BRAND.full} · {BRAND.author}．
              数据来源于公开真实接口，标注来源与时效；仅供研究与教育，非投资建议。
              坐标统一标注「示意」，敏感条目支持一键下架。
            </div>

            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="关闭"
              className="absolute right-3 top-3 rounded-md px-2 py-1 text-sm text-dashboard-neutral/60 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

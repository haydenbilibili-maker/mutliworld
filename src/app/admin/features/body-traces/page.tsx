'use client';

/**
 * 天体痕迹在线编辑 — Phase 5 后台编辑
 * 浏览器内新增/编辑/删除月球·火星探索痕迹（localStorage 持久化），地图实时预览；
 * 支持 JSON 导出/导入，开发者可将定稿数据固化进仓库。无服务端文件持久化依赖。
 */

import { useMemo, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useBodyOverridesStore } from '@/store/useBodyOverridesStore';
import { bodyLayersFor } from '@/bodies/sites';
import type { BodySite, BodySiteStatus, CelestialBody } from '@/types/body';

const STATUS: BodySiteStatus[] = ['active', 'completed', 'lost'];
const STATUS_LABEL: Record<BodySiteStatus, string> = { active: '在役', completed: '已完成', lost: '失联' };

const EMPTY = (): Partial<BodySite> => ({
  id: '', body: 'moon', layer: 'moon_legacy', name: '', nameEn: '', agency: '', lng: 0, lat: 0, date: '', status: 'completed', summary: '', sourceUrl: '',
});

export default function BodyTracesAdminPage() {
  const customSites = useBodyOverridesStore((s) => s.customSites);
  const upsertSite = useBodyOverridesStore((s) => s.upsertSite);
  const removeSite = useBodyOverridesStore((s) => s.removeSite);
  const replaceAll = useBodyOverridesStore((s) => s.replaceAll);
  const clearAll = useBodyOverridesStore((s) => s.clearAll);

  const [form, setForm] = useState<Partial<BodySite>>(EMPTY());
  const [msg, setMsg] = useState('');

  const layerOptions = useMemo(() => bodyLayersFor((form.body as CelestialBody) ?? 'moon'), [form.body]);

  const set = (k: keyof BodySite, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.id) { setMsg('id 与 name 必填'); return; }
    const site: BodySite = {
      id: String(form.id).trim(),
      body: (form.body as CelestialBody) ?? 'moon',
      layer: (form.layer as BodySite['layer']) ?? 'moon_legacy',
      name: String(form.name).trim(),
      nameEn: String(form.nameEn ?? '').trim() || undefined,
      agency: String(form.agency ?? '').trim(),
      lng: Number(form.lng) || 0,
      lat: Number(form.lat) || 0,
      date: String(form.date ?? '').trim(),
      status: (form.status as BodySiteStatus) ?? 'completed',
      summary: String(form.summary ?? '').trim(),
      sourceUrl: String(form.sourceUrl ?? '').trim() || undefined,
    };
    upsertSite(site);
    setForm(EMPTY());
    setMsg(`已保存「${site.name}」，切到「${site.body === 'moon' ? '月球' : '火星'}」查看地图标记`);
  };

  const exportJson = () => {
    const text = JSON.stringify(customSites, null, 2);
    navigator.clipboard?.writeText(text).catch(() => {});
    setMsg(`已复制 ${customSites.length} 条 JSON 到剪贴板`);
  };

  const importJson = () => {
    const text = prompt('粘贴痕迹 JSON 数组：');
    if (!text) return;
    try {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) { replaceAll(arr as BodySite[]); setMsg(`已导入 ${arr.length} 条`); }
      else setMsg('JSON 不是数组');
    } catch { setMsg('JSON 解析失败'); }
  };

  const inputCls = 'w-full rounded-md border border-dashboard-neutral/20 bg-white/5 px-2 py-1.5 text-sm text-white';

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="天体痕迹在线编辑"
        description="浏览器内新增/编辑月球·火星探索痕迹（localStorage 持久化 + 地图实时预览）。支持 JSON 导出/导入，定稿后可固化进仓库。"
        breadcrumbs={[{ label: '管理后台', href: '/admin' }, { label: '数据管理' }, { label: '天体痕迹' }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 表单 */}
        <div className="rounded-xl border border-dashboard-neutral/15 p-4">
          <div className="mb-3 text-sm font-medium text-white">新增 / 编辑痕迹</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[11px] text-dashboard-neutral/70">id（唯一）<input className={inputCls} value={form.id ?? ''} onChange={(e) => set('id', e.target.value)} placeholder="custom-xxx" /></label>
            <label className="text-[11px] text-dashboard-neutral/70">天体<select className={inputCls} value={form.body} onChange={(e) => set('body', e.target.value)}><option value="moon">月球</option><option value="mars">火星</option></select></label>
            <label className="text-[11px] text-dashboard-neutral/70">图层<select className={inputCls} value={form.layer} onChange={(e) => set('layer', e.target.value)}>{layerOptions.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
            <label className="text-[11px] text-dashboard-neutral/70">状态<select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>{STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
            <label className="text-[11px] text-dashboard-neutral/70">名称<input className={inputCls} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} /></label>
            <label className="text-[11px] text-dashboard-neutral/70">外文名<input className={inputCls} value={form.nameEn ?? ''} onChange={(e) => set('nameEn', e.target.value)} /></label>
            <label className="text-[11px] text-dashboard-neutral/70">机构<input className={inputCls} value={form.agency ?? ''} onChange={(e) => set('agency', e.target.value)} placeholder="NASA/CNSA…" /></label>
            <label className="text-[11px] text-dashboard-neutral/70">日期<input className={inputCls} value={form.date ?? ''} onChange={(e) => set('date', e.target.value)} placeholder="2024-01-01" /></label>
            <label className="text-[11px] text-dashboard-neutral/70">经度（东经正 -180..180）<input className={inputCls} type="number" value={form.lng ?? 0} onChange={(e) => set('lng', e.target.value)} /></label>
            <label className="text-[11px] text-dashboard-neutral/70">纬度（-90..90）<input className={inputCls} type="number" value={form.lat ?? 0} onChange={(e) => set('lat', e.target.value)} /></label>
            <label className="col-span-2 text-[11px] text-dashboard-neutral/70">简介<textarea className={inputCls} rows={2} value={form.summary ?? ''} onChange={(e) => set('summary', e.target.value)} /></label>
            <label className="col-span-2 text-[11px] text-dashboard-neutral/70">来源链接<input className={inputCls} value={form.sourceUrl ?? ''} onChange={(e) => set('sourceUrl', e.target.value)} /></label>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={submit} className="rounded-md bg-brand-cyan/20 px-3 py-1.5 text-xs text-brand-cyan hover:bg-brand-cyan/30">保存</button>
            <button type="button" onClick={() => setForm(EMPTY())} className="rounded-md border border-dashboard-neutral/20 px-3 py-1.5 text-xs text-dashboard-neutral hover:text-white">清空表单</button>
            {msg && <span className="text-[11px] text-emerald-300/80">{msg}</span>}
          </div>
        </div>

        {/* 列表 */}
        <div className="rounded-xl border border-dashboard-neutral/15 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-medium text-white">自定义痕迹 {customSites.length}</span>
            <div className="ml-auto flex gap-2">
              <button type="button" onClick={exportJson} className="rounded-md border border-dashboard-neutral/20 px-2 py-1 text-[11px] text-dashboard-neutral hover:text-white">导出 JSON</button>
              <button type="button" onClick={importJson} className="rounded-md border border-dashboard-neutral/20 px-2 py-1 text-[11px] text-dashboard-neutral hover:text-white">导入</button>
              <button type="button" onClick={() => { if (confirm('清空全部自定义痕迹？')) clearAll(); }} className="rounded-md border border-rose-500/30 px-2 py-1 text-[11px] text-rose-300 hover:bg-rose-500/10">清空</button>
            </div>
          </div>
          {customSites.length === 0 ? (
            <div className="py-6 text-center text-xs text-dashboard-neutral/50">暂无自定义痕迹。左侧新增后会实时显示在对应天体地图上。</div>
          ) : (
            <ul className="max-h-[28rem] space-y-1.5 overflow-y-auto">
              {customSites.map((s) => (
                <li key={s.id} className="flex items-center gap-2 rounded-md border border-dashboard-neutral/12 px-2.5 py-1.5">
                  <span className="text-xs">{s.body === 'moon' ? '🌙' : '🔴'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-white">{s.name}</span>
                    <span className="block truncate text-[10px] text-dashboard-neutral/55">{s.agency} · {s.lat}, {s.lng} · {s.date}</span>
                  </span>
                  <button type="button" onClick={() => setForm(s)} className="rounded px-1.5 py-0.5 text-[10px] text-brand-cyan hover:bg-white/5">编辑</button>
                  <button type="button" onClick={() => removeSite(s.id)} className="rounded px-1.5 py-0.5 text-[10px] text-rose-300 hover:bg-white/5">删除</button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 border-t border-dashboard-neutral/10 pt-2 text-[10px] text-dashboard-neutral/45">
            数据存于浏览器 localStorage；切到月球/火星视图即可看到自定义标记。导出 JSON 后可由开发者固化进 src/bodies/sites。
          </div>
        </div>
      </div>
    </div>
  );
}

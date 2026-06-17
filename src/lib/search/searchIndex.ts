/**
 * 全局搜索索引 — 对标 World Monitor Round 8
 *
 * 跨所有已注册区域聚合可定位条目（区域 / 事件 / 冲突 / 设施 / 基础设施 / 核设施），
 * 提供轻量子串 + 排序的搜索。纯客户端、静态数据构建一次。
 */

import type { ImpactLevel } from '@/types/geo';
import type { RegionId } from '@/types/region';
import { listRegions } from '@/regions';
import { GLOBAL_INFRASTRUCTURE } from '@/regions/global.infrastructure';
import { GLOBAL_NUCLEAR_FACILITIES } from '@/regions/global.nuclear';
import { GLOBAL_THEMATIC_POINTS } from '@/regions/global.thematic';
import { GLOBAL_SEMICONDUCTORS } from '@/regions/global.semiconductors';
import { GLOBAL_GARRISONS } from '@/regions/global.garrisons';
import { GLOBAL_LAUNCH_SITES } from '@/regions/global.launchSites';
import { GLOBAL_DEEP_SEA_MINING } from '@/regions/global.deepSeaMining';
import { GLOBAL_TECTONICS } from '@/regions/global.tectonics';
import { GLOBAL_HYDROCARBON_RESERVES } from '@/regions/global.hydrocarbon';
import { GLOBAL_CABLE_INCIDENTS } from '@/regions/global.cableIncidents';
import { GLOBAL_GROUND_STATIONS } from '@/regions/global.groundStations';
import { GLOBAL_SATELLITES } from '@/regions/global.satellites';
import { GLOBAL_SPACE_EVENTS } from '@/regions/global.spaceEvents';
import {
  GLOBAL_MARINE_ARCHAEOLOGY,
  GLOBAL_OCEAN_CURRENTS,
  GLOBAL_FISHERIES,
  GLOBAL_MONSOON,
  GLOBAL_ATMOSPHERIC_CIRCULATION,
  GLOBAL_DEEP_EXPLORATION,
} from '@/regions/global.ocean';
import { LAYER_LABELS } from '@/lib/constants';

export type SearchKind =
  | 'region'
  | 'event'
  | 'incident'
  | 'facility'
  | 'infra'
  | 'nuclear'
  | 'person';

export interface SearchEntry {
  id: string;
  label: string;
  sublabel: string;
  kind: SearchKind;
  regionId: RegionId | null;
  lng: number;
  lat: number;
  zoom: number;
  impact?: ImpactLevel;
  description?: string;
  source?: string;
  category?: string;
}

const KIND_LABEL: Record<SearchKind, string> = {
  region: '区域',
  event: '事件',
  incident: '冲突',
  facility: '设施',
  infra: '基础设施',
  nuclear: '核设施',
  person: '人物',
};

let INDEX: SearchEntry[] | null = null;

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const regions = listRegions();
  const regionName: Partial<Record<RegionId, string>> = {};

  for (const r of regions) {
    regionName[r.id] = r.name;
    // 区域本体
    out.push({
      id: `region-${r.id}`,
      label: r.name,
      sublabel: `${KIND_LABEL.region} · ${r.viewpoint}`,
      kind: 'region',
      regionId: r.id,
      lng: r.center[0],
      lat: r.center[1],
      zoom: r.zoom,
      description: r.viewpoint,
    });

    const ds = r.dataset;
    if (!ds) continue;

    for (const e of ds.events ?? []) {
      out.push({
        id: `event-${r.id}-${e.id}`,
        label: e.title,
        sublabel: `${r.name} · ${KIND_LABEL.event}`,
        kind: 'event',
        regionId: r.id,
        lng: e.location[0],
        lat: e.location[1],
        zoom: 5.5,
        impact: e.impact_level,
        description: e.description,
        source: e.source,
        category: e.category,
      });
    }

    for (const it of ds.incidents ?? []) {
      out.push({
        id: `incident-${r.id}-${it.id}`,
        label: it.title,
        sublabel: `${r.name} · ${KIND_LABEL.incident}`,
        kind: 'incident',
        regionId: r.id,
        lng: it.location.lng,
        lat: it.location.lat,
        zoom: 5.5,
        description: it.description,
        source: it.source,
        category: it.type,
      });
    }

    for (const f of ds.facilities ?? []) {
      out.push({
        id: `facility-${r.id}-${f.id}`,
        label: f.name,
        sublabel: `${r.name} · ${KIND_LABEL.facility}`,
        kind: 'facility',
        regionId: r.id,
        lng: f.position.lng,
        lat: f.position.lat,
        zoom: 6,
        description: f.notes,
        category: f.type,
      });
    }

    for (const p of ds.persons ?? []) {
      out.push({
        id: `person-${r.id}-${p.id}`,
        label: p.name,
        sublabel: `${r.name} · ${p.domain} · ${KIND_LABEL.person}`,
        kind: 'person',
        regionId: r.id,
        lng: p.lng,
        lat: p.lat,
        zoom: 5.5,
        description: p.bio,
        category: p.domain,
      });
    }
  }

  // 全球基础设施（航空/海运/海缆）
  for (const p of GLOBAL_INFRASTRUCTURE) {
    out.push({
      id: `infra-${p.id}`,
      label: p.name,
      sublabel: `全球 · ${KIND_LABEL.infra}`,
      kind: 'infra',
      regionId: null,
      lng: p.lng,
      lat: p.lat,
      zoom: 5,
      impact: p.impact,
      description: p.note,
      category: p.layerId,
    });
  }

  // 全球核设施
  for (const f of GLOBAL_NUCLEAR_FACILITIES) {
    out.push({
      id: `nuclear-${f.id}`,
      label: f.name,
      sublabel: `全球 · ${KIND_LABEL.nuclear}`,
      kind: 'nuclear',
      regionId: null,
      lng: f.position.lng,
      lat: f.position.lat,
      zoom: 5.5,
      description: f.notes,
      category: f.nuclearKind ?? f.type,
    });
  }

  // 全球主题层（经济中心/矿产/数据中心/抗议/气候）
  for (const p of GLOBAL_THEMATIC_POINTS) {
    const isEvent = p.layerId === 'protests' || p.layerId === 'climate';
    out.push({
      id: `thematic-${p.id}`,
      label: p.name,
      sublabel: `全球 · ${LAYER_LABELS[p.layerId] ?? '主题'}`,
      kind: isEvent ? 'event' : 'infra',
      regionId: null,
      lng: p.lng,
      lat: p.lat,
      zoom: 5,
      impact: p.impact,
      description: p.note,
      category: p.layerId,
    });
  }

  // 全球半导体晶圆厂
  for (const f of GLOBAL_SEMICONDUCTORS) {
    out.push({
      id: `semi-${f.id}`,
      label: f.name,
      sublabel: `全球 · ${LAYER_LABELS.semiconductors}`,
      kind: 'facility',
      regionId: null,
      lng: f.lng,
      lat: f.lat,
      zoom: 5.5,
      impact: f.impact,
      description: `${f.operator} · ${f.note}`,
      category: 'semiconductors',
    });
  }

  // 全球海外军事基地
  for (const b of GLOBAL_GARRISONS) {
    out.push({
      id: `garrison-${b.id}`,
      label: b.name,
      sublabel: `全球 · ${LAYER_LABELS.garrisons}`,
      kind: 'facility',
      regionId: null,
      lng: b.lng,
      lat: b.lat,
      zoom: 5.5,
      impact: b.impact,
      description: b.role,
      category: 'garrisons',
    });
  }

  // 全球深海采矿 / ISA 勘探区
  for (const a of GLOBAL_DEEP_SEA_MINING) {
    out.push({
      id: `dsm-${a.id}`,
      label: a.name,
      sublabel: `全球 · ${LAYER_LABELS.deep_sea_mining}`,
      kind: 'infra',
      regionId: null,
      lng: a.lng,
      lat: a.lat,
      zoom: 4,
      impact: a.impact,
      description: a.note,
      category: 'deep_sea_mining',
    });
  }

  // 全球板块 / 断层
  for (const t of GLOBAL_TECTONICS) {
    out.push({
      id: `tectonic-${t.id}`,
      label: t.name,
      sublabel: `全球 · ${LAYER_LABELS.tectonics}`,
      kind: 'infra',
      regionId: null,
      lng: t.lng,
      lat: t.lat,
      zoom: 4,
      impact: t.impact,
      description: t.note,
      category: 'tectonics',
    });
  }

  // 全球油气储藏
  for (const h of GLOBAL_HYDROCARBON_RESERVES) {
    out.push({
      id: `hc-${h.id}`,
      label: h.nameZh,
      sublabel: `全球 · ${LAYER_LABELS.hydrocarbon_reserves}`,
      kind: 'infra',
      regionId: null,
      lng: h.lng,
      lat: h.lat,
      zoom: 5,
      impact: h.impact,
      description: `${h.type} · ${h.estimatedReserves} · ${h.country}`,
      category: 'hydrocarbon_reserves',
    });
  }

  // 海缆中断事件
  for (const c of GLOBAL_CABLE_INCIDENTS) {
    out.push({
      id: `ci-${c.id}`,
      label: c.name,
      sublabel: `全球 · ${LAYER_LABELS.cable_incidents}`,
      kind: 'event',
      regionId: null,
      lng: c.lng,
      lat: c.lat,
      zoom: 5,
      impact: c.impact,
      description: c.note,
      source: c.source,
      category: 'cable_incidents',
    });
  }

  // 海洋考古
  for (const a of GLOBAL_MARINE_ARCHAEOLOGY) {
    out.push({
      id: `arch-${a.id}`,
      label: a.name,
      sublabel: `全球 · ${LAYER_LABELS.marine_archaeology}`,
      kind: 'infra',
      regionId: null,
      lng: a.lng,
      lat: a.lat,
      zoom: 5,
      impact: a.impact,
      description: a.note,
      category: 'marine_archaeology',
    });
  }

  // 洋流（取路径中点）
  for (const c of GLOBAL_OCEAN_CURRENTS) {
    const mid = c.coordinates[Math.floor(c.coordinates.length / 2)] ?? c.coordinates[0];
    out.push({
      id: `cur-${c.id}`,
      label: c.name,
      sublabel: `全球 · ${LAYER_LABELS.ocean_currents}`,
      kind: 'infra',
      regionId: null,
      lng: mid[0],
      lat: mid[1],
      zoom: 3,
      impact: c.impact,
      description: c.note,
      category: 'ocean_currents',
    });
  }

  // 渔场
  for (const f of GLOBAL_FISHERIES) {
    out.push({
      id: `fish-${f.id}`,
      label: f.name,
      sublabel: `全球 · ${LAYER_LABELS.fisheries}`,
      kind: 'infra',
      regionId: null,
      lng: f.lng,
      lat: f.lat,
      zoom: 4,
      impact: f.impact,
      description: f.note,
      category: 'fisheries',
    });
  }

  // 季风气候带
  for (const m of GLOBAL_MONSOON) {
    out.push({
      id: `mon-${m.id}`,
      label: m.name,
      sublabel: `全球 · ${LAYER_LABELS.monsoon}`,
      kind: 'infra',
      regionId: null,
      lng: m.lng,
      lat: m.lat,
      zoom: 4,
      impact: m.impact,
      description: m.note,
      category: 'monsoon',
    });
  }

  // 大气环流
  for (const a of GLOBAL_ATMOSPHERIC_CIRCULATION) {
    out.push({
      id: `atmo-${a.id}`,
      label: a.name,
      sublabel: `全球 · ${LAYER_LABELS.atmospheric_circulation}`,
      kind: 'infra',
      regionId: null,
      lng: a.lng,
      lat: a.lat,
      zoom: 3,
      impact: a.impact,
      description: a.note,
      category: 'atmospheric_circulation',
    });
  }

  // 深海探索
  for (const d of GLOBAL_DEEP_EXPLORATION) {
    out.push({
      id: `deep-${d.id}`,
      label: d.name,
      sublabel: `全球 · ${LAYER_LABELS.deep_exploration}`,
      kind: 'infra',
      regionId: null,
      lng: d.lng,
      lat: d.lat,
      zoom: 4,
      impact: d.impact,
      description: d.note,
      category: 'deep_exploration',
    });
  }

  // 空天事件
  for (const e of GLOBAL_SPACE_EVENTS) {
    out.push({
      id: `spe-${e.id}`,
      label: e.name,
      sublabel: `全球 · ${LAYER_LABELS.space_events}`,
      kind: 'event',
      regionId: null,
      lng: e.lng,
      lat: e.lat,
      zoom: 4,
      impact: e.impact,
      description: e.note,
      source: e.source,
      category: 'space_events',
    });
  }

  // 在轨 GEO 卫星
  for (const s of GLOBAL_SATELLITES) {
    out.push({
      id: `sat-${s.id}`,
      label: s.name,
      sublabel: `全球 · ${LAYER_LABELS.sat_constellations}`,
      kind: 'facility',
      regionId: null,
      lng: s.lng,
      lat: 0,
      zoom: 4,
      impact: s.impact,
      description: `${s.operator} · 定点 ${s.lng}°E · ${s.note}`,
      category: 'sat_constellations',
    });
  }

  // 全球地面测控站
  for (const g of GLOBAL_GROUND_STATIONS) {
    out.push({
      id: `gs-${g.id}`,
      label: g.name,
      sublabel: `全球 · ${LAYER_LABELS.ground_stations}`,
      kind: 'facility',
      regionId: null,
      lng: g.lng,
      lat: g.lat,
      zoom: 5,
      impact: g.impact,
      description: `${g.operator} · ${g.note}`,
      category: 'ground_stations',
    });
  }

  // 全球航天发射场
  for (const s of GLOBAL_LAUNCH_SITES) {
    out.push({
      id: `launch-${s.id}`,
      label: s.name,
      sublabel: `全球 · ${LAYER_LABELS.launch_sites}`,
      kind: 'facility',
      regionId: null,
      lng: s.lng,
      lat: s.lat,
      zoom: 5.5,
      impact: s.impact,
      description: s.note,
      category: 'launch_sites',
    });
  }

  return out;
}

/** 懒构建索引（去重同名同坐标） */
export function getSearchIndex(): SearchEntry[] {
  if (INDEX) return INDEX;
  const raw = buildIndex();
  const seen = new Set<string>();
  INDEX = raw.filter((e) => {
    const key = `${e.label}@${e.lng.toFixed(2)},${e.lat.toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return INDEX;
}

/** 排序权重：区域 > 标题前缀命中 > 标题包含 > 描述包含 */
function scoreEntry(e: SearchEntry, q: string): number {
  const label = e.label.toLowerCase();
  const sub = e.sublabel.toLowerCase();
  const desc = (e.description ?? '').toLowerCase();
  let score = 0;
  if (label === q) score += 100;
  else if (label.startsWith(q)) score += 60;
  else if (label.includes(q)) score += 40;
  else if (sub.includes(q)) score += 18;
  else if (desc.includes(q)) score += 10;
  else return -1;

  if (e.kind === 'region') score += 25;
  if (e.impact === 'critical') score += 6;
  else if (e.impact === 'high') score += 3;
  return score;
}

/** 搜索：返回排序后的前 limit 条 */
export function searchEntries(query: string, limit = 12): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];
  const idx = getSearchIndex();
  return idx
    .map((e) => ({ e, s: scoreEntry(e, q) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.e);
}

export { KIND_LABEL };

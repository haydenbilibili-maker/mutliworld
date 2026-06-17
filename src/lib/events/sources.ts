/**
 * 真实事件源适配器 — 统一事件管道的数据获取层
 *  USGS(地震) · GDACS(灾害 RSS) · ReliefWeb(人道) · GDELT 2.0 DOC(地缘新闻)
 *
 * 全部免费、服务端抓取（无 CORS）。逐源 try/catch，失败返回 []（不造假）。
 */

import type { LiveEvent, LiveEventSeverity } from '@/types/liveEvent';

/* ── USGS 地震（M4.5+，过去 1 天）─────────────────────────── */
function quakeSeverity(mag: number): LiveEventSeverity {
  if (mag >= 6.5) return 'critical';
  if (mag >= 5.5) return 'high';
  if (mag >= 4.5) return 'medium';
  return 'low';
}

export async function fetchUsgsEvents(): Promise<LiveEvent[]> {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`USGS ${res.status}`);
  const json = (await res.json()) as {
    features?: {
      id: string;
      properties: { mag: number; place: string; time: number; url: string; title: string };
      geometry: { coordinates: [number, number, number] };
    }[];
  };
  const out: LiveEvent[] = [];
  for (const f of json.features ?? []) {
    const p = f.properties;
    const [lng, lat] = f.geometry.coordinates;
    out.push({
      id: `usgs-${f.id}`,
      title: p.title ?? `M${p.mag} ${p.place}`,
      category: 'quake',
      severity: quakeSeverity(p.mag),
      time: new Date(p.time).toISOString(),
      provider: 'USGS',
      source: 'USGS 地震台网',
      sourceUrl: p.url,
      summary: p.place,
      lat,
      lng,
      magnitude: p.mag,
    });
  }
  return out;
}

/* ── GDACS 灾害（RSS，含坐标与预警等级）──────────────────── */
function pickTag(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : '';
}

export async function fetchGdacsEvents(): Promise<LiveEvent[]> {
  const url = 'https://www.gdacs.org/xml/rss.xml';
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`GDACS ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  const out: LiveEvent[] = [];
  for (const it of items) {
    const title = pickTag(it, 'title');
    const link = pickTag(it, 'link');
    if (!title || !link) continue;
    const pub = pickTag(it, 'pubDate');
    const lat = Number(pickTag(it, 'geo:lat') || pickTag(it, 'geo:Point') || '');
    const lng = Number(pickTag(it, 'geo:long') || '');
    const alert = (pickTag(it, 'gdacs:alertlevel') || '').toLowerCase();
    const severity: LiveEventSeverity = alert === 'red' ? 'critical' : alert === 'orange' ? 'high' : 'medium';
    const d = pub ? new Date(pub) : new Date();
    out.push({
      id: `gdacs-${link}`,
      title,
      category: 'disaster',
      severity,
      time: isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(),
      provider: 'GDACS',
      source: 'GDACS 全球灾害预警',
      sourceUrl: link,
      ...(Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0
        ? { lat, lng }
        : {}),
    });
  }
  return out;
}

/* ── ReliefWeb 人道危机 ──────────────────────────────────── */
export async function fetchReliefWebEvents(): Promise<LiveEvent[]> {
  const url =
    'https://api.reliefweb.int/v1/disasters?appname=multiworld-dashboard' +
    '&profile=list&limit=15&sort[]=date:desc' +
    '&fields[include][]=name&fields[include][]=url_alias&fields[include][]=date&fields[include][]=status';
  const res = await fetch(url, { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`ReliefWeb ${res.status}`);
  const json = (await res.json()) as {
    data?: { id: string; fields?: { name?: string; url_alias?: string; date?: { created?: string }; status?: string } }[];
  };
  const out: LiveEvent[] = [];
  for (const d of json.data ?? []) {
    const f = d.fields ?? {};
    if (!f.name) continue;
    const created = f.date?.created ?? new Date().toISOString();
    out.push({
      id: `reliefweb-${d.id}`,
      title: f.name,
      category: 'humanitarian',
      severity: f.status === 'ongoing' || f.status === 'current' ? 'high' : 'medium',
      time: new Date(created).toISOString(),
      provider: 'ReliefWeb',
      source: 'ReliefWeb（OCHA）',
      sourceUrl: f.url_alias ?? `https://reliefweb.int/disaster/${d.id}`,
    });
  }
  return out;
}

/* ── GDELT 2.0 DOC：地缘/冲突新闻 ────────────────────────── */
function gdeltDate(s: string): string {
  // "20240614T123000Z" → ISO
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) return new Date().toISOString();
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`;
}

export async function fetchGdeltEvents(): Promise<LiveEvent[]> {
  const query = '(conflict OR sanctions OR "military" OR ceasefire OR offensive)';
  const url =
    'https://api.gdeltproject.org/api/v2/doc/doc?query=' +
    encodeURIComponent(query) +
    '&mode=ArtList&maxrecords=30&format=json&timespan=24H&sort=DateDesc';
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`GDELT ${res.status}`);
  const json = (await res.json()) as {
    articles?: { url: string; title: string; seendate: string; domain?: string; sourcecountry?: string }[];
  };
  const out: LiveEvent[] = [];
  for (const a of json.articles ?? []) {
    if (!a.url || !a.title) continue;
    out.push({
      id: `gdelt-${a.url}`,
      title: a.title,
      category: 'geopolitics',
      severity: 'medium',
      time: gdeltDate(a.seendate),
      provider: 'GDELT',
      source: a.domain ?? 'GDELT',
      sourceUrl: a.url,
      area: a.sourcecountry,
    });
  }
  return out;
}

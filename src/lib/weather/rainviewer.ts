import type { RadarFrameMeta } from '@/types/weather';

interface RainViewerPastFrame {
  time: number;
  path: string;
}

interface RainViewerResponse {
  host?: string;
  radar?: {
    past?: RainViewerPastFrame[];
    nowcast?: RainViewerPastFrame[];
  };
}

/** 获取 RainViewer 最新降水雷达帧（免费无 key） */
export async function fetchRadarFrame(): Promise<RadarFrameMeta | null> {
  const res = await fetch('https://api.rainviewer.com/public/weather-maps.json', {
    next: { revalidate: 900 },
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`RainViewer 请求失败 (${res.status})`);

  const data = (await res.json()) as RainViewerResponse;
  const host = data.host ?? 'https://tilecache.rainviewer.com';
  const past = data.radar?.past ?? [];
  const nowcast = data.radar?.nowcast ?? [];
  const latest = nowcast[nowcast.length - 1] ?? past[past.length - 1];
  if (!latest) return null;

  const tiles = [`${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`];

  return {
    timestamp: latest.time,
    tiles,
    host,
    generatedAt: new Date().toISOString(),
  };
}

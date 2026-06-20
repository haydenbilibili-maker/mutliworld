/**
 * 全球直播频道目录 — 主流媒体 24/7 YouTube 直播。
 *
 * 采用 YouTube 频道直播嵌入：https://www.youtube.com/embed/live_stream?channel=<channelId>
 * 始终播放该频道当前直播；频道暂未直播时 iframe 显示占位（优雅）。
 * channelId 为各频道公开 YouTube 频道 ID。中立并陈、不代表平台立场。
 */

export interface LiveChannel {
  id: string;
  name: string;
  /** YouTube 频道 ID（UC 开头） */
  channelId: string;
  lang: string;
  region: string;
}

export const LIVE_CHANNELS: LiveChannel[] = [
  { id: 'aljazeera', name: '半岛电视台 Al Jazeera English', channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg', lang: 'EN', region: '中东/全球' },
  { id: 'dw', name: 'DW News（德国之声）', channelId: 'UCknLrEdhRCp1aegoMqRaCZg', lang: 'EN', region: '欧洲/全球' },
  { id: 'france24', name: 'FRANCE 24 English', channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg', lang: 'EN', region: '欧洲/全球' },
  { id: 'skynews', name: 'Sky News', channelId: 'UCoMdktPbSTixAyNGwb-UYkQ', lang: 'EN', region: '英国/全球' },
  { id: 'bloomberg', name: 'Bloomberg Television', channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg', lang: 'EN', region: '财经/全球' },
  { id: 'euronews', name: 'Euronews English', channelId: 'UCSrZ3UV4jOidv8ppoVuvW9Q', lang: 'EN', region: '欧洲' },
  { id: 'trtworld', name: 'TRT World', channelId: 'UC7fWeaHhqgM4Ry-RMpM2YYw', lang: 'EN', region: '土耳其/全球' },
  { id: 'abcnews', name: 'ABC News（美国）', channelId: 'UCBi2mrWuNuyYy4gbM6fU18Q', lang: 'EN', region: '美国' },
  { id: 'nbcnews', name: 'NBC News NOW', channelId: 'UCeY0bbntWzzVIaj2z3QigXg', lang: 'EN', region: '美国' },
  { id: 'cna', name: 'CNA（亚洲新闻台）', channelId: 'UC53Bq1Re8sQF6sxKku2v1zA', lang: 'EN', region: '亚太/新加坡' },
  { id: 'nasa', name: 'NASA（航天直播）', channelId: 'UCLA_DiR1FfKNvjuUpBHmylQ', lang: 'EN', region: '航天/科普' },
];

/** 频道直播嵌入 URL */
export function channelEmbedUrl(channelId: string): string {
  return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`;
}

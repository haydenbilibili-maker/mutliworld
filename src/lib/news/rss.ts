import { batchTranslate } from '@/lib/translate';

/**
 * RSS 新闻聚合 — 对标 World Monitor Round 4
 *
 * 服务端拉取若干公开 RSS（免费无 key），轻量正则解析 item，去重排序。
 * 仅存标题 + 链接 + 来源 + 时间（不缓存正文，尊重版权）。
 * 英文标题自动翻译为简体中文（使用已配置的 LLM）。
 */

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
}

const FEEDS: { source: string; url: string }[] = [
  { source: 'BBC', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' },
  { source: '半岛', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { source: 'UN News', url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml' },
  { source: 'France24', url: 'https://www.france24.com/en/rss' },
  { source: 'DW', url: 'https://rss.dw.com/rdf/rss-en-all' },
];

function decode(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function pick(block: string, tag: string): string {
  const m = block.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
  );
  return m ? decode(m[1].trim()) : '';
}

function parseFeed(xml: string, source: string): NewsItem[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  const out: NewsItem[] = [];
  for (const it of items) {
    const title = pick(it, 'title');
    const link = pick(it, 'link');
    if (!title || !link) continue;
    const pub = pick(it, 'pubDate');
    const d = pub ? new Date(pub) : new Date();
    out.push({
      id: `${source}-${link}`,
      title,
      link,
      source,
      publishedAt: isNaN(d.getTime())
        ? new Date().toISOString()
        : d.toISOString(),
    });
  }
  return out;
}

/** 聚合所有 feed，去重（按 link）、按时间降序、截断。失败的 feed 跳过。Next 缓存 5 分钟。 */
export async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.all(
    FEEDS.map(async (f) => {
      try {
        const r = await fetch(f.url, { next: { revalidate: 300 } });
        if (!r.ok) return [] as NewsItem[];
        const xml = await r.text();
        return parseFeed(xml, f.source);
      } catch {
        return [] as NewsItem[];
      }
    }),
  );

  const seen = new Set<string>();
  const dedup: NewsItem[] = [];
  for (const n of results.flat()) {
    if (seen.has(n.link)) continue;
    seen.add(n.link);
    dedup.push(n);
  }
  dedup.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const top = dedup.slice(0, 40);

  // 英文标题自动翻译为简体中文
  try {
    const titles = top.map((n) => n.title);
    const translationMap = await batchTranslate(titles);
    for (const n of top) {
      const translated = translationMap.get(n.title);
      if (translated && translated !== n.title) n.title = translated;
    }
  } catch {
    // 翻译失败不影响数据返回
  }

  return top;
}

/**
 * 实时市场数据 — 对标 World Monitor「Finance」维度（Round 5）
 *
 * 免费、无 key、服务端抓取（无 CORS）：
 *  - 外汇 FX：Frankfurter（ECB 数据），日涨跌用近 10 日时间序列算。
 *  - 加密 Crypto：CoinGecko simple/price（含 24h 涨跌）。
 *
 * 每个源独立 try/catch：任一失败不影响其余，面板始终给出可用数据。
 * 仅展示价格/涨跌等公开行情，不含投资建议。
 */

export type MarketKind = 'fx' | 'crypto';

export interface MarketQuote {
  id: string;
  kind: MarketKind;
  symbol: string;       // 展示符号，如 USD/CNY、BTC
  label: string;        // 中文名
  price: number;        // 现价
  changePct: number | null; // 涨跌幅 %（日 / 24h），无则 null
  unit: string;         // 计价单位，如 CNY、USD
  asOf: string | null;  // 数据日期/时间
}

/** FX：以 USD 为基准的主要货币 + 卢布（俄乌相关） */
const FX_SYMBOLS = ['CNY', 'EUR', 'JPY', 'GBP', 'RUB'] as const;
const FX_LABEL: Record<string, string> = {
  CNY: '人民币',
  EUR: '欧元',
  JPY: '日元',
  GBP: '英镑',
  RUB: '卢布',
};

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** 拉取 USD→各币种汇率，并用近 10 日序列算最近两个交易日的涨跌幅 */
async function fetchFx(): Promise<MarketQuote[]> {
  const symbols = FX_SYMBOLS.join(',');
  const end = new Date();
  const start = new Date(end.getTime() - 10 * 86400_000);
  const url = `https://api.frankfurter.dev/v1/${ymd(start)}..${ymd(
    end,
  )}?base=USD&symbols=${symbols}`;

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const json = (await res.json()) as {
    rates: Record<string, Record<string, number>>;
  };

  const dates = Object.keys(json.rates).sort(); // 升序
  if (dates.length === 0) return [];
  const lastDate = dates[dates.length - 1];
  const prevDate = dates.length >= 2 ? dates[dates.length - 2] : null;
  const last = json.rates[lastDate];
  const prev = prevDate ? json.rates[prevDate] : null;

  return FX_SYMBOLS.filter((s) => last[s] != null).map((s) => {
    const price = last[s];
    const p = prev?.[s];
    const changePct =
      p != null && p !== 0 ? ((price - p) / p) * 100 : null;
    return {
      id: `fx-${s}`,
      kind: 'fx' as const,
      symbol: `USD/${s}`,
      label: FX_LABEL[s] ?? s,
      price,
      changePct,
      unit: s,
      asOf: lastDate,
    };
  });
}

/** 拉取主要加密货币现价 + 24h 涨跌 */
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana'] as const;
const CRYPTO_META: Record<string, { symbol: string; label: string }> = {
  bitcoin: { symbol: 'BTC', label: '比特币' },
  ethereum: { symbol: 'ETH', label: '以太坊' },
  solana: { symbol: 'SOL', label: 'Solana' },
};

async function fetchCrypto(): Promise<MarketQuote[]> {
  const ids = CRYPTO_IDS.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url, {
    next: { revalidate: 120 },
    headers: { accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`coingecko ${res.status}`);
  const json = (await res.json()) as Record<
    string,
    { usd?: number; usd_24h_change?: number }
  >;

  const out: MarketQuote[] = [];
  for (const id of CRYPTO_IDS) {
    const row = json[id];
    if (!row || row.usd == null) continue;
    const meta = CRYPTO_META[id];
    out.push({
      id: `crypto-${id}`,
      kind: 'crypto',
      symbol: meta.symbol,
      label: meta.label,
      price: row.usd,
      changePct: row.usd_24h_change ?? null,
      unit: 'USD',
      asOf: new Date().toISOString(),
    });
  }
  return out;
}

/** 聚合所有市场源；任一失败不影响其余 */
export async function fetchMarkets(): Promise<{
  quotes: MarketQuote[];
  sources: { fx: boolean; crypto: boolean };
}> {
  const [fxRes, cryptoRes] = await Promise.allSettled([
    fetchFx(),
    fetchCrypto(),
  ]);

  const quotes: MarketQuote[] = [];
  const sources = { fx: false, crypto: false };

  if (fxRes.status === 'fulfilled') {
    quotes.push(...fxRes.value);
    sources.fx = fxRes.value.length > 0;
  }
  if (cryptoRes.status === 'fulfilled') {
    quotes.push(...cryptoRes.value);
    sources.crypto = cryptoRes.value.length > 0;
  }

  return { quotes, sources };
}

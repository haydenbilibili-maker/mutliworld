/**
 * 批量中文翻译 — 将英文内容翻译为简体中文
 *
 * 使用 DeepSeek（已配置的 LLM 客户端）进行批量化翻译。
 * 设计约束：
 *  - 跳过已含中文的文本（无需翻译）
 *  - 批量发送减少 API 调用次数
 *  - 内存缓存避免重复翻译同一字符串
 *  - 翻译异常时回退到原文，不阻塞数据流
 */

import 'server-only';

const KEY = (process.env.LLM_API_KEY ?? '').trim();
const BASE = (process.env.LLM_BASE_URL ?? 'https://api.deepseek.com').trim().replace(/\/$/, '');
const MODEL = process.env.LLM_MODEL ?? 'deepseek-chat';

/** 是否已包含中文字符（近似判断——有中文就视为已有中文翻译） */
function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff\u3400-\u4dbf]/.test(text);
}

/** 内存缓存：原文 → 译文 */
const cache = new Map<string, string>();
const CACHE_MAX = 500;

function cachedTranslate(text: string): string | null {
  return cache.get(text) ?? null;
}

function setCache(original: string, translated: string): void {
  if (cache.size >= CACHE_MAX) {
    // 简单淘汰：删除最早的一半
    const keys = Array.from(cache.keys());
    for (let i = 0; i < keys.length / 2; i++) cache.delete(keys[i]);
  }
  cache.set(original, translated);
}

/**
 * 批量翻译文本为中文
 *
 * @param texts  待翻译的字符串数组
 * @param maxBatchSize  每批最大条数（默认 8，超出则分批调用）
 * @returns 原始字符串 → 译文的映射（未翻译或失败的保留原文）
 */
export async function batchTranslate(
  texts: string[],
  maxBatchSize = 8,
): Promise<Map<string, string>> {
  const result = new Map<string, string>();

  // 1. 筛出需要翻译的（缓存命中 + 跳过中文）
  const toTranslate: string[] = [];
  for (const t of texts) {
    if (!t || hasChinese(t)) {
      result.set(t, t); // 已有中文，直接保留
      continue;
    }
    const cached = cachedTranslate(t);
    if (cached !== null) {
      result.set(t, cached);
      continue;
    }
    toTranslate.push(t);
  }

  if (toTranslate.length === 0) return result;

  // 2. 分批翻译
  for (let i = 0; i < toTranslate.length; i += maxBatchSize) {
    const batch = toTranslate.slice(i, i + maxBatchSize);
    try {
      const translated = await callTranslateBatch(batch);
      for (let j = 0; j < batch.length; j++) {
        const t = translated[j]?.trim();
        if (t && t.length > 0 && t !== batch[j]) {
          result.set(batch[j], t);
          setCache(batch[j], t);
        } else {
          result.set(batch[j], batch[j]); // 翻译失败，保留原文
        }
      }
    } catch {
      // 整批失败，全部保留原文
      for (const t of batch) result.set(t, t);
    }
  }

  return result;
}

/**
 * 调用 LLM 进行一次批量翻译
 */
async function callTranslateBatch(texts: string[]): Promise<string[]> {
  const prompt = `请将以下英文文本逐条翻译为简体中文。每条结果占一行，不要编号，不要解释，直接输出翻译。如果原文已经是中文则保留不变。\n\n${texts.map((t, i) => `[${i + 1}] ${t}`).join('\n')}`;

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: '你是一名专业翻译。输出纯文本，每行一条翻译，与输入条数完全一致。不要额外说明。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: texts.length * 60,
    }),
  });

  if (!res.ok) throw new Error(`Translation API error: ${res.status}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty translation response');

  // 解析响应行
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  // 去掉可能的编号前缀 "[1] xxx" → "xxx"
  const parsed = lines.map((l) => l.replace(/^\[\d+\]\s*/, ''));

  return parsed;
}

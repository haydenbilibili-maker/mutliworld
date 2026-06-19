/**
 * LLM 客户端 — DeepSeek Chat Completions（默认）+ 兼容 OpenAI（可切换）
 *
 * 环境变量（服务端）：
 *  - LLM_API_KEY   ：API 密钥（必填，缺失则功能优雅降级）
 *                     DeepSeek 密钥可在 platform.deepseek.com/api_keys 获取
 *  - LLM_BASE_URL  ：兼容端点基址，默认 https://api.deepseek.com
 *                     切回 OpenAI 设为 https://api.openai.com/v1
 *  - LLM_MODEL     ：模型名，默认 deepseek-chat
 *                     切回 GPT 设为 gpt-4o-mini 等
 *
 * 仅用于「在给定真实数据上合成中立简报」，不引入模型自身的世界知识（RAG 式约束在提示词中声明）。
 */

const KEY = (process.env.LLM_API_KEY ?? '').trim();
const BASE = (process.env.LLM_BASE_URL ?? 'https://api.deepseek.com').trim().replace(/\/$/, '');
const MODEL = (process.env.LLM_MODEL ?? 'deepseek-chat').trim();

export function hasLlm(): boolean {
  return KEY.length > 0;
}

export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

/** 调用 LLM；缺 Key/失败返回 null（上层降级，不编造）。 */
export async function chat(messages: ChatMessage[], maxTokens = 600): Promise<string | null> {
  if (!hasLlm()) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
      }),
    }).finally(() => clearTimeout(timeout));
    if (!res.ok) {
      if (res.status === 401) console.error('[LLM] 认证失败：请检查 LLM_API_KEY');
      else if (res.status === 429) console.error('[LLM] 请求频率超限（429）');
      else console.error('[LLM] HTTP', res.status, res.statusText);
      return null;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content?.trim();
    return text && text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

export const LLM_MODEL_NAME = MODEL;

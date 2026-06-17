/**
 * LLM 客户端 — OpenAI 兼容 Chat Completions（区域简报 LLM 化）
 *
 * 环境变量（服务端）：
 *  - LLM_API_KEY   ：API 密钥（必填，缺失则功能优雅降级）
 *  - LLM_BASE_URL  ：兼容端点基址，默认 https://api.openai.com/v1
 *  - LLM_MODEL     ：模型名，默认 gpt-4o-mini
 *
 * 仅用于「在给定真实数据上合成中立简报」，不引入模型自身的世界知识（RAG 式约束在提示词中声明）。
 */

const KEY = (process.env.LLM_API_KEY ?? '').trim();
const BASE = (process.env.LLM_BASE_URL ?? 'https://api.openai.com/v1').trim().replace(/\/$/, '');
const MODEL = (process.env.LLM_MODEL ?? 'gpt-4o-mini').trim();

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
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = json.choices?.[0]?.message?.content?.trim();
    return text && text.length > 0 ? text : null;
  } catch {
    return null;
  }
}

export const LLM_MODEL_NAME = MODEL;

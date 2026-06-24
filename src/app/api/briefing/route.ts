export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { chat, hasLlm, LLM_MODEL_NAME } from '@/lib/llm/client';

/**
 * 区域简报 LLM 化 — 仅在给定真实数据上合成中立简报，保留来源、不编造。
 * 缺 LLM_API_KEY 时返回 degraded:'no_key'，前端回落规则化简报。
 */

interface BriefingItem {
  title: string;
  source?: string;
  timestamp?: string;
}

interface BriefingRequest {
  regionName?: string;
  stats?: Record<string, number>;
  recent?: BriefingItem[];
  situation?: string[];
}

const SYSTEM = [
  '你是地缘态势简报助手。严格遵守：',
  '1) 只能依据用户提供的「真实数据」撰写，不得引入任何外部或你自己的知识；',
  '2) 中立、客观、不渲染立场，不编造数字、事件或结论；',
  '3) 用简体中文，控制在 4-6 句，先总后分；',
  '4) 涉及具体动态时标注其来源名称（如 BBC/USGS 等）；',
  '5) 数据不足时如实说明「监测数据有限」，不要补全臆测。',
].join('\n');

export async function POST(req: Request) {
  if (!hasLlm()) {
    return Response.json({ degraded: 'no_key' }, { headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    let body: BriefingRequest;
    try {
      body = (await req.json()) as BriefingRequest;
    } catch {
      return Response.json({ degraded: 'error', error: '请求体格式错误' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }
    const lines: string[] = [];
    lines.push(`区域：${body.regionName ?? '未指定'}`);
    if (body.stats) {
      lines.push('结构化计数：' + Object.entries(body.stats).map(([k, v]) => `${k}=${v}`).join('，'));
    }
    if (body.situation?.length) {
      lines.push('态势要点：');
      for (const s of body.situation.slice(0, 8)) lines.push(`- ${s}`);
    }
    if (body.recent?.length) {
      lines.push('近期动态（含来源）：');
      for (const r of body.recent.slice(0, 8)) {
        lines.push(`- ${r.title}${r.source ? `（来源：${r.source}）` : ''}${r.timestamp ? ` · ${r.timestamp.slice(0, 16)}` : ''}`);
      }
    }
    const userPrompt = `以下是该区域的真实监测数据，请据此撰写态势简报：\n\n${lines.join('\n')}`;

    const briefing = await chat([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: userPrompt },
    ]);

    if (!briefing) {
      return Response.json({ degraded: 'llm_error' }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json(
      { briefing, model: LLM_MODEL_NAME, generatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : '简报合成失败';
    return Response.json({ degraded: 'error', error: message }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}

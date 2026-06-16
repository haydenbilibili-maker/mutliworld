import 'server-only';

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { clearTleCache, loadTleDatabase } from '@/lib/orbital/tleStore';
import type { OrbitalCategory } from '@/types/orbital';
import type { TleRefreshResponse } from '@/types/orbital';

/** 硬编码脚本路径，禁止任意命令执行 */
const SCRIPT_PATH = join(process.cwd(), 'scripts', 'fetch-tle.js');
const TIMEOUT_MS = 120_000;

let refreshInProgress = false;

interface ScriptResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function runFetchTleScript(): Promise<ScriptResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [SCRIPT_PATH], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('TLE 抓取超时（120s）'));
    }, TIMEOUT_MS);

    child.stdout?.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });
    child.stderr?.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? 1 });
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function emptyCounts(): Record<OrbitalCategory, number> {
  return { station: 0, satellite: 0, debris: 0 };
}

/** 执行 node scripts/fetch-tle.js，写入 data/orbital/tle.json */
export async function refreshTleData(): Promise<TleRefreshResponse> {
  if (refreshInProgress) {
    return {
      ok: false,
      count: 0,
      fetchedAt: '',
      counts: emptyCounts(),
      source: '',
      summary: '',
      error: '已有更新任务正在执行，请稍后再试',
    };
  }

  refreshInProgress = true;
  try {
    const { stdout, stderr, exitCode } = await runFetchTleScript();
    clearTleCache();
    const db = loadTleDatabase();
    const summary = stdout.trim().split('\n').slice(-4).join('\n').trim();

    if (exitCode !== 0) {
      return {
        ok: false,
        count: db.objects.length,
        fetchedAt: db.fetchedAt,
        counts: db.counts,
        source: db.source,
        summary,
        error: stderr.trim() || summary || `脚本退出码 ${exitCode}`,
      };
    }

    return {
      ok: true,
      count: db.objects.length,
      fetchedAt: db.fetchedAt,
      counts: db.counts,
      source: db.source,
      summary,
    };
  } catch (err) {
    clearTleCache();
    const db = loadTleDatabase();
    const message = err instanceof Error ? err.message : '未知错误';
    return {
      ok: false,
      count: db.objects.length,
      fetchedAt: db.fetchedAt,
      counts: db.counts,
      source: db.source,
      summary: '',
      error: message,
    };
  } finally {
    refreshInProgress = false;
  }
}

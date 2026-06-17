import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { SystemInfo } from '@/lib/admin/system';

const MAPLIBRE_VERSION = '5.24.0';

export function getPackageVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    ) as { version?: string; name?: string };
    return pkg.version ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export function getPackageName(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    ) as { name?: string };
    return pkg.name ?? 'global-situation-awareness-dashboard';
  } catch {
    return 'global-situation-awareness-dashboard';
  }
}

export function getSystemInfo(): SystemInfo {
  return {
    appName: getPackageName(),
    version: getPackageVersion(),
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
    maplibreVersion: MAPLIBRE_VERSION,
    globeProjection: true,
    geographicBasemap: true,
    buildTime: process.env.BUILD_TIME ?? null,
  };
}

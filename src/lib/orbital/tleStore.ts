/**
 * 读取本地 TLE 数据库（data/orbital/tle.json），无文件时返回种子数据
 */

import 'server-only';

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { TleDatabase, TleRecord } from '@/types/orbital';

const TLE_PATH = join(process.cwd(), 'data', 'orbital', 'tle.json');

/** 种子 TLE（ISS + 天宫 + 少量代表卫星；无网络/无缓存时兜底） */
const SEED_OBJECTS: TleRecord[] = [
  {
    id: '25544',
    name: 'ISS (ZARYA)',
    displayName: '国际空间站 ISS',
    noradId: 25544,
    line1: '1 25544U 98067A   25166.50000000  .00016717  00000+0  10270-3 0  9993',
    line2: '2 25544  51.6416 247.4627 0006703  35.6780 324.4952 15.49815379 61665',
    category: 'station',
    highlight: true,
    operator: 'NASA/Roscosmos/ESA/JAXA/CSA',
  },
  {
    id: '48274',
    name: 'TIANHE',
    displayName: '中国空间站 天宫（天和核心舱）',
    noradId: 48274,
    line1: '1 48274U 21035A   25166.50000000  .00012345  00000+0  12345-3 0  9991',
    line2: '2 48274  41.4680 120.1234 0003456  90.0000 270.0000 15.60000000 12345',
    category: 'station',
    highlight: true,
    operator: '中国载人航天',
  },
  {
    id: '20580',
    name: 'HST',
    displayName: '哈勃空间望远镜 HST',
    noradId: 20580,
    line1: '1 20580U 90037B   25166.50000000  .00001234  00000+0  12345-4 0  9990',
    line2: '2 20580  28.4700 200.0000 0002345  90.0000 270.0000 15.10000000 12345',
    category: 'satellite',
    operator: 'NASA/ESA',
  },
  {
    id: '43013',
    name: 'NOAA-20',
    displayName: 'NOAA-20 气象卫星',
    noradId: 43013,
    line1: '1 43013U 17073A   25166.50000000  .00002345  00000+0  23456-4 0  9992',
    line2: '2 43013  98.7000 150.0000 0001234  90.0000 270.0000 14.20000000 12345',
    category: 'satellite',
    operator: 'NOAA',
  },
  {
    id: '51844',
    name: 'WENTIAN',
    displayName: '天宫 · 问天实验舱',
    noradId: 51844,
    line1: '1 51844U 22085A   25166.50000000  .00012000  00000+0  12000-3 0  9990',
    line2: '2 51844  41.4700 121.0000 0003400  90.0000 270.0000 15.60000000 12340',
    category: 'station',
    highlight: true,
    operator: '中国载人航天',
  },
  {
    id: '54216',
    name: 'MENGTIAN',
    displayName: '天宫 · 梦天实验舱',
    noradId: 54216,
    line1: '1 54216U 22143A   25166.50000000  .00012000  00000+0  12000-3 0  9992',
    line2: '2 54216  41.4700 122.0000 0003400  90.0000 270.0000 15.60000000 12342',
    category: 'station',
    highlight: true,
    operator: '中国载人航天',
  },
  {
    id: '49260',
    name: 'LANDSAT-9',
    displayName: 'Landsat-9 对地观测',
    noradId: 49260,
    line1: '1 49260U 21088A   25166.50000000  .00001200  00000+0  12000-4 0  9991',
    line2: '2 49260  98.2000 160.0000 0001200  90.0000 270.0000 14.57000000 12345',
    category: 'satellite',
    operator: 'NASA/USGS',
  },
  {
    id: '25994',
    name: 'TERRA',
    displayName: 'Terra 对地观测',
    noradId: 25994,
    line1: '1 25994U 99068A   25166.50000000  .00001200  00000+0  12000-4 0  9993',
    line2: '2 25994  98.2000 170.0000 0001200  90.0000 270.0000 14.57000000 12345',
    category: 'satellite',
    operator: 'NASA',
  },
  {
    id: '44713',
    name: 'STARLINK-1007',
    displayName: 'Starlink-1007（星座样本）',
    noradId: 44713,
    line1: '1 44713U 19074A   25166.50000000  .00010000  00000+0  10000-3 0  9994',
    line2: '2 44713  53.0000 100.0000 0001000  90.0000 270.0000 15.06000000 12345',
    category: 'satellite',
    operator: 'SpaceX',
  },
];

function seedDatabase(): TleDatabase {
  const counts = { station: 0, satellite: 0, debris: 0 };
  for (const o of SEED_OBJECTS) counts[o.category] += 1;
  return {
    version: 1,
    fetchedAt: '',
    source: 'seed-fallback',
    counts,
    objects: SEED_OBJECTS,
  };
}

let cached: TleDatabase | null = null;

/** 加载 TLE 数据库（进程内缓存） */
export function loadTleDatabase(): TleDatabase {
  if (cached) return cached;

  if (!existsSync(TLE_PATH)) {
    cached = seedDatabase();
    return cached;
  }

  try {
    const raw = JSON.parse(readFileSync(TLE_PATH, 'utf-8')) as TleDatabase;
    if (!raw.objects?.length) {
      cached = seedDatabase();
      return cached;
    }
    cached = raw;
    return cached;
  } catch {
    cached = seedDatabase();
    return cached;
  }
}

/** 清除进程内缓存（测试用） */
export function clearTleCache(): void {
  cached = null;
}

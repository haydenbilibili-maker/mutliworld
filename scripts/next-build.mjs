#!/usr/bin/env node
/**
 * Build via a no-space symlink cwd — required because the project path
 * contains a space ("Multi world") which breaks Next/webpack chunk output.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const linkPath = path.join(os.tmpdir(), 'multiworld-next-build');
const nextBin = path.join(projectRoot, 'node_modules', '.bin', 'next');
const distDir = path.join(projectRoot, '.next');

function runBuild() {
  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(projectRoot, linkPath, 'dir');
  const result = spawnSync(nextBin, ['build'], {
    cwd: linkPath,
    stdio: 'inherit',
    env: process.env,
  });
  fs.rmSync(linkPath, { recursive: true, force: true });
  return result.status ?? 1;
}

for (let attempt = 1; attempt <= 3; attempt++) {
  if (attempt > 1) {
    fs.rmSync(distDir, { recursive: true, force: true });
    fs.rmSync(path.join(projectRoot, 'node_modules', '.cache'), { recursive: true, force: true });
  }
  const code = runBuild();
  if (code === 0) process.exit(0);
}

process.exit(1);

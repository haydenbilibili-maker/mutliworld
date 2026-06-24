#!/usr/bin/env node
/**
 * Next.js dev via a no-space symlink cwd (same path workaround as next-build.mjs).
 * Uses webpack by default; pass --turbo or run `npm run dev:turbo` for Turbopack.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const linkPath = path.join(os.tmpdir(), 'multiworld-next-dev');

fs.rmSync(linkPath, { recursive: true, force: true });
fs.symlinkSync(projectRoot, linkPath, 'dir');

const args = process.argv.slice(2);
const nextBin = path.join(projectRoot, 'node_modules', '.bin', 'next');
const child = spawn(nextBin, ['dev', ...args], {
  cwd: linkPath,
  stdio: 'inherit',
  env: process.env,
});

const cleanup = () => {
  try {
    fs.rmSync(linkPath, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
};

child.on('exit', (code) => {
  cleanup();
  process.exit(code ?? 1);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));

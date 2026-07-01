import { spawnSync } from 'node:child_process';
import path from 'node:path';

const executable = process.platform === 'win32' ? 'astro.cmd' : 'astro';
const astroBin = path.join(process.cwd(), 'node_modules', '.bin', executable);

const result = spawnSync(astroBin, ['build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
  },
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);

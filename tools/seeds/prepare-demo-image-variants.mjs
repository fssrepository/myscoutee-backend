import { mkdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const options = parseArgs(process.argv.slice(2));
if (!options.source || !options.kind || !options.key) {
  throw new Error('Usage: node tools/seeds/prepare-demo-image-variants.mjs --source FILE --kind asset|event|profile --key KEY');
}
if (!['asset', 'event', 'profile'].includes(options.kind)) throw new Error(`Unsupported kind: ${options.kind}`);
await stat(options.source);

const portrait = options.kind === 'profile';
const targetDirectory = portrait
  ? path.join(ROOT, 'server/docker/conf/minio/media/images/demo-profiles', options.key, 'photo-01')
  : path.join(ROOT, 'server/docker/conf/minio/media/images', `demo-${options.kind}s`, options.key, 'v1');
await mkdir(targetDirectory, { recursive: true });

const variants = portrait
  ? [
      { name: 'large', width: 960, height: 1280, quality: 82 },
      { name: 'medium', width: 480, height: 640, quality: 78 },
      { name: 'small', width: 96, height: 128, quality: 72 }
    ]
  : [
      { name: 'large', width: 1280, height: 720, quality: 82 },
      { name: 'medium', width: 640, height: 360, quality: 78 },
      { name: 'small', width: 128, height: 72, quality: 72 }
    ];

for (const variant of variants) {
  const target = path.join(targetDirectory, `${variant.name}.webp`);
  try {
    await stat(target);
    if (!options.force) throw new Error(`Refusing to overwrite ${path.relative(ROOT, target)}; pass --force intentionally.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const result = spawnSync('convert', [
    options.source,
    '-auto-orient',
    '-resize', `${variant.width}x${variant.height}^`,
    '-gravity', 'center',
    '-extent', `${variant.width}x${variant.height}`,
    '-strip',
    '-define', 'webp:method=6',
    '-quality', `${variant.quality}`,
    target
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `ImageMagick failed with ${result.status}`);
}

console.log(JSON.stringify({ kind: options.kind, key: options.key, targetDirectory: path.relative(ROOT, targetDirectory) }));

function parseArgs(args) {
  const result = { force: false };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--force') result.force = true;
    else if (args[index]?.startsWith('--')) result[args[index].slice(2)] = args[index + 1], index += 1;
  }
  return result;
}

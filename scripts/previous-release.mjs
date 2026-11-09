#!/usr/bin/env node
// Print the greatest published version below the one being released.
// Reads one version per line on stdin (for example from `gh release list`).
//
// Usage: ... | node scripts/previous-release.mjs <version>

import { readFileSync } from 'node:fs';

const current = process.argv[2];
if (!current) {
  console.error('usage: previous-release.mjs <version>');
  process.exit(2);
}

const parse = (value) => value.split('.').map((part) => Number(part));
const compare = (left, right) => {
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const delta = (a[i] || 0) - (b[i] || 0);
    if (delta) return Math.sign(delta);
  }
  return 0;
};

const versions = readFileSync(0, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => /^\d+\.\d+\.\d+$/.test(line));

let previous = '';
for (const version of versions) {
  if (version === current || compare(version, current) >= 0) continue;
  if (!previous || compare(version, previous) > 0) previous = version;
}

process.stdout.write(previous);

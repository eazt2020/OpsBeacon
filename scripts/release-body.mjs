#!/usr/bin/env node
// Build the body of a GitHub release from RELEASE_NOTES.md.
//
// A release describes every change made after the previous release, up to and
// including this version. Versions that were tagged or documented in between
// but never published as releases are therefore folded into the next release.
//
// Usage: node scripts/release-body.mjs <version> [previous-version] [notes-file]

import { readFileSync } from 'node:fs';

const [version, previous = '', file = 'RELEASE_NOTES.md'] = process.argv.slice(2);
if (!version) {
  console.error('usage: release-body.mjs <version> [previous-version] [notes-file]');
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

const sections = [];
let current = null;
for (const line of readFileSync(file, 'utf8').split('\n')) {
  const heading = /^##\s+(\d+\.\d+\.\d+)\s*$/.exec(line);
  if (heading) {
    current = { version: heading[1], body: [] };
    sections.push(current);
    continue;
  }
  if (current) current.body.push(line);
}

const selected = sections.filter(
  (section) =>
    compare(section.version, version) <= 0 &&
    (!previous || compare(section.version, previous) > 0)
);

if (!selected.some((section) => section.version === version)) {
  console.error(`No '## ${version}' section in ${file}`);
  process.exit(1);
}

const body = selected
  .map((section) => [`## ${section.version}`, ...section.body].join('\n').replace(/\s+$/, ''))
  .join('\n\n');

process.stdout.write(`${body}\n`);

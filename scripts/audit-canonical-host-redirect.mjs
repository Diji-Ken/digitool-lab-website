#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const htaccess = readFileSync('.htaccess', 'utf8');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const lines = htaccess.split('\n').map((line) => line.trim()).filter(Boolean);
const expected = [
  'RewriteCond %{HTTPS} !=on [OR]',
  'RewriteCond %{HTTP_HOST} !^digitool-lab\\.com$ [NC]',
  'RewriteRule ^ https://digitool-lab.com%{REQUEST_URI} [L,R=301,NE]',
];

const firstRule = lines.indexOf(expected[0]);
const hasOneHopRule = firstRule >= 0
  && lines[firstRule + 1] === expected[1]
  && lines[firstRule + 2] === expected[2];

const findings = [];
if (!hasOneHopRule) {
  findings.push('.htaccess must redirect HTTP and non-canonical hosts directly to the HTTPS apex URL in one hop.');
}

if (htaccess.includes('https://%{HTTP_HOST}%{REQUEST_URI}')) {
  findings.push('.htaccess must not preserve the incoming host during the HTTP-to-HTTPS redirect.');
}

for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = new URL(match[1]);
  if (url.protocol !== 'https:' || url.hostname !== 'digitool-lab.com') {
    findings.push(`sitemap.xml contains a non-canonical URL: ${match[1]}`);
  }
}

if (findings.length) {
  console.error('Canonical host redirect audit failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Canonical host redirect audit passed: HTTP and www requests use a one-hop HTTPS apex redirect.');

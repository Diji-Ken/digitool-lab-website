#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const MAX_TITLE_LENGTH = 70;
const SKIP_DIRS = new Set([".git", ".github", "node_modules", "tools"]);

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(path));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

const findings = [];
for (const path of collectHtmlFiles(ROOT)) {
  const html = readFileSync(path, "utf8");
  const robots = html.match(/<meta\s+[^>]*name=["']robots["'][^>]*>/i)?.[0] ?? "";
  if (/noindex/i.test(robots)) continue;

  const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  if (!rawTitle) continue;
  const title = rawTitle.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const length = [...title].length;
  if (length > MAX_TITLE_LENGTH) {
    findings.push({ file: relative(ROOT, path), length, title });
  }
}

if (findings.length > 0) {
  console.error(`Title length audit failed: ${findings.length} indexable page(s) exceed ${MAX_TITLE_LENGTH} characters.`);
  for (const finding of findings) {
    console.error(`  ${finding.file} (${finding.length}): ${finding.title}`);
  }
  process.exit(1);
}

console.log(`Title length audit passed: all indexable HTML titles are ${MAX_TITLE_LENGTH} characters or fewer.`);

#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const SITE_ORIGIN = "https://digitool-lab.com";
const SITE_HOST = "digitool-lab.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "4ba663d743398d30823a85572606249e";
const INDEXNOW_KEY_FILE = `${INDEXNOW_KEY}.txt`;
const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY_FILE}`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const submitAll = args.includes("--all");

function argumentValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function runGit(gitArgs) {
  return execFileSync("git", gitArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function changedFiles(before, after) {
  if (before && !/^0+$/.test(before)) {
    return runGit(["diff", "--name-only", before, after])
      .split("\n")
      .filter(Boolean);
  }

  return runGit(["show", "--format=", "--name-only", after])
    .split("\n")
    .filter(Boolean);
}

function canonicalFromHtml(filePath) {
  if (!existsSync(filePath)) return null;

  const html = readFileSync(filePath, "utf8");
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of linkTags) {
    if (!/\brel=["']canonical["']/i.test(tag)) continue;
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) return href;
  }
  return null;
}

function fallbackUrlForHtml(filePath) {
  const normalized = filePath.replace(/^\.\//, "").replaceAll(path.sep, "/");
  const excludedPrefixes = [".github/", "docs/", "scripts/", "tools/", "data/"];
  if (excludedPrefixes.some((prefix) => normalized.startsWith(prefix))) return null;
  if (!normalized.endsWith(".html")) return null;

  if (normalized === "index.html") return `${SITE_ORIGIN}/`;
  if (normalized.endsWith("/index.html")) {
    return `${SITE_ORIGIN}/${normalized.slice(0, -"index.html".length)}`;
  }
  return `${SITE_ORIGIN}/${normalized.slice(0, -".html".length)}`;
}

function parseSitemap(xml) {
  const entries = new Map();
  for (const match of xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/gi)) {
    const block = match[1];
    const loc = block.match(/<loc>([^<]+)<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1]?.trim() ?? "";
    entries.set(loc, lastmod);
  }
  return entries;
}

function previousSitemap(before) {
  if (!before || /^0+$/.test(before)) return new Map();
  try {
    return parseSitemap(runGit(["show", `${before}:sitemap.xml`]));
  } catch {
    return new Map();
  }
}

function normalizeSiteUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, `${SITE_ORIGIN}/`);
    if (url.protocol !== "https:" || url.hostname !== SITE_HOST) return null;
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function collectUrls(files, before, forceAll) {
  const urls = new Set();
  const sitemapChanged = files.includes("sitemap.xml");
  const firstSetup = files.includes(INDEXNOW_KEY_FILE);
  const currentSitemap = parseSitemap(readFileSync("sitemap.xml", "utf8"));

  if (forceAll || firstSetup) {
    for (const loc of currentSitemap.keys()) urls.add(loc);
  } else if (sitemapChanged) {
    const oldSitemap = previousSitemap(before);
    for (const [loc, lastmod] of currentSitemap) {
      if (!oldSitemap.has(loc) || oldSitemap.get(loc) !== lastmod) urls.add(loc);
    }
  }

  for (const file of files) {
    if (!file.endsWith(".html")) continue;
    const url = canonicalFromHtml(file) ?? fallbackUrlForHtml(file);
    if (url) urls.add(url);
  }

  return [...urls]
    .map(normalizeSiteUrl)
    .filter(Boolean)
    .sort();
}

function assertKeyFile() {
  if (!existsSync(INDEXNOW_KEY_FILE)) {
    throw new Error(`IndexNow key file is missing: ${INDEXNOW_KEY_FILE}`);
  }
  const publishedKey = readFileSync(INDEXNOW_KEY_FILE, "utf8").trim();
  if (publishedKey !== INDEXNOW_KEY) {
    throw new Error("IndexNow key file does not match the configured key");
  }
}

async function submit(urlList) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList,
      }),
      signal: controller.signal,
    });

    const responseBody = await response.text();
    if (![200, 202].includes(response.status)) {
      throw new Error(`IndexNow returned HTTP ${response.status}: ${responseBody.slice(0, 500)}`);
    }
    console.log(`IndexNow accepted ${urlList.length} URL(s) with HTTP ${response.status}.`);
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  assertKeyFile();

  const before = argumentValue("--before") ?? process.env.GITHUB_EVENT_BEFORE;
  const after = argumentValue("--after") ?? process.env.GITHUB_SHA ?? "HEAD";
  const files = submitAll ? [] : changedFiles(before, after);
  const urlList = collectUrls(files, before, submitAll);

  if (urlList.length === 0) {
    console.log("IndexNow skipped: no changed public URLs were found.");
    return;
  }
  if (urlList.length > 10_000) {
    throw new Error(`IndexNow URL limit exceeded: ${urlList.length}`);
  }

  if (dryRun) {
    console.log(JSON.stringify({ count: urlList.length, urlList }, null, 2));
    return;
  }

  await submit(urlList);
}

await main();

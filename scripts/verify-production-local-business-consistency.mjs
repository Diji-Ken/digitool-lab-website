#!/usr/bin/env node

const baseUrl = 'https://digitool-lab.com/';
const corePages = ['', 'about', 'privacy-policy', 'service', 'case-studies', 'contact'];
const expectedNap = [
  '331-0821',
  '埼玉県さいたま市北区別所町738-3',
  '048-700-7030',
];
const staleNapFragments = [
  '110-0004',
  '東京都台東区',
  '台東区下谷',
  '下谷2丁目23',
  'リベール上野',
  '埼玉県比企郡川島町',
];
const findings = [];
const stamp = Date.now().toString();

async function fetchPage(pathname) {
  const url = new URL(pathname, baseUrl);
  url.searchParams.set('nap_consistency_check', stamp);
  return fetch(url, {
    redirect: 'follow',
    headers: {
      accept: 'text/html,*/*;q=0.8',
      'cache-control': 'no-cache',
      'user-agent': 'DigitalToolLabNapVerifier/1.0',
    },
    signal: AbortSignal.timeout(15_000),
  });
}

await Promise.all(corePages.map(async (pathname) => {
  const label = pathname || '/';
  try {
    const response = await fetchPage(pathname);
    const html = await response.text();
    if (response.status !== 200) {
      findings.push(`${label}: expected 200, received ${response.status}.`);
      return;
    }

    for (const value of expectedNap) {
      if (!html.includes(value)) findings.push(`${label}: current NAP value is missing: ${value}`);
    }
    for (const value of staleNapFragments) {
      if (html.includes(value)) findings.push(`${label}: stale NAP value remains: ${value}`);
    }
  } catch (error) {
    findings.push(`${label}: production fetch failed: ${error.message}`);
  }
}));

if (findings.length > 0) {
  console.error('Production local business consistency verification failed.');
  for (const finding of findings) console.error(`  ${finding}`);
  process.exit(1);
}

console.log(
  `Production local business consistency verification passed: ${corePages.length} core pages, `
  + `${expectedNap.length} current NAP values, ${staleNapFragments.length} stale fragments.`,
);

const baseUrl = 'https://digitool-lab.com/';
const privatePaths = [
  '業務効率化サポート事例 - 活用サポート事例.csv',
  'add-analytics.sh',
  'check-missing-pages.py',
  'nginx-redirect.conf',
  'analytics_code.txt',
  'spam_log.txt',
  'spam_admin.php',
  'test_spam_protection.php',
  'spam_protection_config.php',
  'enhanced_spam_protection.php',
];
const publicPaths = [
  'robots.txt',
  'llms.txt',
  'llms_full.txt',
  '4ba663d743398d30823a85572606249e.txt',
];
const findings = [];

async function statusFor(path) {
  const url = new URL(path, baseUrl);
  url.searchParams.set('exposure_check', Date.now().toString());
  const response = await fetch(url, {
    method: 'HEAD',
    redirect: 'manual',
    headers: { 'cache-control': 'no-cache' },
    signal: AbortSignal.timeout(15_000),
  });
  return response.status;
}

for (const path of privatePaths) {
  const status = await statusFor(path);
  if (status !== 403 && status !== 404 && status !== 410) {
    findings.push(`${path}: expected 403/404/410, received ${status}.`);
  }
}

for (const path of publicPaths) {
  const status = await statusFor(path);
  if (status !== 200) {
    findings.push(`${path}: expected 200, received ${status}.`);
  }
}

if (findings.length > 0) {
  console.error('Production public file exposure verification failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log(`Production public file exposure verification passed: ${privatePaths.length} private paths blocked, ${publicPaths.length} discovery files available.`);

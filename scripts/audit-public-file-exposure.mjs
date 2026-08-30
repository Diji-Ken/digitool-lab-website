import fs from 'node:fs';

const htaccess = fs.readFileSync('.htaccess', 'utf8');
const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
const findings = [];

const extensionRule = htaccess.match(/RewriteRule \^\.\*\\\.\(\?:([a-z|]+)\)\$ - \[G,L,NC\]/)?.[1]?.split('|') ?? [];
for (const extension of ['bak', 'conf', 'csv', 'md', 'py', 'sh']) {
  if (!extensionRule.includes(extension)) {
    findings.push(`.htaccess must return 410 for .${extension} working files.`);
  }
}

if (!htaccess.includes('RewriteRule ^(?:analytics_code|spam_log|rate_limit_[^/]+)\\.txt$ - [G,L,NC]')) {
  findings.push('.htaccess must return 410 for analytics snippets, spam logs and legacy rate-limit files.');
}

const privatePhpBlock = `<FilesMatch "^(?:enhanced_spam_protection|spam_admin|spam_protection_config|test_spam_protection)\\.php$">
    Require all denied
</FilesMatch>`;
if (!htaccess.includes(privatePhpBlock)) {
  findings.push('.htaccess must block direct HTTP access to internal spam-protection PHP files.');
}

for (const pattern of [
  '**/*.conf',
  '**/*.csv',
  '**/*.md',
  '**/*.py',
  '**/*.sh',
  '**/analytics_code.txt',
  '**/spam_admin.php',
  '**/spam_log.txt',
  '**/test_spam_protection.php',
  '**/rate_limit_*.txt',
]) {
  if (!workflow.includes(`          ${pattern}`)) {
    findings.push(`Deploy workflow must exclude ${pattern}.`);
  }
}

if (workflow.includes('          **/*.txt')) {
  findings.push('Deploy workflow must not exclude every .txt file; robots.txt, llms.txt and the IndexNow key stay public.');
}

for (const runtimeFile of ['contact_form.php', 'contact_form_secure.php', 'send_lead.php', 'enhanced_spam_protection.php']) {
  if (workflow.includes(`**/${runtimeFile}`)) {
    findings.push(`Deploy workflow must keep runtime dependency ${runtimeFile}.`);
  }
}

if (findings.length > 0) {
  console.error('Public file exposure audit failed.');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Public file exposure audit passed: working files are denied and excluded while public discovery files remain deployable.');

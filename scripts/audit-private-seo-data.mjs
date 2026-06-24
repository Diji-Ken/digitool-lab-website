import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

function fail(message, findings = []) {
  console.error(message);
  if (findings.length) console.error(findings.join('\n'));
  process.exit(1);
}

const findings = [];
const htaccess = fs.readFileSync('.htaccess', 'utf8');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const deployWorkflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

if (!htaccess.includes('RedirectMatch 410 ^/data/gsc(?:/|$)')) {
  findings.push('.htaccess must explicitly RedirectMatch 410 for /data/gsc before rewrite handling.');
}

if (!/RewriteRule \^\([^)]*\|data\/gsc\)\(\?:\/\|\$\) - \[G,L\]/.test(htaccess)) {
  findings.push('.htaccess must return 410 Gone for data/gsc operational exports.');
}

if (!/^data\/gsc\/\*$/m.test(gitignore) || !/^!data\/gsc\/\.gitkeep$/m.test(gitignore)) {
  findings.push('.gitignore must ignore data/gsc/* while keeping data/gsc/.gitkeep.');
}

if (!/^\s+\*\*\/data\/gsc\/\*\*$/m.test(deployWorkflow) || !/^\s+data\/gsc\/\*\*$/m.test(deployWorkflow)) {
  findings.push('Deploy workflow must exclude data/gsc/** from FTP upload.');
}

const trackedGscFiles = execFileSync('git', ['ls-files', 'data/gsc'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const unexpectedTracked = trackedGscFiles.filter((file) => file !== 'data/gsc/.gitkeep');

if (unexpectedTracked.length) {
  findings.push(`Only data/gsc/.gitkeep may be tracked. Remove these files:\n${unexpectedTracked.join('\n')}`);
}

if (findings.length) {
  fail('Private SEO/GSC data audit failed.', findings);
}

console.log('Private SEO/GSC data audit passed.');

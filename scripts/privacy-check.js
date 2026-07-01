import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scanTargets = ['src', 'public', 'README.md'];
const riskyTerms = [
  'LiangHe',
  'Randy',
  'randyhe041026',
  'PVI',
  'Linqx',
  'WCT',
  'CEM',
  'CEMPRO',
  'CEMLife',
  'CEMManager',
  'Azure DevOps',
  'ADO',
  'PR ID',
  'build ID',
  'pipeline ID',
  'token',
  'C:\\Users\\',
  '.codex',
  'daily-learning-logs',
  '01PVI',
  'customer confidential',
  'client confidential',
  'internal repo',
  'local path',
];

const allowedDisclosureTerms = new Set([
  'PR ID',
  'build ID',
  'pipeline ID',
  'token',
  'internal repo',
  'local path',
]);

function collectFiles(target) {
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) {
    return [];
  }

  const stat = fs.statSync(absolute);
  if (stat.isFile()) {
    return [absolute];
  }

  const files = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const entryPath = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(path.relative(root, entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function isAllowedDisclosureLine(filePath, line, term) {
  if (term === 'Randy' && line.includes('randyhe.github.io')) {
    return true;
  }

  if (!allowedDisclosureTerms.has(term)) {
    return false;
  }

  const normalized = filePath.split(path.sep).join('/');
  const lowerLine = line.toLowerCase();
  const isReadme = normalized.endsWith('README.md');
  const isAbout = normalized.endsWith('src/pages/about.astro');

  const disclosureMarkers = [
    'does not include',
    'do not include',
    'confirm it does not include',
    'not include',
    'content safety checklist',
  ];

  const isChecklistItem = isReadme && lowerLine.trimStart().startsWith('- ');
  const isReadmePrivacyDisclosure = isReadme && line.trim().length > 0;
  const isAboutPrivacyParagraph = isAbout && line.trim().length > 0;

  return (
    (isReadme || isAbout) &&
    (disclosureMarkers.some((marker) => lowerLine.includes(marker)) ||
      isChecklistItem ||
      isReadmePrivacyDisclosure ||
      isAboutPrivacyParagraph)
  );
}

const matches = [];

for (const target of scanTargets) {
  for (const file of collectFiles(target)) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const term of riskyTerms) {
        if (line.toLowerCase().includes(term.toLowerCase()) && !isAllowedDisclosureLine(file, line, term)) {
          matches.push({
            file: path.relative(root, file),
            term,
            line: index + 1,
          });
        }
      }
    });
  }
}

if (matches.length > 0) {
  console.error('Failed: risky terms found.');
  for (const match of matches) {
    console.error(`${match.file}:${match.line} matched ${match.term}`);
  }
  process.exit(1);
}

console.log('Passed: no risky terms found.');

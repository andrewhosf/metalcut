const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the new version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const newVersion = packageJson.version;

// Update CHANGELOG.md
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Replace [Unreleased] with the new version
const today = new Date().toISOString().split('T')[0];
changelog = changelog.replace(
  '## [Unreleased]',
  `## [Unreleased]\n\n## [${newVersion}] - ${today}`
);

// Update the comparison links at the bottom
const lastVersion = execSync('git describe --tags --abbrev=0').toString().trim();
changelog = changelog.replace(
  /\[Unreleased\]: .*\n/,
  `[Unreleased]: https://github.com/yourusername/metalcut/compare/v${newVersion}...HEAD\n`
);
changelog += `[${newVersion}]: https://github.com/yourusername/metalcut/compare/v${lastVersion}...v${newVersion}\n`;

fs.writeFileSync(changelogPath, changelog);

console.log(`Updated CHANGELOG.md for version ${newVersion}`);

// Create a git tag
execSync(`git add CHANGELOG.md`);
execSync(`git commit -m "chore: update CHANGELOG.md for version ${newVersion}"`);
execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);

console.log(`Created git tag v${newVersion}`); 
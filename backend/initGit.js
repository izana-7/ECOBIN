const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const repoDir = path.join(__dirname, '..');

async function initRepo() {
  console.log('[GIT] Initializing local Git repository in', repoDir);
  
  await git.init({ fs, dir: repoDir });

  // Add remote for Sahilgit10
  const remoteUrl = 'https://github.com/Sahilgit10/EcoBin.git';
  await git.addRemote({
    fs,
    dir: repoDir,
    remote: 'origin',
    url: remoteUrl,
    force: true
  });
  console.log('[GIT] Remote origin configured: https://github.com/Sahilgit10/EcoBin.git');

  // Helper function to recursively stage files
  async function stageFiles(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name).replace(/\\/g, '/');

      // Exclude gitignored items
      if (
        relPath.startsWith('.git') ||
        relPath.includes('node_modules') ||
        relPath.includes('dist') ||
        relPath.includes('backend/data') ||
        relPath.endsWith('.log')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await stageFiles(fullPath, relPath);
      } else {
        await git.add({ fs, dir: repoDir, filepath: relPath });
      }
    }
  }

  console.log('[GIT] Staging project files...');
  await stageFiles(repoDir);

  // Commit
  const sha = await git.commit({
    fs,
    dir: repoDir,
    author: {
      name: 'Sahilgit10',
      email: 'sahil@ecobin.campus.edu'
    },
    message: 'Initial commit: EcoBin Smart Campus Waste Management Platform'
  });

  console.log('✅ [GIT] Successfully created initial commit SHA:', sha);
  console.log('--------------------------------------------------');
  console.log('Git Repository initialized for GitHub user: Sahilgit10');
  console.log('Target GitHub URL: https://github.com/Sahilgit10/EcoBin.git');
  console.log('--------------------------------------------------');
}

initRepo().catch(console.error);

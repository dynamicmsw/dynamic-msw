const fs = require('fs');
const path = require('path');
const { exit } = require('process');

if (
  process.argv.includes('-h') ||
  process.argv.includes('--help') ||
  process.argv[3]
) {
  console.info(
    `|
|
|  Usage: setupMockServer PATH_TO_PUBLIC_MOCK_SERVER_DIRECTORY
|
|  The following:
|    \`setupMockServer ./path-to-public-folder/mock-server\`
|
|  Will result in the following files being generated
|
|    \`\${CWD}/path-to-public-folder/mock-server/index.html\`
|    \`\${CWD}/path-to-public-folder/mock-server/mock-server-settings.js\`
|
|  Note: \${CWD} is the current working directory from which the command is executed:
|
|`
  );
  exit(1);
}

const destDir = path.join(process.cwd(), process.argv[2]);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(
  path.resolve(__dirname, 'index.html'),
  path.join(destDir, 'index.html')
);
fs.copyFileSync(
  path.resolve(__dirname, 'mock-server-settings.js'),
  path.join(destDir, 'mock-server-settings.js')
);

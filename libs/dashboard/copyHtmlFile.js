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
|  Will result in an 'index.html' file being generated at the following path
|
|    \`\${CWD}/path-to-public-folder/mock-server/index.html\`
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

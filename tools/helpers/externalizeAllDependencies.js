import fs from 'node:fs';
import path from 'node:path';

export default function externalizeAllDependencies(root) {
  const packageJsonString = fs.readFileSync(
    path.join(root, 'package.json'),
    'utf-8'
  );
  const packageJson = packageJsonString ? JSON.parse(packageJsonString) : {};
  return [
    ...convertDependencies(packageJson.dependencies),
    ...convertDependencies(packageJson.peerDependencies),
    /^node:/,
  ];
}

function convertDependencies(deps) {
  if (!deps) return [];
  return Object.keys(deps).map((dep) => new RegExp(`^${dep}`));
}

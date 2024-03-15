import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['**/*.d.ts', '**/*.test-d.ts', '**/.history/**/*', './tools/**'],
  exclude: ['unlisted', 'dependencies'],
  workspaces: {
    'libs/*': {
      entry: 'src/index.ts',
      project: 'src/**/*.ts',
    },
    'apps/*': {
      entry: 'src/index.ts',
      project: 'src/**/*.ts',
    },
  },
};

export default config;

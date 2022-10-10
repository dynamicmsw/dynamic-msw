/* eslint-disable */
export default {
  displayName: 'dashboard',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/core',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};

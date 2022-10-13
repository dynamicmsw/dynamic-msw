// Copied from https://github.com/storybookjs/storybook/pull/19238/files

/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

export function describe(name: string, fn: () => void): void {}
export function it(name: string, fn: () => void): void {}

export function satisfies<A>() {
  return <T extends A>(x: T) => x;
}

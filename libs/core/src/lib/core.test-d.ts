import { rest } from 'msw';

import { describe, it, satisfies } from '../utils/tests';
import { createMock } from './createMock';
import { createScenario } from './createScenario';

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    mockOptions: {
      success: {
        options: [true, false],
        defaultValue: true,
      },
    },
  },
  () => {
    return rest.get('exampleEndpoint', async (_req, res, ctx) => {
      return res(ctx.json({}));
    });
  }
);

export const variatedExampleMock = createMock(
  {
    mockTitle: 'Variated mock options',
    openPageURL: '#',
    mockOptions: {
      success: {
        options: ['true', 'false'],
        defaultValue: 'true',
      },
      someTextOption: {
        defaultValue: 'text value',
      },
      someNumberOption: {
        defaultValue: 123,
      },
      someUndefinedOption: {
        type: 'text',
      },
    },
  },
  (config) => {
    const response = {
      iAmText: config.someTextOption,
      iAmNumber: config.someNumberOption,
    };
    return rest.get('/i-am-relative', async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

describe('createMock type definitions', () => {
  it('passes down converted config types', () => {
    createMock(
      {
        mockTitle: 'example',
        mockOptions: {
          success: {
            options: [true, false],
            defaultValue: true,
          },
          someTextOption: {
            defaultValue: 'text value',
          },
          someNumberOption: {
            defaultValue: 123,
          },
          someUndefinedOption: {},
        },
        openPageURL: (config) => {
          // ✅
          satisfies<Partial<typeof config>>()({
            success: false,
          });
          // ✅
          satisfies<Partial<typeof config>>()({
            success: true,
          });
          // ✅
          satisfies<Partial<typeof config>>()({
            someNumberOption: 123,
          });
          // ✅
          satisfies<Partial<typeof config>>()({
            someUndefinedOption: 'i-am-text',
          });
          // ❌
          satisfies<Partial<typeof config>>()({
            // @ts-expect-error config type is a boolean
            success: 'bad',
          });
          // ❌
          satisfies<Partial<typeof config>>()({
            // @ts-expect-error config type is a boolean
            success: 1,
          });
          // ❌
          satisfies<Partial<typeof config>>()({
            // @ts-expect-error config type is a boolean
            someNumberOption: '123',
          });
          // ❌
          satisfies<Partial<typeof config>>()({
            // @ts-expect-error config type is a boolean
            someUndefinedOption: 123,
          });

          return config.success ? 'yes-page' : 'no-page';
        },
      },
      (config) => {
        // ✅
        satisfies<Partial<typeof config>>()({
          success: false,
        });
        // ✅
        satisfies<Partial<typeof config>>()({
          success: true,
        });
        // ✅
        satisfies<Partial<typeof config>>()({
          someNumberOption: 123,
        });
        // ✅
        satisfies<Partial<typeof config>>()({
          someUndefinedOption: 'i-am-text',
        });
        // ❌
        satisfies<Partial<typeof config>>()({
          // @ts-expect-error config type is a boolean
          success: 'bad',
        });
        // ❌
        satisfies<Partial<typeof config>>()({
          // @ts-expect-error config type is a boolean
          success: 1,
        });
        // ❌
        satisfies<Partial<typeof config>>()({
          // @ts-expect-error config type is a boolean
          someNumberOption: '123',
        });
        // ❌
        satisfies<Partial<typeof config>>()({
          // @ts-expect-error config type is a boolean
          someUndefinedOption: 123,
        });

        return rest.get('test', async (req, res, ctx) => {
          return res(
            ctx.json({
              success: config.success === true ? 'yes' : 'no',
            })
          );
        });
      }
    );
  });
});

// TODO: add proper type testing for createScenario
describe('createMock type definitions', () => {
  it('passes down converted config types', () => {
    createScenario({ scenarioTitle: 'title' }, [
      {
        mock: exampleMock,
        mockOptions: {
          success: true,
          someUndefinedOption: '123',
        },
      },
      {
        mock: variatedExampleMock,
        mockOptions: {
          someTextOption: '123',
          someUndefinedOption: '123',
        },
      },
    ]);
  });
});

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
          someUndefinedOption: {
            type: 'text',
          },
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

describe('createScenario type definitions', () => {
  it('passes down converted config types', () => {
    // ✅
    createScenario('test', { exampleMock }, { exampleMock: { success: true } });
    // ✅
    createScenario(
      'variatedExampleMock',
      { variatedExampleMock },
      {
        variatedExampleMock: {
          success: 'true',
          someTextOption: 'someTextOption',
          someNumberOption: 123,
          someUndefinedOption: 'sf',
        },
      }
    );
    // ✅
    createScenario(
      'variatedExampleMock',
      { variatedExampleMock },
      {
        variatedExampleMock: {
          someTextOption: 'someTextOption',
        },
      }
    );
    // ❌ invalid values
    createScenario(
      'variatedExampleMock',
      { variatedExampleMock },
      {
        variatedExampleMock: {
          // ❌ invalid value
          // @ts-expect-error invalid value as type is string
          success: false,
          // ❌ invalid value
          // @ts-expect-error invalid value as type is string
          someTextOption: 1,
          // ❌ invalid value
          // @ts-expect-error invalid value as type is number
          someNumberOption: 'asdf',
          // ❌ invalid value
          // @ts-expect-error invalid value as type is string
          someUndefinedOption: 1,
        },
      }
    );
  });
});

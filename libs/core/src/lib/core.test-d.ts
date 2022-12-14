import { rest } from 'msw';

import { describe, it, satisfies } from '../utils/tests';
import { createMock } from './createMock/createMock';
import { createScenario } from './createScenario/createScenario';

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    mockOptions: {
      success: {
        options: [true, false] as const,
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
        options: ['true', 'false', 0] as const,
      },
      alternativeOptions: ['true', 'false', 0] as const,
      someTextOption: 'text value',
      someNumberOption: 123,
      someUndefinedOption: {
        type: 'text',
      },
    },
  },
  (options) => {
    const response = {
      iAmText: options.someTextOption,
      iAmNumber: options.someNumberOption,
    };
    return rest.get('/i-am-relative', async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

describe('createMock type definitions', () => {
  it('passes down converted options types', () => {
    createMock(
      {
        mockTitle: 'example',
        mockOptions: {
          success: {
            options: [true, false] as const,
            defaultValue: true,
          },
          someTextOption: 'text value',
          someNumberOption: 123,
          someUndefinedOption: {
            type: 'text',
            // TODO: figure out why unknown object keys do not error. likely need to make type checking more strict
            // ❌
            selectedValue: '1',
            // ❌
            xss: '1',
          },
        },
        openPageURL: (options) => {
          // ✅
          satisfies<Partial<typeof options>>()({
            success: false,
          });
          // ✅
          satisfies<Partial<typeof options>>()({
            success: true,
          });
          // ✅
          satisfies<Partial<typeof options>>()({
            someNumberOption: 123,
          });
          // ✅
          satisfies<Partial<typeof options>>()({
            someUndefinedOption: 'i-am-text',
          });
          // ❌
          satisfies<Partial<typeof options>>()({
            // @ts-expect-error options type is a boolean
            success: 'bad',
          });
          // ❌
          satisfies<Partial<typeof options>>()({
            // @ts-expect-error options type is a boolean
            success: 1,
          });
          // ❌
          satisfies<Partial<typeof options>>()({
            // @ts-expect-error options type is a number
            someNumberOption: '123',
          });
          // ❌
          satisfies<Partial<typeof options>>()({
            // @ts-expect-error options type is a boolean
            someUndefinedOption: 123,
          });

          return options.success ? 'yes-page' : 'no-page';
        },
      },
      (options) => {
        // ✅
        satisfies<Partial<typeof options>>()({
          success: false,
        });
        // ✅
        satisfies<Partial<typeof options>>()({
          success: true,
        });
        // ✅
        satisfies<Partial<typeof options>>()({
          someNumberOption: 123,
        });
        // ✅
        satisfies<Partial<typeof options>>()({
          someUndefinedOption: 'i-am-text',
        });
        // ❌
        satisfies<Partial<typeof options>>()({
          // @ts-expect-error options type is a boolean
          success: 'bad',
        });
        // ❌
        satisfies<Partial<typeof options>>()({
          // @ts-expect-error options type is a boolean
          success: 1,
        });
        // ❌
        satisfies<Partial<typeof options>>()({
          // @ts-expect-error options type is a number
          someNumberOption: '123',
        });
        // ❌
        satisfies<Partial<typeof options>>()({
          // @ts-expect-error options type is a text
          someUndefinedOption: 123,
        });

        return rest.get('test', async (req, res, ctx) => {
          return res(
            ctx.json({
              success: options.success === true ? 'yes' : 'no',
            })
          );
        });
      }
    );
  });
  it('Has proper updateMock param type', () => {
    // ✅
    variatedExampleMock.updateMock({ success: 'false' });
    // ✅
    variatedExampleMock.updateMock({
      someUndefinedOption: 's',
    });
    // ✅
    variatedExampleMock.updateMock({
      alternativeOptions: 'true',
    });
    // ✅
    variatedExampleMock.updateMock({
      someNumberOption: 123,
    });
    // ❌
    // @ts-expect-error options type is a text
    variatedExampleMock.updateMock({ success: false });
  });
});

describe('createScenario type definitions', () => {
  it('passes down converted options types', () => {
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
          alternativeOptions: 'true',
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
          // @ts-expect-error invalid value as type is 0 | "true" | "false"
          alternativeOptions: 'asdf',
          // ❌ invalid value
          // @ts-expect-error invalid value as type is string
          someUndefinedOption: 1,
          //TODO: expect error. likely need to make type checking more strict
          // ❌ invalid property
          x: 1,
        },
      }
    );
  });
});

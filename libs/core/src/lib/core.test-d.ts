import { rest } from 'msw';

import { describe, it, satisfies } from '../utils/tests';
import { createMock } from './createMock';

describe('createMock type definitions', () => {
  it('passes down converted config types', () => {
    createMock(
      {
        id: 'example',
        openPage: (config) => {
          // ✅
          satisfies<typeof config>()({
            success: false,
          });
          // ✅
          satisfies<typeof config>()({
            success: true,
          });
          // ❌
          satisfies<typeof config>()({
            // @ts-expect-error config type is a boolean
            success: 'bad',
          });
          // ❌
          satisfies<typeof config>()({
            // @ts-expect-error config type is a boolean
            success: 1,
          });

          return config.success ? 'yes-page' : 'no-page';
        },
        config: {
          success: {
            options: [true, false],
            defaultValue: true,
          },
        },
      },
      (config) => {
        // ✅
        satisfies<typeof config>()({
          success: false,
        });
        // ✅
        satisfies<typeof config>()({
          success: true,
        });
        // ❌
        satisfies<typeof config>()({
          // @ts-expect-error config type is a boolean
          success: 'bad',
        });
        // ❌
        satisfies<typeof config>()({
          // @ts-expect-error config type is a boolean
          success: 1,
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

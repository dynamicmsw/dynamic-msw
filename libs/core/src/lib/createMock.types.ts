import type { RestHandler } from 'msw';

type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

type OptionType = boolean | string | number;

type OptionRenderType = 'text' | 'number' | 'boolean' | 'select';

export type Options<T extends OptionType = OptionType> = Record<
  string,
  | {
      options?: T[];
      selectedValue?: T;
    } & (
      | { defaultValue: T; type?: OptionRenderType }
      | {
          defaultValue?: T;
          type: OptionRenderType;
        }
    )
>;

export type ConvertedOptions<T extends Options = Options> = {
  [Key in keyof T]: ArrayElementType<T[Key]['options']>;
};

export type CreateMockMockFn<T extends Options = Options> = (
  config: ConvertedOptions<T>
) => RestHandler | RestHandler[];

export type OpenPageFn<T extends Options = Options> = (
  config: ConvertedOptions<T>
) => string;

export type ConvertMockOptionsFn = (
  options: Options
) => ConvertedOptions<Options>;

export type SetupMocksFn = (
  options: ConvertedOptions<Options>,
  mockFn: CreateMockMockFn
) => RestHandler[];

export interface CreateMockFnReturnType<T extends Options = Options> {
  mocks: RestHandler[];
  updateMock: (updateValues: Partial<ConvertedOptions<T>>) => void;
  resetMock: () => void;
}

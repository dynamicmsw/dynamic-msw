import type { RestHandler } from 'msw';

export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export type OptionType = boolean | string | number;

export type OptionRenderType = 'text' | 'number' | 'boolean' | 'select';

export type Options<T extends OptionType = OptionType> = Record<
  string,
  {
    options?: T[];
    selectedValue?: T;
    type?: OptionRenderType;
    defaultValue?: T;
  }
>;

interface OptionRenderTypeMap {
  text: string;
  number: number;
  boolean: boolean;
  select: never;
}

export type ConvertedOptions<T extends Options = Options> = {
  [Key in keyof T]: T[Key]['defaultValue'] extends OptionType
    ? T[Key]['defaultValue'] extends true | false
      ? boolean
      : T[Key]['defaultValue']
    : OptionRenderTypeMap[T[Key]['type']] extends never
    ? ArrayElementType<T[Key]['options']>
    : OptionRenderTypeMap[T[Key]['type']];
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
  mockTitle: string;
  typeHackMockOptions?: Partial<ConvertedOptions<T>>;
  updateMock: (
    updateValues: Partial<ConvertedOptions<T>>,
    skipSaveToState?: boolean
  ) => CreateMockFnReturnType<T>;
  resetMock: () => void;
}

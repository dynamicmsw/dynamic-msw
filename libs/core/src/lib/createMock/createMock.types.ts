import type { RestHandler, GraphQLHandler } from 'msw';

export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export type OptionType = boolean | string | number;

export type OptionRenderType = 'text' | 'number' | 'boolean';

export type StateOptions<T extends OptionType = OptionType> = Record<
  string,
  {
    optionTitle?: string;
    options?: ReadonlyArray<T>;
    selectedValue?: T;
    type?: OptionRenderType;
    defaultValue?: T;
  }
>;

export type SelectOptionsType<T extends OptionType = OptionType> = {
  options: ReadonlyArray<T>;
  defaultValue?: T;
  type?: never;
};

type NoDefaultOptionsType = {
  options?: never;
  defaultValue?: never;
  type: OptionRenderType;
};

export type Options<T extends OptionType = OptionType> = Record<
  string,
  SelectOptionsType<T> | NoDefaultOptionsType | T | ReadonlyArray<T>
>;

interface OptionRenderTypeMap {
  text: string;
  number: number;
  boolean: boolean;
}

export type ConvertedStateOptions<T extends StateOptions = StateOptions> = {
  [Key in keyof T]: T[Key]['defaultValue'] extends OptionType
    ? T[Key]['defaultValue'] extends boolean
      ? boolean
      : T[Key]['defaultValue']
    : T[Key]['options'] extends ReadonlyArray<OptionType>
    ? ArrayElementType<T[Key]['options']>
    : T[Key] extends ReadonlyArray<OptionType>
    ? ArrayElementType<T[Key]>
    : OptionRenderTypeMap[T[Key]['type']];
};

export type ConvertedOptions<T extends Options = Options> = {
  [Key in keyof T]: T[Key] extends Record<string, unknown>
    ? T[Key]['options'] extends SelectOptionsType['options']
      ? ArrayElementType<T[Key]['options']>
      : T[Key]['type'] extends OptionRenderType
      ? OptionRenderTypeMap[T[Key]['type']]
      : never
    : T[Key] extends true | false
    ? boolean
    : T[Key] extends ReadonlyArray<OptionType>
    ? ArrayElementType<T[Key]>
    : T[Key];
};

export type CreateMockHandlerFn<T extends Options = Options> = (
  config: ConvertedOptions<T>
) => RestHandler | GraphQLHandler | HandlerArray;

export type OpenPageFn<T extends Options = Options> = (
  config: ConvertedOptions<T>
) => string;

export type ConvertMockOptionsFn = (
  options: StateOptions
) => ConvertedStateOptions<StateOptions>;

export type SetupMocksFn = (
  options: ConvertedStateOptions<StateOptions>,
  createMockHandler: CreateMockHandlerFn
) => HandlerArray;

export type HandlerArray = Array<RestHandler | GraphQLHandler>;

export interface CreateMockArg<T extends Options> {
  mockTitle: string;
  openPageURL?: string | OpenPageFn<ConvertedOptions<T>>;
  mockOptions?: T;
}

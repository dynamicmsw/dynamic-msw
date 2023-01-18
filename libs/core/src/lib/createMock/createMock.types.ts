import type { RequestHandler } from 'msw';

import type { ArrayElementType, DeepPartial } from '../types';

// * createMock Parameters

export interface CreateMockOptions<
  TOptions extends MockOptions,
  TData extends MockData
> {
  title: string;
  openPageURL?: string | OpenPageUrlFn<MockOptions & TOptions>;
  options: MockOptions & TOptions;
  data?: TData;
  updateDataTransformer?: (
    newData: DeepPartial<TData>,
    oldData: TData
  ) => TData;
}
export type CreateMockHandlerFn<
  TOptions extends MockOptions,
  TData extends MockData
> = (
  opts: ConvertedMockOptions<TOptions>,
  context: CreateMockHandlerContext<TOptions, TData>
) => RequestHandler | RequestHandler[];

export interface CreateMockHandlerContext<
  TOptions extends MockOptions,
  TData extends MockData
> {
  data: TData;
  updateData(update: TData): void;
  updateOptions(options: ConvertedMockOptions<TOptions>): void;
}

export type MockData = Record<symbol, unknown> | undefined;

export type OpenPageUrl<TOptions extends MockOptions> =
  | string
  | OpenPageUrlFn<MockOptions & TOptions>;

export type OpenPageUrlFn<T extends MockOptions> = (
  opts: ConvertedMockOptions<T>
) => string;

// * MockOptions

export type MockOptions = Record<
  string,
  MockOptionsValueType | readonly MockOptionsValueType[] | MockOptionsObjectType
>;

export type StoredMockOptions<T extends MockOptions> = Record<
  keyof T,
  StoredMockOptionsValue
>;

export type StoredMockOptionsValue = {
  inputType: MockOptionsInputType;
  options?: readonly MockOptionsValueType[];
  defaultValue?: MockOptionsValueType;
  selectedValue?: MockOptionsValueType;
};

export interface StoredMockState<TOptions extends MockOptions> {
  title: string;
  openPageURL?: string;
  isActive?: boolean;
  options: StoredMockOptions<TOptions>;
}

export type MockOptionsValueType = number | boolean | string;

export type MockOptionsInputType = 'string' | 'number' | 'boolean' | 'select';

export type MockOptionsObjectType =
  | MockOptionsObjectTypeWithInputType
  | MockOptionsObjectTypeWithOptionsArray
  | MockOptionsObjectTypeWithDefaultValue;

interface MockOptionsObjectTypeWithInputType {
  // TODO: breaking change type renamed to inputType
  inputType: MockOptionsInputType;
  options?: readonly MockOptionsValueType[];
  defaultValue?: MockOptionsValueType;
}

interface MockOptionsObjectTypeWithOptionsArray {
  inputType?: MockOptionsInputType;
  options: readonly MockOptionsValueType[];
  defaultValue?: MockOptionsValueType;
}
interface MockOptionsObjectTypeWithDefaultValue {
  inputType?: MockOptionsInputType;
  options?: readonly MockOptionsValueType[];
  defaultValue: MockOptionsValueType;
}

// * ConvertMockOptions

export type ConvertedMockOptionsBase = Record<
  string,
  MockOptionsValueType | undefined
>;

export type ConvertedMockOptions<T extends MockOptions> = {
  [K in keyof T]: T[K] extends MockOptionsValueType
    ? ConvertedMockOptionsValueType<T[K]>
    : T[K] extends readonly MockOptionsValueType[]
    ? ArrayElementType<T[K]> | undefined
    : T[K] extends MockOptionsObjectType
    ? ConvertedObjectCreateMockOptions<T[K]>
    : never;
};

type ConvertedMockOptionsValueType<T extends MockOptionsValueType> =
  T extends boolean ? boolean : T;

type ConvertedObjectCreateMockOptions<T extends MockOptionsObjectType> =
  T extends MockOptionsObjectTypeWithOptionsArray
    ? ConvertedMockOptionsObjectTypeWithOptionsArray<T>
    : T extends MockOptionsObjectTypeWithInputType
    ? ConvertedMockOptionsObjectTypeWithInputType<T>
    : T extends MockOptionsObjectTypeWithDefaultValue
    ? T['defaultValue']
    : never;

type ConvertedInputTypeValue<T extends MockOptionsInputType> =
  T extends 'string'
    ? string
    : T extends 'number'
    ? number
    : T extends 'boolean'
    ? boolean
    : never;

type ConvertedMockOptionsObjectTypeWithOptionsArray<
  T extends MockOptionsObjectType
> = T extends {
  inputType?: MockOptionsInputType;
  options: readonly MockOptionsValueType[];
  defaultValue: MockOptionsValueType;
}
  ? ArrayElementType<T['options']>
  : T extends MockOptionsObjectTypeWithOptionsArray
  ? ArrayElementType<T['options']> | undefined
  : never;

type ConvertedMockOptionsObjectTypeWithInputType<
  T extends MockOptionsObjectType
> = T extends {
  inputType: MockOptionsInputType;
  options?: readonly MockOptionsValueType[];
  defaultValue: MockOptionsValueType;
}
  ? ConvertedInputTypeValue<T['inputType']>
  : T extends MockOptionsObjectTypeWithInputType
  ? ConvertedInputTypeValue<T['inputType']> | undefined
  : never;

// *

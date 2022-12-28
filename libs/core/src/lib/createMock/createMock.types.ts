import type { MswHandlers, ArrayElementType } from '../types';

// * createMock Parameters

export interface CreateMockOptions<T extends MockOptions> {
  mockTitle: string;
  openPageURL?: string | OpenPageUrlFn<MockOptions & T>;
  mockOptions: MockOptions & T;
}
export type CreateMockHandlerFn<T extends MockOptions> = (
  opts: ConvertedMockOptions<T>
) => MswHandlers | MswHandlers[];

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

export interface StoredMockState<T extends MockOptions> {
  mockTitle: string;
  openPageURL?: string;
  mockOptions: StoredMockOptions<T>;
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

import { saveToStorage } from '../storage/storage';
import type { MswHandlers, ServerOrWorker } from '../types';
import type {
  MockData,
  CreateMockHandlerContext,
  MockOptionsValueType,
  StoredMockOptionsValue,
  StoredMockState,
} from './createMock.types';
import type {
  MockOptions,
  ConvertedMockOptions,
  StoredMockOptions,
  MockOptionsObjectType,
  CreateMockHandlerFn,
} from './createMock.types';

export const convertMockOptions = <T extends MockOptions>(
  options: StoredMockOptions<T>
): ConvertedMockOptions<T> =>
  Object.keys(options).reduce<ConvertedMockOptions<T>>((prev, key) => {
    const currValue = options[key];
    return {
      ...prev,
      [key]:
        typeof currValue.selectedValue !== 'undefined'
          ? currValue.selectedValue
          : currValue.defaultValue,
    };
  }, {} as ConvertedMockOptions<T>);

export const createStorageMockOptions = <T extends MockOptions>(
  options: T
): StoredMockOptions<T> =>
  Object.keys(options).reduce<StoredMockOptions<T>>((prev, key) => {
    const currValue = options[key];
    const isArray = Array.isArray(currValue);
    const isObject =
      !isArray && currValue !== null && typeof currValue === 'object';

    const castedObjValue = currValue as MockOptionsObjectType;
    const castedValue = currValue as MockOptionsValueType;
    return {
      ...prev,
      [key]: (isArray && { inputType: 'select', options: currValue }) ||
        (isObject && {
          inputType:
            (castedObjValue.options && 'select') ||
            castedObjValue.inputType ||
            getObjectStorageOptions(castedObjValue),
          ...(castedObjValue.defaultValue && {
            defaultValue: castedObjValue.defaultValue,
          }),
          ...(castedObjValue.options && {
            options: castedObjValue.options,
          }),
        }) || {
          inputType: getTypeofValue(castedValue),
          defaultValue: castedValue,
        },
    };
  }, {} as StoredMockOptions<T>);

export const updateStorageOptions = <T extends MockOptions>(
  options: Partial<ConvertedMockOptions<T>>,
  storageOptions: StoredMockOptions<T>
): StoredMockOptions<T> =>
  Object.keys(options).reduce(
    (prev, key) => ({
      ...prev,
      [key]: { ...storageOptions[key], selectedValue: options[key] },
    }),

    {} as StoredMockOptions<T>
  );

const getObjectStorageOptions = (
  data: MockOptionsObjectType
): StoredMockOptionsValue => ({
  inputType:
    (data.options && 'select') ||
    data.inputType ||
    getTypeofValue(data.defaultValue),
});
const getTypeofValue = (
  defaultValue: string | number | boolean | undefined
) => {
  switch (typeof defaultValue) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
    default:
      return 'string';
  }
};

export const initializeMockHandlers = <
  TOptions extends MockOptions,
  TData extends MockData
>(
  options: ConvertedMockOptions<TOptions>,
  createMockHandler: CreateMockHandlerFn<TOptions, TData>,
  context: CreateMockHandlerContext<TOptions, TData>
): MswHandlers[] => {
  const initializedMockHandlers = createMockHandler(options, context);
  return Array.isArray(initializedMockHandlers)
    ? initializedMockHandlers
    : [initializedMockHandlers];
};

export const createStorageKey = (mockTitle: string) =>
  `dynamic-msw.mocks.${mockTitle}`;

export const saveMockToStorage = <
  T extends MockOptions,
  TData extends MockData
>({
  mockOptions,
  mockTitle,
  storageKey,
  openPageURL,
  data,
}: {
  mockOptions: StoredMockOptions<T>;
  mockTitle: string;
  storageKey: string;
  openPageURL?: string;
  data: TData;
}) => {
  saveToStorage<StoredMockState<T, TData>>(storageKey, {
    mockTitle: mockTitle,
    openPageURL: openPageURL,
    mockOptions,
    data,
  });
};

export const useMockHandlers = (
  mocks: MswHandlers[],
  serverOrWorker: ServerOrWorker | undefined
) => {
  ensureServerOrWorkerIsDefined(serverOrWorker);
  serverOrWorker?.use(...mocks);
};

const ensureServerOrWorkerIsDefined = (
  serverOrWorker: ServerOrWorker | undefined
) => {
  if (!serverOrWorker) {
    throw new Error(`Ensure you set the server or worker. Example: 
import { setupServer } from "msw/node";

const dynamicMocks = getDynamicMocks();

const server = setupServer(...dynamicMocks.mocks);

dynamicMocks.setupServerOrWorker(server)
`);
  }
};

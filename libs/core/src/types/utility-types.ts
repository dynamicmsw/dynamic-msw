export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export type OmitUndefinedObjKeys<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

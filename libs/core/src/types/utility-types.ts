export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

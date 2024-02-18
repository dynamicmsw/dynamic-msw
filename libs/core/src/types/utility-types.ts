export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export type OmitNeverObjKeys<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
export type OmitUndefinedObjKeys<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export type ArrayToUnion<T> = T extends Array<infer Member> ? Member : T;

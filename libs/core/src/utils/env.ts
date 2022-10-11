export const isClient =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'test';

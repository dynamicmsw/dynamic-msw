import fetch from 'node-fetch';

global.fetch = fetch as unknown as typeof global.fetch;

export const storageMock = () => {
  let store: Record<string, unknown> = {};

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: unknown) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key: string) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
};

Object.defineProperty(global, 'sessionStorage', { value: storageMock() });
Object.defineProperty(global, 'localStorage', { value: storageMock() });

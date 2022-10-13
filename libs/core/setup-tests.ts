import fetch from 'node-fetch';

global.fetch = fetch as unknown as typeof global.fetch;

export const storageMock = () => {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },

    clear() {
      store = {};
    },

    removeItem(key) {
      delete store[key];
    },

    getAll() {
      return store;
    },
  };
};

Object.defineProperty(global, 'sessionStorage', { value: storageMock() });
Object.defineProperty(global, 'localStorage', { value: storageMock() });

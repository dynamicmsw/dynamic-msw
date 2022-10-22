import { createMock } from '@dynamic-msw/core';

createMock({ mockTitle, openPageURL, mockOptions }, (options) => RestHandler);

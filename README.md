<h1 align="center">Dynamic Mock Service Worker</h1>

- [Summary](#summary)
- [Underlying Concept](#underlying-concept)
- [Packages](#packages)
- [Getting started](#getting-started)
  - [Configure mocks](#configure-mocks)
  - [Configure scenarios](#configure-scenarios)
  - [Overriding defaults](#overriding-defaults)
  - [Testing](#testing)
  - [Setup worker](#setup-worker)
  - [Setup dashboard](#setup-dashboard)
- Dashboard
  - [Best practices for using the dashboard](#best-practices-for-using-the-dashboard)
  - [Demo](#demo)

## Summary

Dynamic Mock Service Worker (Dynamic MSW) serves as an extension to the
Mock Service Worker (MSW), enhancing it with the capability to make request handlers
dynamic by incorporating updateable parameters. Moreover, it provides preloaded
data that can be seamlessly updated, facilitating the testing of CRUD operations.
Additionally, the library offers a dashboard feature, allowing you to configure
mocks on-the-fly.

To make the most of Dynamic Mock Service Worker, it is assumed that users possess
a fundamental understanding of Mock Service Worker (MSW). It is highly recommended
to refer to the [official MSW documentation](https://github.com/mswjs/msw#documentation)
before delving into the functionalities of Dynamic Mock Service Worker.

## Underlying Concept

As applications expand, they inherently become susceptible to overlooking the myriad
variations that both the application and its components can embody. Consider a webshop
product page as a prime example, with its potential states such as a product being
out of stock. This module offers a straightforward means to effortlessly manipulate
and test these states during the development process.

In an ideal scenario, comprehensive test coverage should preempt unforeseen issues.
However, the reality often diverges from this ideal, necessitating a pragmatic approach.
This is where the dashboard assumes significance. The dashboard acts as a centralized
control center, allowing you to swiftly toggle between diverse states. This not
only facilitates testing but also provides a quick overview of all possible scenarios,
ensuring the visual and functional integrity of the application is thoroughly examined
and validated.

## Packages

Both browser and Node.js

```
dynamic-msw @dynamic-msw/node @dynamic-msw/browser
```

Node.js only

```
dynamic-msw @dynamic-msw/node
```

Browser only

```
dynamic-msw @dynamic-msw/browser
```

## Getting started

The example are used in the [demo](#demo).

### Configure mocks

#### Simple mock

```js
// createFeatureFlagsMock.js
import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

export const createFeatureFlagsMock = configureMock(
  {
    key: 'featureFlags', // unique key
    parameters: {
      checkoutProcessVersion: {
        selectOptions: ['v1', 'v2'] as const,
        defaultValue: 'v1',
      },
    },
  },
  ({ getParams }) => {
    return http.get('/feature-flags', () => {
      return HttpResponse.json({ checkoutProcessVersion: getParams().checkoutProcessVersion });
    });
  },
);
```

#### CRUD mock

```js
// createTodoMocks.js
import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

export const createTodoMocks = configureMock(
  {
    key: 'todos',
    data: { todos: [] },
  },
  ({ getData, setData }) => {
    return [
      http.post('/todos/create', async ({ request }) => {
        const newTodo = await request.json();
        const newTodos = [...getData().todos, newTodo];
        setData({ todos: newTodos });
        return HttpResponse.json(newTodos);
      }),
      http.get('/todos', () => {
        return HttpResponse.json(data.todos);
      }),
    ];
  },
);
```

<details>

<summary>Advanced mock</summary>

```ts
// createProductMocks.ts
import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

export type ProductReview = {
  id: string;
  customerName: string;
  review: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type ProductResponse = {
  id: string;
  title: string;
  availableStock: number;
  canReview: boolean;
};

export type ProductApiError = {
  errorType: 'out-of-stock' | 'product-not-found';
};

export type ProductWithoutParamaters = Omit<ProductResponse, 'availableStock' | 'canReview'>;

export const testProductsData: ProductWithoutParamaters = {
  id: 'some-product',
  title: 'Harry Potter',
};

const initialReview: ProductReview = {
  id: 'some-review',
  customerName: 'Bram',
  review: 'Very nice product.',
  rating: 5,
};
const initialReviews: ProductReview[] = [initialReview];

const productNotFoundResponse = HttpResponse.json<ProductApiError>(
  {
    errorType: 'product-not-found',
  },
  { status: 404 },
);

export const createProductMocks = configureMock(
  {
    key: 'product', // unique key
    parameters: {
      productExists: true,
      availableStock: 1,
      canReview: true,
    },
    data: {
      reviews: initialReviews,
    },
    dashboardConfig: {
      pageURL: `/products/${testProductsData.id}`,
    },
  },
  ({ getParams, getData, setData }) => {
    return [
      http.get<never, ProductApiError | ProductResponse>('/products/:productId', () => {
        const { productExists, availableStock, canReview } = getParams();
        if (!productExists) {
          return productNotFoundResponse;
        }
        return HttpResponse.json<ProductResponse>({
          ...testProductsData,
          availableStock,
          canReview,
        });
      }),
      http.get<never, ProductApiError | ProductReview[]>('/products/:productId/reviews', () => {
        const { productExists } = getParams();
        if (!productExists) return productNotFoundResponse;
        return HttpResponse.json<ProductReview[]>(getData().reviews);
      }),
      http.post<never, ProductReview, ProductApiError | ProductReview>(`/products/${testProductsData.id}/reviews/create`, async ({ request }) => {
        const { productExists } = getParams();
        if (!productExists) return productNotFoundResponse;
        const newReview = await request.json();
        setData({ ...data, reviews: [...getData().reviews, newReview] });
        return HttpResponse.json<ProductReview>(newReview);
      }),
    ];
  },
);
```

</details>

## Configure scenarios

```ts
// createCheckoutScenario.js
import { createFeatureFlagsMock } from './createFeatureFlagsMock';
import { createProductMocks } from './createProductMocks';

const createCheckoutScenario = configureScenario({
  key: 'checkoutScenario', // unique key
  mocks: [createFeatureFlagsMock(), createProductMocks()],
  dashboardConfig: {
    openPageURL: '/checkout',
  },
});
```

## Overriding defaults

```ts
import { createTodoMocks } from './createTodoMocks';
import { createCheckoutScenario } from './createCheckoutScenario';

const todoMocksWithInitialTodo = createTodoMocks({
  data: { todos: [{ id: 'new-todo', title: 'new-todo', done: false }] },
  dashboardConfig: {
    openPageURL: 'http://localhost/todos/bram',
  },
});

const checkoutScenarioV1 = createCheckoutScenario({ parameters: { featureFlags: { checkoutProcessVersion: 'v1' } } });
```

## Testing

```js
import { setupServer } from 'msw/node';
import { setupHandlers } from 'dynamic-msw';
import { createCheckoutScenario } from './createCheckoutScenario';

const testTodoMock = createTestTodoMock();
const testCheckoutScenario = createCheckoutScenario();
const dynamicMsw = setupHandlers(testCheckoutScenario, testTodoMock);

const server = setupServer(...dynamicMsw.handlers);

server.listen();

afterEach(() => {
  dynamicMsw.resetAll();
  server.resetHandlers();
});

test('Initial todos', () => {
  testTodoMock.setData({ todos: [{ id: 'new-todo', title: 'new-todo', done: false }] });
  // Assert what ever needs to happen with a list of initial todos.
});

test('Non existing product page', () => {
  createProductMocks.updateParameters({ productExists: false });
  // Assert what ever needs to happen when a product does not exist
});

test('Checkout scenario v1', () => {
  testScenario.updateParameters({ featureFlags: { checkoutProcessVersion: 'v1' } });
  // Assert what ever is relevant to the checkout v1 flow.
});

test('Checkout scenario v2', () => {
  testScenario.updateParameters({ featureFlags: { checkoutProcessVersion: 'v2' } });
  // Assert what ever is relevant to the checkout v2 flow.
});
```

## Setup worker

```js
import { setupWorker } from 'msw/browser';
import { createCheckoutScenario } from './createCheckoutScenario';

const worker = setupWorker(...setupHandlers(createCheckoutScenario()).handlers);

worker.start();
```

## Setup dashboard

We dynamically import the mock dashboard in a later example to prevent bundling
(dynamic) MSW dependencies into production builds.

```ts
// setupMockDashboard.js
import { setupDashboard } from '@dynamic-msw/browser';
import { createFeatureFlagsMock } from './createFeatureFlagsMock';
import { createProductMocks } from './createProductMocks';
import { createSimpleProductScenarioV1 } from './createSimpleProductScenarioV1';
import { createTodoMocks } from './createTodoMocks';

export const setup = setupDashboard([createFeatureFlagsMock(), createTodoMocks(), createProductMocks(), createSimpleProductScenarioV1()], {
  renderDashboardButton: true, // true by default
});

export const worker = setupWorker(...setup.handlers);
```

This example uses top level await to keep things simple.

```jsx
// App.tsx
if (USE_MOCK_DASHBOARD === 'true') {
  await import('./setupMockDashboard').then(({ worker }) => worker.start());
}

export default function App() {
  return <Layout />;
}
```

### Best practices for using the dashboard

Ensure your API type definitions are generated by your backend.

### Demo

[Storybook](https://dynamicmsw.github.io/dynamic-msw)

[Take a look at source code of the Storybook demo](https://github.com/dynamicmsw/dynamic-msw/tree/main/apps/storybook/src)

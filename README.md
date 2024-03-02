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

### Configure mocks

#### Simple mock

```ts
// createFeatureFlagsMock.ts
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
  ({ checkoutProcessVersion }) => {
    return http.get('/feature-flags', () => {
      return HttpResponse.json({ checkoutProcessVersion });
    });
  }
);
```

#### CRUD mock

```ts
// createTodoMocks.ts
import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

type Todo = { id: string; title: string; done: boolean };

export const createTodoMocks = configureMock(
  {
    key: 'todos',
    data: { todos: [] satisfies Todo[] as Todo[] },
  },
  (parameters, data, updateData) => {
    return [
      http.post('/todos/create', async ({ request }) => {
        const newTodo = (await request.json()) as Todo;
        const newTodos = [...data.todos, newTodo];
        updateData({ todos: newTodos });
        return HttpResponse.json(newTodos);
      }),
      http.get('/todos', () => {
        return HttpResponse.json(data.todos);
      }),
    ];
  }
);
```

<details>

<summary>Advanced mock</summary>

```ts
// createProductMocks.ts
import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';

type Product = { id: string; title: string; availableStock: 1; };

const testProductsData: Product[] = [{ id: 'some-product', title: 'Harry Potter', availableStock: 1 }]

export const createProductMocks = configureMock(
  {
    key: 'product', // unique key
    parameters: {
      productExists: true,
    },
    data: { products: testProductsData },
  },
  (parameters, data, updateData) => {
    return [
      http.get('/products/:product', ({params}) => {
        if (parameters.productExists) {
          return HttpResponse.json(
            {
              errorMessage: 'Product does not exist',
            },
            { status: 404 }
          );
        }
        return HttpResponse.json(
          data.products.find(
            (product) => product.id === params.id
          )
        );
      }),
      http.get('/products/:product/reserve', () => {
        const product = data.products.find(
          (product) => product.id === params.id
        )
        if (product.availableStock <= 0) {
          return return HttpResponse.json(
            {
              errorMessage: 'Product is out of stock',
            },
            { status: 404 }
          );
        }
        updateData(data.products.map(
          (product) =>
            product.id === params.id
              ? {...product, availableStock: product.availableStock - 1 }
              : product)
        )
        return HttpResponse.text("OK")
      }),
    ];
  }
);
```

</details>

## Configure scenarios

```ts
// createCheckoutScenario.ts
import { createFeatureFlagsMock } from './createFeatureFlagsMock.ts';
import { createProductMocks } from './createProductMocks.ts';

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

```ts
import { setupServer } from '@dynamic-msw/node';
import { createCheckoutScenario } from './createCheckoutScenario.ts';

const testTodoMock = createTestTodoMock();
const testCheckoutScenario = createCheckoutScenario();

const server = setupServer(testCheckoutScenario, testTodoMock);

server.listen();

afterEach(() => {
  server.resetHandlers();
});

test('Initial todos', () => {
  testTodoMock.updateData({ todos: [{ id: 'new-todo', title: 'new-todo', done: false }] });
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

```ts
import { setupWorker } from '@dynamic-msw/browser';
import { createCheckoutScenario } from './createCheckoutScenario.ts';

const worker = setupWorker(createCheckoutScenario());

worker.start();
```

## Setup dashboard

We dynamically import the mock dashboard in a later example to prevent bundling
(dynamic) MSW dependencies into production builds.

```ts
// setupMockDashboard.ts
import { setupDashboard } from '@dynamic-msw/browser';
import { createCheckoutScenario } from './createCheckoutScenario.ts';
import { createFeatureFlagsMock } from './createFeatureFlagsMock.ts';
import { createTodoMocks } from './createTodoMocks.ts';

export const mockDashboard = setupDashboard([createFeatureFlagsMock(), createCheckoutScenario()], {
  renderDashboardButton: true, // true by default
});
```

This example is based using a React hook solution but the gist is similar with
other frameworks.

```ts
// useLoadMockDashboard.ts
import { useState, useEffect } from 'react';

const isUsingMockDashboard = .USE_MOCK_DASHBOARD === 'true';

export default function useLoadMockDashboard() {
  const [isLoaded, setIsLoaded] = useState(!isUsingMockDashboard);
  useEffect(() => {
    if (!isUsingMockDashboard) return;
    let cancel = false;
    import('./setupMockDashboard').then(async ({ mockDashboard }) => {
      if (cancel) return;
      await mockDashboard.start();
      setIsLoaded(true);
    });
    return () => {
      cancel = true;
    };
  }, []);
  return { isLoaded };
}
```

```tsx
// App.tsx
import { useState } from 'react';

export default function App() {
  const { isLoaded } = useLoadMockDashboard();
  if (!isLoaded) return null;
  return <Layout />;
}
```

### Best practices for using the dashboard

Ensure your API type definitions are generated by your backend.

### Demo

[Storybook](https://dynamicmsw.github.io/dynamic-msw)

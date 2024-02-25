<h1 align="center">Dynamic Mock Service Worker</h1>

- [Summary](#summary)
- [Underlying Concept](#underlying-concept)
- [Packages](#packages)
- [Getting started](#getting-started)
  - [Create mocks](#create-mocks)
  - [Create scenarios](#create-scenarios)
  - [Testing](#create-scenarios)
  - [Browser development](#browser-development)
- [Dashboard](#dashboard)
  - [Best practices for using the dashboard](#best-practices-for-using-the-dashboard)
  - [Demo](#demo)

## Summary

Dynamic Mock Service Worker (Dynamic MSW) serves as an extension to the
Mock Service Worker (MSW),enhancing it with the capability to make request handlers
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

Browswer only

```
dynamic-msw @dynamic-msw/browser
```

## Create mocks

```ts
import { createMock } from 'dynamic-msw';
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

type Product = { id: string; title: string; availableStock: 2; };

const productsData: Product[] = [{ id: 'some-product', title: 'Harry Potter', availableStock: 2 }]

export const createProductMocks = configureMock(
  {
    key: 'product', // unique key
    parameters: {
      productExists: true,
    },
    data: { products: productsData },
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
        return HttpResponse.json(data.products.find((product) => product.id === params.id));
      }),
      http.get('/products/:product/reserve', () => {
        const product = data.products.find((product) => product.id === params.id)
        if (product.availableStock <= 0) {
          return return HttpResponse.json(
            {
              errorMessage: 'Product is out of stock',
            },
            { status: 404 }
          );
        }
        updateData(data.products.map((product) => product.id === params.id ? {...product, availableStock: product.availableStock - 1 } : product))
        return HttpResponse.text("OK")
      }),
    ];
  }
);
```

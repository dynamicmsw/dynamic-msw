import { createMock, getDynamicMocks, createScenario } from '@dynamic-msw/core';
import { rest, setupWorker } from 'msw';

export const loginMock = createMock(
  {
    title: 'Login',
    openPageURL: './iframe.html?id=preview-mockedresponsedata--primary',
    options: {
      userRole: {
        options: ['ADMIN', 'MODERATOR', 'DEFAULT'] as const,
        defaultValue: 'ADMIN',
      },
      loginSuccess: true,
      preferredLanguage: 'en',
    },
  },
  (options) => {
    const response = {
      preferredLanguage: options.preferredLanguage,
      userRole: options.userRole,
    };
    return rest.post('http://localhost:3001/login', async (_req, res, ctx) => {
      return options.loginSuccess
        ? res(ctx.json(response))
        : res(
            ctx.status(401),
            ctx.json({
              errorMessage: 'Invalid username or password',
            })
          );
    });
  }
);

export const featureFlagsMock = createMock(
  {
    title: 'Feature flags',
    options: {
      invoiceDashboardVersion: ['v1', 'v2', 'v3'] as const,
      financeFlowIsEnabled: true,
      buyFlowIsEnabled: true,
      leaseFlowIsEnabled: false,
    },
  },
  (options) => {
    return rest.get(
      'http://localhost:3001/feature-flags',
      async (_req, res, ctx) => {
        return res(ctx.json(options));
      }
    );
  }
);

export const productDataMock = createMock(
  {
    title: 'Product data',
    options: {
      multipleColorOptions: true,
      isInStock: true,
      deliveryTime: {
        options: ['Next day', '3 days', '1 week', '3 weeks'] as const,
      },
      hasFAQSection: false,
    },
  },
  (options) => {
    const response = {
      availableColors: options.multipleColorOptions
        ? [
            'Hot pink',
            'Red',
            'Orange',
            'Yellow',
            'Green',
            'Turquoise',
            'Indigo',
            'Violet',
          ]
        : null,
      isInStock: options.isInStock,
      deliveryTime: options.deliveryTime,
      frequentlyAskedQuestions: options.hasFAQSection
        ? [
            {
              question: 'How many times can I use the product?',
              answer: 'The product can be used approximately 1337 times.',
            },
            {
              question:
                'What does Kent C. Dodds think about Mock Service Worker?',
              answer: `Kent C. Dodds has mentioned the following:

              "I found MSW and was thrilled that not only could I still see the mocked responses in my DevTools, but that the mocks didn't have to be written in a Service Worker and could instead live alongside the rest of my app. This made it silly easy to adopt. The fact that I can use it for testing as well makes MSW a huge productivity booster."`,
            },
          ]
        : null,
    };
    return rest.get(
      'http://localhost:3001/products/:productID',
      async (_req, res, ctx) => {
        return res(ctx.json(response));
      }
    );
  }
);

export const productReviewsMock = createMock(
  {
    title: 'Product review data',
    options: {
      hasReviews: true,
    },
  },
  (options) => {
    const response = options.hasReviews
      ? [
          {
            user: 'Happy Doge',
            stars: 5,
            comment: 'Wow, so cereal, many sunshine, much wow!',
          },
          ...Array(5)
            .fill(null)
            .map((_, index) => ({
              user: 'John Doe',
              stars: index + 1,
              comment:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. At neque maiores fuga saepe consectetur? Dolorem, minus, distinctio officiis ut error soluta, aliquid commodi id iste officia voluptate nisi facere ducimus?',
            })),
        ]
      : [];
    return rest.get(
      'http://localhost:3001/products/:productID/reviews',
      async (_req, res, ctx) => {
        return res(ctx.json(response));
      }
    );
  }
);

export const exampleForAllOptionTypes = createMock(
  {
    title: 'Example with all option types',
    options: {
      selectOption: {
        options: ['Option 1', 'Option 2', 1337, false] as const,
        defaultValue: false,
      },
      selectOptionWithoutDefault: ['no', 'default'] as const,
      booleanOption: true,
      numberOption: 1337,
      textOption: 'Mock Service Worker is awesome!',
    },
  },
  (options) => {
    return rest.get(
      'http://localhost:3001/all-option-types',
      async (_req, res, ctx) => {
        return res(ctx.json(options));
      }
    );
  }
);

export const defaultProductScenario = createScenario({
  title: 'Default product scenario',
  openPageURL: './iframe.html?id=preview-mockedresponsedata--primary',
  mocks: { productDataMock, productReviewsMock, featureFlagsMock },
});

export const unhappyProductScenario = createScenario({
  title: 'Unhappy product scenario',
  openPageURL: './iframe.html?id=preview-mockedresponsedata--primary',
  mocks: { productDataMock, productReviewsMock, featureFlagsMock },
  options: {
    productDataMock: {
      deliveryTime: '3 weeks',
      isInStock: false,
      multipleColorOptions: false,
    },
    productReviewsMock: { hasReviews: false },
    featureFlagsMock: {
      financeFlowIsEnabled: false,
      buyFlowIsEnabled: false,
      leaseFlowIsEnabled: false,
    },
  },
});

export const setupPreview = () => {
  const { handlers, setWorker } = getDynamicMocks({
    mocks: [loginMock, featureFlagsMock, exampleForAllOptionTypes],
    scenarios: [defaultProductScenario, unhappyProductScenario],
  });

  const worker = setupWorker(...handlers);
  setWorker(worker);
  worker.start({
    serviceWorker: {
      url: `${process.env.STORYBOOK_PUBLIC_PATH || '/'}mockServiceWorker.js`,
    },
  });
  return worker;
};

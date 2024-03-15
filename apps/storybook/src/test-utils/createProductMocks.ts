// ? import from dynamic-msw in your app instead.
import { configureMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';
import { createApiURL } from './createApiURL';

type ProductReview = {
  id: string;
  customerName: string;
  review: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

type ProductResponse = {
  id: string;
  title: string;
  availableStock: number;
  canReview: boolean;
};

type ProductApiError = {
  errorType: 'out-of-stock' | 'product-not-found';
};

type ProductWithoutParamaters = Omit<
  ProductResponse,
  'availableStock' | 'canReview'
>;

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
      isActiveByDefault: false,
    },
  },
  ({ getParams, getData, setData }) => {
    return [
      http.get<never, ProductApiError | ProductResponse>(
        createApiURL(`/products/${testProductsData.id}`),
        () => {
          const { productExists, availableStock, canReview } = getParams();
          if (!productExists) {
            return productNotFoundResponse;
          }
          return HttpResponse.json<ProductResponse>({
            ...testProductsData,
            availableStock,
            canReview,
          });
        },
      ),
      http.get<never, ProductApiError | ProductReview[]>(
        createApiURL(`/products/${testProductsData.id}/reviews`),
        () => {
          if (!getParams().productExists) return productNotFoundResponse;
          return HttpResponse.json<ProductReview[]>(getData().reviews);
        },
      ),
      http.post<never, ProductReview, ProductApiError | ProductReview>(
        createApiURL(`/products/${testProductsData.id}/reviews/create`),
        async ({ request }) => {
          if (!getParams().productExists) return productNotFoundResponse;
          const newReview = await request.json();
          const data = getData();
          setData({ ...data, reviews: [...data.reviews, newReview] });
          return HttpResponse.json<ProductReview>(newReview);
        },
      ),
    ];
  },
);

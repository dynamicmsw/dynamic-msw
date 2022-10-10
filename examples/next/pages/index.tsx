import type { ExampleResponse } from '@dynamic-msw/mock-example';
import { useEffect, useState } from 'react';

export function Index() {
  const [data, setData] = useState<ExampleResponse>();
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === 'test')
    ) {
      const {
        exampleEndpoint,
        //eslint-disable-next-line @typescript-eslint/no-var-requires
      } = require('@dynamic-msw/mock-example');

      fetch(exampleEndpoint)
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        typeof window !== 'undefined' &&
        (process.env.NODE_ENV === 'development' ||
          process.env.NODE_ENV === 'test')
      ) {
        const {
          exampleMock,
          exampleEndpoint,
          //eslint-disable-next-line @typescript-eslint/no-var-requires
        } = require('@dynamic-msw/mock-example');

        exampleMock.updateMock({ success: false });

        if (typeof window !== 'undefined') {
          fetch(exampleEndpoint)
            .then((res) => res.json())
            .then((data) => setData(data));
        }
      }
    }, 3500);
  }, []);

  return <div data-testid="test-mocked-data">{data?.success}</div>;
}

export default Index;

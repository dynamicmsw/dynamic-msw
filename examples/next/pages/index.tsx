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
        exampleMock,
        //eslint-disable-next-line @typescript-eslint/no-var-requires
      } = require('@dynamic-msw/mock-example');

      fetch(exampleEndpoint)
        .then((res) => res.json())
        .then((data) => setData(data));

      setTimeout(() => {
        exampleMock.updateMock({ success: false });
        fetch(exampleEndpoint)
          .then((res) => res.json())
          .then((data) => setData(data));
      }, 3500);
    }
  }, []);

  return <div data-testid="test-mocked-data">{data?.success}</div>;
}

export default Index;

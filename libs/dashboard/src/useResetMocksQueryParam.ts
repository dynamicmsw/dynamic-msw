import { defaultState, saveToStorage } from '@dynamic-msw/core';
import { useEffect, useState } from 'react';

export const useResetMocksQueryParam = () => {
  const queryParams = new URLSearchParams(location.search);
  const [shouldResetMocks, setShouldResetMocks] = useState(
    queryParams.get('resetMocks') === 'true'
  );

  useEffect(() => {
    if (shouldResetMocks) {
      saveToStorage(defaultState);
      queryParams.delete('resetMocks');
      const updateQueryParams = queryParams.toString();
      const updatedURL = `${location.pathname}${
        updateQueryParams ? `?${updateQueryParams}` : ''
      }`;
      location.replace(updatedURL);
      setShouldResetMocks(false);
    }
  }, []);

  return { shouldResetMocks };
};

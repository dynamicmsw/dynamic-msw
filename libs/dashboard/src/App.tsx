import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { theme } from '@stela-ui/css';
import { GlobalStyles } from '@stela-ui/react';
import type { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'theme-ui';

import { useResetMocksQueryParam } from './useResetMocksQueryParam';

const emotionCache = createCache({
  key: 'x',
  // Browser prefixes are not required
  stylisPlugins: [],
});

export const App: FC<Required<PropsWithChildren>> = ({ children }) => {
  const { shouldResetMocks } = useResetMocksQueryParam();
  return shouldResetMocks ? null : (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
};

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { theme } from '@stela-ui/css';
import type { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from 'theme-ui';

const emotionCache = createCache({
  key: 'x',
  // Browser prefixes are not required
  stylisPlugins: [],
});

export const App: FC<Required<PropsWithChildren>> = ({ children }) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};

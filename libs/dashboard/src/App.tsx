import createCache from '@emotion/cache';
import { CacheProvider, css } from '@emotion/react';
import { Global } from '@emotion/react';
import type { FC, PropsWithChildren } from 'react';

const emotionCache = createCache({
  key: 'x',
  // Browser prefixes are not required
  stylisPlugins: [],
});

export const App: FC<Required<PropsWithChildren>> = ({ children }) => {
  return (
    <CacheProvider value={emotionCache}>
      <Global
        styles={css`
          html {
            background: #f6f6f6;
          }
        `}
      />
      {children}
    </CacheProvider>
  );
};

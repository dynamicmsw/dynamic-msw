import type { AppProps } from 'next/app';
import Head from 'next/head';

// Use any if case here that matches your needs
if (process.env.NODE_ENV === 'development') {
  //eslint-disable-next-line @typescript-eslint/no-var-requires
  const { setup } = require('@dynamic-msw/mock-example');
  if (typeof window === 'undefined') {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const { setupServer } = require('msw/node');
    setup(setupServer);
  } else {
    setup();
  }
}

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Dynamic MSW next examplse</title>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;

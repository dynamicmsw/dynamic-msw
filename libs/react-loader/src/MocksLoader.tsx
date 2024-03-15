import { type PropsWithChildren, useEffect, useState } from 'react';

export type MocksLoaderProps = PropsWithChildren<{
  enable: boolean;
  loader: () => Promise<unknown>;
}>;

export default function MocksLoader({
  children,
  enable,
  loader,
}: MocksLoaderProps) {
  const [isLoading, setIsLoading] = useState(!enable);

  useEffect(() => {
    if (enable) {
      setIsLoading(true);
      loader().then(() => {
        setIsLoading(false);
      });
    }
  }, [enable, loader]);

  if (!isLoading) return children;

  return (
    <div
      style={{
        position: 'fixed',
        background: 'rgba(255,255,255,.8)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h2>Loading Mock Service Worker...</h2>
    </div>
  );
}

import { Container, Stack, Typography } from '@mui/material';
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';

import { getStorageKeys } from './Dashboard.helpers';
import type { DashboardItem } from './Dashboard.types';
import { DashboardTable, DashboardTableRow } from './DashboardTable';
import { useGetMockConfig } from './useGetMockConfig';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = () => {
  const { isLoading, iFrameError } = useGetMockConfig();
  const [resetTime, setResetTime] = useState(new Date().getTime());
  const [filteredItems, setFilteredItems] = useState<DashboardItem[]>([]);
  const { fuse, initialItems } = useMemo<{
    fuse: Fuse<DashboardItem>;
    initialItems: DashboardItem[];
  }>(() => {
    if (isLoading || iFrameError)
      return { fuse: null, initialItems: [] } as unknown as {
        fuse: Fuse<DashboardItem>;
        initialItems: DashboardItem[];
      };
    const items = getStorageKeys();
    setFilteredItems(items);
    return {
      fuse: new Fuse<DashboardItem>(items, {
        keys: ['title'],
        threshold: 0.3,
      }),
      initialItems: items,
    };
  }, [isLoading, iFrameError]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (iFrameError) return <Typography>error</Typography>;
  return (
    <Container>
      <Stack gap={3} direction="column">
        <Typography variant="h6">Dynamic Mock Service Worker</Typography>
        <DashboardTable
          initialItems={initialItems}
          resetForm={() => {
            setResetTime(new Date().getTime());
          }}
          fuse={fuse}
          setFilteredItems={setFilteredItems}
        >
          {filteredItems.map(({ title, mocks }) => (
            <DashboardTableRow
              key={title + resetTime + (mocks ? 'scenario' : 'mock')}
              title={title}
              mocks={mocks}
            />
          ))}
        </DashboardTable>
      </Stack>
    </Container>
  );
};

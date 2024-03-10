import {
  configureMockActions,
  configureMockId,
  selectCreateMockById,
  useAppDispatch,
  useTypedSelector,
} from '@dynamic-msw/core';
import ConfigTableRow from './ConfigTableRow';
import MockConfig from './MockConfig';
import { Stack } from '@mui/material';

export default function MockTableRow({ mockKey }: { mockKey: string }) {
  const dispatch = useAppDispatch();
  const mock = useTypedSelector(
    selectCreateMockById(configureMockId(mockKey, undefined)),
  );
  return (
    <ConfigTableRow
      title={mock.dashboardConfig?.title || mockKey}
      mockKey={mockKey}
      isActive={!!mock.isActive}
      setIsActive={setIsActive}
      dashboardConfig={mock.dashboardConfig}
      hasParameters={
        !!mock.parameters && Object.keys(mock.parameters).length > 0
      }
    >
      <Stack gap={3} direction="column" sx={{ width: 300, my: 3 }}>
        <MockConfig
          key={mockKey}
          parameters={mock.parameters}
          mockKey={mockKey}
          scenarioKey={undefined}
        />
      </Stack>
    </ConfigTableRow>
  );

  function setIsActive(isActive: boolean) {
    dispatch(
      configureMockActions.updateOne({
        mockKey,
        scenarioKey: undefined,
        changes: { isActive },
      }),
    );
  }
}

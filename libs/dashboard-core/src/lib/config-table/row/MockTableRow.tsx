import {
  mockDashboardActions,
  getMockEntityId,
  selectMockParametersById,
  useAppDispatch,
  useTypedSelector,
  selectMockDashboardConfigById,
} from '@dynamic-msw/core';
import ConfigTableRow from './ConfigTableRow';
import MockConfig from '../content/MockConfig';
import { Stack } from '@mui/material';

export default function MockTableRow({ mockKey }: { mockKey: string }) {
  const dispatch = useAppDispatch();
  const entityId = getMockEntityId(mockKey, undefined);
  const dashboardConfig = useTypedSelector(
    selectMockDashboardConfigById(entityId),
  );
  const parameters = useTypedSelector(selectMockParametersById(entityId));
  return (
    <ConfigTableRow
      title={dashboardConfig.title || mockKey}
      mockKey={mockKey}
      isActive={!!dashboardConfig.isActive}
      setIsActive={setIsActive}
      dashboardConfig={dashboardConfig}
      hasParameters={!!parameters && Object.keys(parameters).length > 0}
    >
      <Stack gap={3} direction="column" sx={{ width: 300, my: 3 }}>
        <MockConfig
          key={mockKey}
          parameters={parameters}
          mockKey={mockKey}
          scenarioKey={undefined}
        />
      </Stack>
    </ConfigTableRow>
  );

  function setIsActive(isActive: boolean) {
    dispatch(
      mockDashboardActions.updateOne({
        id: entityId,
        changes: { isActive },
      }),
    );
  }
}

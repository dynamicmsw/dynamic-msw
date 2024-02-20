import {
  selectCreateScenarioById,
  selectScenarioMocksById,
  useAppDispatch,
  useTypedSelector,
  createScenarioActions,
} from '@dynamic-msw/core';
import ConfigTableRow from './ConfigTableRow';
import MockConfig from './MockConfig';
import { Stack } from '@mui/material';

export default function ScenarioTableRow({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const dispatch = useAppDispatch();
  const scenario = useTypedSelector(selectCreateScenarioById(scenarioId));
  const scenarioMocks = useTypedSelector(selectScenarioMocksById(scenarioId));
  return (
    <ConfigTableRow
      title={scenario.id}
      isActive={!!scenario.isActive}
      setIsActive={setIsActive}
      dashboardConfig={scenario.dashboardConfig}
    >
      <Stack gap={3} direction="column" sx={{ width: 300, my: 3 }}>
        {scenarioMocks.map((scenarioMock) => (
          <MockConfig
            key={scenarioMock.mockKey}
            title={scenarioMock.mockKey}
            parameters={scenarioMock.parameters}
            mockKey={scenarioMock.mockKey}
            scenarioKey={scenarioId}
          />
        ))}
      </Stack>
    </ConfigTableRow>
  );

  function setIsActive(isActive: boolean) {
    dispatch(
      createScenarioActions.updateOne({
        id: scenarioId,
        changes: { isActive },
      })
    );
  }
}

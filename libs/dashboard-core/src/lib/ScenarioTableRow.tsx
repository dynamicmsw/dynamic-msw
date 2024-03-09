import {
  selectCreateScenarioById,
  selectScenarioMocksById,
  useAppDispatch,
  useTypedSelector,
  configureScenarioActions,
  configureMockActions,
} from '@dynamic-msw/core';
import ConfigTableRow from './ConfigTableRow';
import { Table, TableBody } from '@mui/material';
import ScenarioSubTableRow from './ScenarioSubTableRow';

export default function ScenarioTableRow({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const dispatch = useAppDispatch();
  const scenario = useTypedSelector(selectCreateScenarioById(scenarioId));
  const scenarioMocks = useTypedSelector((state) =>
    selectScenarioMocksById(state, scenarioId)
  );
  return (
    <ConfigTableRow
      isScenario
      scenarioKey={scenarioId}
      title={scenario.dashboardConfig?.title || scenario.id}
      isActive={!!scenario.isActive}
      setIsActive={setIsActive}
      dashboardConfig={scenario.dashboardConfig}
      hasParameters={true}
    >
      <Table>
        <colgroup>
          <col style={{ width: '0px' }} />
          <col style={{ width: 'auto' }} />
        </colgroup>
        <TableBody>
          {scenarioMocks.map((scenarioMock) => (
            <ScenarioSubTableRow
              key={scenarioMock.mockKey}
              title={scenarioMock.mockKey}
              parameters={scenarioMock.parameters}
              mockKey={scenarioMock.mockKey}
              scenarioKey={scenarioId}
            />
          ))}
        </TableBody>
      </Table>
    </ConfigTableRow>
  );

  function setIsActive(isActive: boolean) {
    dispatch(
      configureScenarioActions.updateOne({
        id: scenarioId,
        changes: { isActive },
      })
    );
    // TODO: scenarios should also update their mock state
    scenarioMocks.forEach((scenarioMock) => {
      dispatch(
        configureMockActions.updateOne({
          mockKey: scenarioMock.mockKey,
          scenarioKey: scenarioMock.scenarioKey,
          changes: { isActive },
        })
      );
    });
  }
}

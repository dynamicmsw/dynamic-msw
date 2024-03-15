import {
  getMockEntityId,
  mockDashboardActions,
  scenarioActions,
  selectScenarioById,
  useAppDispatch,
  useTypedSelector,
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
  const scenario = useTypedSelector(selectScenarioById(scenarioId));
  return (
    <ConfigTableRow
      isScenario
      scenarioKey={scenarioId}
      title={scenario.title || scenario.id}
      isActive={!!scenario.isActive}
      setIsActive={setIsActive}
      dashboardConfig={scenario}
      hasParameters={true}
    >
      <Table>
        <colgroup>
          <col style={{ width: '0px' }} />
          <col style={{ width: 'auto' }} />
        </colgroup>
        <TableBody>
          {scenario.mockKeys.map((mockKey) => (
            <ScenarioSubTableRow
              key={mockKey}
              title={mockKey}
              mockKey={mockKey}
              scenarioKey={scenarioId}
            />
          ))}
        </TableBody>
      </Table>
    </ConfigTableRow>
  );

  function setIsActive(isActive: boolean) {
    dispatch(
      scenarioActions.updateOne({
        id: scenarioId,
        changes: { isActive },
      }),
    );
    scenario.mockKeys.forEach((mockKey) => {
      dispatch(
        mockDashboardActions.updateOne({
          id: getMockEntityId(mockKey, scenarioId),
          changes: { isActive },
        }),
      );
    });
  }
}

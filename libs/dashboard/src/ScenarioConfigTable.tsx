import { Table, TableBody } from '@mui/material';
import ScenarioTableRow from './ScenarioTableRow';
import {
  selectActiveSortedCreateScenarioIds,
  useTypedSelector,
} from '@dynamic-msw/core';

export default function ScenarioConfigTable() {
  const allCreateScenarioIds = useTypedSelector(
    selectActiveSortedCreateScenarioIds
  );
  return (
    <Table>
      <colgroup>
        <col style={{ width: '0px' }} />
        <col style={{ width: '0px' }} />
        <col style={{ width: 'auto' }} />
        <col style={{ width: '0px' }} />
      </colgroup>
      <TableBody>
        {allCreateScenarioIds.map((createScenarioId) => (
          <ScenarioTableRow
            key={createScenarioId}
            scenarioId={createScenarioId}
          />
        ))}
      </TableBody>
    </Table>
  );
}

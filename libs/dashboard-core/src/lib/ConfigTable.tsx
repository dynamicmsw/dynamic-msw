import { Divider, Table, TableBody } from '@mui/material';
import MockTableRow from './MockTableRow';
import ScenarioTableRow from './ScenarioTableRow';
import TableToolBar from './TableToolBar';
import { useFilteredMocksAndScenarios } from './useFilteredMocksAndScenarios';

export default function ConfigTable() {
  const filteredMocksAndScenarios = useFilteredMocksAndScenarios();
  return (
    <>
      <Table>
        <TableBody>
          <TableToolBar />
          {filteredMocksAndScenarios.map(({ mockKey, scenarioKey }) =>
            mockKey ? (
              <MockTableRow key={mockKey} mockKey={mockKey} />
            ) : (
              <ScenarioTableRow key={scenarioKey} scenarioId={scenarioKey!} />
            )
          )}
        </TableBody>
        <colgroup>
          <col style={{ width: '0px' }} />
          <col style={{ width: '0px' }} />
          <col style={{ width: '0px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '0px' }} />
        </colgroup>
      </Table>
    </>
  );
}

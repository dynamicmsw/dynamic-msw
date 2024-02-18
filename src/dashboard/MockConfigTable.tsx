import { useTypedSelector } from "../state/store";
import { Table, TableBody } from "@mui/material";
import { selectAllNonScenarioMocksIds } from "../state/createMock.slice";
import MockTableRow from "./MockTableRow";

export default function MockConfigTable() {
  const mockIds = useTypedSelector(selectAllNonScenarioMocksIds);
  return (
    <Table>
      <colgroup>
        <col style={{ width: "0px" }} />
        <col style={{ width: "0px" }} />
        <col style={{ width: "auto" }} />
        <col style={{ width: "0px" }} />
      </colgroup>
      <TableBody>
        {mockIds.map((mockId) => (
          <MockTableRow key={mockId} mockKey={mockId} />
        ))}
      </TableBody>
    </Table>
  );
}

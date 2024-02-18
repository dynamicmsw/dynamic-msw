import { useAppDispatch, useTypedSelector } from "../state/store";
import {
  createMockActions,
  createMockId,
  selectCreateMockById,
} from "../state/createMock.slice";
import ConfigTableRow from "./ConfigTableRow";
import MockConfig from "./MockConfig";
import { Stack } from "@mui/material";

export default function MockTableRow({ mockKey }: { mockKey: string }) {
  const dispatch = useAppDispatch();
  console.log(mockKey);
  const mock = useTypedSelector(
    selectCreateMockById(createMockId(mockKey, undefined))
  );
  return (
    <ConfigTableRow
      title={mockKey}
      isActive={!!mock.isActive}
      setIsActive={setIsActive}
      dashboardConfig={mock.dashboardConfig}
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
      createMockActions.updateOne({
        mockKey,
        scenarioKey: undefined,
        changes: { isActive },
      })
    );
  }
}

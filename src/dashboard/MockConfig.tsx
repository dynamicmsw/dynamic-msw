import { Stack, Typography } from "@mui/material";
import { NormalizedMockParameters } from "../types/MockParamater";
import MockConfigParameterInput from "./MockConfigParameterInput";

export default function MockConfig({
  title,
  mockKey,
  scenarioKey,
  parameters,
}: {
  title?: string;
  mockKey: string;
  scenarioKey: string | undefined;
  parameters: NormalizedMockParameters | undefined;
}) {
  if (!parameters) return null;
  return (
    <Stack gap={2} direction="column">
      {!!title && <Typography variant="h6">{title}</Typography>}
      {Object.entries(parameters).map(([key, parameter]) => (
        <MockConfigParameterInput
          key={key}
          title={key}
          mockKey={mockKey}
          parameterKey={key}
          parameter={parameter}
          scenarioKey={scenarioKey}
        />
      ))}
    </Stack>
  );
}

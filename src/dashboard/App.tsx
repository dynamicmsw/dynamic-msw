import { Box, Paper, Stack, Typography } from "@mui/material";
import ScenarioConfigTable from "./ScenarioConfigTable";
import MockConfigTable from "./MockConfigTable";

function App() {
  // TODO: combina mocks and tables to maintain order of mocks
  return (
    <>
      <Typography variant="h4">Dynamic MSW dashboard</Typography>
      <Stack direction="row" gap={3}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5">Scenarios</Typography>
          <Paper>
            <ScenarioConfigTable />
          </Paper>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5">Mocks</Typography>
          <Paper>
            <MockConfigTable />
          </Paper>
        </Box>
      </Stack>
    </>
  );
}

export default App;

import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { PropsWithChildren } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LaunchIcon from '@mui/icons-material/Launch';
import {
  DashboardConfig,
  createMockActions,
  createMockId,
  createScenarioActions,
  dashboardActions,
  selectIsMockExpanded,
  selectIsScenarioExpanded,
  useAppDispatch,
  useTypedSelector,
} from '@dynamic-msw/core';

const tableCellSx = {
  py: 1,
};

type MockKeyOrScenarioKey =
  | {
      mockKey: string;
      isScenario?: false;
      scenarioKey?: undefined;
    }
  | {
      mockKey?: undefined;
      isScenario: true;
      scenarioKey: string;
    };

export default function ConfigTableRow({
  children,
  title,
  mockKey,
  scenarioKey,
  isScenario,
  isActive,
  setIsActive,
  dashboardConfig = {},
}: PropsWithChildren<
  {
    title: string;
    isActive: boolean;
    setIsActive: (isActive: boolean) => unknown;
    dashboardConfig?: DashboardConfig;
  } & MockKeyOrScenarioKey
>) {
  // TODO: add this logics to consumers of this component
  const isExpanded = useTypedSelector(
    isScenario
      ? selectIsScenarioExpanded(scenarioKey)
      : selectIsMockExpanded(createMockId(mockKey, scenarioKey))
  );
  const dispatch = useAppDispatch();
  const pageURL = dashboardConfig?.pageURL;
  return (
    <>
      <TableRow>
        <TableCell sx={tableCellSx}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>
              dispatch(
                isScenario
                  ? createScenarioActions.updateOne({
                      id: scenarioKey,
                      changes: { isExpanded: !isExpanded },
                    })
                  : createMockActions.updateOne({
                      mockKey,
                      scenarioKey,
                      changes: { isExpanded: !isExpanded },
                    })
              )
            }
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ ...tableCellSx, px: 0 }}>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title={scenarioKey ? 'Scenario' : 'Mock'}
          >
            <span>{scenarioKey ? 'S' : 'M'}</span>
          </Tooltip>
        </TableCell>
        <TableCell sx={tableCellSx}>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            placement="right-start"
            title={isActive ? 'Deactivate' : 'Activate'}
          >
            <Box sx={{ '*': { m: '0px !important' } }}>
              <Checkbox
                color="primary"
                checked={!!isActive}
                onChange={() => setIsActive(!isActive)}
              />
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={tableCellSx}>{title}</TableCell>
        <TableCell sx={tableCellSx}>
          <Stack justifyContent="flex-end" direction="row">
            {pageURL && (
              <Tooltip
                enterDelay={500}
                leaveDelay={200}
                arrow
                title="View related page"
                placement="left"
              >
                <IconButton
                  component="a"
                  aria-label="Open page"
                  color="primary"
                  size="small"
                  target="_blank"
                  onClick={() =>
                    dispatch(dashboardActions.setOpenPageURL(pageURL))
                  }
                >
                  <LaunchIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell
            sx={tableCellSx}
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={5}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>{children}</Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

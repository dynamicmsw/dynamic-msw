import {
  Box,
  Checkbox,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  configureMockActions,
  configureMockId,
  configureScenarioActions,
  dashboardActions,
  removeState,
  selectIsOneMockExpanded,
  selectIsOneMockInactive,
  selectIsOneScenarioExpanded,
  useAppDispatch,
  useTypedSelector,
} from '@dynamic-msw/core';
import { useFilteredMocksAndScenarios } from './useFilteredMocksAndScenarios';
import { useMemo } from 'react';
import DisplayFilter from './DisplayFilter';

const tableCellSx = {
  py: 1,
};

export default function TableToolBar() {
  const dispatch = useAppDispatch();
  const isOneMockExpanded = useTypedSelector(selectIsOneMockExpanded);
  const isOneScenarioExpanded = useTypedSelector(selectIsOneScenarioExpanded);
  const isOneMockInactive = useTypedSelector(selectIsOneMockInactive);
  const filteredMocksAndScenarios = useFilteredMocksAndScenarios();
  const filteredMockIds = useMemo(
    () =>
      filteredMocksAndScenarios.flatMap((mock) =>
        mock.scenarioKey
          ? mock.mockKeys.map((mockKey) =>
              configureMockId(mockKey, mock.scenarioKey)
            )
          : configureMockId(mock.mockKey!, undefined)
      ),
    [filteredMocksAndScenarios]
  );
  const filteredScenarioMocksIds = useMemo(
    () =>
      filteredMocksAndScenarios
        .filter((scenario) => scenario.scenarioKey)
        .map((scenario) => scenario.scenarioKey!),
    [filteredMocksAndScenarios]
  );
  const isOneExpanded = isOneMockExpanded || isOneScenarioExpanded;
  return (
    <TableRow sx={{ borderBottom: 'solid 1.5px rgba(0,0,0,.18)' }}>
      <TableCell sx={tableCellSx}>
        <Tooltip
          enterDelay={500}
          leaveDelay={200}
          placement="right-start"
          title={
            isOneExpanded
              ? 'Collapse all (filtered) items'
              : 'Expand all (filtered) items'
          }
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              if (isOneExpanded) {
                dispatch(
                  configureMockActions.collapseEntities(filteredMockIds)
                );
                dispatch(
                  configureScenarioActions.collapseEntities(
                    filteredScenarioMocksIds
                  )
                );
              } else {
                dispatch(configureMockActions.expandEntities(filteredMockIds));
                dispatch(
                  configureScenarioActions.expandEntities(
                    filteredScenarioMocksIds
                  )
                );
              }
            }}
          >
            {isOneExpanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ ...tableCellSx, px: 0 }}>
        <DisplayFilter />
      </TableCell>
      <TableCell sx={tableCellSx}>
        <Tooltip
          enterDelay={500}
          leaveDelay={200}
          placement="right-start"
          title={
            isOneMockInactive
              ? 'Activate all (filtered) items'
              : 'Deactivate all (filtered) items'
          }
        >
          <Box sx={{ '*': { m: '0px !important' } }}>
            <Checkbox
              color="primary"
              checked={!isOneMockInactive}
              onChange={() => {
                if (isOneMockInactive) {
                  dispatch(
                    configureMockActions.activateEntities(filteredMockIds)
                  );
                  dispatch(
                    configureScenarioActions.activateEntities(
                      filteredScenarioMocksIds
                    )
                  );
                } else {
                  dispatch(
                    configureMockActions.deactiveEntities(filteredMockIds)
                  );
                  dispatch(
                    configureScenarioActions.deactiveEntities(
                      filteredScenarioMocksIds
                    )
                  );
                }
              }}
            />
          </Box>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ ...tableCellSx, pl: 1.5 }}>
        <TextField
          fullWidth
          id="search"
          type="search"
          label="Search"
          size="small"
          variant="outlined"
          onChange={(e) =>
            dispatch(dashboardActions.setSearchQuery(e.target.value))
          }
        />
      </TableCell>
      <TableCell sx={tableCellSx}>
        <Stack justifyContent="flex-end" gap={1} direction="row">
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title="Delete stored options"
          >
            <IconButton
              aria-label="Delete stored config and reload page"
              color="error"
              size="small"
              onClick={() => {
                removeState();
                dispatch(dashboardActions.reloadPage());
              }}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title="Reset all filters and parameters"
          >
            <IconButton
              aria-label="Reset all filters and parameters"
              color="error"
              size="small"
              onClick={() => {
                dispatch(configureMockActions.resetAll());
                dispatch(configureScenarioActions.resetAll());
                dispatch(dashboardActions.reset());
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

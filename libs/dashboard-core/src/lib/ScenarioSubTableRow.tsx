import { Box, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  NormalizedMockParameters,
  createMockActions,
  createMockId,
  selectIsMockExpanded,
  useAppDispatch,
  useTypedSelector,
} from '@dynamic-msw/core';
import MockConfig from './MockConfig';
const tableCellSx = {
  py: 1,
};
export default function ScenarioSubTableRow({
  title,
  mockKey,
  scenarioKey,
  parameters,
}: {
  title: string;
  mockKey: string;
  scenarioKey: string | undefined;
  parameters: NormalizedMockParameters | undefined;
}) {
  const isExpanded = useTypedSelector(
    selectIsMockExpanded(createMockId(mockKey, scenarioKey))
  );
  const dispatch = useAppDispatch();
  return (
    <>
      <TableRow sx={{ '&:last-child > *': { borderBottom: 'none' } }}>
        <TableCell sx={tableCellSx}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>
              dispatch(
                createMockActions.updateOne({
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
        <TableCell sx={tableCellSx}>{title}</TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell
            sx={tableCellSx}
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={5}
          >
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <MockConfig
                  title={title}
                  mockKey={mockKey}
                  scenarioKey={scenarioKey}
                  parameters={parameters}
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

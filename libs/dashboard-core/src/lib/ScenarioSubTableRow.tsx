import { Box, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  type NormalizedMockParameters,
  configureMockActions,
  configureMockId,
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
    selectIsMockExpanded(configureMockId(mockKey, scenarioKey)),
  );
  const dispatch = useAppDispatch();
  const hasParameters = !!parameters && Object.keys(parameters).length > 0;
  return (
    <>
      <TableRow sx={{ '&:last-child > *': { borderBottom: 'none' } }}>
        <TableCell sx={tableCellSx}>
          {hasParameters && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() =>
                dispatch(
                  configureMockActions.updateOne({
                    mockKey,
                    scenarioKey,
                    changes: { isExpanded: !isExpanded },
                  }),
                )
              }
            >
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
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
              <Box sx={{ margin: 1, pt: 2 }}>
                <MockConfig
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

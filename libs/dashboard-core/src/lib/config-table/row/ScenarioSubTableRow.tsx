import { Box, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  mockDashboardActions,
  getMockEntityId,
  selectIsMockExpanded,
  useAppDispatch,
  useTypedSelector,
  selectMockParametersById,
} from '@dynamic-msw/core';
import MockConfig from '../content/MockConfig';
const tableCellSx = {
  py: 1,
};
export default function ScenarioSubTableRow({
  title,
  mockKey,
  scenarioKey,
}: {
  title: string;
  mockKey: string;
  scenarioKey: string | undefined;
}) {
  const isExpanded = useTypedSelector(
    selectIsMockExpanded(getMockEntityId(mockKey, scenarioKey)),
  );
  const dispatch = useAppDispatch();
  const entityId = getMockEntityId(mockKey, scenarioKey);
  const parameters = useTypedSelector(selectMockParametersById(entityId));
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
                  mockDashboardActions.updateOne({
                    id: entityId,
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

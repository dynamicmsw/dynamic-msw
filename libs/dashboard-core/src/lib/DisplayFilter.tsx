import {
  DashboardDisplayFilter,
  dashboardActions,
  selectDisplayFilter,
  useAppDispatch,
  useTypedSelector,
} from '@dynamic-msw/core';
import { Box, MenuItem, Select } from '@mui/material';

const displayFilterValueMap = {
  'mocks-and-scenarios': 'M/S',
  mocks: 'M',
  scenarios: 'S',
} satisfies Record<DashboardDisplayFilter, string>;

export default function DisplayFilter() {
  const dispatch = useAppDispatch();
  const displayFilter = useTypedSelector(selectDisplayFilter);
  return (
    <Select<DashboardDisplayFilter>
      variant="standard"
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={displayFilter}
      renderValue={(value) => (
        <Box sx={{ minWidth: '29px' }}>{displayFilterValueMap[value]}</Box>
      )}
      onChange={(e) => {
        dispatch(
          dashboardActions.setDisplayFilter(
            e.target.value as DashboardDisplayFilter
          )
        );
      }}
    >
      <MenuItem value={'mocks-and-scenarios' satisfies DashboardDisplayFilter}>
        Mocks and Scenarios
      </MenuItem>
      <MenuItem value={'mocks' satisfies DashboardDisplayFilter}>
        Mocks
      </MenuItem>
      <MenuItem value={'scenarios' satisfies DashboardDisplayFilter}>
        Scenarios
      </MenuItem>
    </Select>
  );
}

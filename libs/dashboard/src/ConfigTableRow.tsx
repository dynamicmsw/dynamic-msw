import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LaunchIcon from '@mui/icons-material/Launch';
import { DashboardConfig } from '@dynamic-msw/core';

export default function ConfigTableRow({
  children,
  title,
  isActive,
  setIsActive,
  dashboardConfig = {},
}: PropsWithChildren<{
  title: string;
  isActive: boolean;
  setIsActive: (isActive: boolean) => unknown;
  dashboardConfig?: DashboardConfig;
}>) {
  const [isRowExpanded, setIsRowExpanded] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setIsRowExpanded(!isRowExpanded)}
          >
            {isRowExpanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            placement="right-start"
            title={isActive ? 'Deactivate' : 'Activate'}
          >
            <Box sx={{ '*': { m: '0px !important' } }}>
              <Checkbox
                color="primary"
                defaultChecked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>
          {dashboardConfig.pageURL && (
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
                href={dashboardConfig.pageURL}
              >
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      {isRowExpanded && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
            <Collapse in={isRowExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>{children}</Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

import type {
  MockOptions,
  StoredMockState,
  StoredScenarioState,
} from '@dynamic-msw/core';
import { createStorageKey } from '@dynamic-msw/core';
import {
  createScenarioKey,
  loadFromStorage,
  saveToStorage,
  createScenarioMockKey,
} from '@dynamic-msw/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LaunchIcon from '@mui/icons-material/Launch';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import type Fuse from 'fuse.js';
import * as React from 'react';

import { getFlatStorageKeys } from './Dashboard.helpers';
import type { DashboardItem } from './Dashboard.types';

export const DashboardTableRow: React.FC<{
  title: string;
  mocks?: string[];
}> = ({ title, mocks }) => {
  const storageKey = mocks
    ? createStorageKey(createScenarioKey(title))
    : createStorageKey(title);

  const [open, setOpen] = React.useState(false);
  const storageConfigRef = React.useRef(
    loadFromStorage<StoredMockState<MockOptions> | StoredScenarioState>(
      storageKey
    )
  );
  const { isActive, openPageURL } = storageConfigRef.current;

  return (
    <React.Fragment>
      <TableRow sx={{ '&, > *': { borderBottom: 'unset !important' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title={mocks ? 'Scenario' : 'Mock'}
          >
            <Box sx={{ '*': { m: '0px !important' } }}>
              <Typography textAlign="center">{mocks ? 'S' : 'M'}</Typography>
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '34px',
          }}
        >
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
                onChange={(e) => {
                  storageConfigRef.current = {
                    ...storageConfigRef.current,
                    isActive: !!e.target.checked,
                  };
                  saveToStorage(storageKey, storageConfigRef.current);
                }}
              />
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>{title}</TableCell>
        <TableCell>
          {openPageURL && (
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
                href={openPageURL}
              >
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {mocks ? (
                mocks.map((scenarioStorageKey) => {
                  const scenarioMockStorageKey = createStorageKey(
                    createScenarioMockKey(title, scenarioStorageKey)
                  );
                  return (
                    <DashboardTableInputRow
                      key={scenarioStorageKey}
                      storageKey={scenarioMockStorageKey}
                      title={scenarioStorageKey}
                    />
                  );
                })
              ) : (
                <DashboardTableInputRow storageKey={storageKey} />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const DashboardTableInputRow: React.FC<{
  storageKey: string;
  title?: string;
}> = ({ storageKey, title }) => {
  const storageConfigRef = React.useRef(
    loadFromStorage<StoredMockState<MockOptions>>(storageKey)
  );
  const { options } = storageConfigRef.current || {};
  const optionKeys = Object.keys(options);
  return (
    <FormGroup>
      <Stack gap={1} direction="column" sx={{ width: 300, my: 3 }}>
        {title && <Typography variant="h6">{title}</Typography>}
        {optionKeys.map((key) => {
          const changeHandler = (value: string | number | boolean) => {
            storageConfigRef.current.options[key].selectedValue = value;

            saveToStorage(storageKey, storageConfigRef.current);
          };
          const optionData = options[key];
          const id = `${storageKey}-${key}`;
          const currentValue =
            typeof optionData.selectedValue !== 'undefined'
              ? optionData.selectedValue
              : optionData.defaultValue;
          switch (optionData.inputType) {
            case 'boolean':
              return (
                <FormControlLabel
                  key={id}
                  control={
                    <Switch
                      defaultChecked={!!currentValue}
                      onChange={(e) => {
                        changeHandler(!!e.target.checked);
                      }}
                      name={key}
                    />
                  }
                  label={key}
                />
              );
            case 'select': {
              const isBoolean = typeof currentValue === 'boolean';
              return (
                <FormControl key={id}>
                  <InputLabel id={id} size="small">
                    {key}
                  </InputLabel>
                  <Select
                    labelId={id}
                    size="small"
                    label={key}
                    id="demo-simple-select"
                    {...(typeof currentValue === 'undefined'
                      ? { defaultValue: '' }
                      : {
                          defaultValue: isBoolean
                            ? `dyanmic-msw-boolean:${currentValue}`
                            : currentValue,
                        })}
                    onChange={(e) => {
                      changeHandler(
                        e.target.value
                          .toString()
                          .startsWith('dyanmic-msw-boolean:')
                          ? ((e.target.value as string).endsWith(
                              'dyanmic-msw-boolean:true'
                            ) &&
                              true) ||
                              false
                          : e.target.value
                      );
                    }}
                  >
                    {optionData.options?.map((option) => {
                      return (
                        <MenuItem
                          key={option.toString()}
                          value={
                            typeof option === 'boolean'
                              ? `dyanmic-msw-boolean:${option.toString()}`
                              : option
                          }
                        >
                          {option.toString()}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              );
            }
            case 'string':
            case 'number':
            default:
              return (
                <TextField
                  key={id}
                  id={id}
                  label={key}
                  size="small"
                  variant="outlined"
                  defaultValue={currentValue}
                  onChange={(e) => changeHandler(e.target.value)}
                />
              );
          }
        })}
      </Stack>
    </FormGroup>
  );
};

export const DashboardTable: React.FC<{
  children: React.ReactNode | React.ReactNode[];
  resetForm: () => void;
  fuse: Fuse<{
    title: string;
    mocks?: string[] | undefined;
  }>;
  setFilteredItems: React.Dispatch<React.SetStateAction<DashboardItem[]>>;
  initialItems: DashboardItem[];
}> = ({ children, resetForm, setFilteredItems, fuse, initialItems }) => {
  const storageKeys = React.useMemo(() => getFlatStorageKeys(), []);
  return (
    <TableContainer component={Paper}>
      <Stack
        justifyContent="space-between"
        gap={1}
        direction="row"
        alignItems="center"
      >
        <Stack pl={1} my={1}>
          <TextField
            id="search"
            label="Search"
            size="small"
            variant="outlined"
            onChange={(e) => {
              if (e.target.value) {
                const searchResult = fuse.search(e.target.value);
                setFilteredItems(searchResult.map((result) => result.item));
              } else {
                fuse.setCollection(initialItems);
                setFilteredItems(initialItems);
              }
            }}
          />
        </Stack>
        <Stack justifyContent="flex-end" gap={1} direction="row" pr={2}>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title="Delete stored options"
          >
            <IconButton
              aria-label="Delete stored config"
              color="error"
              size="small"
              onClick={() => {
                storageKeys.map((key) => localStorage.removeItem(key));
                window.location.reload();
              }}
            >
              <RotateLeftIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            enterDelay={500}
            leaveDelay={200}
            arrow
            title="Reset options"
          >
            <IconButton
              aria-label="Open page"
              color="error"
              size="small"
              onClick={() => {
                storageKeys.map((key) => {
                  const item = loadFromStorage(key) as any;
                  if (item.isActive) {
                    item.isActive = false;
                  }
                  if (item.options) {
                    saveToStorage(key, {
                      ...item,
                      options: Object.keys(item.options).reduce((prev, key) => {
                        const { selectedValue, ...updatedItem } =
                          item.options[key];
                        return { ...prev, [key]: updatedItem };
                      }, {}),
                    });
                  } else {
                    saveToStorage(key, item);
                  }
                });
                resetForm();
              }}
            >
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider />
      <Divider />
      <Table aria-label="collapsible table" size="small">
        <colgroup>
          <col style={{ width: '0px' }} />
          <col style={{ width: '0px' }} />
          <col style={{ width: '0px' }} />
          <col style={{ width: 'auto' }} />
          <col style={{ width: '0px' }} />
        </colgroup>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );
};

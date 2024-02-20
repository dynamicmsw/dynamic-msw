import {
  NormalizedMockParameter,
  createMockActions,
  createMockId,
  useAppDispatch,
} from '@dynamic-msw/core';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';

export default function MockConfigParameterInput({
  title,
  parameterKey,
  mockKey,
  scenarioKey,
  parameter,
}: {
  title: string;
  parameterKey: string;
  parameter: NormalizedMockParameter;
  mockKey: string;
  scenarioKey: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const currentValue = parameter.currentValue ?? parameter.defaultValue;
  const inputType =
    parameter.dashboardInputType ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (parameter.selectOptions?.length >= 0 && 'select');
  const uniqueId = createMockId(mockKey, scenarioKey).toString();
  switch (inputType) {
    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!currentValue}
              onChange={() =>
                dispatch(
                  createMockActions.updateOne({
                    mockKey,
                    scenarioKey,
                    changes: {
                      parameters: {
                        [parameterKey]: !currentValue,
                      },
                    },
                  })
                )
              }
            />
          }
          label={title}
        />
      );
    case 'select': {
      const isBoolean = typeof currentValue === 'boolean';
      return (
        <FormControl>
          <InputLabel id={uniqueId} size="small">
            {parameterKey}
          </InputLabel>
          <Select
            labelId={uniqueId}
            size="small"
            label={parameterKey}
            id="demo-simple-select"
            {...(typeof currentValue === 'undefined'
              ? { value: '' }
              : {
                  value: isBoolean
                    ? `dynamic-msw-boolean:${currentValue}`
                    : currentValue,
                })}
            onChange={(e) => {
              dispatch(
                createMockActions.updateOne({
                  mockKey,
                  scenarioKey,
                  changes: {
                    parameters: {
                      [parameterKey]: e.target.value
                        .toString()
                        .startsWith('dynamic-msw-boolean:')
                        ? JSON.parse(
                            e.target.value
                              .toString()
                              .split('dynamic-msw-boolean:')[1]
                          )
                        : e.target.value,
                    },
                  },
                })
              );
            }}
          >
            {parameter.selectOptions?.map((option) => {
              const optionValue =
                typeof option === 'boolean'
                  ? `dynamic-msw-boolean:${option.toString()}`
                  : option.toString();
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {option.toString()}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    }
    case 'number':
      return (
        <TextField
          id={uniqueId}
          type="number"
          label={title}
          size="small"
          variant="outlined"
          defaultValue={currentValue}
          onChange={(e) => {
            const isNaNNumber = Number.isNaN(e.target.value);
            if (isNaNNumber) return;
            dispatch(
              createMockActions.updateOne({
                mockKey,
                scenarioKey,
                changes: {
                  parameters: {
                    [parameterKey]: Number(e.target.value),
                  },
                },
              })
            );
          }}
        />
      );

    case 'string':
    default:
      return (
        <TextField
          id={uniqueId}
          label={title}
          type="text"
          size="small"
          variant="outlined"
          defaultValue={currentValue}
          onChange={(e) => {
            dispatch(
              createMockActions.updateOne({
                mockKey,
                scenarioKey,
                changes: {
                  parameters: {
                    [parameterKey]: e.target.value,
                  },
                },
              })
            );
          }}
        />
      );
  }
}

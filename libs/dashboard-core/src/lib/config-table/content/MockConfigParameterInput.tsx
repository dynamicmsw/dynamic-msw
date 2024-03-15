import {
  type NormalizedMockParameter,
  mockParametersActions,
  getMockEntityId,
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
  const entityId = getMockEntityId(mockKey, scenarioKey);
  const uniqueId =
    getMockEntityId(mockKey, scenarioKey).toString() + parameterKey;
  switch (inputType) {
    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!currentValue}
              onChange={() =>
                dispatch(
                  mockParametersActions.updateOne({
                    id: entityId,
                    changes: {
                      [parameterKey]: !currentValue,
                    },
                  }),
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
            value={
              typeof currentValue === 'undefined'
                ? ''
                : isBoolean
                  ? `dynamic-msw-boolean:${currentValue}`
                  : currentValue
            }
            onChange={(e) => {
              dispatch(
                mockParametersActions.updateOne({
                  id: entityId,
                  changes: {
                    [parameterKey]: e.target.value
                      ?.toString()
                      .startsWith('dynamic-msw-boolean:')
                      ? JSON.parse(
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          e.target.value
                            .toString()
                            .split('dynamic-msw-boolean:')[1]!,
                        )
                      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        e.target.value!,
                  },
                }),
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
          value={currentValue}
          onChange={(e) => {
            const isNaNNumber = Number.isNaN(e.target.value);
            if (isNaNNumber) return;
            dispatch(
              mockParametersActions.updateOne({
                id: entityId,
                changes: {
                  [parameterKey]: Number(e.target.value),
                },
              }),
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
          value={currentValue}
          onChange={(e) => {
            dispatch(
              mockParametersActions.updateOne({
                id: entityId,
                changes: {
                  [parameterKey]: e.target.value,
                },
              }),
            );
          }}
        />
      );
  }
}

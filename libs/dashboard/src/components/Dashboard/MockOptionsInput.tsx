import type { State } from '@dynamic-msw/core';
import { SelectInput, TextInput, ToggleInput } from '@stela-ui/react';
import type { FC } from 'react';

import type { ConvertedMockOptions } from './Dashboard.helpers';
import {
  getInputType,
  updateConfig,
  convertOptionValue,
} from './Dashboard.helpers';

interface MockSettingsProps extends ConvertedMockOptions {
  mockConfig: State;
  mockConfigIndex: number;
  id: string;
}

export const MockOptionsInput: FC<MockSettingsProps> = ({
  mockConfig,
  mockConfigIndex,
  selectedValue,
  options,
  type,
  title,
  id,
}) => {
  const inputType = getInputType(selectedValue, options, type);
  const onChangeHandler = (value: string | number | boolean) => {
    updateConfig(
      mockConfig,
      mockConfigIndex,
      title,
      inputType === 'number' ? Number(value) : value
    );
  };
  const defaultValue = convertOptionValue(selectedValue);
  switch (inputType) {
    case 'select':
      return (
        <SelectInput
          data-testid="scenario-config-input"
          name={id}
          label={title}
          defaultValue={defaultValue}
          onChange={onChangeHandler}
          options={
            options?.map((value) => ({
              value: convertOptionValue(value) || 'value not specified',
            })) || []
          }
        />
      );
    case 'text':
    case 'number':
      return (
        <TextInput
          data-testid="scenario-config-input"
          label={title}
          type={inputType}
          defaultValue={defaultValue}
          onChange={onChangeHandler}
        />
      );
    case 'boolean':
      return (
        <ToggleInput
          data-testid="scenario-config-input"
          label={title}
          defaultChecked={defaultValue === 'true'}
          onChange={onChangeHandler}
        />
      );
    default:
      return null;
  }
};

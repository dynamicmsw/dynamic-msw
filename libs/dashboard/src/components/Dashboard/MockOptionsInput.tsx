import type { OptionRenderType } from '@dynamic-msw/core';
import { SelectInput, TextInput, ToggleInput } from '@stela-ui/react';
import type { FC } from 'react';

import type { ConvertedMockOptions } from './Dashboard.helpers';
import { convertOptionValue } from './Dashboard.helpers';

interface MockSettingsProps extends ConvertedMockOptions {
  id: string;
  inputType: OptionRenderType;
  onChange: (value: string | number | boolean) => void;
}

export const MockOptionsInput: FC<MockSettingsProps> = ({
  onChange,
  selectedValue,
  options,
  title,
  inputType,
  id,
}) => {
  const defaultValue = convertOptionValue(selectedValue);
  switch (inputType) {
    case 'select':
      return (
        <SelectInput
          data-testid="scenario-config-input"
          name={id}
          label={title}
          defaultValue={defaultValue}
          onChange={onChange}
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
          onChange={onChange}
        />
      );
    case 'boolean':
      return (
        <ToggleInput
          data-testid="scenario-config-input"
          label={title}
          defaultChecked={defaultValue === 'true'}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};
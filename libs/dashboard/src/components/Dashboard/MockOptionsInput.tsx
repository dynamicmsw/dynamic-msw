import type { OptionRenderType } from '@dynamic-msw/core';
import { SelectInput, TextInput, ToggleInput } from '@stela-ui/react';
import type { FC } from 'react';

import type { ConvertedMockOptions } from './Dashboard.helpers';
import { convertOptionValue } from './Dashboard.helpers';

interface MockSettingsProps extends ConvertedMockOptions {
  id: string;
  inputType: OptionRenderType | 'select';
  onChange: (value: string | number | boolean | undefined) => void;
  gridRow?: number;
}

const styles = { '> *': { paddingLeft: '10px' } };

export const MockOptionsInput: FC<MockSettingsProps> = ({
  onChange,
  selectedValue,
  options,
  title,
  inputType,
  id,
}) => {
  const value = convertOptionValue(selectedValue);
  const testId = id.replace(/ /g, '-');
  switch (inputType) {
    case 'select':
      return (
        <SelectInput
          css={styles}
          data-testid={testId}
          labelPosition="left"
          name={id}
          label={title}
          value={value || ''}
          onChange={(value) => {
            if (value === 'Select a value') {
              onChange(undefined);
            } else {
              onChange(value);
            }
          }}
          options={[
            { value: 'Select a value' },
            ...(options?.map((value) => ({
              value: convertOptionValue(value) || 'value not specified',
            })) || []),
          ]}
        />
      );
    case 'text':
    case 'number':
      return (
        <TextInput
          css={styles}
          data-testid={testId}
          labelPosition="left"
          label={title}
          type={inputType}
          value={value || ''}
          onChange={onChange}
        />
      );
    case 'boolean':
      return (
        <ToggleInput
          css={styles}
          data-testid={testId}
          label={title}
          checked={value === 'true'}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

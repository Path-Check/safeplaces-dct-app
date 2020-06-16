import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { Option } from '../Option';
import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from '../constants';

test('SCREEN_TYPE_CHECKBOX', () => {
  const { asJSON } = render(
    <Option
      index={0}
      onSelect={jest.fn()}
      option={{
        description: 'Description',
        label: 'Label',
        value: 'Value',
      }}
      type={SCREEN_TYPE_CHECKBOX}
    />,
  );
  expect(asJSON()).toMatchSnapshot();
});

test('SCREEN_TYPE_RADIO', () => {
  const { asJSON } = render(
    <Option
      index={0}
      onSelect={jest.fn()}
      option={{
        description: 'Description',
        label: 'Label',
        value: 'Value',
      }}
      type={SCREEN_TYPE_RADIO}
    />,
  );
  expect(asJSON()).toMatchSnapshot();
});

describe('SCREEN_TYPE_DATE', () => {
  test('displays the label if not selected', () => {
    const { getByTestId } = render(
      <Option
        index={0}
        onSelect={jest.fn()}
        option={{
          label: 'Label',
          value: 'Value',
        }}
        type={SCREEN_TYPE_DATE}
      />,
    );
    expect(getByTestId('label').children).toEqual(['Label']);
  });
  test('on iOS, selecting the date picker immediatley invokes the onSelect handler with the current date', () => {
    jest.doMock('../../../Util', () => ({
      isPlatformIOS: () => true,
    }));
    let onSelect = jest.fn();
    const { getByTestId } = render(
      <Option
        index={0}
        onSelect={onSelect}
        option={{
          label: 'Label',
          value: 'Value',
        }}
        type={SCREEN_TYPE_DATE}
      />,
    );
    fireEvent.press(getByTestId('option'));
    expect(onSelect).toHaveBeenCalledWith(new Date().toDateString());
    expect(getByTestId('label').children[0]).toMatch(/\d\d?\/\d\d?\/\d\d\d\d/);
  });
  test('shows the date picker', () => {
    const { getByTestId } = render(
      <Option
        index={0}
        onSelect={jest.fn()}
        option={{
          label: 'Label',
          value: 'Value',
        }}
        type={SCREEN_TYPE_DATE}
      />,
    );
    fireEvent.press(getByTestId('option'));
    expect(getByTestId('datepicker')).toBeTruthy();
  });
});

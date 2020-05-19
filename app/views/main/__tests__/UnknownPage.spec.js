import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as permissions from 'react-native-permissions';

import { UnknownPage } from '../UnknownPage';

let settingsURLSpy;

beforeEach(() => {
  settingsURLSpy = jest
    .spyOn(permissions, 'openSettings')
    .mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  settingsURLSpy.mockRestore();
});

it('unknown permissions matches snapshot', () => {
  const { asJSON } = render(<UnknownPage />);

  expect(asJSON()).toMatchSnapshot();
});

it('open settings to enable location', () => {
  const { getByLabelText } = render(<UnknownPage />);

  const button = getByLabelText('Enable Location Data');
  fireEvent.press(button);

  expect(settingsURLSpy).toHaveBeenCalled();
});

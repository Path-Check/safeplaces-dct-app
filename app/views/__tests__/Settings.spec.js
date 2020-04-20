import 'react-native';

import { act, render } from '@testing-library/react-native';
import React from 'react';

import * as languages from '../../locales/languages';
import { SettingsScreen } from '../Settings';

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn().mockReturnValue(Promise.resolve('true')),
  };
});

beforeEach(() => {
  jest.spyOn(languages, 'findUserLang').mockResolvedValue('en');
});

jest.useFakeTimers();

it('renders correctly', async () => {
  const { asJSON } = render(<SettingsScreen />);

  act(() => {
    jest.runAllTimers();
  });

  await expect(asJSON()).toMatchSnapshot();
});

import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import * as flagsEnv from '../../constants/flagsEnv';
import { FlagsProvider } from '../../helpers/Flags';
import { FeatureFlagsScreen } from '../FeatureFlagToggles';

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn().mockResolvedValue(false),
  };
});

const buildTimeFlags = { flag: true };

it('renders default values from the flags provider', async () => {
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders toggle events', async () => {
  flagsEnv.buildTimeFlags = buildTimeFlags;

  const { getByTestId, debug } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  const toggle = getByTestId('flag');
  fireEvent.valueChange(toggle, false);
  debug(toggle);
  expect(toggle.props.value).toBe(false);
});

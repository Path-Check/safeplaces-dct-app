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
flagsEnv.buildTimeFlags = buildTimeFlags;

it('renders default values from the flags provider', async () => {
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders toggle events', async () => {
  const { getByTestId } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  const toggle = getByTestId('flag');

  await act(async () => await fireEvent.valueChange(toggle, false));
  // debug(toggle);
  // console.log(toggle);
});

import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import * as flagsEnv from '../../constants/flagsEnv';
import * as Flags from '../../helpers/Flags';
import { FeatureFlagsScreen } from '../FeatureFlagToggles';

const { FlagsProvider } = Flags;

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn().mockResolvedValue(false),
  };
});

jest.useFakeTimers();

const buildTimeFlags = { feature1: true };
flagsEnv.buildTimeFlags = buildTimeFlags;

it('does not render flags that are not runtime flags', async () => {
  Flags.runtimeFlags = {};

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();

  Flags.runtimeFlags = buildTimeFlags;
});

it('renders default values from the flags provider', async () => {
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders toggle events', async () => {
  const { getByTestId, debug } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  const toggle = getByTestId('feature1');

  await act(async () => {
    fireEvent.valueChange(toggle, false);
    jest.runOnlyPendingTimers();
    debug(toggle);
  });

  // debug(toggle);
  expect(toggle.props.value).toBe(false);
});

import { act, fireEvent, render, wait } from '@testing-library/react-native';
import React from 'react';

import * as flagsEnv from '../../constants/flagsEnv';
import * as Flags from '../../helpers/Flags';
import { FeatureFlagsScreen } from '../FeatureFlagToggles';

const { FlagsProvider } = Flags;
const buildTimeFlags = { feature1: true };

flagsEnv.buildTimeFlags = buildTimeFlags;

jest.mock('../../helpers/General', () => {
  return {
    GetStoreData: jest.fn().mockResolvedValue(false),
  };
});

it('renders default values from the flags provider', async () => {
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

// TODO
it.skip('renders toggle events', async () => {
  const { getByTestId } = render(
    <FlagsProvider>
      <FeatureFlagsScreen />
    </FlagsProvider>,
  );

  const toggle = getByTestId('feature1');

  await act(() => {
    fireEvent.valueChange(toggle, false);
  });

  await wait();

  expect(toggle.props.value).toBe(false);
});

import { act, fireEvent, render, wait } from '@testing-library/react-native';
import React from 'react';

import { FlagsProvider } from '../../helpers/Flags';
import { FeatureFlagsScreen } from '../FeatureFlagToggles';

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

// TODO: issue in test lib: https://github.com/testing-library/native-testing-library/issues/46
// eslint-disable-next-line jest/no-disabled-tests
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

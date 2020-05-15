import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { getBuildtimeFlags } from '../../constants/flagsEnv';
import { FlagsProvider } from '../../helpers/Flags';
import { FeatureFlag } from '../FeatureFlag';

jest.mock('../../constants/flagsEnv', () => {
  return {
    getBuildtimeFlags: jest.fn(),
  };
});

it('renders feature if the flag is enabled', () => {
  getBuildtimeFlags.mockReturnValue({ feature1: true });

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('does not render if the flag is disabled', () => {
  getBuildtimeFlags.mockReturnValue({ feature1: false });

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature2'>
        <Text>feature2</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is missing', () => {
  getBuildtimeFlags.mockReturnValue({});
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature3'>
        <Text>feature3</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders the fallback instead, if the flag is disabled/omitted', () => {
  getBuildtimeFlags.mockReturnValue({ feature1: false });
  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature2' fallback={<Text>Old UI</Text>}>
        <Text>feature2</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

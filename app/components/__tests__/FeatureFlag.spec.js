import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import * as flagsEnv from '../../constants/flagsEnv';
import * as Flags from '../../helpers/Flags';
import { FeatureFlag } from '../FeatureFlag';

const { FlagsProvider } = Flags;

it('renders feature if the flag is enabled', () => {
  flagsEnv.buildTimeFlags = { feature1: true };

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
  flagsEnv.buildTimeFlags = { feature1: false };

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is missing', () => {
  flagsEnv.buildTimeFlags = {};

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders the fallback instead, if the flag is disabled/omitted', () => {
  flagsEnv.buildTimeFlags = {};

  const { asJSON } = render(
    <FlagsProvider>
      <FeatureFlag name='feature1' fallback={<Text>Old UI</Text>}>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

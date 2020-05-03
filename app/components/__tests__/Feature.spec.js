import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { FlagsProvider } from '../../helpers/flags';
import { Feature } from '../Feature';

it('renders feature if the flag is enabled', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{ feature1: true }}>
      <Feature name='feature1'>
        <Text>feature1</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('allows dotted notation in the feature name', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{ feature1: { child: true } }}>
      <Feature name='feature1.child'>
        <Text>feature1.child</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('does not render if dotted notation key path is falsy', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{ feature1: {} }}>
      <Feature name='feature1.child'>
        <Text>feature1.child</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is disabled', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{ feature1: false }}>
      <Feature name='feature1'>
        <Text>feature1</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is missing', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{}}>
      <Feature name='feature1'>
        <Text>feature1</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders the fallback instead, if the flag is disabled/omitted', () => {
  const { asJSON } = render(
    <FlagsProvider flags={{ feature1: false }}>
      <Feature name='feature1' fallback={() => <Text>Old UI</Text>}>
        <Text>feature1</Text>
      </Feature>
    </FlagsProvider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

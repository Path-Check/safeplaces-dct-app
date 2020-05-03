import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { FlagsContext } from '../../helpers/flags';
import { FeatureFlag } from '../Feature';

const mockSetFlags = jest.fn();

it('renders feature if the flag is enabled', () => {
  const mockFlags = { feature1: true };

  const { asJSON } = render(
    <FlagsContext.Provider value={[mockFlags, mockSetFlags]}>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsContext.Provider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('does not render if the flag value is falsy', () => {
  const mockFlags = { feature1: {} };
  const { asJSON } = render(
    <FlagsContext.Provider value={[mockFlags, mockSetFlags]}>
      <FeatureFlag name='feature1.child'>
        <Text>feature1.child</Text>
      </FeatureFlag>
    </FlagsContext.Provider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is disabled', () => {
  const mockFlags = { feature1: false };
  const { asJSON } = render(
    <FlagsContext.Provider value={[mockFlags, mockSetFlags]}>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsContext.Provider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('omits feature if the flag is missing', () => {
  const mockFlags = {};
  const { asJSON } = render(
    <FlagsContext.Provider value={[mockFlags, mockSetFlags]}>
      <FeatureFlag name='feature1'>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsContext.Provider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders the fallback instead, if the flag is disabled/omitted', () => {
  const mockFlags = { feature1: false };
  const { asJSON } = render(
    <FlagsContext.Provider value={[mockFlags, mockSetFlags]}>
      <FeatureFlag name='feature1' fallback={<Text>Old UI</Text>}>
        <Text>feature1</Text>
      </FeatureFlag>
    </FlagsContext.Provider>,
  );

  expect(asJSON()).toMatchSnapshot();
});

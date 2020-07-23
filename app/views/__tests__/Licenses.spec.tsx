import React from 'react';
import 'react-native';
import { render } from '../../test-utils/redux-provider';
import '@testing-library/jest-native/extend-expect';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { TracingStrategyProvider } from '../../TracingStrategyContext';
import { TracingStrategy } from '../../tracingStrategy';
import gpsStrategy from '../../gps';

import { LicensesScreen } from '../Licenses';
import { FeatureFlagOption } from '../../store/types';

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  return render(
    <TracingStrategyProvider strategy={strategy}>
      <LicensesScreen />
    </TracingStrategyProvider>,
    {
      initialState: {
        featureFlags: { flags: { [FeatureFlagOption.MOCK_EXPOSURE]: false } },
      },
    },
  );
};

jest.mock('@react-navigation/native');
(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() });

describe('LicensesScreen', () => {
  it('renders correctly', () => {
    const { asJSON } = renderTracingStrategyProvider(gpsStrategy);
    expect(asJSON()).toMatchSnapshot();
  });

  describe('when the tracing strategy is gps', () => {
    it('displays PathCheck GPS', () => {
      const { getByTestId } = renderTracingStrategyProvider(gpsStrategy);

      expect(getByTestId('licenses-legal-header')).toHaveTextContent(
        'PathCheck GPS',
      );
    });
  });
});

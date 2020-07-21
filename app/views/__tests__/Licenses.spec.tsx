import React from 'react';
import 'react-native';
import { render } from '../../test-utils/redux-provider';
import '@testing-library/jest-native/extend-expect';

import { TracingStrategyProvider } from '../../TracingStrategyContext';
import { TracingStrategy } from '../../tracingStrategy';
import gpsStrategy from '../../gps';
import btStrategy from '../../bt';

import { LicensesScreen } from '../Licenses';
import { FeatureFlagOption } from '../../store/types';

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  return render(
    <TracingStrategyProvider strategy={strategy}>
      <LicensesScreen />
    </TracingStrategyProvider>,
    {
      initialState: {
        featureFlags: { flags: { [FeatureFlagOption.EXPOSURE_MODE]: false } },
      },
    },
  );
};

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

  describe('when the tracing strategy is bt', () => {
    it('displays PathCheck BT', () => {
      const { getByTestId } = renderTracingStrategyProvider(btStrategy);

      expect(getByTestId('licenses-legal-header')).toHaveTextContent(
        'PathCheck BT',
      );
    });
  });
});

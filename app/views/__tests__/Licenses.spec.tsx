import React from 'react';
import 'react-native';
import { render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { TracingStrategyProvider } from '../../TracingStrategyContext';
import gpsStrategy from '../../gps';
import btStrategy from '../../bt';

import { LicensesScreen } from '../Licenses';

jest.mock('@react-navigation/native');
(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() });

describe('LicensesScreen', () => {
  it('renders correctly', () => {
    const { asJSON } = render(
      <TracingStrategyProvider strategy={gpsStrategy}>
        <LicensesScreen />
      </TracingStrategyProvider>,
    );

    expect(asJSON()).toMatchSnapshot();
  });

  describe('when the tracing strategy is gps', () => {
    it('displays PathCheck GPS', () => {
      const { getByTestId } = render(
        <TracingStrategyProvider strategy={gpsStrategy}>
          <LicensesScreen />
        </TracingStrategyProvider>,
      );

      expect(getByTestId('licenses-legal-header')).toHaveTextContent(
        'PathCheck GPS',
      );
    });
  });

  describe('when the tracing strategy is bt', () => {
    it('displays PathCheck BT', () => {
      const { getByTestId } = render(
        <TracingStrategyProvider strategy={btStrategy}>
          <LicensesScreen />
        </TracingStrategyProvider>,
      );

      expect(getByTestId('licenses-legal-header')).toHaveTextContent(
        'PathCheck BT',
      );
    });
  });
});

import { act, render } from '@testing-library/react-native';
import React from 'react';

// import { config } from '../../../COVIDSafePathsConfig';
import * as useGpsTrackingStatus from '../../../services/hooks/useGpsTrackingStatus';
import { LocationTrackingStatus } from '../LocationTrackingStatus';

jest.useFakeTimers();

describe('<LocationTrackingStatus />', () => {
  describe('when contact tracing strategy is not GPS', () => {
    jest.mock('../../../COVIDSafePathsConfig', () => ({
      config: {
        tracingStrategy: '',
      },
    }));

    it('does not render', () => {
      const { asJSON } = render(<LocationTrackingStatus />);
      expect(asJSON()).toMatchSnapshot();
    });
  });

  describe('when contact tracing strategy is GPS', () => {
    jest.mock('../../../COVIDSafePathsConfig', () => ({
      config: {
        tracingStrategy: 'gps',
      },
    }));

    it('renders a <LocationStatusSwitch /> if hasPermission', async () => {
      jest
        .spyOn(useGpsTrackingStatus, 'useGpsTrackingStatus')
        .mockReturnValueOnce([
          {
            reason: 'ALL_CONDITIONS_MET',
            canTrack: true,
          },
          jest.fn(),
        ]);

      const { asJSON } = render(<LocationTrackingStatus />);

      await act(async () => {
        jest.runAllTimers();
      });

      await expect(asJSON()).toMatchSnapshot();
    });
    it('renders a <EnableLocationButton /> if isMissingPermission', () => {});
  });
});

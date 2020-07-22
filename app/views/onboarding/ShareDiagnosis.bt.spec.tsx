import React, { FunctionComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import { render, cleanup, fireEvent } from '../../test-utils/redux-provider';
import '@testing-library/jest-native/extend-expect';

import { TracingStrategyProvider } from '../../TracingStrategyContext';
import ShareDiagnosis from './ShareDiagnosis';
import { Screens } from '../../navigation';
import { isPlatformiOS } from '../../Util';
import gpsStrategy from '../../gps';
import { FeatureFlagOption } from '../../store/types';

afterEach(cleanup);

jest.mock('@react-navigation/native');
jest.mock('../../Util');
jest.mock('../../COVIDSafePathsConfig', () => ({ isGPS: false }));

describe('Home', () => {
  describe('When tracing strategy is BT', () => {
    describe('and platform is Android', () => {
      it('navigates next to Enable Exposure Notfications ', () => {
        const navigateMock = jest.fn();

        (useNavigation as jest.Mock).mockReturnValue({
          navigate: navigateMock,
        });
        (isPlatformiOS as jest.Mock).mockReturnValue(false);

        const { getByLabelText } = render(<BTWrapper />, {
          initialState: {
            featureFlags: {
              flags: { [FeatureFlagOption.MOCK_EXPOSURE]: false },
            },
          },
        });

        const button = getByLabelText('Set up my phone');
        fireEvent.press(button);

        expect(navigateMock).toHaveBeenCalledWith(
          Screens.EnableExposureNotifications,
        );
      });
    });

    describe('and platform is iOS', () => {
      it('navigates next to BT Notification Permissions', () => {
        const navigateMock = jest.fn();

        (useNavigation as jest.Mock).mockReturnValue({
          navigate: navigateMock,
        });
        (isPlatformiOS as jest.Mock).mockReturnValue(true);
        const { getByLabelText } = render(<BTWrapper />, {
          initialState: {
            featureFlags: {
              flags: { [FeatureFlagOption.MOCK_EXPOSURE]: false },
            },
          },
        });

        const button = getByLabelText('Set up my phone');
        fireEvent.press(button);

        expect(navigateMock).toHaveBeenCalledWith(
          Screens.NotificationPermissionsBT,
        );
      });
    });
  });
});

const BTWrapper: FunctionComponent = () => {
  return (
    <TracingStrategyProvider strategy={gpsStrategy}>
      <ShareDiagnosis />
    </TracingStrategyProvider>
  );
};

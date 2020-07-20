import React from 'react';
import { Alert, Platform } from 'react-native';
import {
  render,
  cleanup,
  wait,
  fireEvent,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import { ENPermissionStatus } from '../PermissionsContext';
import Home from './Home';

afterEach(cleanup);

describe('Home', () => {
  describe('When the enPermissionStatus is enabled and authorized', () => {
    it('renders a notifications are enabled message', () => {
      const enPermissionStatus: ENPermissionStatus = ['AUTHORIZED', 'ENABLED'];
      const requestPermission = jest.fn();

      const { getByTestId, queryByTestId } = render(
        <Home
          enPermissionStatus={enPermissionStatus}
          requestPermission={requestPermission}
        />,
      );

      const header = getByTestId('home-header');
      const subheader = getByTestId('home-subheader');
      const button = queryByTestId('home-request-permissions-button');

      expect(header).toHaveTextContent('PathCheck');
      expect(subheader).toHaveTextContent('Exposure notifications are on');
      expect(button).toBeNull();
    });
  });

  describe('When the enPermissionStatus is not enabled', () => {
    describe('when the enPermissionStatus is not authorized', () => {
      it('displays an alert dialog if exposure notifications are not authorized', async () => {
        const enPermissionStatus: ENPermissionStatus = [
          'UNAUTHORIZED',
          'DISABLED',
        ];
        const requestPermission = jest.fn();
        const alert = jest.spyOn(Alert, 'alert');

        const { getByTestId } = render(
          <Home
            enPermissionStatus={enPermissionStatus}
            requestPermission={requestPermission}
          />,
        );
        const button = getByTestId('home-request-permissions-button');

        fireEvent.press(button);
        await wait(() => {
          if (Platform.OS === 'ios') {
            expect(alert).toHaveBeenCalled();
          } else {
            expect(alert).not.toHaveBeenCalled();
          }
        });
      });
    });

    it('it renders a notification are not enabled message', () => {
      const enPermissionStatus: ENPermissionStatus = ['AUTHORIZED', 'DISABLED'];
      const requestPermission = jest.fn();

      const { getByTestId } = render(
        <Home
          enPermissionStatus={enPermissionStatus}
          requestPermission={requestPermission}
        />,
      );

      const header = getByTestId('home-header');
      const subheader = getByTestId('home-subheader');

      expect(header).toHaveTextContent('Exposure Notifications Disabled');
      expect(subheader).toHaveTextContent(
        'Enable Exposure Notifications to receive information about possible exposures',
      );
    });

    it('it renders an Enable Notifications button which requests permissions', async () => {
      const enPermissionStatus: ENPermissionStatus = ['AUTHORIZED', 'DISABLED'];
      const requestPermission = jest.fn();

      const { getByTestId } = render(
        <Home
          enPermissionStatus={enPermissionStatus}
          requestPermission={requestPermission}
        />,
      );
      const button = getByTestId('home-request-permissions-button');

      fireEvent.press(button);
      await wait(() => {
        expect(requestPermission).toHaveBeenCalled();
      });
    });
  });
});

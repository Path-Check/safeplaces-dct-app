import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import * as permissions from 'react-native-permissions';

import { UnknownPage } from '../UnknownPage';

let settingsURLSpy;

beforeEach(() => {
  settingsURLSpy = jest
    .spyOn(permissions, 'openSettings')
    .mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  settingsURLSpy.mockRestore();
});

describe('UnknowPage', () => {
  describe('when the tracing strategy is bte', () => {
    it('the enable bluetooth button opens the settings screen', () => {
      const { getByLabelText } = render(
        <UnknownPage tracingStrategy={'bte'} />,
      );

      const button = getByLabelText('Enable Bluetooth');
      fireEvent.press(button);

      expect(settingsURLSpy).toHaveBeenCalled();
    });
  });

  describe('when the tracing strategy is gps', () => {
    describe('and the permissions are unknown', () => {
      it('it matches the snapshot', () => {
        const { asJSON } = render(<UnknownPage tracingStrategy={'gps'} />);

        expect(asJSON()).toMatchSnapshot();
      });

      it('the enable location button opens the settings screen', () => {
        const { getByLabelText } = render(
          <UnknownPage tracingStrategy={'gps'} />,
        );

        const button = getByLabelText('Enable Location Data');
        fireEvent.press(button);

        expect(settingsURLSpy).toHaveBeenCalled();
      });
    });
  });
});

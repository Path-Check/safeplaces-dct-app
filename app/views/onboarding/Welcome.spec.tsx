import React from 'react';
import {
  render,
  cleanup,
  wait,
  fireEvent,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import WelcomeScreen from './Welcome';

afterEach(cleanup);

describe('WelcomeScreen', () => {
  it('renders correctly', () => {
    const { asJSON } = render(<WelcomeScreen />);

    expect(asJSON()).toMatchSnapshot();
  });

  describe('when the user checks the eula checkbox', () => {
    it('allows the user to proceed', async () => {
      const { getByTestId } = render(<WelcomeScreen />);

      const checkbox = getByTestId('welcome-eula-checkbox');
      const getStartedButton = getByTestId('welcome-button');

      expect(getStartedButton).toBeDisabled();

      fireEvent.press(checkbox);

      await wait(() => {
        expect(getStartedButton).not.toBeDisabled();
      });
    });
  });
});

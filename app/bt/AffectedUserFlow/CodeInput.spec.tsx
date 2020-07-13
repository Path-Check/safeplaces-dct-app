import React from 'react';
import {
  cleanup,
  render,
  fireEvent,
  wait,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import { useNavigation } from '@react-navigation/native';

import CodeInputScreen from './CodeInput';
import { AffectedUserProvider } from './AffectedUserContext';
import * as API from './verificationAPI';
import { Screens } from '../../navigation';

afterEach(cleanup);

jest.mock('@react-navigation/native');
(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
describe('CodeInputScreen', () => {
  it('initializes with an empty code form', () => {
    const { getByTestId } = render(
      <AffectedUserProvider>
        <CodeInputScreen />
      </AffectedUserProvider>,
    );

    expect(getByTestId('affected-user-code-input-screen')).not.toBeNull();
    expect(getByTestId('code-input')).toHaveTextContent('');
  });

  describe('on a successful code verification', () => {
    it('navigates to the affected user publish consent', async () => {
      const navigateSpy = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy });
      const successTokenResponse = {
        kind: 'success' as const,
        body: {
          token: 'token',
          error: '',
          testDate: 'testDate',
          testType: 'testType',
        },
      };
      const apiSpy = jest
        .spyOn(API, 'postVerificationCode')
        .mockResolvedValue(successTokenResponse);
      const code = '12345678';

      const { getByTestId, getByLabelText } = render(
        <AffectedUserProvider>
          <CodeInputScreen />
        </AffectedUserProvider>,
      );
      fireEvent.changeText(getByTestId('code-input'), code);
      fireEvent.press(getByLabelText('Submit'));

      await wait(() => {
        expect(apiSpy).toHaveBeenCalledWith(code);
        expect(navigateSpy).toHaveBeenCalledWith(
          Screens.AffectedUserPublishConsent,
        );
      });
    });
  });

  describe('validates the verification code', () => {
    it('informs of an invalid code error', async () => {
      const error = 'InvalidCode' as const;
      const wrongTokenResponse = {
        kind: 'failure' as const,
        error,
      };
      jest
        .spyOn(API, 'postVerificationCode')
        .mockResolvedValueOnce(wrongTokenResponse);

      const { getByTestId, getByLabelText, getByText } = render(
        <AffectedUserProvider>
          <CodeInputScreen />
        </AffectedUserProvider>,
      );
      fireEvent.changeText(getByTestId('code-input'), '12345678');
      fireEvent.press(getByLabelText('Submit'));

      await wait(() => {
        expect(getByText('Try a different code')).toBeDefined();
      });
    });

    it('informs of a used verification code', async () => {
      const error = 'VerificationCodeUsed' as const;
      const wrongTokenResponse = {
        kind: 'failure' as const,
        error,
      };
      jest
        .spyOn(API, 'postVerificationCode')
        .mockResolvedValueOnce(wrongTokenResponse);

      const { getByTestId, getByLabelText, getByText } = render(
        <AffectedUserProvider>
          <CodeInputScreen />
        </AffectedUserProvider>,
      );
      fireEvent.changeText(getByTestId('code-input'), '12345678');
      fireEvent.press(getByLabelText('Submit'));

      await wait(() => {
        expect(
          getByText('Verification code has already been used'),
        ).toBeDefined();
      });
    });

    it('informs of an unknown error', async () => {
      const error = 'Unknown' as const;
      const wrongTokenResponse = {
        kind: 'failure' as const,
        error,
      };
      jest
        .spyOn(API, 'postVerificationCode')
        .mockResolvedValueOnce(wrongTokenResponse);

      const { getByTestId, getByLabelText, getByText } = render(
        <AffectedUserProvider>
          <CodeInputScreen />
        </AffectedUserProvider>,
      );
      fireEvent.changeText(getByTestId('code-input'), '12345678');
      fireEvent.press(getByLabelText('Submit'));

      await wait(() => {
        expect(getByText('Try a different code')).toBeDefined();
      });
    });
  });
});

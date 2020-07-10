import React from 'react';
import {
  cleanup,
  render,
  fireEvent,
  wait,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import CodeInputScreen from './CodeInput';
import { AffectedUserProvider } from './AffectedUserContext';
import * as API from './verificationAPI';

afterEach(cleanup);

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

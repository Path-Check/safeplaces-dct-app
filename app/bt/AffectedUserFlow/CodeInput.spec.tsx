import React from 'react';
import { cleanup, render } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

import CodeInputScreen from './CodeInput';
import { AffectedUserProvider } from './AffectedUserContext';

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
});

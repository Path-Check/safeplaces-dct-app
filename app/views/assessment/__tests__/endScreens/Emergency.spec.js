import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../locales/languages';
import { AssessmentNavigationContext } from '../../Context';
import { Emergency } from '../../endScreens/Emergency';

test('base', () => {
  const { asJSON } = render(<Emergency />, { wrapper: Wrapper });
  expect(asJSON()).toMatchSnapshot();
});

test('cta', () => {
  let openURL = jest.fn();
  jest.doMock('react-native/Libraries/Linking/Linking', () => ({
    openURL: openURL,
  }));
  const { getByTestId } = render(<Emergency />, {
    wrapper: Wrapper,
  });
  const cta = getByTestId('assessment-button');
  fireEvent.press(cta);
  expect(openURL).toHaveBeenCalledWith('tel://911');
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AssessmentNavigationContext.Provider value={{}}>{children}</AssessmentNavigationContext.Provider>
    </I18nextProvider>
  );
}

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../locales/languages';
import { MetaContext } from '../AssessmentContext';
import AssessmentEndEmergency from '../AssessmentEndEmergency';

test('base', () => {
  const { asJSON } = render(<AssessmentEndEmergency />, { wrapper: Wrapper });
  expect(asJSON()).toMatchSnapshot();
});

test('cta', () => {
  let openURL = jest.fn();
  jest.doMock('react-native/Libraries/Linking/Linking', () => ({
    openURL: openURL,
  }));
  const { getByTestId } = render(<AssessmentEndEmergency />, {
    wrapper: Wrapper,
  });
  const cta = getByTestId('assessment-button');
  fireEvent.press(cta);
  expect(openURL).toHaveBeenCalledWith('tel:911');
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MetaContext.Provider value={{}}>{children}</MetaContext.Provider>
    </I18nextProvider>
  );
}

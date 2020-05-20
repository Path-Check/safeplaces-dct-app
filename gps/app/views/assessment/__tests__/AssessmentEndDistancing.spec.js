import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../locales/languages';
import { MetaContext } from '../AssessmentContext';
import AssessmentEndDistancing from '../AssessmentEndDistancing';

test('base', () => {
  const { asJSON } = render(<AssessmentEndDistancing />, { wrapper: Wrapper });
  expect(asJSON()).toMatchSnapshot();
});

test('cta', () => {
  const push = jest.fn();
  const { getByTestId } = render(
    <AssessmentEndDistancing navigation={{ push }} />,
    { wrapper: Wrapper },
  );
  const cta = getByTestId('assessment-button');
  fireEvent.press(cta);
  expect(push).toHaveBeenCalledWith('MyRoute');
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MetaContext.Provider value={{ completeRoute: 'MyRoute' }}>
        {children}
      </MetaContext.Provider>
    </I18nextProvider>
  );
}

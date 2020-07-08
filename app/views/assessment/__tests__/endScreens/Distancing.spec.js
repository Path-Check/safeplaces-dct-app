import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../locales/languages';
import { AssessmentNavigationContext } from '../../Context';
import { Distancing } from '../../endScreens/Distancing';

test('base', () => {
  const { asJSON } = render(<Distancing />, { wrapper: Wrapper });
  expect(asJSON()).toMatchSnapshot();
});

test('cta', () => {
  const push = jest.fn();
  const { getByTestId } = render(<Distancing navigation={{ push }} />, {
    wrapper: Wrapper,
  });
  const cta = getByTestId('assessment-button');
  fireEvent.press(cta);
  expect(push).toHaveBeenCalledWith('MyRoute');
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AssessmentNavigationContext.Provider
        value={{ completeRoute: 'MyRoute' }}>
        {children}
      </AssessmentNavigationContext.Provider>
    </I18nextProvider>
  );
}

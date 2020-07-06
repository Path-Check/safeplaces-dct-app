import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../locales/languages';
import { AssessmentNavigationContext } from '../../Context';
import { AssessmentComplete } from '../../endScreens/AssessmentComplete';

let meta;

beforeEach(() => {
  meta = {
    completeRoute: 'MyRoute',
  };
});

test('base', () => {
  const { asJSON } = render(<AssessmentComplete />, { wrapper: Wrapper });
  expect(asJSON()).toMatchSnapshot();
});

test('cta', () => {
  const dismiss = jest.fn();
  meta.dismiss = dismiss;
  const { getByTestId } = render(<AssessmentComplete />, {
    wrapper: Wrapper,
  });
  const cta = getByTestId('assessment-button');
  fireEvent.press(cta);
  expect(dismiss).toHaveBeenCalled();
});

function Wrapper({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <AssessmentNavigationContext.Provider value={meta}>{children}</AssessmentNavigationContext.Provider>
    </I18nextProvider>
  );
}

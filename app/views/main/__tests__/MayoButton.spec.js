import 'react-native';

import { act, render } from '@testing-library/react-native';
import React from 'react';

import { setUserLocaleOverride } from '../../../locales/languages';
import { MayoButton } from '../MayoButton';

it('does not render when the language is not english', async () => {
  await act(async () => {
    await setUserLocaleOverride('es');
  });

  const { asJSON } = render(<MayoButton />);

  expect(asJSON()).toMatchSnapshot();
});

it('renders when the language is english', async () => {
  await act(async () => {
    await setUserLocaleOverride('en');
  });

  const { asJSON } = render(<MayoButton />);

  expect(asJSON()).toMatchSnapshot();
});

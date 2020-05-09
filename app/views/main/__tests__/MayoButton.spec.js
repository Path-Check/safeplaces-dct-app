import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';

import { setUserLocaleOverride } from '../../../locales/languages';
import { MayoButton } from '../MayoButton';

let mayoClinicURLSpy;

beforeEach(() => {
  mayoClinicURLSpy = jest
    .spyOn(Linking, 'openURL')
    .mockImplementation(() => Promise.resolve());
});

afterEach(() => {
  mayoClinicURLSpy.mockRestore();
});

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

it('open mayo clinic url with label', async () => {
  await act(async () => {
    await setUserLocaleOverride('en');
  });
  const { getByTestId } = render(<MayoButton />);

  const button = getByTestId('MayoLinkLabel');
  fireEvent.press(button);

  expect(mayoClinicURLSpy).toHaveBeenCalled();
});

it('open mayo clinic url with heading', async () => {
  await act(async () => {
    await setUserLocaleOverride('en');
  });
  const { getByTestId } = render(<MayoButton />);

  const button = getByTestId('MayoLinkHeading');
  fireEvent.press(button);

  expect(mayoClinicURLSpy).toHaveBeenCalled();
});

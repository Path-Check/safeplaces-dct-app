import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { Info } from '../Info';

test('base', () => {
  const { asJSON, queryByTestId } = render(
    <Info image={{ uri: 'image.png' }} title='End' />,
  );
  expect(asJSON()).toMatchSnapshot();
  expect(queryByTestId('cta')).toBe(null);
});

test('children', () => {
  const { getByTestId } = render(
    <Info image={{ uri: 'image.png' }} title='End'>
      <View testID='children' />
    </Info>,
  );
  expect(getByTestId('children')).toBeTruthy();
});

test('cta', () => {
  const { getByTestId } = render(
    <Info ctaTitle='Next' image={{ uri: 'image.png' }} title='End' />,
  );
  expect(getByTestId('assessment-button')).toBeTruthy();
});

test('description', () => {
  const { getByTestId } = render(
    <Info description='Hello' image={{ uri: 'image.png' }} title='End' />,
  );
  expect(getByTestId('description')).toBeTruthy();
});

test('footer', () => {
  const { getByTestId } = render(
    <Info
      footer={<View testID='footer' />}
      image={{ uri: 'image.png' }}
      title='End'
    />,
  );
  expect(getByTestId('footer')).toBeTruthy();
});

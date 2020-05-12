import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import AssessmentEnd from '../AssessmentEnd';

test('base', () => {
  const { asJSON, queryByTestId } = render(
    <AssessmentEnd image={{ uri: 'image.png' }} title='End' />,
  );
  expect(asJSON()).toMatchSnapshot();
  expect(queryByTestId('cta')).toBe(null);
});

test('children', () => {
  const { getByTestId } = render(
    <AssessmentEnd image={{ uri: 'image.png' }} title='End'>
      <View testID='children' />
    </AssessmentEnd>,
  );
  expect(getByTestId('children')).toBeTruthy();
});

test('cta', () => {
  const { getByTestId } = render(
    <AssessmentEnd ctaTitle='Next' image={{ uri: 'image.png' }} title='End' />,
  );
  expect(getByTestId('assessment-button')).toBeTruthy();
});

test('description', () => {
  const { getByTestId } = render(
    <AssessmentEnd
      description='Hello'
      image={{ uri: 'image.png' }}
      title='End'
    />,
  );
  expect(getByTestId('description')).toBeTruthy();
});

test('footer', () => {
  const { getByTestId } = render(
    <AssessmentEnd
      footer={<View testID='footer' />}
      image={{ uri: 'image.png' }}
      title='End'
    />,
  );
  expect(getByTestId('footer')).toBeTruthy();
});

test('pretitle', () => {
  const { getByTestId } = render(
    <AssessmentEnd
      image={{ uri: 'image.png' }}
      pretitle={<View testID='pretitle' />}
      title='End'
    />,
  );
  expect(getByTestId('pretitle')).toBeTruthy();
});

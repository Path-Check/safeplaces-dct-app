import { render } from '@testing-library/react-native';
import React from 'react';

import AssessmentButton from '../AssessmentButton';

test('base', () => {
  const { asJSON } = render(<AssessmentButton title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

test('disabled', () => {
  const { asJSON } = render(<AssessmentButton disabled title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

test('color', () => {
  const { asJSON } = render(<AssessmentButton color='red' title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

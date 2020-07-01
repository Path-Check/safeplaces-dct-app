import { render } from '@testing-library/react-native';
import React from 'react';

import { Button } from '../components/Button';

test('base', () => {
  const { asJSON } = render(<Button title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

test('disabled', () => {
  const { asJSON } = render(<Button disabled title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

test('color', () => {
  const { asJSON } = render(<Button color='red' title='Next' />);
  expect(asJSON()).toMatchSnapshot();
});

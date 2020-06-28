import { render } from '@testing-library/react-native';
import React from 'react';

import { Button } from '../Button';

const svg = `<g />`;

it('renders', () => {
  const { asJSON } = render(<Button label='Default' />);

  expect(asJSON()).toMatchSnapshot();
});

it('allows small override', () => {
  const { asJSON } = render(<Button small label='Small' />);

  expect(asJSON()).toMatchSnapshot();
});

it('renders different color for secondary', () => {
  const { asJSON } = render(<Button label='Button' secondary />);

  expect(asJSON()).toMatchSnapshot();
});

it('renders an icon and space-between if supplied', () => {
  const { asJSON } = render(<Button label='Button' icon={svg} />);

  expect(asJSON()).toMatchSnapshot();
});

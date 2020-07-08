import { render } from '@testing-library/react-native';
import React from 'react';

import { IconButton } from '../IconButton';

const svg = `<g />`;

it('renders the icon in a touchable opacity', () => {
  const { asJSON } = render(
    <IconButton icon={svg} accessibilityLabel='Label' />,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('allows size override', () => {
  const { asJSON } = render(<IconButton icon={svg} size={48} />);

  expect(asJSON()).toMatchSnapshot();
});

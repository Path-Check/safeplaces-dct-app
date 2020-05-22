import { render } from '@testing-library/react-native';
import React from 'react';

import { Theme } from '../../constants/themes';
import { IconButton } from '../IconButton';

const svg = `<g />`;

it('renders the icon in a touchable opacity', () => {
  const { asJSON } = render(
    <Theme>
      <IconButton icon={svg} accessibilityLabel='Label' />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('allows size override', () => {
  const { asJSON } = render(
    <Theme>
      <IconButton icon={svg} size={48} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders different color for secondary', () => {
  const { asJSON } = render(
    <Theme>
      <IconButton icon={svg} secondary />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('changes color based on theme', () => {
  const { asJSON } = render(
    <>
      <Theme use='charcoal'>
        <IconButton icon={svg} label='charcoal' />
      </Theme>
      <Theme use='default'>
        <IconButton icon={svg} label='default' />
      </Theme>
    </>,
  );

  expect(asJSON()).toMatchSnapshot();
});

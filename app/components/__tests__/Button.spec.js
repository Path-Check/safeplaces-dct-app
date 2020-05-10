import { render } from '@testing-library/react-native';
import React from 'react';

import { Theme } from '../../constants/themes';
import { Button } from '../Button';

const svg = `<g />`;

it('renders a violet 72px button on default theme', () => {
  const { asJSON } = render(
    <Theme>
      <Button label='Default' />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('allows small override', () => {
  const { asJSON } = render(
    <Theme>
      <Button small label='Small' />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders different color for secondary', () => {
  const { asJSON } = render(
    <Theme>
      <Button label='Button' secondary />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('renders an icon and space-between if supplied', () => {
  const { asJSON } = render(
    <Theme>
      <Button label='Button' icon={svg} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('changes color based on theme', () => {
  const { asJSON } = render(
    <>
      <Theme use='default'>
        <Button label='onDefault' />
      </Theme>
      <Theme use='charcoal'>
        <Button label='onCharcoal' />
      </Theme>
      <Theme use='violet'>
        <Button label='onViolet' />
      </Theme>
    </>,
  );

  expect(asJSON()).toMatchSnapshot();
});

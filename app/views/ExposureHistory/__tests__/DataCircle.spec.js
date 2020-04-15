import { render } from '@testing-library/react-native';
import React from 'react';

import { Theme } from '../../../constants/themes';
import { DataCircle, Risk } from '../DataCircle';

it('possible exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <DataCircle riskLevel={Risk.Possible} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('no exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <DataCircle riskLevel={Risk.None} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('unknown exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <DataCircle riskLevel={Risk.Unknown} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('today matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <DataCircle riskLevel={Risk.Today} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('size is configurable (snapshot)', () => {
  const { asJSON } = render(
    <Theme>
      <DataCircle size={24} riskLevel={Risk.Today} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

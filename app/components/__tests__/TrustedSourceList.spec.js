import { render } from '@testing-library/react-native';
import React from 'react';

import { TrustedSourceList } from '../TrustedSourceList';

const trustedSourceList = [
  { first: [{ url: '' }, { bound: '' }] },
  { second: [{ url: '' }, { bound: '' }] },
];
const selected = [{ first: [{ url: '' }, { bound: '' }] }];

it('renders trusted source list', () => {
  const { asJSON } = render(
    <TrustedSourceList
      authoritiesList={trustedSourceList}
      selectedAuthorities={selected}
    />,
  );

  expect(asJSON()).toMatchSnapshot();
});

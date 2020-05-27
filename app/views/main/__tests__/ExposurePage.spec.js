import { render } from '@testing-library/react-native';
import React from 'react';

import { ExposurePage } from '../ExposurePage';

it('may be exposed matches snapshot', () => {
  const { asJSON } = render(<ExposurePage />);

  expect(asJSON()).toMatchSnapshot();
});

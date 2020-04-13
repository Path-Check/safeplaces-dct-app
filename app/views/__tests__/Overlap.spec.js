import React from 'react';
import {render} from '@testing-library/react-native';
import Overlap from '../Overlap';

it('renders correctly', () => {
  const {asJSON} = render(<Overlap />);

  expect(asJSON()).toMatchSnapshot();
});

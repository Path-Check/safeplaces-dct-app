import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import Licenses from '../Licenses';

it('renders correctly', () => {
  const {asJSON} = render(<Licenses />);

  expect(asJSON()).toMatchSnapshot();
});

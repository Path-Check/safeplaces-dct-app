/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {render} from '@testing-library/react-native';

jest.mock('../app/Entry', () => 'Entry');

it('renders correctly', () => {
  const {asJSON} = render(<App />);

  expect(asJSON()).toMatchSnapshot();
});

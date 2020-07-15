/**
 * @format
 */

import 'react-native';
import 'isomorphic-fetch';

import { render } from '@testing-library/react-native';
import React from 'react';

import { UnconnectedApp } from '../App';

jest.mock('../app/Entry', () => ({ Entry: 'Entry' }));

it('renders correctly', () => {
  const { asJSON } = render(<UnconnectedApp />);

  expect(asJSON()).toMatchSnapshot();
});

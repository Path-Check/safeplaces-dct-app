import React from 'react';
import { render } from '@testing-library/react-native';

import HomeScreen from './index';

describe('HomeScreen', () => {
  it('renders', () => {
    const { asJSON } = render(<HomeScreen />);

    expect(asJSON()).toMatchSnapshot();
  });
});

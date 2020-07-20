import React from 'react';
import { render } from '@testing-library/react-native';
import { useFocusEffect } from '@react-navigation/native';

import HomeScreen from './index';

jest.mock('@react-navigation/native');
(useFocusEffect as jest.Mock).mockReturnValue(jest.fn());

describe('HomeScreen', () => {
  it('renders', () => {
    const { asJSON } = render(<HomeScreen />);

    expect(asJSON()).toMatchSnapshot();
  });
});

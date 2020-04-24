import { render } from '@testing-library/react-native';
import React from 'react';

import { ExportScreen } from '../Export';

describe('<ExportScreen />', () => {
  it('renders correctly', () => {
    const { asJSON } = render(<ExportScreen />);
    expect(asJSON()).toMatchSnapshot();
  });
});

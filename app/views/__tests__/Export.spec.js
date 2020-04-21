import { render } from '@testing-library/react-native';
import React from 'react';

import { ExportScreen } from '../Export';

describe('<Export />', () => {
  it('renders correctly', () => {
    const { asJSON } = render(<ExportScreen />);
    expect(asJSON()).toMatchSnapshot();
  });
});

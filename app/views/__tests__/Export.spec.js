import { TouchableOpacity } from 'react-native';
import React from 'react';
import renderer, { create } from 'react-test-renderer';
import Export from '../Export';

describe('<Export />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Export />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

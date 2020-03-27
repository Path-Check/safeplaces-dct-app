import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Export from '../Export';

it('renders correctly', () => {
  const tree = renderer
    .create(<Export />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

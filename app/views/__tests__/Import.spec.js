import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Import from '../Import';

it('renders correctly', () => {
  const tree = renderer
    .create(<Import />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

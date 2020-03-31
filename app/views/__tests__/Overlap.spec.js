import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Overlap from '../Overlap';

it('renders correctly', () => {
  const tree = renderer
    .create(<Overlap />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

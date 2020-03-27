import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Licenses from '../Licenses';

it('renders correctly', () => {
  const tree = renderer
    .create(<Licenses />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

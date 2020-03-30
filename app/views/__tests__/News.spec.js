import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import News from '../News';

it('renders correctly', () => {
  const tree = renderer
    .create(<News />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

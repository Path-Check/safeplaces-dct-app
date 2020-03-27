import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LocationTracking from '../LocationTracking';

it('renders correctly', () => {
  const tree = renderer
    .create(<LocationTracking />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

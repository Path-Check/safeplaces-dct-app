jest.spyOn(console, 'log').mockImplementationOnce(() => {});
jest.mock('../../helpers/__mocks__/General');

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Welcome from '../Welcome';

it('renders correctly', () => {
  const tree = renderer
    .create(<Welcome />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

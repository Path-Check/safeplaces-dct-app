jest.spyOn(console, 'log').mockImplementationOnce(() => {});

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Import from '../Import';

const navigationMock = {
  goBack: jest.fn()
};

it('renders correctly', () => {
  const tree = renderer
    .create(<Import navigation={navigationMock} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

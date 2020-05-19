import * as React from 'react';
import renderer from 'react-test-renderer';

import { MonoText } from '../StyledText';

it(`renders correctly`, () => {
  const text = 'Snapshot test!';
  const tree = renderer.create(<MonoText>{text}</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});

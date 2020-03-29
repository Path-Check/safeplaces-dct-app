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

  describe('Share button', () => {
    it('should be disabled if not data is in the log', () => {
      const component = create(<Export />);
      const instance = component.root;
      const shareButton = instance.findAllByType(TouchableOpacity)[1];
      expect(shareButton.props.disabled).toBeTruthy();
    });

    it('should be disabled if not data is in the log', () => {
      const component = create(<Export shareButtonDisabled={false} />);
      const instance = component.root;
      const shareButton = instance.findAllByType(TouchableOpacity)[1];
      expect(shareButton.props.disabled).toBeFalsy();
    });
  })
});

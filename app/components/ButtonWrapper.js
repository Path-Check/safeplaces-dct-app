import * as React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
const width = Dimensions.get('window').width;
import FontWeights from '../constants/fontWeights';
import Button from './Button';

class ButtonWrapper extends React.Component<Props> {
  render() {
    return (
      <View style={styles.buttonContainer}>
        <Button titleStyle={styles.primaryButtonText} {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  primaryButtonText: {
    fontWeight: FontWeights.BOLD,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.7,
    alignSelf: 'center',
  },
});

export default ButtonWrapper;

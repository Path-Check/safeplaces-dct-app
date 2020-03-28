import * as React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
const width = Dimensions.get('window').width;
import FontWeights from '../constants/fontWeights';
import Button from './Button';
import PropTypes from 'prop-types';

class ButtonWrapper extends React.Component {
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

ButtonWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
  toBgColor: PropTypes.string,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
};

export default ButtonWrapper;

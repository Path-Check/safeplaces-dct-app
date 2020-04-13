import PropTypes from 'prop-types';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import fontFamily from '../constants/fonts';
import Button from './Button';

const width = Dimensions.get('window').width;

class ButtonWrapper extends React.Component {
  render() {
    const additionalStyle = {};
    if (this.props.buttonWidth) {
      additionalStyle.width = this.props.buttonWidth;
    }
    return (
      <View style={[styles.buttonContainer, additionalStyle]}>
        <Button titleStyle={styles.primaryButtonText} {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  primaryButtonText: {
    fontFamily: fontFamily.primarySemiBold,
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.8,
    alignSelf: 'center',
  },
});

ButtonWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
  bgColor: PropTypes.string.isRequired,
  toBgColor: PropTypes.string,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  borderColor: PropTypes.string,
  buttonWidth: PropTypes.any,
};

export default ButtonWrapper;

import PropTypes from 'prop-types';
import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../constants/colors';
import { Typography } from './Typography';

class Button extends React.Component {
  render() {
    const {
      title,
      onPress,
      buttonColor = colors.WHITE,
      bgColor = colors.DODGER_BLUE,
      toBgColor = bgColor,
      titleStyle,
      buttonStyle,
      buttonHeight = 54,
      borderColor,
    } = this.props;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[bgColor, toBgColor]}
        style={[
          buttonStyle ? buttonStyle : styles.container,
          {
            height: buttonHeight,
            borderWidth: borderColor ? 2 : 0,
            borderColor: borderColor,
          },
        ]}>
        <TouchableOpacity
          style={[
            buttonStyle ? buttonStyle : styles.container,
            { height: buttonHeight },
          ]}
          onPress={onPress}
          accessible
          accessibilityLabel={title}
          accessibilityRole='button'>
          <Typography
            style={[
              titleStyle ? titleStyle : styles.text,
              {
                color: buttonColor,
              },
            ]}>
            {title}
          </Typography>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  text: {
    textAlign: 'center',
    height: 28,
    fontSize: 20,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
  bgColor: PropTypes.string,
  toBgColor: PropTypes.string,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  borderColor: PropTypes.string,
};

export default Button;

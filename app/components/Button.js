import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    const {
      title,
      onPress,
      bgColor = colors.DODGER_BLUE,
      toBgColor = bgColor,
      titleStyle,
      buttonStyle,
    } = this.props;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[bgColor, toBgColor]}
        style={[buttonStyle ? buttonStyle : styles.container]}>
        <TouchableOpacity
          style={[buttonStyle ? buttonStyle : styles.container]}
          onPress={onPress}>
          <Text style={titleStyle ? titleStyle : styles.text}>{title}</Text>
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
    borderColor: 'rgba(255,255,255,0.7)',
  },
  text: {
    color: colors.WHITE,
    textAlign: 'center',
    height: 28,
    fontSize: 20,
    fontWeight: '600',
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  bgColor: PropTypes.string,
  toBgColor: PropTypes.string,
  titleStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
};

export default Button;

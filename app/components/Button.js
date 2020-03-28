import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  title: string;
  bgColor: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const {
      title,
      onPress,
      bgColor = '#665EFF',
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

export default Button;

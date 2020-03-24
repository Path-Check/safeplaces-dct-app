import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

interface Props {
  label: string;
  bgColor: string;
  onPress: () => void;
}

class Button extends React.Component<Props> {
  render() {
    const { title, onPress, bgColor } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: bgColor || colors.DODGER_BLUE },
        ]}
        onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
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

import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import styles from './styles';
import Colors from '../constants/Colors';

export default function Input({
  length,
  keyboard = 'default',
  onChange,
  multiLine,
  style,
  ...props
}) {
  const [focused, setfocused] = useState(false);
  const inputStyle = {
    borderColor: Colors.mainBlue,
    borderBottomWidth: 1
  };
  return (
    <View>
      <TextInput
        maxLength={length}
        keyboardType={keyboard}
        onFocus={() => setfocused(true)}
        onBlur={() => setfocused(false)}
        multiline={multiLine}
        style={[styles.inputs, focused && inputStyle, style]}
        onChangeText={text => onChange(text)}
        {...props}
      />
    </View>
  );
}

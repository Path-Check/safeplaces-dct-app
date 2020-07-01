import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

import Colors from '../../../constants/colors';
import styles from '../Header/style';

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
    borderColor: Colors.BLUE_RIBBON,
    borderBottomWidth: 1,
  };
  return (
    <View>
      <TextInput
        maxLength={length}
        keyboardType={keyboard}
        onFocus={() => setfocused(true)}
        onBlur={() => setfocused(false)}
        multiline={multiLine}
        style={[
          styles.inputs,
          focused && inputStyle,
          { color: Colors.BLACK },
          style,
        ]}
        onChangeText={text => onChange(text)}
        {...props}
      />
    </View>
  );
}

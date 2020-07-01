import React from 'react';
import { TextInput } from 'react-native';

import Colors from '../../../constants/colors';
import styles from '../Header/style';

export default function PhoneInput({
  value,
  maxLength = 14,
  handleOnChange,
  style,
}) {
  const formatPhoneNumber = str => {
    // eslint-disable-next-line
    const match =
      str.length <= 3
        ? str.match(/^(\d{1,3})$/)
        : str.length <= 6
        ? str.match(/^(\d{3})(\d{1,3})$/)
        : str.match(/^(\d{3})(\d{3})(\d{1,4})$/);
    if (match) {
      const first =
        match[1].length === 3 && match[2] ? `(${match[1]}) ` : match[1];
      // eslint-disable-next-line
      const second =
        match[2] && match[2].length >= 1
          ? match[2].length === 3 && match[3]
            ? `${match[2]}-`
            : match[2]
          : '';
      const third = match[3] && match[3].length >= 1 ? match[3] : '';
      return `${first}${second}${third}`;
    }
    return str;
  };

  const handleOnChangePhone = text => {
    const cleaned = `${text}`.replace(/\D/g, '');
    handleOnChange(formatPhoneNumber(cleaned));
  };

  return (
    <TextInput
      value={value}
      style={[styles.inputs, style, { color: Colors.BLACK }]}
      onChangeText={text => handleOnChangePhone(text)}
      maxLength={maxLength}
      keyboardType='number-pad'
    />
  );
}

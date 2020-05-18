import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CheckBox, Text } from 'native-base';
import Colors from '../constants/Colors';

export default function Checkbox({ id, text, setValue, initialCheck }) {
  const [checked, setChecked] = useState(initialCheck);

  useEffect(() => {
    setChecked(initialCheck);
  }, [initialCheck]);

  return (
    <View>
      <TouchableOpacity
        style={{ flexDirection: 'row', marginVertical: 8 }}
        onPress={() => {
          setChecked(!checked);
          setValue(id, !checked);
        }}>
        <CheckBox
          checked={checked}
          color={Colors.mainBlue}
          onPress={() => {
            setChecked(!checked);
            setValue(id, !checked);
          }}
        />
        <Text style={{ marginLeft: 15 }}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

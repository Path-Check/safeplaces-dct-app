import { CheckBox, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import Colors from '../../constants/colors';

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
          color={Colors.MAIN_BLUE}
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

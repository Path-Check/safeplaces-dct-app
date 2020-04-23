import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import Colors from '../constants/colors';
import languages from '../locales/languages';

export const Checkbox = props => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={props.onPressFunction}>
      <Image
        source={props.boxChecked === true ? boxCheckedIcon : boxUncheckedIcon}
        style={{ width: 25, height: 25, marginRight: 10 }}
      />
      <Text style={styles.checkboxText}>
        {languages.t('label.eula_checkbox')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxText: {
    color: Colors.WHITE,
    fontSize: 18,
  },
});

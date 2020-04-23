import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import Colors from '../constants/colors';
import languages from '../locales/languages';
import { Typography } from './Typography';

export const Checkbox = props => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={props.onPressFunction}>
      <Image
        source={props.boxChecked === true ? boxCheckedIcon : boxUncheckedIcon}
        style={{ width: 25, height: 25, marginRight: 10 }}
      />
      <Typography style={styles.checkboxText}>
        {languages.t('label.eula_checkbox')}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxText: {
    color: Colors.WHITE,
    fontSize: 18,
  },
});

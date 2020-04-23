import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import Colors from '../constants/colors';
import { Typography } from './Typography';

export const Checkbox = props => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={props.onPressFunction}>
      <Image
        source={props.boxChecked === true ? boxCheckedIcon : boxUncheckedIcon}
        style={{ width: 25, height: 25, marginRight: 10 }}
      />
      <Typography style={styles.checkboxText}>
        {t('label.eula_checkbox')}
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

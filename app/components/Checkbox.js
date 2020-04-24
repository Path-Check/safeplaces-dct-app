import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity } from 'react-native';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
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
      <Typography use='body1'>{t('onboarding.eula_checkbox')}</Typography>
    </TouchableOpacity>
  );
};

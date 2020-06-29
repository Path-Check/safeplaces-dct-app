import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ServiceOffScreen } from './Base';
import { Screens } from '../../../navigation';

export const SelectAuthorityScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(Screens.PartnersEdit);
  };

  return (
    <ServiceOffScreen
      header={t('home.shared.select_authority_header')}
      subheader={t('home.shared.select_authority_subheader')}
      button={{
        label: t('home.shared.select_authority_button'),
        onPress: onPress,
      }}
    />
  );
};

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { ServiceOffScreen } from './Base';
import { Stacks } from '../../../navigation';

export const SelectAuthorityScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate(Stacks.Partners);
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

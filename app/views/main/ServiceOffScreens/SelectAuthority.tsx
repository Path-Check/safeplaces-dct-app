import React from 'react';
import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import { useNavigation } from '@react-navigation/native';

export const SelectAuthorityScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const {
    selectAuthorityScreenHeader,
    selectAuthorityScreenSubheader,
    selectAuthorityScreenButton,
  } = useAssets();

  const onPress = () => {
    navigation.navigate('ChooseProviderScreen');
  };

  return (
    <ServiceOffScreen
      header={selectAuthorityScreenHeader}
      subheader={selectAuthorityScreenSubheader}
      button={{ label: selectAuthorityScreenButton, onPress: onPress }}
    />
  );
};

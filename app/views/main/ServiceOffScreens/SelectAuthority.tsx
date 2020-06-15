import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAssets } from '../../../TracingStrategyAssets';
import { ServiceOffScreen } from './Base';
import { Stacks } from '../../../navigation';

export const SelectAuthorityScreen = (): JSX.Element => {
  const navigation = useNavigation();
  const {
    selectAuthorityScreenHeader,
    selectAuthorityScreenSubheader,
    selectAuthorityScreenButton,
  } = useAssets();

  const onPress = () => {
    navigation.navigate(Stacks.Partners);
  };

  return (
    <ServiceOffScreen
      header={selectAuthorityScreenHeader}
      subheader={selectAuthorityScreenSubheader}
      button={{ label: selectAuthorityScreenButton, onPress: onPress }}
    />
  );
};

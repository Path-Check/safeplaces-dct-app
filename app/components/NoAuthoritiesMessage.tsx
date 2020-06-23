import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ActivityIndicator } from 'react-native';
import { Spacing } from '../styles';
import { Typography } from './Typography';
import isAuthorityListLoadedSelector from '../store/selectors/isAuthorityListLoadedSelector';
import { useSelector } from 'react-redux';

const NoAuthoritiesMessage = (): JSX.Element => {
  const { t } = useTranslation();
  const authoritiesLoaded = useSelector(isAuthorityListLoadedSelector);

  if (!authoritiesLoaded) {
    return <ActivityIndicator size={'large'} />;
  }

  return (
    <View>
      <Typography use={'headline2'} style={{ paddingBottom: Spacing.xSmall }}>
        {t('label.authorities_no_sources')}
      </Typography>
      <Typography use={'body2'}>
        {t('home.gps.all_services_on_no_ha_available')}
      </Typography>
    </View>
  );
};

export default NoAuthoritiesMessage;

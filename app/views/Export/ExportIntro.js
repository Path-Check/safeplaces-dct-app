import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import { useAssets } from '../../TracingStrategyAssets';
import ExportTemplate from './ExportTemplate';
import { Icons } from '../../assets';

export const ExportIntro = ({ navigation }) => {
  const { t } = useTranslation();
  const { exportStartTitle, exportStartBody } = useAssets();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);
  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const selectedAuthorityDummy = authorities[0];

  const onNext = () =>
    navigation.navigate('ExportCodeInput', {
      selectedAuthority: selectedAuthorityDummy,
    });
  const onClose = () => navigation.navigate('SettingsScreen');
  return (
    <ExportTemplate
      onNext={onNext}
      onClose={onClose}
      icon={Icons.Heart}
      headline={exportStartTitle}
      body={exportStartBody}
      nextButtonLabel={t('common.start')}
      ignoreModalStyling // this is in a tab
    />
  );
};

export default ExportIntro;

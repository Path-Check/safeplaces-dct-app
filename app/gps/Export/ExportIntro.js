import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import ExportTemplate from './ExportTemplate';
import { Screens } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';

import { Icons } from '../../assets';

export const ExportIntro = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { StrategyCopy } = useStrategyContent();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);

  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const selectedAuthorityDummy = authorities[0];

  const onNext = () =>
    navigation.navigate(Screens.ExportCodeInput, {
      selectedAuthority: selectedAuthorityDummy,
    });
  const onClose = () => navigation.goBack();

  return (
    <ExportTemplate
      onNext={onNext}
      onClose={onClose}
      icon={Icons.Heart}
      headline={StrategyCopy.exportStartTitle}
      body={StrategyCopy.exportStartBody}
      nextButtonLabel={t('common.start')}
      ignoreModalStyling // this is in a tab
    />
  );
};

export default ExportIntro;

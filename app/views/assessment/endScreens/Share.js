import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import getHealthcareAuthorities from '../../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../../store/selectors/healthcareAuthorityOptionsSelector';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);
  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const selectedAuthorityDummy = authorities[0];
  const shareDescription = t('assessment.share_description', {
    ha_name: selectedAuthorityDummy.name,
  });

  return (
    <Info
      ctaAction={() => {
        navigation.push('AssessmentComplete');
      }}
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      ctaTitle={t('assessment.share_cta')}
      description={shareDescription}
      title={t('assessment.share_title')}
    />
  );
};

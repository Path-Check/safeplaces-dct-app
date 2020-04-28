import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import Fonts from '../../constants/fonts';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndCaregiver = ({ navigation }) => {
  let { t } = useTranslation();
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('EndShare');
      }}
      ctaTitle={t('assessment.caregiver_cta')}
      description={
        <Trans i18nKey='assessment.caregiver_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={require('../../assets/images/illustration-screening-end-caregiver.png')}
      title={t('assessment.caregiver_title')}
    />
  );
};

export default AssessmentEndCaregiver;

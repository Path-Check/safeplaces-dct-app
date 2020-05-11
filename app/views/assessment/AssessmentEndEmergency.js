import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking, Text } from 'react-native';

import image from '../../assets/images/illustration-screening-end-911.png';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndEmergency = () => {
  let { t } = useTranslation();
  return (
    <AssessmentEnd
      ctaAction={() => {
        // TODO: This would need to be localized per country
        Linking.openURL('tel:911');
      }}
      ctaColor={Colors.ASSESSMENT_DANGER}
      ctaTitle={t('assessment.emergency_cta')}
      description={
        <Trans i18nKey='assessment.emergency_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={image}
      title={t('assessment.emergency_title')}
    />
  );
};

export default AssessmentEndEmergency;

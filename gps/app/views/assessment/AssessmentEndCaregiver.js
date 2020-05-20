import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import image from '../../assets/images/assessment/illustration-screening-end-caregiver.png';
import Fonts from '../../constants/fonts';
import { MetaContext } from './AssessmentContext';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndCaregiver = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      ctaTitle={t('assessment.caregiver_cta')}
      description={
        <Trans i18nKey='assessment.caregiver_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={image}
      title={t('assessment.caregiver_title')}
    />
  );
};

export default AssessmentEndCaregiver;

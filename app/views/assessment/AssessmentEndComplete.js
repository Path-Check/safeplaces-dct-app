import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import Fonts from '../../constants/fonts';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndDistancing = () => {
  let { t } = useTranslation();
  return (
    <AssessmentEnd
      ctaAction={() => {}}
      ctaTitle={t('assesasment.complete_cta')}
      description={
        <Trans i18nKey='assessment.complete_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={require('../../assets/images/illustration-screening-end-distancing.png')}
      title={t('assessment.complete_title')}
    />
  );
};

export default AssessmentEndDistancing;

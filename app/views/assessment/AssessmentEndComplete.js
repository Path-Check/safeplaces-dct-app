import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import Fonts from '../../constants/fonts';
import { MetaContext } from './AssessmentContext';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndComplete = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={dismiss}
      ctaTitle={t('assessment.complete_cta')}
      description={
        <Trans i18nKey='assessment.complete_description'>
          <Text />
          <Text style={{ fontFamily: Fonts.primaryBold }} />
        </Trans>
      }
      image={require('../../assets/images/illustration-screening-end-done.png')}
      title={t('assessment.complete_title')}
    />
  );
};

export default AssessmentEndComplete;

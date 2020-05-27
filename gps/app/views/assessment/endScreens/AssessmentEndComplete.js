import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import image from '../../../assets/images/assessment/illustration-screening-end-done.png';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../AssessmentContext';
import AssessmentEnd, { assessmentStyles } from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndComplete = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={dismiss}
      ctaTitle={t('assessment.complete_cta')}
      description={
        <Trans t={t} i18nKey='assessment.complete_description'>
          <Typography />
          <Typography surveyFont style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      image={image}
      title={t('assessment.complete_title')}
    />
  );
};

export default AssessmentEndComplete;

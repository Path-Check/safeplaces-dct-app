import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
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
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.complete_cta')}
      description={
        <Trans t={t} i18nKey='assessment.complete_description'>
          <Typography />
          <Typography style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      title={t('assessment.complete_title')}
    />
  );
};

export default AssessmentEndComplete;

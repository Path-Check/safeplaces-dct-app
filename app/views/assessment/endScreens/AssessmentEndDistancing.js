import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../AssessmentContext';
import AssessmentEnd, { assessmentStyles } from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndDistancing = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.distancing_cta')}
      description={
        <Trans t={t} i18nKey='assessment.distancing_description'>
          <Typography />
          <Typography style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      title={t('assessment.distancing_title')}
    />
  );
};

export default AssessmentEndDistancing;

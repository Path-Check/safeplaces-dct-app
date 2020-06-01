import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import image from '../../../assets/images/assessment/illustration-screening-end-distancing.png';
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
      ctaTitle={t('assessment.distancing_cta')}
      description={
        <Trans t={t} i18nKey='assessment.distancing_description'>
          <Typography />
          <Typography style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      image={image}
      title={t('assessment.distancing_title')}
    />
  );
};

export default AssessmentEndDistancing;

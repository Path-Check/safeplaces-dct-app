import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import image from '../../../assets/images/assessment/illustration-screening-end-isolate.png';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../AssessmentContext';
import AssessmentEnd, { assessmentStyles } from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndIsolate = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      ctaTitle={t('assessment.isolate_cta')}
      description={
        <Trans t={t} i18nKey='assessment.isolate_description'>
          <Typography />
          <Typography surveyFont style={assessmentStyles.boldBlackText} />
        </Trans>
      }
      image={image}
      title={t('assessment.isolate_title')}
    />
  );
};

export default AssessmentEndIsolate;

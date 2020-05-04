import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/colors';
import { MetaContext } from './AssessmentContext';
import AssessmentEnd from './AssessmentEnd';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndEmergency = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={dismiss}
      ctaColor={Colors.ASSESSMENT_DANGER}
      ctaTitle={t('assessment.emergency_cta')}
      description={t('assessment.emergency_description')}
      image={require('../../assets/images/illustration-screening-end-911.png')}
      title={t('assessment.emergency_title')}
    />
  );
};

export default AssessmentEndEmergency;

import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../AssessmentContext';
import AssessmentEnd from './AssessmentEnd';
import Colors from '../../../constants/colors';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndDistancing = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.distancing_cta')}
      description={
        <Trans t={t} i18nKey='assessment.distancing_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.distancing_title')}
    />
  );
};

export default AssessmentEndDistancing;

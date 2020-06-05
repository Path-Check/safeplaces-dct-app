import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { MetaContext } from '../AssessmentContext';
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
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.caregiver_cta')}
      description={
        <Trans t={t} i18nKey='assessment.caregiver_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.caregiver_title')}
    />
  );
};

export default AssessmentEndCaregiver;

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Typography } from '../../../components/Typography';
import AssessmentEnd from './AssessmentEnd';
import Colors from '../../../constants/colors';

/** @type {React.FunctionComponent<{}>} */
const AssessmentEndShare = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <AssessmentEnd
      ctaAction={() => {
        navigation.push('EndComplete');
      }}
      icon={Icons.AnonymizedData}
      backgroundColor={Colors.PRIMARY_50}
      ctaColor={Colors.WHITE}
      ctaTitle={t('assessment.share_cta')}
      fontColor={Colors.WHITE}
      description={
        <>
          <Trans t={t} i18nKey='assessment.share_description'>
            <Typography />
          </Trans>
        </>
      }
      title={t('assessment.share_title')} />
  );
};

export default AssessmentEndShare;

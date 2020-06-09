import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { Colors as AssessmentColors } from '../constants';
import { Info } from '../Info';

/** @type {React.FunctionComponent<{}>} */
export const Emergency = () => {
  let { t } = useTranslation();
  return (
    <Info
      ctaAction={() => {
        // TODO: This would need to be localized per country
        Linking.openURL('tel:911');
      }}
      ctaColor={AssessmentColors.DANGER}
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.emergency_cta')}
      description={
        <Trans t={t} i18nKey='assessment.emergency_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.emergency_title')}
    />
  );
};

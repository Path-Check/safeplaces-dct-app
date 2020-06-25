import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <Info
      ctaAction={() => {
        navigation.push('AssessmentComplete');
      }}
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.invertedQuaternaryBackground}
      titleStyle='headline3'
      descriptionStyle='body4'
      ctaBackgroundColor={Colors.white}
      ctaTextColor={Colors.violetTextLight}
      ctaTitle={t('assessment.share_cta')}
      description={
        <Trans t={t} i18nKey='assessment.share_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.share_title')}
    />
  );
};

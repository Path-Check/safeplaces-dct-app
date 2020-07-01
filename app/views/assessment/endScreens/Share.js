import React from 'react';
import { useTranslation } from 'react-i18next';

import { Icons } from '../../../assets';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';

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
      ctaTextColor={Colors.black}
      ctaTitle={t('assessment.share_cta')}>
        <InfoText useTitleStyle='headline6'
          useDescriptionStyle='body4'
          title={t('assessment.share_title')}
          description={t('assessment.share_description')} />
    </Info>
  );
};

import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { MetaContext } from '../Context';
import { Info } from '../Info';
import { InfoText } from '../components/InfoText';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const AssessmentComplete = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <Info
      ctaAction={dismiss}
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.complete_cta')}>
        <InfoText useTitleStyle='headline2'
          title={t('assessment.complete_title')}
          description={t('assessment.complete_description')} />
    </Info>
  );
};

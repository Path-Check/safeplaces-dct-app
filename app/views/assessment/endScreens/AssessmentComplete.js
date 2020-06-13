import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { MetaContext } from '../Context';
import { Info } from '../Info';

/** @type {React.FunctionComponent<{}>} */
export const AssessmentComplete = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <Info
      ctaAction={dismiss}
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      ctaTitle={t('assessment.complete_cta')}
      description={
        <Trans t={t} i18nKey='assessment.complete_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.complete_title')}
    />
  );
};

import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import { MetaContext } from '../Context';
import { Info } from '../Info';

import { Colors } from '../../../styles';

/** @type {React.FunctionComponent<{}>} */
export const Complete = () => {
  let { t } = useTranslation();
  let { dismiss } = useContext(MetaContext);
  return (
    <Info
      ctaAction={dismiss}
      backgroundColor={Colors.primaryBackgroundFaintShade}
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

import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icons, Images } from '../../../assets';
import { Typography } from '../../../components/Typography';
import Colors from '../../../constants/colors';
import { MetaContext } from '../Context';
import { Info } from '../Info';

/** @type {React.FunctionComponent<{}>} */
export const Isolate = ({ navigation }) => {
  let { t } = useTranslation();
  let { completeRoute } = useContext(MetaContext);
  return (
    <Info
      ctaAction={() => {
        navigation.push(completeRoute);
      }}
      backgroundColor={Colors.SECONDARY_10}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      ctaTitle={t('assessment.isolate_cta')}
      description={
        <Trans t={t} i18nKey='assessment.isolate_description'>
          <Typography />
        </Trans>
      }
      title={t('assessment.isolate_title')}
    />
  );
};

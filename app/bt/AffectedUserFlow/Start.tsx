import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import ExportTemplate from './ExportTemplate';
import { Screens } from '../../navigation';
import { useStrategyContent } from '../../TracingStrategyContext';

import { Icons } from '../../assets';

export const ExportIntro = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { StrategyCopy } = useStrategyContent();

  const onNext = () => navigation.navigate(Screens.AffectedUserCodeInput);
  const onClose = () => navigation.goBack();

  return (
    <ExportTemplate
      onNext={onNext}
      onClose={onClose}
      icon={Icons.Heart}
      headline={StrategyCopy.exportStartTitle}
      body={StrategyCopy.exportStartBody}
      nextButtonLabel={t('common.start')}
      ignoreModalStyling // this is in a tab
    />
  );
};

export default ExportIntro;

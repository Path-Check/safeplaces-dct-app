import React, { FunctionComponent } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useStrategyContent } from '../../TracingStrategyContext';
import ExportTemplate from './ExportTemplate';
import { Screens } from '../../navigation';

export const ExportComplete: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { StrategyCopy } = useStrategyContent();
  const onClose = () => navigation.navigate(Screens.Settings);

  return (
    <ExportTemplate
      onNext={onClose}
      nextButtonLabel={t('common.done')}
      headline={t('export.complete_title')}
      body={StrategyCopy.exportCompleteBody}
    />
  );
};

export default ExportComplete;

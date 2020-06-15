import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAssets } from '../../TracingStrategyAssets';
import ExportTemplate from './ExportTemplate';
import { isGPS } from '../../COVIDSafePathsConfig';
import { Screens } from '../../navigation';

export const ExportComplete = ({ navigation }) => {
  const { t } = useTranslation();
  const { exportCompleteBody } = useAssets();
  const onClose = () => navigation.navigate(exportExitRoute);

  const exportExitRoute = isGPS ? Screens.ExportStart : Screens.Settings;

  return (
    <ExportTemplate
      lightTheme
      onNext={onClose}
      nextButtonLabel={t('common.done')}
      headline={t('export.complete_title')}
      body={exportCompleteBody}
    />
  );
};

export default ExportComplete;

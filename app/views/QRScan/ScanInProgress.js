import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { Button } from '../../components/Button';
import { styles } from './style';

export const ScanInProgress = ({ onScanCancel, onScanSuccess }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.qrScanContainer}>
      <QRCodeScanner
        onRead={onScanSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
      />
      <Button
        label={t('qr.scan_cancel')}
        style={styles.qrCancelButton}
        onPress={onScanCancel}
      />
    </View>
  );
};

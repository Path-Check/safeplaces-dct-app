import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import StateAtRisk from '../../assets/svgs/stateAtRisk';
import StateNoContact from '../../assets/svgs/stateNoContact';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { StateEnum } from './StateEnum';
import { styles } from './style';

const height = Dimensions.get('window').height;

const StateIcon = ({ status, size }) => {
  let icon;
  switch (status) {
    case StateEnum.DEFAULT:
      icon = null;
      break;
    case StateEnum.SCAN_SUCCESS:
      icon = StateNoContact;
      break;
    case StateEnum.SCAN_FAIL:
      icon = StateAtRisk;
      break;
  }
  return <SvgXml xml={icon} width={size || 80} height={size || 80} />;
};

export const ScanComplete = ({ currentState, onExit }) => {
  const { t } = useTranslation();

  const getMainText = () => {
    switch (currentState) {
      case StateEnum.SCAN_SUCCESS:
        return (
          <Typography style={styles.mainTextBelow} use='headline2'>
            {t('qr.successful_title')}
          </Typography>
        );
      case StateEnum.SCAN_FAIL:
        return (
          <Typography style={styles.mainTextBelow} use='headline2'>
            {t('qr.fail_title')}
          </Typography>
        );
    }
  };

  const getSubText = () => {
    switch (currentState) {
      case StateEnum.SCAN_SUCCESS:
        return t('qr.successful_subtitle');
      case StateEnum.SCAN_FAIL:
        return t('qr.fail_subtitle');
    }
  };

  return (
    <View style={styles.ScanCompleteContainer}>
      <View style={styles.iconContainer}>
        <StateIcon size={height} status={currentState} />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.content}>
          {getMainText()}
          <Typography style={styles.subheaderText} use='body1'>
            {getSubText()}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button label={t('qr.exit')} onPress={onExit} />
          </View>
        </View>
      </View>
    </View>
  );
};

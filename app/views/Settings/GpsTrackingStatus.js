import styled, { css } from '@emotion/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import DeviceSettings from 'react-native-device-settings';
import { openSettings } from 'react-native-permissions';

import {
  AnimatedText,
  Button,
  Divider,
  Switch,
  Typography,
} from '../../components';
import Colors from '../../constants/colors';
import { useGpsTrackingStatus } from '../../services/hooks/useGpsTrackingStatus';
import { Reason } from '../../services/LocationService';
import { isPlatformiOS } from '../../Util';

export const GpsTrackingStatus = () => {
  const { i18n } = useTranslation();
  const [userOptIn, setUserOptIn] = useGpsTrackingStatus();

  const { reason, canTrack } = userOptIn;

  const hasPermission =
    reason === Reason.ALL_CONDITIONS_MET || reason === Reason.USER_OPT_OUT;

  const getCurrentRowDirection = i18n.dir() === 'rtl' ? 'row-reverse' : 'row';

  const getGpsStatusElement = () => {
    if (reason === undefined) {
      return;
    }

    if (hasPermission) {
      return (
        <GpsStatusSwitch canTrack={canTrack} setUserOptIn={setUserOptIn} />
      );
    } else {
      return <EnableGpsButton reason={reason} />;
    }
  };

  return (
    <>
      <Container
        style={css`
          flex-direction: ${getCurrentRowDirection};
        `}>
        {getGpsStatusElement()}
      </Container>
      <Divider />
    </>
  );
};

const EnableGpsButton = ({ reason }) => {
  const { t } = useTranslation();

  /**
   * Conditional toggling based on the location permission actions
   * that are enabled per platform.
   */
  const requestLocationPermission = async () => {
    /**
     * Open the settings for the app
     */
    if (reason === Reason.APP_NOT_AUTHORIZED) {
      openSettings();
    }

    /**
     * Open Device Settings.
     * If iOS, open Settings home screen
     * If Android, we are able to open the device location permissions
     */
    if (reason === Reason.DEVICE_LOCATION_OFF) {
      if (isPlatformiOS()) {
        const deviceSettingsUrl = 'App-prefs:';
        Linking.openURL(deviceSettingsUrl);
      } else {
        DeviceSettings.location();
      }
    }
  };

  return (
    <Button
      onPress={requestLocationPermission}
      label={t('label.logging_request_location_permission')}
      style={{ width: '100%' }}
      secondary
      small
    />
  );
};

const GpsStatusSwitch = ({ canTrack, setUserOptIn }) => {
  const { t, i18n } = useTranslation();

  const label = canTrack
    ? t('label.logging_active_location')
    : t('label.logging_location_paused');

  const getCurrentMarginDirection =
    i18n.dir() === 'rtl' ? 'margin-left: 12px;' : 'margin-right: 12px;';

  const onValueChange = async val => await setUserOptIn(val);

  return (
    <>
      <Label>
        <Typography use='body1' style={!canTrack && { color: Colors.RED_TEXT }}>
          {canTrack ? <AnimatedText value={label} interval={1000} /> : label}
        </Typography>
      </Label>
      <Switch
        onValueChange={onValueChange}
        value={canTrack}
        style={css`
          ${getCurrentMarginDirection};
        `}
      />
    </>
  );
};

const Container = styled.View`
  padding: 18px 0;
  align-items: center;
`;

const Label = styled.View`
  flex: 1;
  justify-content: center;
`;

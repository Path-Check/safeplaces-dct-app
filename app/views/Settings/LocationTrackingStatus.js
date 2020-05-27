import styled, { css } from '@emotion/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import DeviceSettings from 'react-native-device-settings';
import { openSettings } from 'react-native-permissions';

import { Button, Divider, Switch, Typography } from '../../components';
import Colors from '../../constants/colors';
import { config } from '../../COVIDSafePathsConfig';
import { useLocTrackingStatus } from '../../services/hooks/useLocTrackingStatus';
import { Reason } from '../../services/LocationService';
import { isPlatformiOS } from '../../Util';

export const LocationTrackingStatus = () => {
  const { i18n } = useTranslation();
  const [locTrackingStatus, setLocTrackingStatus] = useLocTrackingStatus();

  const { reason, canTrack } = locTrackingStatus;

  const isGPS = config.tracingStrategy === 'gps';

  console.log(reason);

  const hasLocTrackingPermissions =
    reason === Reason.USER_ENABLED || reason === Reason.USER_DISABLED;

  const isMissingLocPermissions =
    reason === Reason.DEVICE_LOCATION_OFF ||
    reason === Reason.APP_NOT_AUTHORIZED;

  const getCurrentRowDirection = () =>
    i18n.dir() === 'rtl' ? 'row-reverse' : 'row';

  const getLocStatusElement = () => {
    if (hasLocTrackingPermissions) {
      return (
        <LocationStatusSwitch
          canTrack={canTrack}
          setLocTrackingStatus={setLocTrackingStatus}
        />
      );
    }

    if (isMissingLocPermissions) {
      return <EnableLocationButton reason={reason} />;
    }
  };

  if (isGPS) {
    return (
      <>
        <Container
          style={css`
            flex-direction: ${getCurrentRowDirection()};
          `}>
          {getLocStatusElement()}
        </Container>
        <Divider />
      </>
    );
  }
};

const EnableLocationButton = ({ reason }) => {
  const { t } = useTranslation();

  /**
   * Conditional toggling based on the location permission actions
   * that are enabled per platform.
   */
  const requestLocationPermission = async () => {
    if (reason === Reason.APP_NOT_AUTHORIZED) {
      /**
       * Open the settings for the app
       */
      openSettings();
    } else if (reason === Reason.DEVICE_LOCATION_OFF) {
      /**
       * Open Device Settings.
       * If iOS, open Settings home screen
       * If Android, we are able to open the device location permissions
       */
      if (isPlatformiOS()) {
        const deviceSettingsUrl = 'App-prefs:';
        Linking.openURL(deviceSettingsUrl);
      } else {
        DeviceSettings.location();
      }
    }
  };

  return (
    <>
      <Button
        onPress={requestLocationPermission}
        label={t('label.logging_request_location_permission')}
        style={{ width: '100%' }}
        secondary
        small
      />
    </>
  );
};

const LocationStatusSwitch = ({ canTrack, setLocTrackingStatus }) => {
  const { t, i18n } = useTranslation();
  const [label, setLabel] = useState('');

  useEffect(() => {
    let labelInterval;

    /**
     * Provide a basic animation to show that location logging
     * is active. If the label reaches three periods, reset
     * to the original label
     */
    const createLabelInterval = () => {
      return setInterval(() => {
        setLabel(label => {
          if (label.slice(-3) === '...') {
            setLabel(t('label.logging_active_location'));
          } else {
            setLabel(label + '.');
          }
        });
      }, 1000);
    };

    const initLabel = () => {
      if (canTrack) {
        setLabel(t('label.logging_active_location'));
        labelInterval = createLabelInterval();
      } else {
        setLabel(t('label.logging_location_paused'));
        labelInterval = clearInterval(labelInterval);
      }
    };

    initLabel();

    return () => clearInterval(labelInterval);
  }, [canTrack, t]);

  const getCurrentMarginDirection = () =>
    i18n.dir() === 'rtl' ? 'margin-left: 12px;' : 'margin-right: 12px;';

  const onValueChange = async val => await setLocTrackingStatus(val);

  return (
    <>
      <Label>
        <Typography use='body1' style={!canTrack && { color: Colors.RED_TEXT }}>
          {label}
        </Typography>
      </Label>
      <Switch
        onValueChange={onValueChange}
        value={canTrack}
        style={css`
          ${getCurrentMarginDirection()};
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

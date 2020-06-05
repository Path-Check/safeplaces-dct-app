import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { useEffect, useState } from 'react';

import LocationService from '../LocationService';

/**
 * Hook used to check the location tracking status of a user
 * @param {{canTrack: boolean, reason: Reason, isRunning: boolean}} status
 */
export const useGpsTrackingStatus = () => {
  const initialState = {
    canTrack: undefined,
    reason: undefined,
    isRunning: undefined,
  };

  const [gpsTrackingStatus, setStatus] = useState(initialState);

  useEffect(() => {
    BackgroundGeolocation.on('start', async () => {
      await getAndSetStatus();
    });

    const getAndSetStatus = async () => {
      const status = await LocationService.checkStatus();
      setStatus(status);
    };

    getAndSetStatus();
  }, []);

  return gpsTrackingStatus;
};

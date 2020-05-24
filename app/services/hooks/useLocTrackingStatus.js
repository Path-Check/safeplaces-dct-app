import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import { useEffect, useState } from 'react';

import LocationService from '../LocationService';

/**
 * Hook used to check the location tracking status of a user
 * @param {{canTrack: boolean, reason: Reason, isRunning: boolean, hasPotentialExposure: boolean}} status
 */
export const useLocTrackingStatus = () => {
  const initialState = {
    canTrack: undefined,
    reason: undefined,
    isRunning: undefined,
    hasPotentialExposure: undefined,
  };

  const [locTrackingStatus, setStatus] = useState(initialState);

  /**
   * Set the location tracking status
   * @param {boolean} isEnabled
   * @returns {{canTrack: boolean, reason: Reason, isRunning: boolean, hasPotentialExposure: boolean}}
   */
  const setLocTrackingStatus = async newIsTracking => {
    const { isRunning, reason } = await LocationService.checkStatus();

    if (newIsTracking && !isRunning) {
      await LocationService.start();
    }

    if (!newIsTracking && isRunning) {
      await LocationService.stop();
    }

    const newStatus = await LocationService.checkStatus();

    setStatus(newStatus);
  };

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

  return [locTrackingStatus, setLocTrackingStatus];
};

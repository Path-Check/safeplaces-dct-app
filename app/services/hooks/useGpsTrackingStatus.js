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

  const [userOptIn, setStatus] = useState(initialState);

  /**
   * Set the location tracking status, and start/stop BackgroundGeolocation accordingly
   * @param {boolean} userOptIn
   * @returns {{canTrack: boolean, reason: Reason, isRunning: boolean}}
   */
  const setUserOptIn = async userOptIn => {
    LocationService.setUserOptIn(userOptIn);

    const { isRunning } = await LocationService.checkStatus();
    const shouldStartTracking = userOptIn && !isRunning;

    shouldStartTracking
      ? await LocationService.start()
      : await LocationService.stop();

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

  return [userOptIn, setUserOptIn];
};

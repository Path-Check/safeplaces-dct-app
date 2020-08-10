/* eslint-disable no-undef */
import _ from 'lodash';
import { getBundleId, ApplicationState } from '../common/constants';

export const BUNDLE_ID = getBundleId();

export const isAppRunning = async () => {
  const appState = await getApplicationState();
  return _.isEqual(appState, ApplicationState.RUNNING_IN_FOREGROUND);
};

export const backgroundApp = async (secondsToSpendInBackground = 2) => {
  const isAppInForeground = await isAppRunning();
  if (isAppInForeground) {
    await driver.background(secondsToSpendInBackground);
  } else {
    await launchApp();
    await driver.background(secondsToSpendInBackground);
  }
};

export const launchApp = async () => {
  const isAppAlreadyRunning = await isAppRunning();
  if (!isAppAlreadyRunning) {
    await driver.launchApp();
  }
};

export const getApplicationState = async () => {
  return driver.queryAppState(BUNDLE_ID);
};

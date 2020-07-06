import { createAction } from '@reduxjs/toolkit';

const TOGGLE_DOWNLOAD_HA_DATA_OVER_WIFI_ONLY =
  'TOGGLE_DOWNLOAD_HA_DATA_OVER_WIFI_ONLY';

const toggleDownloadHaDataOverWifiOnlyAction = createAction(
  TOGGLE_DOWNLOAD_HA_DATA_OVER_WIFI_ONLY,
);

export default toggleDownloadHaDataOverWifiOnlyAction;

import { createAction } from '@reduxjs/toolkit';

const TOGGLE_DOWNLOAD_LARGE_DATA_OVER_WIFI_ONLY =
  'TOGGLE_DOWNLOAD_LARGE_DATA_OVER_WIFI_ONLY';

const toggleDownloadLargeDataOverWifiOnlyAction = createAction(
  TOGGLE_DOWNLOAD_LARGE_DATA_OVER_WIFI_ONLY,
);

export default toggleDownloadLargeDataOverWifiOnlyAction;

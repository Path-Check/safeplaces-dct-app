import { createReducer } from '@reduxjs/toolkit';

import toggleDownloadLargeDataOverWifiOnlyAction from '../actions/settings/downloadLargeDataOverWifiOnlyAction';

const initialState = { downloadLargeDataOverWifiOnly: false };

const settingsReducer = createReducer(initialState, (builder) =>
  builder.addCase(toggleDownloadLargeDataOverWifiOnlyAction, (state) => {
    state.downloadLargeDataOverWifiOnly = !state.downloadLargeDataOverWifiOnly;
  }),
);

export default settingsReducer;

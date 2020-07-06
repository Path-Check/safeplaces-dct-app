import { createReducer } from '@reduxjs/toolkit';

import toggleDownloadHaDataOverWifiOnlyAction from '../actions/settings/downloadHaDataOverWifiAction';

const initialState = { downloadHaDataOverWifiOnly: false };

const settingsReducer = createReducer(initialState, (builder) =>
  builder.addCase(toggleDownloadHaDataOverWifiOnlyAction, (state) => {
    state.downloadHaDataOverWifiOnly = !state.downloadHaDataOverWifiOnly;
  }),
);

export default settingsReducer;

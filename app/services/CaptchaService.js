import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import Colors from '../constants/colors';

const width = Dimensions.get('window').width;
/**
 *
 * @param {*} onMessage: callback after received response, error of Google captcha or when user cancel
 * @param {*} siteKey: your site key of Google captcha
 * @param {*} style: custom style
 * @param {*} url: base url
 */
export const HCaptcha = ({ onMessage, style, uri }) => {
  return (
    <WebView
      startInLoadingState
      originWhitelist={['*']}
      mixedContentMode={'always'}
      onMessage={onMessage}
      javaScriptEnabled
      automaticallyAdjustContentInsets
      source={{ uri }}
      style={style}
      renderLoading={renderLoadingView}
    />
  );
};

function renderLoadingView() {
  return (
    <ActivityIndicator
      animating
      size='large'
      hidesWhenStopped
      style={styles.loading}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 40,
    left: (width - 40) / 2,
    color: Colors.DARK_GRAY,
  },
});

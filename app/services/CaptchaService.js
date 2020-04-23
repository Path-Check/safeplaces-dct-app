import React from 'react';
import WebView from 'react-native-webview';
/**
 *
 * @param {*} onMessage: callback after received response, error of Google captcha or when user cancel
 * @param {*} siteKey: your site key of Google captcha
 * @param {*} style: custom style
 * @param {*} url: base url
 */
const HCaptcha = ({ onMessage, style, uri }) => {
  return (
    <WebView
      originWhitelist={['*']}
      mixedContentMode={'always'}
      onMessage={onMessage}
      javaScriptEnabled
      automaticallyAdjustContentInsets
      style={style}
      source={{ uri }}
    />
  );
};

export default HCaptcha;

import React from 'react';
import WebView from 'react-native-webview';

const patchPostMessageJsCode = `(${String(function() {
  // eslint-disable-next-line no-var
  let originalPostMessage = window.ReactNativeWebView.postMessage;
  let patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage',
    );
  };
  window.ReactNativeWebView.postMessage = patchedPostMessage;
})})();`;

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
      injectedJavaScript={patchPostMessageJsCode}
      automaticallyAdjustContentInsets
      style={style}
      source={{ uri }}
    />
  );
};

export default HCaptcha;

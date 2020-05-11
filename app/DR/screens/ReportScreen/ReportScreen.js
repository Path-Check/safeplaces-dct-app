import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import firestore from '../../utils/firebase';

export default function ReportScreen({ navigation }) {
  let webViewRef;
  const [form, setForm] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // The screen is unfocused
      // Call any action
      webViewRef && webViewRef.reload();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  return (
    <WebView
      ref={(ref) => (webViewRef = ref)}
      source={{
        uri: 'https://covidrd.page.link/report',
      }}
      onResponderReject={(res) => console.log(res)}
    />
  );
}

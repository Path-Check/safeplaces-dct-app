import React, { useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AuroraScreen({ navigation }) {
  let webViewRef;
  const form = 'https://aurorasalud.org.do/chat/';

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      webViewRef && webViewRef.reload();
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={ref => (webViewRef = ref)}
        source={{
          uri: form,
        }}
        onResponderReject={res => console.log(res)}
      />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, View } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import WebView from 'react-native-webview';

import NavigationBarWrapper from '../../../components/NavigationBarWrapper';
import { GetStoreData } from '../../../helpers/General';
import en from '../../../locales/eula/en.html';
import es from '../../../locales/eula/es.html';

const eulaFiles = { en, es };

const DEFAULT_EULA_URL = 'about:blank';
export default function Index({ navigation }) {
  const { t } = useTranslation();
  const [html, setHtml] = useState();

  const backToMain = () => {
    navigation.goBack();
  };

  const shouldStartLoadWithRequestHandler = webViewState => {
    let shouldLoadRequest = true;
    if (webViewState.url !== DEFAULT_EULA_URL) {
      // If the webpage to load isn't the EULA, load it in a separate browser
      Linking.openURL(webViewState.url);
      // Don't load the page if its being handled in a separate browser
      shouldLoadRequest = false;
    }
    return shouldLoadRequest;
  };

  useEffect(() => {
    (async () => {
      const storedLocale = await GetStoreData('LANG_OVERRIDE');

      const eulaPath = eulaFiles[storedLocale] || en;
      setHtml(await loadLocalResource(eulaPath));
    })();
  });
  return (
    <NavigationBarWrapper
      title={t('label.terms_and_conditions')}
      onBackPress={backToMain.bind(this)}>
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <WebView
          source={{ html }}
          style={{ flex: 1 }}
          onShouldStartLoadWithRequest={shouldStartLoadWithRequestHandler}
        />
      </View>
    </NavigationBarWrapper>
  );
}

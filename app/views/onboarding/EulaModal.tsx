import React, { useEffect, useState } from 'react';
import { Linking, Modal, StyleSheet, View, SafeAreaView } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import WebView from 'react-native-webview';

import { useStatusBarEffect } from '../../navigation';
import { IconButton } from '../../components/IconButton';

const en = require('../../locales/eula/en.html');
const es_PR = require('../../locales/eula/es_PR.html');
const ht = require('../../locales/eula/ht.html');

import { Icons } from '../../assets';
import { Spacing, Colors } from '../../styles';

const DEFAULT_EULA_URL = 'about:blank';

interface EulaModalProps {
  selectedLocale: string;
  showModal: boolean;
  onCloseModal: () => void;
}

const EulaModal = ({
  selectedLocale,
  showModal,
  onCloseModal,
}: EulaModalProps): JSX.Element => {
  useStatusBarEffect('dark-content');
  const [html, setHtml] = useState<string | undefined>(undefined);

  const selectEulaFile = (locale: string): number => {
    switch (locale) {
      case 'en': {
        return en;
      }
      case 'es_PR': {
        return es_PR;
      }
      case 'ht': {
        return ht;
      }
      default: {
        return en;
      }
    }
  };

  const eulaPath = selectEulaFile(selectedLocale);

  // Any links inside the EULA should launch a separate browser otherwise you can get stuck inside the app
  const shouldStartLoadWithRequestHandler = (webViewState: { url: string }) => {
    let shouldLoadRequest = true;
    if (webViewState.url !== DEFAULT_EULA_URL) {
      // If the webpage to load isn't the EULA, load it in a separate browser
      Linking.openURL(webViewState.url);
      // Don't load the page if its being handled in a separate browser
      shouldLoadRequest = false;
    }
    return shouldLoadRequest;
  };

  // Load the EULA from disk
  useEffect(() => {
    const loadEula = async () => {
      setHtml(await loadLocalResource(eulaPath));
    };
    loadEula();
  }, [selectedLocale, setHtml, eulaPath]);

  return (
    <Modal animationType='slide' transparent visible={showModal}>
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.contentContainer}>
            <IconButton
              icon={Icons.Close}
              size={20}
              style={styles.closeIcon}
              accessibilityLabel='Close'
              onPress={onCloseModal}
            />
            {html && (
              <WebView
                style={{ flex: 1 }}
                source={{ html }}
                onShouldStartLoadWithRequest={shouldStartLoadWithRequestHandler}
              />
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: Colors.primaryText,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    flex: 7,
    paddingHorizontal: Spacing.small,
  },
  closeIcon: {
    padding: Spacing.xSmall,
    alignSelf: 'flex-end',
  },
});

export default EulaModal;

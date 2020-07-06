import { Button, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Modal, StyleSheet, View } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import close from '../assets/svgs/close';
import Colors from '../constants/colors';
import buttonStyle from '../constants/DR/buttonStyles';
import { Theme } from '../constants/themes';
import en from '../locales/eula/en.html';
import es from '../locales/eula/es.html';
import ht from '../locales/eula/ht.html';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';
import { Typography } from './Typography';

const EULA_FILES = { en, ht, es };

const DEFAULT_EULA_URL = 'about:blank';

export const EulaModal = ({ selectedLocale, continueFunction }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const [html, setHtml] = useState(undefined);
  const { t } = useTranslation();

  // Pull the EULA in the correct language, with en as fallback
  const eulaPath = EULA_FILES[selectedLocale] || en;

  // Any links inside the EULA should launch a separate browser otherwise you can get stuck inside the app
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

  // Load the EULA from disk
  useEffect(() => {
    const loadEula = async () => {
      setHtml(await loadLocalResource(eulaPath));
    };
    loadEula();
  }, [selectedLocale, setHtml, eulaPath]);

  const canContinue = boxChecked;

  return (
    <>
      <Button
        style={{
          ...buttonStyle.buttonStyle,
          backgroundColor: Colors.WHITE,
          marginBottom: 20,
        }}
        onPress={() => setModalVisibility(true)}>
        <Text style={{ ...buttonStyle.buttonText, color: Colors.BLUE_RIBBON }}>
          {t('label.launch_get_started')}
        </Text>
      </Button>
      <Modal animationType='slide' transparent visible={modalVisible}>
        <View style={styles.container}>
          <Theme use='default'>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={{ flex: 7, paddingHorizontal: 5 }}>
                <IconButton
                  icon={close}
                  size={20}
                  style={styles.closeIcon}
                  accessibilityLabel='Close'
                  onPress={() => setModalVisibility(false)}
                />
                {html && (
                  <WebView
                    style={{ flex: 1 }}
                    source={{ html }}
                    onShouldStartLoadWithRequest={
                      shouldStartLoadWithRequestHandler
                    }
                  />
                )}
              </View>
            </SafeAreaView>
          </Theme>
          <Theme use='violet'>
            <SafeAreaView style={{ backgroundColor: Colors.BLUE_RIBBON }}>
              <View style={styles.ctaBox}>
                <Checkbox
                  label={t('onboarding.eula_checkbox')}
                  onPress={() => toggleCheckbox(!boxChecked)}
                  checked={boxChecked}
                />
                <Typography style={styles.smallDescriptionText}>
                  {t('onboarding.eula_message')}
                </Typography>
                <Button
                  style={{
                    ...buttonStyle.buttonStyle,
                    backgroundColor: canContinue
                      ? Colors.WHITE
                      : Colors.LIGHT_GRAY,
                  }}
                  disabled={!canContinue}
                  onPress={() => {
                    setModalVisibility(false);
                    continueFunction();
                  }}>
                  <Text
                    style={{
                      ...buttonStyle.buttonText,
                      color: canContinue
                        ? Colors.BLUE_RIBBON
                        : Colors.GRAY_BUTTON,
                    }}>
                    {t('onboarding.eula_continue')}
                  </Text>
                </Button>
              </View>
            </SafeAreaView>
          </Theme>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Container covers the entire screen
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: Colors.PRIMARY_TEXT,
    backgroundColor: Colors.WHITE,
  },
  ctaBox: {
    padding: 15,
    paddingTop: 10,
    backgroundColor: Colors.BLUE_RIBBON,
  },
  closeIcon: {
    marginTop: 50,
    marginBottom: 6,
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  smallDescriptionText: {
    fontSize: 14,
    marginVertical: 12,
  },
});

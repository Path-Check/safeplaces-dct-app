import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Linking,
  Modal,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import loadLocalResource from 'react-native-local-resource';
import WebView from 'react-native-webview';

import { Button, Checkbox, IconButton, Typography } from '../components';
import en from '../locales/eula/en.html';
import es_PR from '../locales/eula/es_PR.html';
import ht from '../locales/eula/ht.html';

import { Icons } from '../assets';
import {
  Spacing,
  Buttons,
  Colors,
  Typography as TypographyStyles,
} from '../styles';

const EULA_FILES = { en, es_PR, ht };

const DEFAULT_EULA_URL = 'about:blank';

export const EulaModal = ({ selectedLocale, continueFunction }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const [html, setHtml] = useState(undefined);
  const { t } = useTranslation();

  // Pull the EULA in the correct language, with en as fallback
  const eulaPath = EULA_FILES[selectedLocale] || en;

  // Any links inside the EULA should launch a separate browser otherwise you can get stuck inside the app
  const shouldStartLoadWithRequestHandler = (webViewState) => {
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

  const handleOnPressGetStarted = () => setModalVisibility(true);
  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOnPressGetStarted}>
        <Typography style={styles.buttonText}>
          {t('label.launch_get_started')}
        </Typography>
      </TouchableOpacity>
      <Modal animationType='slide' transparent visible={modalVisible}>
        <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 7, paddingHorizontal: 5 }}>
              <IconButton
                icon={Icons.Close}
                size={20}
                style={styles.closeIcon}
                accessible
                accessibilityLabel={t('label.close_icon')}
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
          <SafeAreaView style={{ backgroundColor: Colors.secondaryBlue }}>
            <View style={styles.ctaBox}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  label={t('onboarding.eula_checkbox')}
                  onPress={() => toggleCheckbox(!boxChecked)}
                  checked={boxChecked}
                />
                <Typography style={styles.smallDescriptionText}>
                  {t('onboarding.eula_message')}
                </Typography>
              </View>
              <Button
                label={t('onboarding.eula_continue')}
                disabled={!canContinue}
                onPress={() => {
                  setModalVisibility(false);
                  continueFunction();
                }}
              />
            </View>
          </SafeAreaView>
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
    color: Colors.primaryText,
    backgroundColor: Colors.white,
  },
  ctaBox: {
    padding: Spacing.medium,
    backgroundColor: Colors.secondaryBlue,
  },
  checkboxContainer: {
    paddingBottom: Spacing.medium,
  },
  closeIcon: {
    padding: Spacing.xSmall,
    alignSelf: 'flex-end',
  },
  smallDescriptionText: {
    ...TypographyStyles.label,
    color: Colors.invertedText,
  },
  button: {
    ...Buttons.largeWhite,
  },
  buttonText: {
    ...TypographyStyles.buttonTextDark,
  },
});

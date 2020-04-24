import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import closeIcon from '../assets/images/closeIcon.png';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';
import en_html from '../locales/eula/en_html';
import ht_html from '../locales/eula/ht_html';
import ButtonWrapper from './ButtonWrapper';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';

const EULA_FILES = {
  en: en_html,
  ht: ht_html,
};

const webViewScrollDetection = `
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If 'immediate' is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  function scrollHandler() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 30) {
      window.ReactNativeWebView.postMessage('end');
    } else {
      window.ReactNativeWebView.postMessage('scroll');
    }
  }

  setTimeout(() => {
    window.addEventListener('scroll', debounce(scrollHandler, 150));
  }, 300);
  true;
`;

export const EulaModal = ({ selectedLocale, continueFunction }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const [hasScrolledToEnd, setScrolledToEnd] = useState();
  const { t } = useTranslation();

  // reset the scroll check if language changes
  useEffect(() => {
    setScrolledToEnd(false);
  }, [selectedLocale]);

  /**
   * Set scrolled to end when end reached, and never untoggle it if scrolling
   * back up
   */
  const handleWebViewMessage = event => {
    if (!hasScrolledToEnd && event.nativeEvent.data === 'end') {
      setScrolledToEnd(true);
    }
  };

  // Pull the EULA in the correct language, with en as fallback
  const html = EULA_FILES[selectedLocale] || en_html;

  const canContinue = boxChecked; // && hasScrolledToEnd;

  return (
    <>
      <ButtonWrapper
        title={t('label.launch_get_started')}
        onPress={() => setModalVisibility(true)}
        buttonColor={Colors.VIOLET}
        bgColor={Colors.WHITE}
      />
      <Modal animationType='slide' transparent visible={modalVisible}>
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 7, paddingHorizontal: 5, paddingBottom: 0 }}>
              <TouchableOpacity onPress={() => setModalVisibility(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
              <WebView
                style={{ flex: 1 }}
                source={{ html }}
                onMessage={handleWebViewMessage}
                javaScriptEnabled
                injectedJavaScript={webViewScrollDetection}
              />
            </View>
          </SafeAreaView>
          <Theme use='violet'>
            <SafeAreaView style={{ backgroundColor: Colors.VIOLET_BUTTON }}>
              <View style={styles.ctaBox}>
                <Checkbox
                  label={t('onboarding.eula_checkbox')}
                  onPress={() => toggleCheckbox(!boxChecked)}
                  checked={boxChecked}
                />
                <Typography style={styles.smallDescriptionText}>
                  {t('onboarding.eula_message')}
                </Typography>
                <ButtonWrapper
                  title={t('onboarding.eula_continue')}
                  buttonColor={canContinue ? Colors.VIOLET : Colors.GRAY_BUTTON}
                  bgColor={canContinue ? Colors.WHITE : Colors.LIGHT_GRAY}
                  buttonWidth={'100%'}
                  disabled={!canContinue}
                  onPress={() => {
                    setModalVisibility(false);
                    continueFunction();
                  }}
                />
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
    paddingTop: 0,
    backgroundColor: Colors.VIOLET_BUTTON,
  },
  closeIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  smallDescriptionText: {
    fontSize: 14,
    marginVertical: 12,
  },
});

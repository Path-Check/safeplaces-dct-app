import React, { useState } from 'react';
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

export const EulaModal = ({ selectedLocale, continueFunction }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const { t } = useTranslation();

  // Pull the EULA in the correct language, with en as fallback
  const html = EULA_FILES[selectedLocale] || en_html;

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
            <View style={{ flex: 7, paddingHorizontal: 25, paddingBottom: 0 }}>
              <TouchableOpacity onPress={() => setModalVisibility(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
              <WebView style={{ flex: 1 }} source={{ html }} />
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
                  buttonColor={boxChecked ? Colors.VIOLET : Colors.GRAY_BUTTON}
                  bgColor={boxChecked ? Colors.WHITE : Colors.LIGHT_GRAY}
                  buttonWidth={'100%'}
                  disabled={!boxChecked}
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
    padding: 25,
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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';

import closeIcon from './../assets/images/closeIcon.png';
import { eula_en } from './../locales/eula/eula_en';
import { eula_ht } from './../locales/eula/eula_ht';
import colors from '../constants/colors';
import Colors from '../constants/colors';
import { Theme } from '../constants/themes';
import ButtonWrapper from './ButtonWrapper';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';

const EULA_LANGUAGES = {
  en: eula_en,
  ht: eula_ht,
};

export const EulaModal = ({ selectedLocale, continueFunction }) => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const { t } = useTranslation();

  // Pull the EULA in the correct language, with en as fallback
  const eulaText = EULA_LANGUAGES[selectedLocale] || eula_en;

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
            <View style={{ flex: 7, padding: 25, paddingBottom: 0 }}>
              <TouchableOpacity onPress={() => setModalVisibility(false)}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
              <ScrollView>
                <Markdown style={{ body: { color: Colors.DARK_GRAY } }}>
                  {eulaText}
                </Markdown>
              </ScrollView>
            </View>
          </SafeAreaView>
          <Theme use='violet'>
            <SafeAreaView style={{ backgroundColor: Colors.VIOLET_BUTTON }}>
              <View style={styles.ctaBox}>
                <Checkbox
                  onPressFunction={() => toggleCheckbox(!boxChecked)}
                  boxChecked={boxChecked}
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
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
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

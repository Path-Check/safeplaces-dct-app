import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';

import closeIcon from './../assets/images/closeIcon.png';
import { eula_en } from './../locales/eula/eula_en';
import { eula_es } from './../locales/eula/eula_es';
import colors from '../constants/colors';
import Colors from '../constants/colors';
import ButtonWrapper from './ButtonWrapper';
import { Checkbox } from './Checkbox';
import { Typography } from './Typography';

export const EulaModal = props => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);
  const { t } = useTranslation();

  // Pull the EULA in the correct language, with en as fallback
  let eulaText = eula_en;
  const eulaLanguages = {
    en: eula_en,
    es: eula_es,
  };

  eulaLanguages[props.selectedLocale] !== undefined
    ? (eulaText = eulaLanguages[props.selectedLocale])
    : console.log('Lang not found, reverting to en');

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
                props.continueFunction();
              }}
            />
          </View>
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
    flex: 2,
    padding: 25,
    justifyContent: 'space-between',
    backgroundColor: Colors.VIOLET_BUTTON,
  },
  closeIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
    opacity: 0.7,
    alignSelf: 'flex-end',
  },
  checkboxText: {
    color: Colors.WHITE,
    fontSize: 18,
  },
  smallDescriptionText: {
    color: Colors.WHITE,
    fontSize: 14,
  },
});

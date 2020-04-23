import React, { useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import closeIcon from './../assets/images/closeIcon.png';
import colors from '../constants/colors';
import Colors from '../constants/colors';
import languages from '../locales/languages';
import ButtonWrapper from './ButtonWrapper';
import { Checkbox } from './Checkbox';

export const EulaModal = props => {
  const [modalVisible, setModalVisibility] = useState(false);
  const [boxChecked, toggleCheckbox] = useState(false);

  return (
    <>
      <ButtonWrapper
        title={languages.t('label.launch_get_started')}
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
                {languages.t('markdown.eula')}
              </Markdown>
            </ScrollView>
          </View>
          <View style={styles.ctaBox}>
            <Checkbox
              onPressFunction={() => toggleCheckbox(!boxChecked)}
              boxChecked={boxChecked}
            />
            <Text style={styles.smallDescriptionText}>
              {languages.t('label.eula_message')}
            </Text>
            <ButtonWrapper
              title={languages.t('label.eula_continue')}
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

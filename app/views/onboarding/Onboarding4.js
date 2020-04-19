import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import BackgroundImage from './../../assets/images/launchScreen1.png';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import fontFamily from '../../constants/fonts';
import languages from '../../locales/languages';

const width = Dimensions.get('window').width;

const Onboarding = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signedEula, setSignedEula] = useState(false);
  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent={true}
      />
      <View style={styles.centeredView}>
        <Modal
          animationType='slide'
          transparent={true} // eslint-disable-line react/jsx-boolean-value
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View
            style={[
              styles.overlay,
              { flex: 1, alignItems: 'center', justifyContent: 'center' },
            ]}>
            <View style={styles.modalView}>
              <ScrollView>
                <Text style={styles.subheaderText}>
                  {languages.t('label.launch_eula_title')}
                </Text>
                <Text style={styles.modalContent}>
                  {languages.t('label.launch_eula_content')}
                </Text>
                <View style={styles.modalButtons}>
                  <ButtonWrapper
                    title={languages.t('label.launch_eula_not_agree')}
                    onPress={() => {
                      setSignedEula(false);
                      setModalVisible(false);
                    }}
                    buttonColor={Colors.WHITE}
                    bgColor={Colors.VIOLET_BUTTON}
                  />
                  <ButtonWrapper
                    title={languages.t('label.launch_eula_agree')}
                    onPress={() => {
                      setSignedEula(true);
                      setModalVisible(false);
                    }}
                    buttonColor={Colors.WHITE}
                    bgColor={Colors.GREEN}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
      <ImageBackground
        source={BackgroundImage}
        style={styles.backgroundImage}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>
          {languages.t('label.launch_screen4_header')}
        </Text>
        <Text style={styles.subheaderText}>
          {languages.t('label.launch_screen4_subheader')}
        </Text>
      </View>
      <View style={styles.footerContainer}>
        <ButtonWrapper
          title={
            signedEula
              ? languages.t('label.launch_set_up_phone')
              : languages.t('label.launch_sign_eula')
          }
          onPress={() => {
            signedEula
              ? props.navigation.replace('Onboarding5')
              : setModalVisible(!modalVisible);
          }}
          buttonColor={Colors.WHITE}
          bgColor={Colors.VIOLET_BUTTON}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    top: '-10%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.INTRO_WHITE_BG,
  },
  contentContainer: {
    width: width * 0.9,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    color: Colors.VIOLET,
    fontSize: 26,
    width: width * 0.7,
    fontFamily: fontFamily.primaryMedium,
  },
  subheaderText: {
    marginTop: '10%',
    color: Colors.VIOLET,
    fontSize: 26,
    //width: width * 0.6,
    fontFamily: fontFamily.primaryRegular,
    textAlign: 'center',
  },
  modalContent: {
    marginTop: '6%',
    color: Colors.VIOLET,
    fontSize: 20,
    width: width * 0.6,
    fontFamily: fontFamily.primaryRegular,
  },
  modalButtons: {
    //flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: '10%',
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  modalView: {
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#06273F80',
  },
});

export default Onboarding;

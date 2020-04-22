import React, { Component } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import closeIcon from './../assets/images/closeIcon.png';
import colors from '../constants/colors';
import Colors from '../constants/colors';
// import { Typography } from './Typography';
import fontFamily from '../constants/fonts';
import languages from '../locales/languages';
import ButtonWrapper from './ButtonWrapper';

export default class EulaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      boxChecked: false,
    };
  }

  render() {
    return (
      <>
        <ButtonWrapper
          title={languages.t('label.launch_get_started')}
          onPress={() => this.setState({ modalVisible: true })}
          buttonColor={Colors.VIOLET}
          bgColor={Colors.WHITE}
        />
        <Modal
          animationType='slide'
          transparent
          visible={this.state.modalVisible}>
          <View style={styles.container}>
            <View style={{ flex: 6, padding: 30 }}>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
              <ScrollView>
                <Text>EULA texts</Text>
              </ScrollView>
            </View>
            <View style={styles.ctaBox}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() =>
                  this.setState({ boxChecked: !this.state.boxChecked })
                }>
                <Image
                  source={
                    this.state.boxChecked === true
                      ? boxCheckedIcon
                      : boxUncheckedIcon
                  }
                  style={{ width: 25, height: 25, marginRight: 10 }}
                />
                <Text style={styles.checkboxText}>
                  I accept the licensing agreement
                </Text>
              </TouchableOpacity>
              <Text style={styles.smallDescriptionText}>
                *You must accept in order to use Safe Paths
              </Text>
              <ButtonWrapper
                title='Continue'
                buttonColor={Colors.VIOLET}
                bgColor={Colors.WHITE}
                buttonWidth={'100%'}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

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
    padding: 30,
    justifyContent: 'space-between',
    backgroundColor: Colors.VIOLET_BUTTON,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamily.primaryBold,
    color: Colors.VIOLET_TEXT,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
    overflow: 'scroll',
    color: Colors.VIOLET_TEXT,
    fontFamily: fontFamily.primaryRegular,
  },
  closeIcon: {
    width: 20,
    height: 20,
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

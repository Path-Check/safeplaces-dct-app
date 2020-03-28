import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import languages from '../../app/locales/languages';
import { GetStoreData } from '../../app/helpers/General';
import { hasFormsLeft, getWaitTimeLeft } from '../formLimitations';

const width = Dimensions.get('window').width;

class FormButtons extends Component {
  newForm = async () => {
    const hasForms = await hasFormsLeft();
    if (!hasForms) {
      Alert.alert(
        languages.t('label.FORMGENERAL_COUNTLIMIT_TITLE'),
        languages.t('label.FORMGENERAL_COUNTLIMIT_MESSAGE'),
      );
      return;
    }

    const timeLeft = await getWaitTimeLeft();
    if (timeLeft > 0) {
      Alert.alert(
        languages.t('label.FORMGENERAL_TIMELIMIT_TITLE'),
        languages.t('label.FORMGENERAL_TIMELIMIT_MESSAGE', {
          minutes: timeLeft,
        }),
      );
      return;
    }

    this.props.navigation.navigate('FormGeneralNewScreen', {});
  };

  render() {
    return (
      <View style={styles.actionButtonsView}>
        {false && (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('FormWorkScreen', {})}
            style={styles.actionButtonsTouchable}>
            <Text style={styles.actionButtonHead}>
              {languages.t('label.FORM_A')}
            </Text>
            <Text style={styles.actionButtonText}>
              {languages.t('label.FORMWORK')}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={this.newForm}
          style={styles.actionButtonsTouchable}>
          <Text style={styles.actionButtonHead}>&#9997;</Text>
          <Text style={styles.actionButtonText}>
            {languages.t('label.FORMGENERAL_NEW')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('FormGeneralActiveScreen', {})
          }
          style={styles.actionButtonsTouchable}>
          <Text style={styles.actionButtonHead}>&#128196;</Text>
          <Text style={styles.actionButtonText}>
            {languages.t('label.FORMGENERAL_ACTIVE')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonsView: {
    width: width * 0.7866,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  actionButtonsTouchable: {
    height: 76,
    borderRadius: 8,
    backgroundColor: '#454f63',
    width: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonImage: {
    height: 21.6,
    width: 32.2,
  },
  actionButtonText: {
    opacity: 0.56,
    fontFamily: 'OpenSans-Bold',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 3,
  },
  actionButtonHead: {
    opacity: 1,
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    lineHeight: 17,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 3,
  },
});

export default FormButtons;

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import { GetStoreData, SetStoreData } from '../../app/helpers/General';
import colors from '../../app/constants/colors';
import { WebView } from 'react-native-webview';
import Button from '../../app/components/Button';
import backArrow from '../../app/assets/images/backArrow.png';
import languages from '../../app/locales/languages';

const width = Dimensions.get('window').width;

class FormWork extends Component {
  state = {
    name: '',
    company: '',
    identification: '',
    area: '',
    timeStart: '',
    timeEnd: '',
    supervisor: '',
    date: '',
  };
  backToMain = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {});
  };

  handleBackPress = () => {
    this.backToMain();
    return true;
  };

  componentDidMount = () => {
    GetStoreData('FORMWORK', false).then((state) => this.setState(state));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  };

  submitForm = () => {
    SetStoreData('FORMWORK', this.state).then(() => this.backToMain());
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backArrowTouchable}
            onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {languages.t('label.FORMWORK')}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.main}>
          <Text style={styles.label}>{languages.t('label.FORMWORK_NAME')}</Text>
          <TextInput
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            style={styles.input}
          />
          <Text style={styles.label}>
            {languages.t('label.FORMWORK_COMPANY')}
          </Text>
          <TextInput
            onChangeText={(company) => this.setState({ company })}
            value={this.state.company}
            style={styles.input}
          />
          <Text style={styles.label}>
            {languages.t('label.FORMWORK_IDENTIFICATION')}
          </Text>
          <TextInput
            onChangeText={(identification) => this.setState({ identification })}
            value={this.state.identification}
            style={styles.input}
          />
          <Text style={styles.label}>{languages.t('label.FORMWORK_AREA')}</Text>
          <TextInput
            onChangeText={(area) => this.setState({ area })}
            value={this.state.area}
            style={styles.input}
          />
          <Text style={styles.label}>
            {languages.t('label.FORMWORK_TIMES')}
          </Text>
          <View style={styles.timesView}>
            <Text>({languages.t('label.FROM')})</Text>
            <TextInput
              onChangeText={(timeStart) => this.setState({ timeStart })}
              value={this.state.timeStart}
              style={styles.inputTime}
            />
            <Text>({languages.t('label.TO')})</Text>
            <TextInput
              onChangeText={(timeEnd) => this.setState({ timeEnd })}
              value={this.state.timeEnd}
              style={styles.inputTime}
            />
          </View>
          <Text style={styles.label}>
            {languages.t('label.FORMWORK_SUPERVISOR')}
          </Text>
          <TextInput
            onChangeText={(supervisor) => this.setState({ supervisor })}
            value={this.state.supervisor}
            style={styles.input}
          />
          <Text style={styles.label}>{languages.t('label.FORMWORK_DATE')}</Text>
          <TextInput
            onChangeText={(date) => this.setState({ date })}
            value={this.state.date}
            style={styles.input}
          />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.submit} onPress={this.submitForm}>
              <Text style={styles.submitText}>
                {languages.t('label.FORMWORK_SUBMIT')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  submit: {
    width: '60%',
    borderRadius: 10,
    padding: 10,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#665eff',
  },
  submitText: {
    lineHeight: 40,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(189, 195, 199,0.6)',
  },
  backArrowTouchable: {
    width: 60,
    height: 60,
    paddingTop: 21,
    paddingLeft: 20,
  },
  backArrow: {
    height: 18,
    width: 18.48,
  },
  input: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 20,
  },
  inputTime: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    height: 50,
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 20,
    width: width * 0.3,
  },
  timesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 26,
    fontFamily: 'OpenSans-Bold',
    top: 21,
  },
});

export default FormWork;

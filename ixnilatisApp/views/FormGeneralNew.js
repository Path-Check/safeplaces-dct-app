import React, {
  Component
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  View,
  Picker,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,BackHandler
} from 'react-native';

import {GetStoreData, SetStoreData} from '../../app/helpers/General';
import colors from "../../app/constants/colors";
import {
  WebView
} from 'react-native-webview';
import Button from "../../app/components/Button";
import backArrow from '../../app/assets/images/backArrow.png'
import I18n from "../../I18n";
import DateTimePicker from '@react-native-community/datetimepicker';

const width = Dimensions.get('window').width;

class FormGeneral extends Component {
  state = {
    name: "",
    dateBirth: "",
    address: "",
    reason: "",
    reasonOther: "",
    showDatePicker : false
  }
  backToMain = () => {
    this.props.navigation.navigate('LocationTrackingScreen', {})
  }

  handleBackPress = () => {     
    this.backToMain();
    return true;   
  };  

  componentDidMount = () =>{
    GetStoreData('FORMGENERAL', false).then(state => this.setState({
      ...state,
      dateBirth: new Date(state.dateBirth),
      reason: "",
      reasonOther: "",
    }));
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress); 
  }

  componentWillUnmount = () => { 
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress); 
  }

  formatDate = d => {
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  }

  submitForm = () => { 
    if ( this.state.reason == "" ) {
      Alert.alert(I18n.t('FORMGENERAL_NOREASON_TITLE'),I18n.t('FORMGENERAL_NOREASON_MESSAGE'));
      return;
    }
    if ( this.state.reason == 9 && this.state.reasonOther == "" ) {
      Alert.alert(I18n.t('FORMGENERAL_NOREASONOTHER_TITLE'),I18n.t('FORMGENERAL_NOREASONOTHER_MESSAGE'));
      return;
    }
    const {name, dateBirth, address, reason, reasonOther } = this.state;
    const formData = {
      name, 
      dateBirth,
      address, 
      reason, 
      reasonOther,
      date: new Date()
    }
    SetStoreData('FORMGENERAL', formData).then(() => this.backToMain());
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backArrowTouchable} onPress={() => this.backToMain()}>
            <Image style={styles.backArrow} source={backArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{I18n.t('FORMGENERAL_NEW')}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.main}>
          <Text style={styles.label}>{I18n.t('FORMGENERAL_NAME')}</Text>
          <TextInput 
            onChangeText={name => this.setState({name})} 
            value={this.state.name} 
            style={styles.input}
          />
          <Text style={styles.label}>{I18n.t('FORMGENERAL_DATEBIRTH')}</Text>
          <TouchableOpacity onPress={() => this.setState({showDatePicker: true})}>
            <Text style={{...styles.input, paddingTop: 10}} >{this.state.dateBirth ? this.formatDate(this.state.dateBirth) : '-'}</Text>
          </TouchableOpacity>
          {this.state.showDatePicker && 
            <DateTimePicker 
              value={this.state.dateBirth ? this.state.dateBirth : new Date()} 
              display="default" 
              onChange={(e,dateBirth) => {
                this.setState({
                  dateBirth,
                  showDatePicker: Platform.OS === 'ios'
                })
              }
              }
            />
          }
          <Text style={styles.label}>{I18n.t('FORMGENERAL_ADDRESS')}</Text>
          <TextInput 
            onChangeText={address => this.setState({address})} 
            value={this.state.address} 
            style={styles.input}
          />
          <Text style={styles.label}>{I18n.t('FORMGENERAL_REASON')}</Text>
          <Picker 
            onValueChange={reason => this.setState({reason})} 
            selectedValue={this.state.reason} 
            style={styles.picker}
          >
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_SELECT')} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_1')} value={1} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_2')} value={2} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_3')} value={3} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_4')} value={4} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_5')} value={5} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_6')} value={6} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_7')} value={7} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_8')} value={8} />
            <Picker.Item label={I18n.t('FORMGENERAL_REASON_9')} value={9} />
          </Picker>
          <Text style={{padding: 10}}>{this.state.reason && I18n.t('FORMGENERAL_REASON_'+this.state.reason)}</Text>
          {this.state.reason == 9 && 
            <TextInput 
              onChangeText={reasonOther => this.setState({reasonOther})} 
              value={this.state.reasonOther} 
              style={styles.input}
              placeholder={I18n.t('FORMGENERAL_REASON_OTHER')}
            />
          }
          <View style={{alignItems: "center"}} >
            <TouchableOpacity style={styles.submit} onPress={this.submitForm}>
              <Text style={styles.submitText}>{I18n.t('FORMWORK_SUBMIT')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginTop: 20,
    marginLeft: 5,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    color: colors.PRIMARY_TEXT,
    backgroundColor: colors.WHITE,
  },
  submit: {
    width: "60%",
    borderRadius: 10,
    padding: 10,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#665eff"
  },
  submitText: {
    lineHeight: 40,
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
  },
  headerContainer: {
    flexDirection: 'row',
    height:60,
    borderBottomWidth:1,
    borderBottomColor:'rgba(189, 195, 199,0.6)'
  },
  backArrowTouchable:{
    width:60,
    height:60,
    paddingTop:21,
    paddingLeft:20
  },
  backArrow: {
    height: 18, 
    width: 18.48
  },
  input: {
    borderColor: '#CCCCCC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 20
  },
  headerTitle:{
    fontSize: 24,
    lineHeight: 26,
    fontFamily:'OpenSans-Bold',
    top:21
  },
  picker:{
  },
});

export default FormGeneral;

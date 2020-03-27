import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
} from 'react-native';
const width = Dimensions.get('window').width;
import PKLogo from './../../assets/images/PKLogo.png';
import languages from './../../locales/languages';

const SimpleWelcomeScreen = props => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoCard}>
        <Image source={PKLogo} style={styles.infoCardImage} />
        <Text style={styles.infoCardHeadText}>
          {languages.t('label.intro_title')}
        </Text>
        <Text style={styles.infoCardSubheadText}>
          {languages.t('label.intro_subtitle')}
        </Text>
        <Text style={styles.infoCardBodyText}>
          {languages.t('label.intro_description_0')}
        </Text>
        <Text style={styles.infoCardBodyText}>
          {languages.t('label.intro_description_1')}
        </Text>
        <Text style={styles.infoCardBodyText}>
          {languages.t('label.intro_description_2')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('LocationTrackingScreen')}
          style={styles.primaryButtonTouchable}>
          <Text style={styles.primaryButtonText}>
            {languages.t('label.intro_get_started')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity><Text style={{marginTop:12,fontFamily:'OpenSans-SemiBold',alignSelf:'center',color:'#665eff'}}>Skip this</Text></TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  infoCard: {
    width: width * 0.7866,
    height: '70%',
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: '9%',
    justifyContent: 'center',
  },
  infoCardImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  },
  infoCardHeadText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  infoCardSubheadText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 0,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  infoCardBodyText: {
    opacity: 0.8,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    maxWidth: '84%',
    alignSelf: 'center',
    marginTop: 20,
  },
  primaryButtonTouchable: {
    borderRadius: 12,
    backgroundColor: '#665eff',
    height: 52,
    alignSelf: 'center',
    width: width * 0.38,
    marginTop: 30,
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.7866,
    alignSelf: 'center',
  },
  secondaryButtonTouchable: {
    borderRadius: 12,
    backgroundColor: 'rgba(120, 132, 158, 0.16)',
    height: 52,
    alignSelf: 'center',
    width: width * 0.38,
    marginTop: 30,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#454f63',
  },
});

export default SimpleWelcomeScreen;

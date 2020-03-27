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

const DescriptionComponent = ({ icon, header, subheader, ...props }) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionIcon}>{icon}</Text>
    <View style={styles.descriptionTextContainer}>
      <Text style={styles.descriptionHeaderText}>{header}</Text>
      <Text style={styles.descriptionSubheaderText}>{subheader}</Text>
    </View>
  </View>
);

const SimpleWelcomeScreen = props => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoCard}>
        <View style={styles.imageContainer}>
          <Image source={PKLogo} style={styles.infoCardImage} />
        </View>
        <Text style={styles.infoCardHeadText}>
          {languages.t('label.intro_title')}
        </Text>
        <Text style={styles.infoCardSubheadText}>
          {languages.t('label.intro_subtitle')}
        </Text>
        <View style={styles.descriptionsContainer}>
          <DescriptionComponent
            icon={languages.t('label.intro_emoji_0')}
            header={languages.t('label.intro_header_0')}
            subheader={languages.t('label.intro_subheader_0')}
          />
          <DescriptionComponent
            icon={languages.t('label.intro_emoji_1')}
            header={languages.t('label.intro_header_1')}
            subheader={languages.t('label.intro_subheader_1')}
          />
          <DescriptionComponent
            icon={languages.t('label.intro_emoji_2')}
            header={languages.t('label.intro_header_2')}
            subheader={languages.t('label.intro_subheader_2')}
          />
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  infoCard: {
    width: width * 0.9,
    height: '75%',
    alignSelf: 'center',
    marginTop: '8%',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: '3%',
  },
  infoCardImage: {
    width: width,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  infoCardHeadText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 40,
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  infoCardSubheadText: {
    fontFamily: 'OpenSans-Light',
    fontSize: 20,
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
    width: width * 0.7,
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
  descriptionsContainer: {
    marginTop: '5%',
    width: width * 0.7,
    flex: 1,
    alignSelf: 'center',
    paddingRight: '5%',
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  descriptionIcon: {
    fontSize: 40,
    textAlign: 'center',
    alignSelf: 'center',
  },
  descriptionTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '5%',
  },
  descriptionHeaderText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  descriptionSubheaderText: {
    fontFamily: 'OpenSans-Light',
    fontSize: 14,
    color: '#000000',
  },
});

export default SimpleWelcomeScreen;

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
import IconLogo from './../../assets/images/PKLogo.png';
import IconGlobe from './../../assets/svgs/intro-globe';
import IconLocked from './../../assets/svgs/intro-locked';
import IconSiren from './../../assets/svgs/intro-siren';
import languages from './../../locales/languages';
import ButtonWrapper from '../../components/ButtonWrapper';
import Colors from '../../constants/colors';
import FontWeights from '../../constants/fontWeights';
import { SvgXml } from 'react-native-svg';

const DescriptionComponent = ({ icon, header, subheader, ...props }) => (
  <View style={styles.descriptionContainer}>
    <View style={styles.descriptionIconContainer}>{icon}</View>
    <View style={styles.descriptionTextContainer}>
      <Text style={styles.descriptionHeaderText}>{header}</Text>
      <Text style={styles.descriptionSubheaderText}>{subheader}</Text>
    </View>
  </View>
);

const ICON_SIZE = 35;

const SimpleWelcomeScreen = props => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoCard}>
        <View style={styles.imageContainer}>
          <Image source={IconLogo} style={styles.infoCardImage} />
        </View>
        <Text style={styles.infoCardHeadText}>
          {languages.t('label.private_kit')}
        </Text>
        <Text style={styles.infoCardSubheadText}>
          {languages.t('label.intro_subtitle')}
        </Text>
        <View style={styles.descriptionsContainer}>
          <DescriptionComponent
            icon={
              <SvgXml xml={IconGlobe} width={ICON_SIZE} height={ICON_SIZE} />
            }
            header={languages.t('label.intro_header_0')}
            subheader={languages.t('label.intro_subheader_0')}
          />
          <DescriptionComponent
            icon={
              <SvgXml xml={IconLocked} width={ICON_SIZE} height={ICON_SIZE} />
            }
            header={languages.t('label.intro_header_1')}
            subheader={languages.t('label.intro_subheader_1')}
          />
          <DescriptionComponent
            icon={
              <SvgXml xml={IconSiren} width={ICON_SIZE} height={ICON_SIZE} />
            }
            header={languages.t('label.intro_header_2')}
            subheader={languages.t('label.intro_subheader_2')}
          />
        </View>
      </View>

      <ButtonWrapper
        title={languages.t('label.intro_get_started')}
        onPress={() => {
          props.navigation.replace('LocationTrackingScreen');
          props.navigation.navigate('LocationTrackingScreen');
        }}
        bgColor={Colors.BLUE_BUTTON}
        toBgColor={Colors.BLUE_TO_BUTTON}
      />
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
    fontWeight: FontWeights.BOLD,
    fontSize: 40,
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  infoCardSubheadText: {
    fontWeight: FontWeights.LIGHT,
    fontSize: 20,
    lineHeight: 0,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
  },
  infoCardBodyText: {
    opacity: 0.8,
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#000000',
    maxWidth: '84%',
    alignSelf: 'center',
    marginTop: 20,
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
  descriptionIconContainer: {
    alignSelf: 'center',
  },
  descriptionIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  descriptionTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: '5%',
  },
  descriptionHeaderText: {
    fontWeight: FontWeights.SEMIBOLD,
    fontSize: 14,
    color: '#000000',
  },
  descriptionSubheaderText: {
    fontWeight: FontWeights.LIGHT,
    fontSize: 14,
    color: '#6A6A6A',
  },
});

export default SimpleWelcomeScreen;

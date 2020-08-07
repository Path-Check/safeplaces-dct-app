import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { SvgXml } from 'react-native-svg';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Typography } from '../../components/Typography';

import { Images, Icons } from '../../assets';
import { Colors } from '../../styles';

// For fixing image width issues
const win = Dimensions.get('window');

type PartnersScreenProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const PartnersIllustration = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        maxHeight: (win.width * 900) / 1125,
        flexGrow: 1,
        overflow: 'hidden',
      }}>
      <Image
        // Hard code to the dimensions of the image. Fixes ScrollView issues
        style={{
          width: win.width,
          height: (win.width * 900) / 1125,
          position: 'absolute',
        }}
        resizeMode={'contain'}
        source={Images.Doctors}
        accessible
        accessibilityLabel={t('label.doctors_image')}
      />
      {/* Mask over the bottom of the image so it has a curve on the bottom, regardless of height */}
      <Image
        source={Images.CurveMask}
        style={{
          width: win.width,
          height: (win.width * 120) / 1125,
          position: 'absolute',
          bottom: 0,
        }}
        resizeMode={'cover'}
      />
    </View>
  );
};

const PartnersScreen = ({ navigation }: PartnersScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const navigateToViewHAs = () => navigation.navigate('PartnersEdit');

  return (
    <NavigationBarWrapper
      title={t('authorities.title')}
      includeBackButton={false}>
      <ScrollView
        style={styles.backgroundWrapper}
        alwaysBounceVertical={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {win.height < 600 ? (
          <View style={{ height: 20 }} />
        ) : (
          <PartnersIllustration />
        )}
        <View style={styles.horizontalPadding}>
          <Typography use={'headline2'}>{t('authorities.title')}</Typography>
          <View style={{ height: 8 }} />
          <Typography use={'body1'}>{t('authorities.info_body')}</Typography>
        </View>
        <View style={{ height: 20 }} />
        {/* Outside horizontal padding so touchable is full width */}
        <View style={styles.divider} />
        <TouchableHighlight
          underlayColor={Colors.underlayPrimaryBackground}
          onPress={navigateToViewHAs}>
          <View
            style={[
              styles.horizontalPadding,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 20,
              },
            ]}>
            <Typography use={'body1'} style={{ fontWeight: '500' }}>
              {t('authorities.view_button_label')}
            </Typography>
            <SvgXml xml={Icons.ChevronRight} />
          </View>
        </TouchableHighlight>
        <View style={styles.divider} />
        <View style={{ height: 24 }} />
      </ScrollView>
    </NavigationBarWrapper>
  );
};
export default PartnersScreen;

const styles = StyleSheet.create({
  backgroundWrapper: {
    backgroundColor: Colors.primaryBackground,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.formInputBorder,
    marginHorizontal: 24,
  },
  horizontalPadding: {
    paddingHorizontal: 24,
  },
});

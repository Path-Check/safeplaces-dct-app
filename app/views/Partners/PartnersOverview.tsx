import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableHighlight,
  Switch,
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

const PartnersScreen = ({ navigation }: PartnersScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const [toggleActive, setToggleActive] = useState(false); // mocked
  const navigateToViewHAs = () => navigation.navigate('PartnersEdit');

  return (
    <NavigationBarWrapper
      title={t('authorities.title')}
      includeBackButton={false}>
      <ScrollView
        style={styles.backgroundWrapper}
        alwaysBounceVertical={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          // Hard code to the dimensions of the image. Fixes ScrollView issues
          style={{
            width: win.width,
            height:
              win.width < 400
                ? (win.width * 900) / 1125 - 100
                : (win.width * 900) / 1125,
          }}
          resizeMode={'contain'}
          source={Images.Doctors}
          accessible
          accessibilityLabel={t('label.doctors_image')}
        />
        <View style={{ height: 20 }} />
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
      {/* UI is ready, this is currently not a feature though. */}
      {__DEV__ && (
        <View style={styles.bottomSheet}>
          <Typography
            style={{
              // Prevent from forcing overflow on parent
              flex: 1,
            }}>
            {t('authorities.automatically_follow')}
          </Typography>
          <View style={{ width: 16 }} />
          <Switch
            trackColor={{
              true: Colors.switchEnabled,
              false: Colors.switchDisabled,
            }}
            value={toggleActive}
            onValueChange={setToggleActive}
          />
        </View>
      )}
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
  bottomSheet: {
    backgroundColor: Colors.bottomSheetBackground,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // TODO: Standardize bottom sheets. We mix shadows & borders.
    // Since this is on a main tab, borders are consistent.
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.formInputBorder,
  },
});

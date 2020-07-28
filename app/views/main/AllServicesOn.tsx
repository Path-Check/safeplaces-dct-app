import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Pulse from 'react-native-pulse';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

import { Icons, Images } from '../../assets';
import { Typography } from '../../components/Typography';

import { styles } from './style';
import { Colors } from '../../styles';
import { Screens } from '../../navigation';

type AllServicesOnProps = {
  noHaAvailable: boolean;
  showAutoSubscribeBanner?: boolean;
};

const useAutoSubscriptionBanner = (showAutoSubscribeBanner: boolean) => {
  const navigation = useNavigation();
  const [showBanner, setShowBanner] = useState(showAutoSubscribeBanner);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () =>
      setShowBanner(false),
    );

    return unsubscribe;
  }, [navigation]);

  return {
    showBanner,
  };
};

export const AllServicesOnScreen = ({
  noHaAvailable,
  showAutoSubscribeBanner = true,
}: AllServicesOnProps): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showBanner } = useAutoSubscriptionBanner(showAutoSubscribeBanner);
  const size = Dimensions.get('window').height;

  // TODO: change this
  const healthAuthorityName = 'placeholder name';

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={Images.BlueGradientBackground}
        style={styles.backgroundImage}>
        <StatusBar
          barStyle='light-content'
          backgroundColor='transparent'
          translucent
        />
        <View style={styles.pulseContainer}>
          <Pulse
            image={{ exportImage: Images.Export }}
            color={Colors.lightestGray}
            numPulses={3}
            diameter={400}
            speed={20}
            duration={2000}
          />
          <SvgXml
            xml={Icons.StateNoContact}
            width={size ? size : 80}
            height={size ? size : 80}
          />
        </View>
      </ImageBackground>

      <View style={styles.mainContainer}>
        <View style={styles.contentAbovePulse} />
        <View style={styles.contentBelowPulse}>
          <Typography style={styles.mainTextBelow}>
            {t('home.gps.all_services_on_header')}
          </Typography>
          <Typography style={styles.subheaderText}>
            {t('home.gps.all_services_on_subheader')}
          </Typography>
          {noHaAvailable && (
            <Typography style={styles.subheaderText}>
              {t('home.gps.all_services_on_no_ha_available')}
            </Typography>
          )}
        </View>
      </View>

      {showBanner && (
        <View style={styles.bottomSheet}>
          <Typography
            style={{
              color: Colors.primaryViolet,
            }}>
            <>
              {t('home.gps.auto_subscribe_text', {
                healthAuthorityName,
              })}
              <Typography
                style={styles.hyperlink}
                // TODO: change this
                onPress={() => navigation.navigate(Screens.PartnersEdit)}>
                {t('home.gps.auto_subscribe_link_text')}
              </Typography>
            </>
          </Typography>
          <View style={{ width: 24 }} />
          {/* TODO: change this */}
          <TouchableOpacity
            onPress={() => navigation.navigate(Screens.PartnersEdit)}>
            <SvgXml xml={Icons.ChevronRight} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

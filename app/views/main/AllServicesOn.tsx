import React, { useState, useEffect, useCallback } from 'react';
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
import Geolocation from '@react-native-community/geolocation';

import { Icons, Images } from '../../assets';
import { Typography } from '../../components/Typography';

import { styles } from './style';
import { Colors } from '../../styles';
import { Stacks, NavigationProp } from '../../navigation';
import { useSelector, useDispatch } from 'react-redux';
import isAutoSubscriptionEnabledSelector from '../../store/selectors/isAutoSubscriptionEnabledSelector';
import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import { RootState } from '../../store/types';

type AllServicesOnProps = {
  noHaAvailable: boolean;
  navigation: NavigationProp;
};

const useAutoSubscriptionBanner = (
  showAutoSubscribeBanner: boolean,
  navigation: NavigationProp,
) => {
  const [showBanner, setShowBanner] = useState(showAutoSubscribeBanner);

  useEffect(() => {
    const listener = navigation.addListener('blur', () => setShowBanner(false));

    return listener.remove;
  }, [navigation]);

  return {
    showBanner,
  };
};

export const AllServicesOnScreen = ({
  noHaAvailable,
  navigation,
}: AllServicesOnProps): JSX.Element => {
  const size = Dimensions.get('window').height;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [userAutoSubscribed, setUserAutoSubscribed] = useState(false);

  const { showBanner } = useAutoSubscriptionBanner(true, navigation);
  const haName = useSelector(
    (state: RootState) =>
      state.healthcareAuthorities.selectedAuthorities[0]?.name,
  );

  const autoSubscriptionEnabled = useSelector(
    isAutoSubscriptionEnabledSelector,
  );

  const autoSubscribe = useCallback(async () => {
    if (autoSubscriptionEnabled && noHaAvailable && !userAutoSubscribed) {
      Geolocation.getCurrentPosition(({ coords }) => {
        dispatch(
          getHealthcareAuthorities({ autoSubscriptionLocation: coords }),
        );
        setUserAutoSubscribed(true);
      });
    }
  }, [autoSubscriptionEnabled, noHaAvailable, userAutoSubscribed, dispatch]);

  useEffect(() => {
    autoSubscribe();
  }, [autoSubscribe]);

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
                healthAuthorityName: haName,
              })}
              <Typography
                style={styles.hyperlink}
                onPress={() => navigation.navigate(Stacks.Partners)}>
                {t('home.gps.auto_subscribe_link_text')}
              </Typography>
            </>
          </Typography>
          <View style={{ width: 24 }} />
          <TouchableOpacity
            onPress={() => navigation.navigate(Stacks.Partners)}>
            <SvgXml xml={Icons.ChevronRight} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

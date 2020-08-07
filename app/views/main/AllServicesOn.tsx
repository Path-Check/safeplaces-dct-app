import React, { useEffect } from 'react';
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

import { Icons, Images } from '../../assets';
import { Typography } from '../../components/Typography';

import { styles } from './style';
import { Colors, Spacing } from '../../styles';
import { Stacks, NavigationProp } from '../../navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/types';
import toggleAutoSubscriptionBanner from '../../store/actions/healthcareAuthorities/toggleAutoSubscriptionBannerAction';

type AllServicesOnProps = {
  navigation: NavigationProp;
};

export const AllServicesOnScreen = ({
  navigation,
}: AllServicesOnProps): JSX.Element => {
  const size = Dimensions.get('window').height;
  const { t } = useTranslation();

  const { autoSubscription, selectedAuthorities } = useSelector(
    (state: RootState) => state.healthcareAuthorities,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    const listener = navigation.addListener('blur', () => {
      if (
        !autoSubscription.bannerDismissed &&
        autoSubscription.selectedAuthority
      ) {
        dispatch(toggleAutoSubscriptionBanner({ overrideValue: false }));
      }
    });
    return listener.remove;
  }, [navigation, dispatch, autoSubscription]);

  const { bannerDismissed, selectedAuthority } = autoSubscription;

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
          {selectedAuthorities.length === 0 && (
            <Typography style={styles.subheaderText}>
              {t('home.gps.all_services_on_no_ha_available')}
            </Typography>
          )}
        </View>
      </View>

      {!bannerDismissed && !!selectedAuthority && (
        <TouchableOpacity
          style={styles.bottomSheet}
          onPress={() => navigation.navigate(Stacks.Partners)}>
          <View style={{ flex: 1, paddingRight: Spacing.medium }}>
            <Typography
              style={{
                color: Colors.primaryViolet,
              }}>
              <>
                {t('home.gps.auto_subscribe_text', {
                  healthAuthorityName: selectedAuthority.name,
                })}
                <Typography style={styles.hyperlink}>
                  {t('home.gps.auto_subscribe_link_text')}
                </Typography>
              </>
            </Typography>
          </View>
          <SvgXml xml={Icons.ChevronRight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

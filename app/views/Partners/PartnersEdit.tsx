import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import { Icons } from '../../assets';
import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';

import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import getHealthcareAuthoritiesAction from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import type { HealthcareAuthority } from '../../store/types';
import selectedHealthcareAuthoritiesSelector from '../../store/selectors/selectedHealthcareAuthoritiesSelector';
import toggleSelectedHealthcareAuthorityAction from '../../store/actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';

type PartnersEditScreenProps = {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
};

const Separator = () => (
  <View
    style={{
      backgroundColor: Colors.DIVIDER,
      height: StyleSheet.hairlineWidth,
      width: '100%',
    }}
  />
);

const PartnersScreen = ({
  navigation,
}: PartnersEditScreenProps): JSX.Element => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // Fetch list on screen mount
  useEffect(() => {
    dispatch(getHealthcareAuthoritiesAction());
  }, [dispatch]);

  const authorities = useSelector(healthcareAuthorityOptionsSelector);
  const selectedAuthorities = useSelector(
    selectedHealthcareAuthoritiesSelector,
  );

  const isSelected = (HA: HealthcareAuthority) => {
    return !!selectedAuthorities.find(
      ({ internal_id }) => internal_id === HA.internal_id,
    );
  };

  const toggleSelected = (HA: HealthcareAuthority) => {
    dispatch(
      toggleSelectedHealthcareAuthorityAction({
        authority: HA,
        overrideValue: !isSelected(HA),
      }),
    );
  };

  return (
    <NavigationBarWrapper
      title={t('authorities.title')}
      onBackPress={() => navigation.goBack()}>
      <FlatList
        extraData={selectedAuthorities}
        keyExtractor={({ name }, i) => `${name}:${i}`}
        renderItem={({ item: HA }) => (
          <TouchableHighlight
            underlayColor={Colors.UNDERLAY}
            style={{
              paddingVertical: 20,
              paddingHorizontal: 24,
            }}
            onPress={() => toggleSelected(HA)}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Typography
                style={{ fontWeight: '500', paddingRight: 30 }}
                use='body1'>
                {HA.name}
              </Typography>
              {/* Preserve icon positioning to prevent adding wrapping  */}
              <View
                style={{
                  opacity: isSelected(HA) ? 1 : 0,
                }}>
                <SvgXml xml={Icons.Checkmark} width={24} height={24} />
              </View>
            </View>
          </TouchableHighlight>
        )}
        alwaysBounceVertical={!!authorities}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        data={authorities}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size={'large'} />
          </View>
        }
        ItemSeparatorComponent={() => <Separator />}
      />
    </NavigationBarWrapper>
  );
};
export default PartnersScreen;

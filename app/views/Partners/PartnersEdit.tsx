import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableHighlight, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Typography } from '../../components/Typography';

import getHealthcareAuthoritiesAction from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import { HealthcareAuthority, FeatureFlagOption } from '../../store/types';
import selectedHealthcareAuthoritiesSelector from '../../store/selectors/selectedHealthcareAuthoritiesSelector';
import customUrlhealthcareAuthorityOptionsSelector from '../../store/selectors/customUrlhealthcareAuthorityOptionsSelector';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import { Screens, NavigationProp } from '../../navigation';

import toggleSelectedHealthcareAuthorityAction from '../../store/actions/healthcareAuthorities/toggleSelectedHealthcareAuthorityAction';
import { Button } from '../../components/Button';
import NoAuthoritiesMessage from '../../components/NoAuthoritiesMessage';
import FeatureFlag from '../../components/FeatureFlag';

import { Icons } from '../../assets';
import { Colors, Spacing } from '../../styles';

type PartnersEditScreenProps = {
  navigation: NavigationProp;
};

const Separator = () => (
  <View
    style={{
      backgroundColor: Colors.formInputBorder,
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

  const authorityOptions = useSelector(healthcareAuthorityOptionsSelector);
  const authorityOptionsFromCustomUrl = useSelector(
    customUrlhealthcareAuthorityOptionsSelector,
  );
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
      toggleSelectedHealthcareAuthorityAction(
        { authority: HA, overrideValue: !isSelected(HA) },
        { triggerIntersect: true },
      ),
    );
  };

  const authorities = [...authorityOptions, ...authorityOptionsFromCustomUrl];

  return (
    <NavigationBarWrapper
      title={t('authorities.title')}
      onBackPress={() => navigation.goBack()}>
      <FlatList
        extraData={selectedAuthorities}
        keyExtractor={({ name }, i) => `${name}:${i}`}
        renderItem={({ item: HA }) => (
          <TouchableHighlight
            underlayColor={Colors.underlayPrimaryBackground}
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
                style={{ fontWeight: '500', paddingRight: 30, flex: 1 }}
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
          <View style={styles.listEmptyWrapper}>
            <NoAuthoritiesMessage />
          </View>
        }
        ItemSeparatorComponent={() => <Separator />}
      />
      <FeatureFlag flag={FeatureFlagOption.CUSTOM_URL}>
        <View style={{ padding: Spacing.large }}>
          <Button
            invert
            label={t('authorities.custom_url')}
            onPress={() => navigation.navigate(Screens.PartnersCustomUrl)}
          />
        </View>
      </FeatureFlag>
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  listEmptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xLarge,
  },
});
export default PartnersScreen;

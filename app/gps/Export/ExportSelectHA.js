import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableHighlight, View, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import NoAuthoritiesMessage from '../../components/NoAuthoritiesMessage';
import getHealthcareAuthorities from '../../store/actions/healthcareAuthorities/getHealthcareAuthoritiesAction';
import healthcareAuthorityOptionsSelector from '../../store/selectors/healthcareAuthorityOptionsSelector';
import customUrlhealthcareAuthorityOptionsSelector from '../../store/selectors/customUrlhealthcareAuthorityOptionsSelector';

import { Screens, useStatusBarEffect } from '../../navigation';

import { Icons } from '../../assets';
import { Colors, Spacing } from '../../styles';

export const ExportSelectHA = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getHealthcareAuthorities());
  }, [dispatch]);

  const authorityOptions = useSelector(healthcareAuthorityOptionsSelector);
  const authorityOptionsFromCustomUrl = useSelector(
    customUrlhealthcareAuthorityOptionsSelector,
  );

  const authorities = [...authorityOptions, ...authorityOptionsFromCustomUrl];

  const [selectedAuthority, setSelectedAuthority] = useState(null);

  const toggleSelected = (HA) => {
    if (HA === selectedAuthority) {
      setSelectedAuthority(null);
    } else {
      setSelectedAuthority(HA);
    }
  };

  useStatusBarEffect('dark-content');

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <SafeAreaView style={{ flex: 1, paddingBottom: 0 }}>
          <View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                padding: 12,
              }}>
              <IconButton
                icon={Icons.Close}
                size={22}
                color={Colors.primaryViolet}
                onPress={() => navigation.navigate(Screens.ExportStart)}
              />
            </View>
            <Typography use='headline2'>
              {t('export.select_ha_title')}
            </Typography>
          </View>
          <Separator />
          <FlatList
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
                  <View style={{ opacity: selectedAuthority === HA ? 1 : 0 }}>
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
        </SafeAreaView>
        <View style={styles.card}>
          <View style={{ paddingHorizontal: 24, marginVertical: 44 }}>
            <Button
              invert
              label={t('common.next')}
              onPress={() =>
                navigation.navigate(Screens.ExportCodeInput, {
                  selectedAuthority,
                })
              }
              disabled={!selectedAuthority}
            />
          </View>
        </View>
      </View>
    </View>
  );
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

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: Colors.primaryBackgroundFaintShade },
  listEmptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xLarge,
  },
  card: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default ExportSelectHA;

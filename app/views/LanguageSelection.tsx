import React from 'react';
import { FlatList, View, StyleSheet, TouchableHighlight } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { NavigationBarWrapper } from '../components/NavigationBarWrapper';
import { getLocaleList, setUserLocaleOverride } from '../locales/languages';
import { Colors, Spacing } from '../styles';
import { Typography } from '../components/Typography';

const Separator = () => (
  <View
    style={{
      backgroundColor: Colors.primaryBorder,
      height: StyleSheet.hairlineWidth,
      width: '100%',
    }}
  />
);

const LanguageSelection = (): JSX.Element => {
  const {
    i18n: { language },
  } = useTranslation();
  const navigation = useNavigation();
  const localeList = getLocaleList();

  const onSelectLanguage = (locale: string) => {
    setUserLocaleOverride(locale);
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={'Choose Language'}
      includeBackButton
      onBackPress={navigation.goBack}>
      <FlatList
        keyExtractor={(_, i) => `${i}`}
        data={localeList}
        renderItem={({ item: { value, label } }) => (
          <TouchableHighlight
            underlayColor={Colors.underlayPrimaryBackground}
            style={{
              paddingVertical: Spacing.medium,
              paddingHorizontal: Spacing.large,
            }}
            onPress={() => onSelectLanguage(value)}>
            <Typography
              style={{ fontWeight: language === value ? '700' : '500' }}
              use='body1'>
              {label}
            </Typography>
          </TouchableHighlight>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </NavigationBarWrapper>
  );
};

export default LanguageSelection;

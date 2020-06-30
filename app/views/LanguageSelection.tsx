import React from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { NavigationBarWrapper } from '../components/NavigationBarWrapper';
import { getLocaleList, setUserLocaleOverride } from '../locales/languages';
import { Colors } from '../styles';
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
  const { t } = useTranslation();
  const navigation = useNavigation();
  const localeList = getLocaleList();

  const onSelectLanguage = (locale: string) => {
    setUserLocaleOverride(locale);
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={t('common.language')}
      includeBackButton={false}>
      <FlatList
        keyExtractor={(_, i) => `${i}`}
        data={localeList}
        renderItem={({ item: { value, label } }) => (
          <TouchableOpacity
            style={{
              paddingVertical: 20,
              paddingHorizontal: 24,
            }}
            onPress={() => onSelectLanguage(value)}>
            <Typography style={{ fontWeight: '500' }} use='body1'>
              {label}
            </Typography>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    </NavigationBarWrapper>
  );
};

export default LanguageSelection;

import findIndex from 'lodash/findIndex';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';

import { Typography } from '../components/Typography';
import Colors from '../constants/colors';

export const TrustedSourceList = ({
  selectedAuthorities,
  authoritiesList,
  isAuthorityFilterActive,
  toggleFilterAuthoritesByGPSHistory,
  addAuthorityToState,
  filterAuthoritesByGPSHistory,
  onMenuClick,
}) => {
  const { t } = useTranslation();
  const isAuthoritySelected = item => {
    let name = Object.keys(item)[0];
    return findIndex(selectedAuthorities, ['key', name]) < 0;
  };
  const availableAuthorities = authoritiesList.filter(item =>
    isAuthoritySelected(item),
  );

  return (
    <>
      {__DEV__ && (
        <TouchableOpacity
          style={styles.authorityFilter}
          onPress={() => toggleFilterAuthoritesByGPSHistory()}>
          <Typography style={styles.authorityFilterText} use={'body2'}>
            {t('label.filter_authorities_by_gps_history')}
          </Typography>
          <Switch
            onValueChange={val => filterAuthoritesByGPSHistory({ val })}
            value={isAuthorityFilterActive}
          />
        </TouchableOpacity>
      )}
      {availableAuthorities &&
        availableAuthorities.map(item => {
          let name = Object.keys(item)[0];
          let key = authoritiesList.indexOf(item);

          return (
            <MenuOption
              key={key}
              onSelect={() => {
                addAuthorityToState(name);
              }}
              disabled={authoritiesList.length === 1}>
              <Typography style={styles.menuOptionText} use={'body2'}>
                {name}
              </Typography>
            </MenuOption>
          );
        })}
      <MenuOption onSelect={onMenuClick}>
        <Typography style={styles.menuOptionText} use={'body2'}>
          {t('label.authorities_add_url')}
        </Typography>
      </MenuOption>
    </>
  );
};

const styles = StyleSheet.create({
  authorityFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    borderTopWidth: 3,
    borderTopColor: Colors.DIVIDER,
    justifyContent: 'space-between',
  },
  authorityFilterText: {
    padding: 10,
    color: Colors.VIOLET_TEXT,
  },
  menuOptionText: {
    padding: 10,
  },
});

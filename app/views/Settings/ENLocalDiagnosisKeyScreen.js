import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, FlatList, StyleSheet, View, Text } from 'react-native';

import { NavigationBarWrapper, Typography } from '../../components';
import ExposureNotificationContext from '../../ExposureNotificationContext';

export const ENLocalDiagnosisKeyScreen = ({ navigation }) => {
  const { diagnosisKeys, fetchDiagnosisKeys } = useContext(
    ExposureNotificationContext,
  );
  const [data, setData] = useState(null);
  useEffect(() => {
    if (data == null) {
      fetchDiagnosisKeys();
    }
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    setData(diagnosisKeys);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation, diagnosisKeys]);

  const backToSettings = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={'Local Diagnosis Keys'}
      onBackPress={backToSettings}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.rollingStartNumber}
        renderItem={(item) => (
          <View style={styles.flatlistRowView}>
            <Typography style={styles.item} use={'body3'}>
              <Text>Rolling start number: {item.item.rollingStartNumber}</Text>
            </Typography>
          </View>
        )}
      />
    </NavigationBarWrapper>
  );
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  flatlistRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 7,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#999999',
  },
  item: {
    padding: 10,
    maxWidth: '90%',
  },
});

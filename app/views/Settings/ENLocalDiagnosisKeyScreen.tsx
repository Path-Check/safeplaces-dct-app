import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import { Typography } from '../../components/Typography';
import { NavigationProp } from '../../navigation';

import { BTNativeModule } from './../../../app/bt';

export type ENDiagnosisKey = {
  rollingStartNumber: number;
};

type ENLocalDiagnosisKeyScreenProp = {
  navigation: NavigationProp;
};

export const ENLocalDiagnosisKeyScreen = ({
  navigation,
}: ENLocalDiagnosisKeyScreenProp): JSX.Element => {
  const initialKeys: ENDiagnosisKey[] = [];

  const fetchDiagnosisKeys = () => {
    const cb = (errorMessage: string, diagnosisKeys: ENDiagnosisKey[]) => {
      if (errorMessage != null) {
        setErrorMessage(errorMessage);
      }
      setDiagnosisKeys(diagnosisKeys);
    };
    BTNativeModule.fetchDiagnosisKeys(cb);
  };

  const [diagnosisKeys, setDiagnosisKeys] = useState<ENDiagnosisKey[]>(
    initialKeys,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorMessage) {
      showErrorAlert(errorMessage);
    }
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation, diagnosisKeys, errorMessage]);

  useEffect(() => {
    fetchDiagnosisKeys();
  }, []);

  const showErrorAlert = (errorMessage: string) => {
    Alert.alert('Error', errorMessage, [{ text: 'OK' }], {
      cancelable: false,
    });
  };

  const backToDebugMenu = () => {
    navigation.goBack();
  };

  return (
    <NavigationBarWrapper
      title={'Local Diagnosis Keys'}
      onBackPress={backToDebugMenu}>
      <FlatList
        data={diagnosisKeys}
        keyExtractor={(item) => item.rollingStartNumber.toString()}
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

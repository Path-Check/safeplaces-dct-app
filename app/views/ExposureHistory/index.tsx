import React, { useState, useContext, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  BackHandler,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import ExposureHistoryContext from '../../ExposureHistoryContext';
import { ExposureDatum } from '../../exposureHistory';
import ExposureDatumDetail from './ExposureDatumDetail';
import Calendar from './Calendar';
import { useStatusBarEffect, NavigationProp } from '../../navigation';

import { Spacing } from '../../styles';

interface ExposureHistoryScreenProps {
  navigation: NavigationProp;
}

const ExposureHistoryScreen = ({
  navigation,
}: ExposureHistoryScreenProps): JSX.Element => {
  const { exposureHistory } = useContext(ExposureHistoryContext);
  const [
    selectedExposureDatum,
    setSelectedExposureDatum,
  ] = useState<ExposureDatum | null>(null);

  useStatusBarEffect('dark-content');

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const handleOnSelectDate = (datum: ExposureDatum) => {
    setSelectedExposureDatum(datum);
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            exposureHistory={exposureHistory}
            onSelectDate={handleOnSelectDate}
            selectedDatum={selectedExposureDatum}
          />
        </View>
        <View style={styles.detailsContainer}>
          {selectedExposureDatum ? (
            <ExposureDatumDetail exposureDatum={selectedExposureDatum} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.medium,
  },
  calendarContainer: {},
  detailsContainer: {
    flex: 1,
    marginTop: Spacing.small,
  },
});

export default ExposureHistoryScreen;

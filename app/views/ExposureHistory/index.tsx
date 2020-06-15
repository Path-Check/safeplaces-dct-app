import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, BackHandler, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NavigationBarWrapper } from '../../components/NavigationBarWrapper';
import ExposureHistoryContext, {
  ExposureDatum,
} from '../../ExposureHistoryContext';
import ExposureDatumDetail from './ExposureDatumDetail';
import Calendar from './Calendar';
import { NavigationProp } from '../../navigation';

import { Spacing } from '../../styles';

interface ExposureHistoryScreenProps {
  navigation: NavigationProp;
}

const ExposureHistoryScreen = ({
  navigation,
}: ExposureHistoryScreenProps): JSX.Element => {
  const { t } = useTranslation();
  const { exposureHistory } = useContext(ExposureHistoryContext);
  const [selectedExposureDatum, setSelectedExposureDatum] = useState(
    exposureHistory[exposureHistory.length - 1],
  );
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
    <NavigationBarWrapper
      includeBackButton={false}
      title={t('label.event_history_title')}
      onBackPress={() => navigation.goBack()}>
      <ScrollView style={styles.container}>
        <View style={styles.calendarContainer}>
          <Calendar
            exposureHistory={exposureHistory}
            onSelectDate={handleOnSelectDate}
            selectedDatum={selectedExposureDatum}
          />
        </View>
        <View style={styles.detailsContainer}>
          <ExposureDatumDetail exposureDatum={selectedExposureDatum} />
        </View>
      </ScrollView>
    </NavigationBarWrapper>
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

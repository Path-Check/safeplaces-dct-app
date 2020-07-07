import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native';

import ExposureHistoryContext from '../../ExposureHistoryContext';
import { useStatusBarEffect } from '../../navigation';
import History from './History';

const ExposureHistoryScreen = (): JSX.Element => {
  const { exposureHistory } = useContext(ExposureHistoryContext);

  useStatusBarEffect('dark-content');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History exposureHistory={exposureHistory} />
    </SafeAreaView>
  );
};

export default ExposureHistoryScreen;

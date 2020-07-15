import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native';

import ExposureHistoryContext from '../../ExposureHistoryContext';
import { useStatusBarEffect } from '../../navigation';
import History from './History';
import { Colors } from '../../styles';

const ExposureHistoryScreen = (): JSX.Element => {
  const { exposureHistory } = useContext(ExposureHistoryContext);

  useStatusBarEffect('dark-content');

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primaryBackground }}>
      <History exposureHistory={exposureHistory} />
    </SafeAreaView>
  );
};

export default ExposureHistoryScreen;

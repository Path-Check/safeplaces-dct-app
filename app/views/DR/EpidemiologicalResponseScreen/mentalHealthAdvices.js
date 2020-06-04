import React, { Component } from 'react';
import { View } from 'react-native';
import PDFView from 'react-native-pdf';

import Colors from '../../../constants/colors';
import { GetStoreData, SetStoreData } from '../../../helpers/General';

class MentalHealthAdvices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      tip: '',
    };
  }

  getData = async () => {
    const storageData = await GetStoreData('epidemiologicalTips', false);

    return storageData || { date: undefined, tip: 0 };
  };

  saveData = async (date, tip) => {
    return await SetStoreData('epidemiologicalTips', {
      date,
      tip,
    });
  };

  isTipGoingToChange = dateStorage => {
    // Aqui va a haber una condicion para saber si es el mismo dia o no
    if (!dateStorage) {
      dateStorage = new Date('2000/01/01');

      dateStorage =
        dateStorage.getFullYear() +
        '/' +
        (dateStorage.getMonth() + 1) + // year/month/day
        '/' +
        dateStorage.getDate();
    }

    let dateNow = new Date();
    dateNow =
      dateNow.getFullYear() +
      '/' +
      (dateNow.getMonth() + 1) + // year/month/day
      '/' +
      dateNow.getDate();

    return dateNow != dateStorage ? dateNow : false;
  };

  defineTip = (oldTip, maxTips) => {
    // Tip con contador

    const newTip = oldTip + 1;

    return newTip >= maxTips ? 1 : newTip;
  };

  async componentDidMount() {
    const { date: storageDate, tip: storageTip } = await this.getData();
    const newDate = this.isTipGoingToChange(storageDate);

    if (newDate) {
      const newTip = this.defineTip(storageTip, 14);
      await this.saveData(newDate, newTip);
      this.setState({ date: newDate, tip: newTip });
    } else {
      this.setState({ date: storageDate, tip: storageTip });
    }
  }

  render() {
    const {
      state: { tip },
    } = this;

    const source = {
      uri: `https://covid-dr.appspot.com/assets/pdfs/SM_${tip}.pdf`,
    };

    return (
      <View>
        <PDFView
          source={source}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: Colors.WHITE,
          }}
        />
      </View>
    );
  }
}

export default MentalHealthAdvices;

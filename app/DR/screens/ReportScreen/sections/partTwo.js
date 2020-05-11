import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'moment/locale/es';
import moment from 'moment';
import styles from '../../../components/styles';
import ToggleButtons from '../../../components/ToggleButtons';
import CalendarButton from '../../../components/CalendarButton';
import Colors from '../../../constants/Colors';

const { green } = Colors;

export default class PartTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      country: '',
      chosenDate: new Date(),
      disabled: true,
      selectedOption: null,
      show: false,
    };
  }

  setSelectedOption = (selected) => {
    this.setState({ selectedOption: selected });
  };

  render() {
    const { chosenDate, show, selectedOption } = this.state;
    const today = new Date();
    const minimum = today.setDate(today.getDate() - 20);
    return (
      <Container>
        <Content>
          <View>
            <ScrollView>
              <View>
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  Por favor indicar la fecha en la que retornó
                </Text>
                <CalendarButton
                  onPress={() => this.setState({ show: true })}
                  text={moment(chosenDate).format('DD/MM/YYYY')}
                />
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={chosenDate}
                    maximumDate={new Date()}
                    minimumDate={minimum}
                    mode="date"
                    display="default"
                    onChange={(event, chosenDate) =>
                      this.setState({
                        chosenDate,
                        show: false,
                        disabled: false,
                      })
                    }
                  />
                )}
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  ¿Cómo retornó al país?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Aire', 'Mar', 'Tierra']}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedOption}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

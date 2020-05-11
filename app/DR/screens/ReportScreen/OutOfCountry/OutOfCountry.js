import React from 'react';
import { ScrollView, View, KeyboardAvoidingView } from 'react-native';
import { Button, Container, Content, Item, Input, Text } from 'native-base';
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

export default class OutOfCountry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flu: null,
      fever: null,
      cough: null,
      throat: null,
      breath: null,
      bodyPain: null,
      mucus: null,
      headache: null,

      chosenDate: new Date(),
      disabled: true,
      selectedOption: null,
      show: false,
    };
  }

  // setSelectedOption = selected => {
  //   this.setState({ [name]: selected });
  // };
  render() {
    const {
      chosenDate,
      show,
      selectedOption,
      flu,
      fever,
      cough,
      throat,
      breath,
      bodyPain,
      mucus,
      headache,
    } = this.state;
    const today = new Date();
    const minimum = today.setDate(today.getDate() - 20);
    return (
      <Container>
        <Content>
          <ScrollView>
            <View style={{ marginHorizontal: wp('6%') }}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿Tienes síntomas de gripe?
              </Text>
              <ToggleButtons
                options={['Sí', 'No']}
                onSelection={(selected) => this.setState({ flu: selected })}
                selectedOption={flu}
              />

              {flu === 'Sí' && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Desde cuándo?
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
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene fiebre?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ fever: selected })
                    }
                    selectedOption={fever}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene tos?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ cough: selected })
                    }
                    selectedOption={cough}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene dolor de garganta?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ throat: selected })
                    }
                    selectedOption={throat}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene dificultad para respirar?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ breath: selected })
                    }
                    selectedOption={breath}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene dolor corporal?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ bodyPain: selected })
                    }
                    selectedOption={bodyPain}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene secreción nasal?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ mucus: selected })
                    }
                    selectedOption={mucus}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene dolor de cabeza?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ headache: selected })
                    }
                    selectedOption={headache}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}
                  >
                    ¿Tiene otros síntomas?
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={(selected) =>
                      this.setState({ selectedOption: selected })
                    }
                    selectedOption={selectedOption}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

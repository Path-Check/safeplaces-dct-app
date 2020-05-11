import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../../components/styles';
import ToggleButtons from '../../../components/ToggleButtons';

export default class PartThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      selectedOption: null,
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
                  ¿Tiene fiebre?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedOption}
                  />
                </View>
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  ¿Tiene dolor de garganta?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedOption}
                  />
                </View>
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  ¿Tiene problemas para respirar?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedOption}
                  />
                </View>
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  ¿Tiene mucosidad?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Sí', 'No']}
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

import React from 'react';
import { ScrollView, View } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../../components/styles';
import ToggleButtons from '../../../components/ToggleButtons';

export default class PartFour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      selectedOption: null,
    };
  }

  setSelectedOption = (selected) => {
    this.setState({ selectedOption: selected });
  };

  render() {
    const { show, selectedOption } = this.state;
    return (
      <Container>
        <Content>
          <View>
            <ScrollView>
              <View>
                <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                  ¿Tuvo contacto con alguna persona infectada en los últimos 14
                  días?
                </Text>
                <View>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={this.setSelectedOption}
                    selectedOption={selectedOption}
                  />
                </View>
                {!show && (
                  <View>
                    <Text
                      style={[styles.subtitles, { marginVertical: hp('3%') }]}
                    >
                      ¿Cuál es la relación con la persona infectada?
                    </Text>
                    <View>
                      <ToggleButtons
                        options={[
                          'Madre',
                          'Padre',
                          'Hijo',
                          'Abuelo',
                          'Hermano',
                          'Amigo',
                          'Jefe',
                          'Conyuge',
                          'Tutor',
                          'Desconocido',
                        ]}
                        onSelection={this.setSelectedOption}
                        selectedOption={selectedOption}
                      />
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

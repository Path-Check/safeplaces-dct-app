import { Container, Content, Picker, Text } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import styles from '../../../../components/DR/Header/style';
import Input from '../../../../components/DR/Input/index';
import context from '../../../../components/DR/Reduces/context';
import Colors from '../../../../constants/colors';
import provinces from '../../../../constants/DR/Provinces.json';

const StepAdress = ({ setCompleted }) => {
  const [
    {
      answers: { province, municipality, address, numberPersonLivesWith },
    },
    setGlobalState,
  ] = useContext(context);

  useEffect(() => {
    setMunicipalities(province);
  }, [province]);
  const [municipios, setMunicipios] = useState([]);

  const setSelectedOption = (option, selected) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: { [option]: selected },
    });
  };

  const setMunicipalities = prov => {
    const municipNames = [];
    provinces.Provincias.map(provincia => {
      if (provincia.Nombre === prov && provincia.Municipio) {
        Object.entries(provincia.Municipio).map(value =>
          value.map(
            value =>
              value.Nombre !== undefined && municipNames.push(value.Nombre),
          ),
        );
      }
    });
    setMunicipios(municipNames);
  };
  if (province && numberPersonLivesWith) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                Provincia *
              </Text>
              <Picker
                note
                mode='dropdown'
                placeholder='Selecciona tu provincia'
                style={[
                  styles.rectButtons,
                  {
                    width: wp('65%'),
                    backgroundColor: Colors.LIGHT_BLUE,
                    alignSelf: 'flex-start',
                    borderBottomColor: Colors.MAIN_BLUE,
                    borderBottomWidth: 1.5,
                  },
                ]}
                selectedValue={province}
                onValueChange={value => {
                  setSelectedOption('province', value);
                  setMunicipalities(value);
                }}>
                {provinces.Provincias.map(provincia => (
                  <Picker.Item
                    label={provincia.Nombre}
                    value={provincia.Nombre}
                    key={provincia.Numero}
                  />
                ))}
              </Picker>
              {municipios.length > 0 ? (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    Municipio *
                  </Text>
                  <Picker
                    note
                    mode='dropdown'
                    placeholder='Selecciona el municipio'
                    style={[
                      styles.rectButtons,
                      {
                        width: wp('65%'),
                        backgroundColor: Colors.LIGHT_BLUE,
                        alignSelf: 'flex-start',
                        borderBottomColor: Colors.MAIN_BLUE,
                        borderBottomWidth: 1.5,
                      },
                    ]}
                    selectedValue={municipality}
                    onValueChange={value => {
                      setSelectedOption('municipality', value);
                    }}>
                    {municipios.map((municipio, index) => (
                      <Picker.Item
                        label={municipio}
                        value={municipio}
                        key={index}
                      />
                    ))}
                  </Picker>
                </View>
              ) : null}
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                Dirección de su domicilio:
              </Text>
              <Input
                value={address}
                length={60}
                multiLine
                onChange={text => setSelectedOption('address', text)}
              />
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿Cuántas personas viven con usted? *
              </Text>
              <Input
                length={2}
                keyboard='number-pad'
                value={numberPersonLivesWith}
                onChange={text => {
                  if (parseInt(text, 10) < 30) {
                    setSelectedOption('numberPersonLivesWith', text);
                  } else if (text === '') {
                    setSelectedOption('numberPersonLivesWith', '');
                  }
                }}
              />
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepAdress;

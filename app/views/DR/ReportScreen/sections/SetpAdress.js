import Geolocation from '@react-native-community/geolocation';
import { Container, Content, Picker, Text } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
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
  const { t } = useTranslation();

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

  const getCurrentLocation = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted || Platform.OS === 'ios') {
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          setSelectedOption('latitude', coords.latitude.toString());
          setSelectedOption('longitude', coords.longitude.toString());
        },
        () => {},
        { enableHighAccuracy: true },
      );
    }
  };

  if (province && numberPersonLivesWith) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  return (
    <Container>
      <Content>
        <View style={{ width: wp('100%') }}>
          <ScrollView>
            <View style={styles.formContainer}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.address.province')}
              </Text>
              <Picker
                note
                mode='dropdown'
                placeholder={t('report.address.province_selection')}
                style={[
                  styles.rectButtons,
                  {
                    width: wp('65%'),
                    backgroundColor: Colors.LIGHT_BLUE,
                    alignSelf: 'flex-start',
                    borderBottomColor: Colors.BLUE_RIBBON,
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
                    {t('report.address.municipality')}
                  </Text>
                  <Picker
                    note
                    mode='dropdown'
                    placeholder={t('report.address.municipality_selection')}
                    style={[
                      styles.rectButtons,
                      {
                        width: wp('65%'),
                        backgroundColor: Colors.LIGHT_BLUE,
                        alignSelf: 'flex-start',
                        borderBottomColor: Colors.BLUE_RIBBON,
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
                {t('report.address.house_address')}
              </Text>
              <Input
                value={address}
                length={60}
                multiLine
                onChange={text => setSelectedOption('address', text)}
              />
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                {t('report.address.number_person_lives_with')}
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
                  getCurrentLocation();
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

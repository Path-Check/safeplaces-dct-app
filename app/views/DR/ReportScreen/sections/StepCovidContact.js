import 'moment/locale/es';

import moment from 'moment';
import { Container, Content, Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import CalendarButton from '../../../../components/DR/CalendarButton';
import Checkbox from '../../../../components/DR/Checkbox';
import styles from '../../../../components/DR/Header/style';
import Input from '../../../../components/DR/Input';
import context from '../../../../components/DR/Reduces/context';
import ToggleButtons from '../../../../components/DR/ToggleButtons';

const StepCovidContact = ({ setCompleted }) => {
  const [
    {
      answers: {
        usage,
        dontKnowArea,
        dontKnowExposition,
        hadCloseContact,
        hadFarContact,
        liveIn,
        liveWith,
        noneAbove,
        notExposed,
        traveled,
        dateArrived,
        countriesVisited,
        traveledIn,
        visitedArea,
        usedProtection,
      },
    },
    setGlobalState,
  ] = useContext(context);

  const [selection, setSelection] = useState(
    traveled == true ? 'Sí' : traveled == false ? 'No' : '',
  );

  const setOption = option => {
    setSelection(option);
    if (option === 'Sí') {
      setSelectedOption('traveled', true);
    } else {
      setSelectedOption('traveled', false);
    }
  };

  const setSelectedOption = (
    option,
    selected,
    notExposureCheck,
    noneAboveCheck,
  ) => {
    setGlobalState({
      type: 'ADD_ANSWERS',
      value: {
        [option]: selected,
        ...(notExposureCheck &&
          noneAboveCheck && {
            [notExposureCheck]: false,
            [noneAboveCheck]: false,
          }),
      },
    });
  };
  const minimum = new Date().setDate(new Date().getDate() - 50);

  // if(traveled && dateArrived && countriesVisited > 5){

  // }
  if (
    traveled === false ||
    (traveled &&
      dateArrived &&
      countriesVisited.length > 5 &&
      (liveIn || visitedArea || dontKnowArea || noneAbove) &&
      (((liveWith || hadCloseContact || hadFarContact) && usedProtection) ||
        notExposed ||
        dontKnowExposition))
  ) {
    setCompleted(true);
  } else {
    setCompleted(false);
  }
  const estar = usage === 'others' ? 'estuvo' : 'estuve';
  const sustantive = usage === 'others' ? 'Ha' : 'He';
  const saber = usage === 'others' ? 'sabe' : 'se';
  return (
    <Container>
      <Content>
        <View>
          <ScrollView>
            <View style={[styles.formContainer, { marginRight: wp('10%') }]}>
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿En los últimos 14 días, ha viajado fuera del país? *
              </Text>
              <ToggleButtons
                options={['Sí', 'No']}
                onSelection={selected => setOption(selected)}
                selectedOption={selection}
              />
              {selection === 'Sí' && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    ¿Cuándo llegó al país? *
                  </Text>
                  <CalendarButton
                    date={moment(dateArrived).format('DD-MM-YYYY')}
                    onChange={date =>
                      setSelectedOption(
                        'dateArrived',
                        moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                      )
                    }
                    minDate={moment(minimum)}
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    ¿En qué lugares/países estuvo? *
                  </Text>
                  <Input
                    value={countriesVisited}
                    length={150}
                    multiLine
                    onChange={text =>
                      setSelectedOption('countriesVisited', text)
                    }
                  />
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    Viajó en: *
                  </Text>
                  <ToggleButtons
                    options={['Avión', 'Barco', 'Terrestre']}
                    onSelection={selected =>
                      setSelectedOption('traveledIn', selected)
                    }
                    selectedOption={traveledIn}
                  />
                </View>
              )}
              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿En los últimos 14 días, ha estado en un área o territorio donde
                se conozca que el COVID-19 se haya extendido o con transmisión
                comunitaria? *
              </Text>
              <Text style={[styles.text, { marginBottom: 10 }]}>
                Seleccione todas las que aplican.
              </Text>
              <Checkbox
                text={`${
                  usage === 'others' ? 'Vive' : 'Vivo'
                } en un área donde el COVID-19 se ha extendido/transmisión comunitaria.`}
                id='liveIn'
                setValue={(id, value) =>
                  setSelectedOption(id, value, 'dontKnowArea', 'noneAbove')
                }
                initialCheck={liveIn}
              />
              <Checkbox
                text={`${
                  usage === 'others' ? 'Visitó' : 'Visité'
                } un área donde el COVID-19 se ha extendido/transmisión comunitaria.`}
                id='visitedArea'
                setValue={(id, value) =>
                  setSelectedOption(id, value, 'dontKnowArea', 'noneAbove')
                }
                initialCheck={visitedArea}
              />
              <Checkbox
                text={`No lo ${saber}.`}
                id='dontKnowArea'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveIn: false,
                      visitedArea: false,
                      noneAbove: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={dontKnowArea}
              />
              <Checkbox
                text={`Ninguna de las anteriores.`}
                id='noneAbove'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveIn: false,
                      visitedArea: false,
                      dontKnowArea: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={noneAbove}
              />

              <Text style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                ¿En los últimos 14 días, cuál ha sido su exposición con personas
                diagnosticadas con COVID-19? *
              </Text>
              <Checkbox
                text={`${
                  usage === 'others' ? 'Vive' : 'Vivo'
                } con alguien diagnosticado con COVID-19.`}
                id='liveWith'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={liveWith}
              />
              <Checkbox
                text={`${sustantive} tenido contacto cercano con alguien diagnosticado con COVID-19.`}
                id='hadCloseContact'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={hadCloseContact}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                Estaba a menos de 6 pies (1.5 metros) de alguien con la
                enfermedad, o {sustantive.toLowerCase()} estado expuesto a tos o
                estornudos.
              </Text>
              <Checkbox
                text={`${sustantive} estado cerca de alguien diagnosticado con COVID-19.`}
                id='hadFarContact'
                setValue={(id, value) =>
                  setSelectedOption(
                    id,
                    value,
                    'notExposed',
                    'dontKnowExposition',
                  )
                }
                initialCheck={hadFarContact}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                Estaba a más de 6 pies de distancia y no {estar} expuesto a tos
                o estornudos.
              </Text>
              <Checkbox
                text={`No ${sustantive.toLowerCase()} estado expuesto.`}
                id='notExposed'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveWith: false,
                      hadCloseContact: false,
                      hadFarContact: false,
                      dontKnowExposition: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={notExposed}
              />
              <Text
                style={[styles.text, { fontSize: 12, marginLeft: wp('9%') }]}>
                No {sustantive.toLowerCase()} estado en contacto con alguien que
                tiene COVID-19.
              </Text>
              <Checkbox
                text={`No lo ${saber}.`}
                id='dontKnowExposition'
                setValue={(id, value) =>
                  setGlobalState({
                    type: 'ADD_ANSWERS',
                    value: {
                      liveWith: false,
                      hadCloseContact: false,
                      hadFarContact: false,
                      notExposed: false,
                      [id]: value,
                    },
                  })
                }
                initialCheck={dontKnowExposition}
              />
              {(liveWith || hadCloseContact || hadFarContact) && (
                <View>
                  <Text
                    style={[styles.subtitles, { marginVertical: hp('3%') }]}>
                    ¿Ha usado equipos de protección personal cuando ha estado
                    expuesto con personas diagnosticadas con COVID-19? *
                  </Text>
                  <ToggleButtons
                    options={['Sí', 'No']}
                    onSelection={selected =>
                      setSelectedOption('usedProtection', selected)
                    }
                    selectedOption={usedProtection}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
};

export default StepCovidContact;

import * as React from 'react';
import {
  Text, View, TouchableOpacity, Image,
} from 'react-native';
import { createAccount, tester } from './style';
import kit from '../../assets/images/kit.png';
import heart from '../../assets/images/heart.png';

export const CreateAccount = () => (
  <View style={createAccount.container}>
    <View style={createAccount.subsontainer}>
      <View style={createAccount.imageContainer}>
        <Image style={createAccount.image} source={kit} />
      </View>
      <Text style={createAccount.title}>
        ¡Aún no tienes cuenta!
      </Text>
      <Text style={createAccount.text}>
        Crea tu cuenta para dar seguimiento
        {'\n'}
        especializado a todo lo que acontence con el
        {'\n'}
        COVID-19 o hacer el formulario de síntomas
        {'\n'}
      </Text>
      <View style={createAccount.buttonContainer}>
        <TouchableOpacity style={createAccount.button}>
          <Text style={createAccount.buttonValue}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const Tester = () => (
  <View style={tester.container}>
    <View style={tester.subsontainer}>
      <View style={tester.titleContainer}>
        <Image style={tester.image} source={heart} />
        <Text style={tester.title}>¿Cómo te sientes?</Text>
      </View>
      <View style={tester.buttonContainer}>
        <View style={tester.textContainer}>
          <Text style={tester.text}>
            Analizaremos tus síntomas para
            {'\n'}
            validar o descartar el COVID-19
            {'\n'}
          </Text>
        </View>
        <TouchableOpacity style={tester.button}>
          <Text style={tester.buttonValue}>Evaluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

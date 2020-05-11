import firebase from 'firebase';
import 'firebase/firestore';

import { decode, encode } from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const firebaseConfig = {
  apiKey: 'AIzaSyCmB1hEeTLKqW0yJYfpPx4J797NCGsPl8U',
  authDomain: 'covid-dr.firebaseapp.com',
  databaseURL: 'https://covid-dr.firebaseio.com',
  projectId: 'covid-dr',
  storageBucket: 'covid-dr.appspot.com',
  messagingSenderId: '546465731626',
  appId: '1:546465731626:web:4f76d9581b891ff9529f53',
  measurementId: 'G-W30TG5Z5XK',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const auth = firebase.auth();
export const database = firebase.database();

import React from 'react';
import {
    Text,
} from 'react-native';
import VersionNumber from 'react-native-version-number';

export default function Version() {
  return (
    <Text style={{textAlign: "center"}}>{VersionNumber.appVersion}</Text>
  )
}

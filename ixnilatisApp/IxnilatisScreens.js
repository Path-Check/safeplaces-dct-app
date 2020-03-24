import React, {Component } from 'react';
import FormWorkScreen from "./views/FormWork";
import FormGeneralScreen from "./views/FormGeneral";

export function getIxnilatisScreens(Stack) {
    return [
      <Stack.Screen
        key="FormWorkScreen"
        name="FormWorkScreen"
        component={FormWorkScreen}
        options={{headerShown:false}}
      />,
      <Stack.Screen
        key="FormGeneralScreen"
        name="FormGeneralScreen"
        component={FormGeneralScreen}
        options={{headerShown:false}}
      />
    ];
}

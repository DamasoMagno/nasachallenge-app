// navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/home";
import { Details } from "../screens/details";
import { NavigationContainer } from "@react-navigation/native";
import { AppParamList } from "../@types/navigation";

const Stack = createNativeStackNavigator<AppParamList>();

export function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

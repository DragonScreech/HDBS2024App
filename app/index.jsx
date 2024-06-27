// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from './src/screens/Home';
import Tabs from './src/components/Tabs'
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './src/components/AppNavigator'


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <AppNavigator></AppNavigator>
    </NavigationContainer>
  );
};

export default App


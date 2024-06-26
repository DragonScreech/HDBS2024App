import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Home from '../screens/Home';
import Transport from '../screens/Transport';
import PujaEvents from '../screens/PujaEvents';
import Food from '../screens/Food';
import Cultural from '../screens/Cultural';
import { FontAwesome6 } from '@expo/vector-icons';
import { View, Image } from 'react-native';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white'
        },
        headerStyle: {
          backgroundColor: '#490000'
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 25,
          color: 'white'
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Image
              style={{ width: 30, height: 30, marginLeft: 5 }}
              source={require('../assets/HDBSLOGO.png')}
            />
          </View>
        )
      }}
    >
      <Tab.Screen
        name={'Home'}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'home'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      >
        {() => <Home />}
      </Tab.Screen>
      <Tab.Screen
        name={'Puja Events'}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'calendar'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      >
        {() => <PujaEvents />}
      </Tab.Screen>
      <Tab.Screen
        name={'Transport'}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'truck'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      >
        {() => <Transport />}
      </Tab.Screen>
      <Tab.Screen
        name={'Cultural Program'}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'music'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      >
        {() => <Cultural />}
      </Tab.Screen>
      <Tab.Screen
        name={'Food'}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="utensils" size={25} color={focused ? 'tomato' : "black"} />
          )
        }}
      >
        {() => <Food />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default Tabs;

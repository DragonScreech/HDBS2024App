// Tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Home from '../screens/Home';
import Transport from '../screens/Transport';
import PujaEvents from '../screens/PujaEvents';
import Food from '../screens/Food';
import Cultural from '../screens/Cultural';
import { FontAwesome6 } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';
import { getHeaderTitle } from '@react-navigation/elements';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
        },
        header: ({ navigation, route, options }) => {
          const title = getHeaderTitle(options, route.name)
          return <CustomHeader title={title}></CustomHeader>
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather name="home" size={25} color={focused ? 'tomato' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name="Puja Events"
        component={PujaEvents}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather name="calendar" size={25} color={focused ? 'tomato' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name="Transport"
        component={Transport}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather name="truck" size={25} color={focused ? 'tomato' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name="Cultural Program"
        component={Cultural}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather name="music" size={25} color={focused ? 'tomato' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name="Food"
        component={Food}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="utensils" size={25} color={focused ? 'tomato' : 'black'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;


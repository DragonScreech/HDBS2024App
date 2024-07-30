// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppNavigator from './src/components/AppNavigator'; // Import your stack navigator
import Alerts from './src/screens/Alerts'
import { View, Text } from 'react-native';
import Contact from './src/screens/Contact'
import DisclaimerPage from './src/screens/DisclaimerPage'
import Sponsor from './src/screens/Sponsors'

// Dummy screen for additional drawer item
function AnotherScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Another Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ drawerPosition: 'right' }}>
        <Drawer.Screen name="Tabs" component={AppNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="Alerts" component={Alerts} options={{ headerShown: false }} />
        <Drawer.Screen name="Contact" component={Contact} options={{ headerShown: false }} />
        <Drawer.Screen name="Disclaimer" component={DisclaimerPage} options={{ headerShown: false }} />
        <Drawer.Screen name="Our Sponsors" component={Sponsor} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}



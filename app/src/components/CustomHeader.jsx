// CustomHeader.js
import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../assets/HDBSLOGO.png')}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Feather name='menu' size={25} color={'white'}></Feather>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#490000',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CustomHeader;

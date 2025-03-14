import { Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebase'
import { Feather } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { getDownloadURL, ref } from 'firebase/storage'

const Sponsor = () => {
  const navigation = useNavigation()
  const [url, setUrl] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      const storageRef = ref(storage, 'SponsorsPDF.pdf')

      await getDownloadURL(storageRef).then((url) => {
        setUrl(url)
      }).catch((err) => {
        console.log(err)
      })
    }
    fetchData()
  })
  const handlePress = () => {
    Linking.openURL(url)
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.featherContainer}>
        <Feather name='menu' style={styles.menu} size={30} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} color={'white'}></Feather>
      </View>
      <Image source={require('../assets/SponsorsBG.jpg')} style={styles.image}></Image>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>Sponsors</Text>
          {/* <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View> */}
        </View>
        <Text style={styles.eventName}>Sponsors</Text>
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Click here to see all of our sponsors</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Sponsor;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 24,
    fontWeight: 'bold',
  },
  time: {
    color: '#555',
    fontSize: 18,
    fontWeight: 'bold'
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#666',
    marginBottom: 20,
    fontSize: 18
  },
  performersLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  performers: {
    color: '#666',
    fontSize: 18
  },
  date: {
    color: '#555',
    fontSize: 18,
    fontWeight: 'bold'
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 5
  },
  registrationText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  menu: {
    position: 'absolute',
    top: 20, // Add some spacing from the top
    right: 10, // Add some spacing from the right
    zIndex: 1, // Ensure the menu icon is on top of other elements
    //marginTop: 20
  },
  featherContainer: {
    position: 'relative',
    zIndex: 50
  },
  button: {
    backgroundColor: '#fa3737',
    borderRadius: 24,
    padding: 4,
    maxWidth: 400,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 20
  },
});
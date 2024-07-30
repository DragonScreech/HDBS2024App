import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import { Feather } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from '@react-navigation/native'

const Contact = () => {
  const navigation = useNavigation()
  const [contact, setContact] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'HDBS', 'Contact')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setContact(docSnap.data().text)
      }
    }
    fetchData()
  })
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.featherContainer}>
        <Feather name='menu' style={styles.menu} size={30} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}></Feather>
      </View>
      <Image source={require('../assets/Contactbg.webp')} style={styles.image}></Image>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>Contact</Text>
          {/* <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View> */}
        </View>
        <Text style={styles.eventName}>Contact</Text>
        <Text style={styles.description}>{contact}</Text>
      </View>
    </SafeAreaView>
  );
}

export default Contact;

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
  }

});
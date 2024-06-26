import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { arrayUnion, collection, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase'
import { useNavigation } from '@react-navigation/native';

const Event = ({ item, date, page }) => {
  const navigate = useNavigation()
  return (
    <View style={page === 'Transport' ? styles.transport : styles.container}>
      {page === 'Cultural' && <LottieView style={styles.flowerImage} source={require('../assets/music.json')} autoPlay loop></LottieView>}
      {page === 'PujaEvents' && <LottieView style={styles.flowerImage} source={require('../assets/flower.json')} autoPlay loop></LottieView>}
      {page === 'Food' && <LottieView style={styles.flowerImage} source={require('../assets/food.json')} autoPlay loop></LottieView>}
      {page === 'Transport' && <LottieView style={styles.transportImage} source={require('../assets/transport.json')} autoPlay loop></LottieView>}
      <Text style={styles.nameStyle}>{item.eventName}</Text>
      {page !== 'Transport' ? (
        <Text style={styles.timeStyle}>{item.timeString}</Text>
      ) : (
        <Text style={styles.line2}>{item.eventName2}</Text>
      )}
      {item.availableFor === 'R' && <Text style={styles.registrationText}>Puja Registration Required</Text>}
      {item.availableFor === 'B' && <Text style={styles.couponText}>Food coupons available for purchase</Text>}
      <TouchableOpacity style={styles.button} onPress={() => navigate.navigate('Details', { eventName: item.eventName, performers: item.performers, eventTime: item.timeString, eventDescription: item.description, category: item.category, date: date, isCultural: page === 'Cultural', isPuja: page === 'PujaEvents', isFood: page === 'Food', sponsor: item.sponsor, availability: item.availableFor, isTransport: page === 'Transport', shuttleTimes: item.shuttleTimes })}>
        <Text style={styles.buttonText}>See more</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Event

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: 'white',
    padding: 12,
    margin: 10,
    marginTop: 20,
    paddingRight: 80,
    position: 'relative', // Added to enable absolute positioning within this container
    overflow: 'visible',
  },
  transport: {
    borderRadius: 18,
    backgroundColor: 'white',
    padding: 12,
    margin: 20,
    marginTop: 30,
    paddingRight: 150,
    position: 'relative', // Added to enable absolute positioning within this container
    overflow: 'visible',
  },
  button: {
    backgroundColor: '#fa3737',
    borderRadius: 24,
    padding: 4,
    maxWidth: 100
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500'
  },
  timeStyle: {
    marginBottom: 40,
    fontSize: 18
  },
  nameStyle: {
    fontSize: 18
  },
  flowerImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: -40,
    right: -40
  },
  transportImage: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: -30,
    right: -20
  },
  registrationText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  couponText: {
    fontSize: 16,
    color: '#40b83e',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  line2: {
    marginBottom: 80,
    fontSize: 18,
    color: '#FA3737'
  }
})

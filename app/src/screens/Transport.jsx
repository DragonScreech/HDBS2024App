import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import Event from '../components/Event'

const Transport = () => {
  const [events, setEvents] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'HDBS', 'Transportation')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        console.log(data)
        setEvents(data.events)
      }
      else {
        console.log("We couldn't find the document")
      }
    }
    fetchData()
  }, [])
  return (
    <ScrollView style={styles.container}>
      {events.map((event, index) => (
        <Event page={'Transport'} key={index} item={event}></Event>
      ))}
    </ScrollView>
  )
}

export default Transport

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'pink',
    paddingBottom: 20,
  }
})
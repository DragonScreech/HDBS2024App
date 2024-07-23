import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'
import Event from '../components/Event'

const Transport = () => {
  const [events, setEvents] = useState([])
  const [data, setData] = useState([])
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
  }, [data])

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'HDBS', 'Transportation'), (doc) => {
      const eventData = doc.data().events
      setData(eventData)
    })
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
    backgroundColor: '#FFF0C5',
    paddingBottom: 20,
  }
})
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Event from '../components/Event';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const Cultural = () => {
  const [eventsByDate, setEventsByDate] = useState([]);
  const { width, height } = Dimensions.get('window');
  const [mockData, setMockData] = useState([
    {
      eventName: 'Epic Violin',
      timeString: '6:30 PM',
    },
    {
      eventName: 'RabrindaSangeet',
      timeString: '7:30 PM'
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'HDBS', 'CulturalProgram');
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());

      if (docSnap.exists()) {
        const data = docSnap.data().events;
        const formattedData = data.map(event => {
          if (event.time) {
            if (event.time.toDate) { // Check if toDate function exists
              event.time = event.time.toDate(); // Convert Firebase Timestamp to JS Date
              event.timeString = event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              event.dateString = event.time.toLocaleDateString('en-US', { weekday: 'long', month: '2-digit', day: '2-digit' });
            } else {
              console.warn('event.time does not have toDate function', event);
            }
          }
          return event;
        });
        console.log(formattedData);

        // Group events by the actual date string
        const groupedEvents = formattedData.reduce((acc, event) => {
          if (event.time) {
            const date = event.dateString;
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
          }
          return acc;
        }, {});

        // Sort events within each date group by time
        Object.keys(groupedEvents).forEach(date => {
          groupedEvents[date].sort((a, b) => new Date(a.time) - new Date(b.time));
        });

        // Convert the grouped events object to an array and sort by the actual date
        const sortedEventsByDate = Object.keys(groupedEvents).sort((a, b) => {
          const dateA = new Date(groupedEvents[a][0].time);
          const dateB = new Date(groupedEvents[b][0].time);
          return dateA - dateB;
        }).map(date => ({
          date,
          events: groupedEvents[date]
        }));

        setEventsByDate(sortedEventsByDate);
        console.log(sortedEventsByDate);
      } else {
        console.log("We couldn't fetch the data");
      }
    }

    fetchData();
  }, []);

  const renderEvent = ({ item }) => (
    <Event item={item} date={item.dateString} page={'Cultural'} />
  );

  return (
    <ScrollView style={styles.container}>
      {eventsByDate.map((dateGroup, index) => (
        <View key={index}>
          <Text style={styles.dayText}>{dateGroup.date}</Text>
          <FlatList
            renderItem={renderEvent}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            data={dateGroup.events}
          />
        </View>
      ))}
    </ScrollView>
  );
}

export default Cultural;

const styles = StyleSheet.create({
  dayText: {
    fontSize: 36,
    marginHorizontal: 10,
    marginTop: 10,
    fontWeight: '500'
  },
  pujaDayText: {
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: '500'
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'pink',
    paddingBottom: 20,
  }
});





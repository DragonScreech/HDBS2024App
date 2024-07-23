import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Event from '../components/Event';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';

const Cultural = () => {
  const [eventsByDate, setEventsByDate] = useState([]);
  const [data, setData] = useState([]);
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
        const eventData = docSnap.data().events;
        const formattedData = eventData.map(event => {
          if (event.time) {
            if (event.time.toDate) {
              event.time = event.time.toDate();
              event.timeString = event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              event.dateString = event.time.toLocaleDateString('en-US', { weekday: 'long', month: '2-digit', day: '2-digit' });
            } else {
              console.warn('event.time does not have toDate function', event);
            }
          }
          return event;
        });
        console.log(formattedData);

        const groupedEvents = formattedData.reduce((acc, event) => {
          if (event.time) {
            const date = event.dateString;
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
          }
          return acc;
        }, {});

        Object.keys(groupedEvents).forEach(date => {
          groupedEvents[date].sort((a, b) => new Date(a.time) - new Date(b.time));
        });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const sortedEventsByDate = Object.keys(groupedEvents).map(date => ({
          date,
          events: groupedEvents[date]
        }));

        const currentDayEvents = sortedEventsByDate.filter(group => {
          const eventDate = new Date(group.events[0].time);
          return eventDate >= startOfToday && eventDate <= endOfToday;
        });

        const futureEvents = sortedEventsByDate.filter(group => {
          const eventDate = new Date(group.events[0].time);
          return eventDate > endOfToday;
        }).sort((a, b) => new Date(a.events[0].time) - new Date(b.events[0].time));

        const pastEvents = sortedEventsByDate.filter(group => {
          const eventDate = new Date(group.events[0].time);
          return eventDate < startOfToday;
        }).sort((a, b) => new Date(a.events[0].time) - new Date(b.events[0].time));

        const orderedEvents = [
          { label: 'Current Day', events: currentDayEvents },
          { label: 'Future Events', events: futureEvents },
          { label: 'Past Events', events: pastEvents },
        ];

        setEventsByDate(orderedEvents);
        console.log(orderedEvents);
      } else {
        console.log("We couldn't fetch the data");
      }
    }

    fetchData();
  }, [data]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "HDBS", "CulturalProgram"), (doc) => {
      const eventData = doc.data().events;
      setData(eventData);
    });

    return () => unsub();
  }, []);

  const renderEvent = ({ item }) => (
    <Event item={item} date={item.dateString} page={'Cultural'} />
  );

  return (
    <ScrollView style={styles.container}>
      {eventsByDate.map((group, index) => (
        <View key={index} style={styles.groupContainer}>
          <Text style={styles.groupLabel}>{group.label}</Text>
          {group.events.length != 0 ? group.events.map((dateGroup, dateIndex) => (
            <View key={dateIndex}>
              <Text style={styles.dayText}>{dateGroup.date}</Text>
              <FlatList
                renderItem={renderEvent}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                data={dateGroup.events}
              />
            </View>
          )) : <Text style={styles.noEvents}>No {group.label} Cultural Program events for this puja</Text>}
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
    backgroundColor: '#FFF0C5',
    paddingBottom: 20,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 24,
    marginHorizontal: 10,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#FF6B6B'
  },
  noEvents: {
    marginHorizontal: 10,
    fontSize: 20
  }
});



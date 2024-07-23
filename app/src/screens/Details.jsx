import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import isEqual from 'lodash/isEqual'

const Details = () => {
  const route = useRoute();
  const { eventName, eventDescription, eventTime, performers, category, date, isCultural, isPuja, isFood, sponsor, availability, isTransport, shuttleTimes, bajaarTimes, isBajaar } = route.params;
  const images = {
    music: require('../assets/musicbg.webp'),
    art: require('../assets/artbg.webp'),
    fashionshow: require('../assets/fashionbg.webp'),
    drama: require('../assets/dramabg.webp'),
    dance: require('../assets/dancebg.webp'),
    quiz: require('../assets/quizbg.webp'),
    recitation: require('../assets/recitebg.webp'),
    other: require('../assets/otherbg.webp'),
  }
  const [formattedCategory, setFormattedCategory] = useState('')
  const [shuttleString, setShuttleString] = useState('')
  const [bajaarString, setBajaarString] = useState('')
  useEffect(() => {
    if (category) {
      const categoryLower = category.toLowerCase()
      setFormattedCategory(categoryLower.replace('-', ''))
    }
    if (shuttleTimes) {
      console.log(shuttleTimes)
      function formatShuttleTimes(shuttleTimes) {
        const options = { month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

        return shuttleTimes.map(timeSlot => {
          const startDate = new Date(timeSlot.startTime.seconds * 1000 + timeSlot.startTime.nanoseconds / 1000000);
          const endDate = new Date(timeSlot.endTime.seconds * 1000 + timeSlot.endTime.nanoseconds / 1000000);

          const formattedDate = startDate.toLocaleDateString('en-US', options);
          const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
          const endTime = endDate.toLocaleTimeString('en-US', timeOptions);

          return `${formattedDate}\n${startTime} - ${endTime}`;
        }).join('\n\n');
      }
      setShuttleString(formatShuttleTimes(shuttleTimes))
    }
    if (bajaarTimes) {
      console.log(bajaarTimes)
      function formatShuttleTimes(shuttleTimes) {
        const options = { month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

        return shuttleTimes.map(timeSlot => {
          const startDate = new Date(timeSlot.startTime.seconds * 1000 + timeSlot.startTime.nanoseconds / 1000000);
          const endDate = new Date(timeSlot.endTime.seconds * 1000 + timeSlot.endTime.nanoseconds / 1000000);

          const formattedDate = startDate.toLocaleDateString('en-US', options);
          const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
          const endTime = endDate.toLocaleTimeString('en-US', timeOptions);

          return `${formattedDate}\n${startTime} - ${endTime}`;
        }).join('\n\n');
      }
      setBajaarString(formatShuttleTimes(bajaarTimes))
    }
  }, [])


  return (
    <View style={styles.container}>
      {isCultural && <Image source={images[formattedCategory]} style={styles.image} />}
      {isPuja && <Image source={require('../assets/otherbg.webp')} style={styles.image} />}
      {isFood && <Image source={require('../assets/foodbg.webp')} style={styles.image} />}
      {isTransport && <Image source={require('../assets/transportbg.webp')} style={styles.image} />}
      {isBajaar && <Image source={require('../assets/bajaarbg.webp')} style={styles.image} />}
      {isCultural && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>{category}</Text>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View>
          </View>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.description}>{eventDescription}</Text>
          {performers && (
            <View>
              <Text style={styles.performersLabel}>Performers</Text>
              <Text style={styles.performers}>{performers}</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Text style={styles.registrationText}>Puja Registration Required</Text>
        </View>
      )}
      {isPuja && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>Puja</Text>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View>
          </View>
          <Text style={styles.eventName}>{eventName}</Text>
          {eventDescription && <Text style={styles.description}>{eventDescription}</Text>}
          {/* <View style={{ flex: 1 }} /> */}
        </View>
      )}
      {isFood && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>Food</Text>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View>
          </View>
          <Text style={styles.eventName}>{eventName}</Text>
          {eventDescription && <Text style={styles.description}>{eventDescription}</Text>}
          {sponsor && (
            <View>
              <Text style={styles.performersLabel}>Sponsor</Text>
              <Text style={styles.performers}>{sponsor}</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          {availability === 'R' && <Text style={styles.registrationText}>Puja Registration Required</Text>}
          {availability === 'B' && <Text style={styles.registrationText}>Food coupons available for purchase</Text>}
        </View>
      )}
      {isTransport && (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>Transport</Text>
            {/* <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View> */}
          </View>
          <Text style={styles.eventName}>{eventName}</Text>
          {eventDescription && <Text style={styles.description}>{eventDescription}</Text>}
          {shuttleTimes && <Text style={styles.description}>{shuttleString}</Text>}
          {/* <View style={{ flex: 1 }} /> */}
        </ScrollView>
      )}
      {isBajaar && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>Bajaar</Text>
            {/* <View style={styles.dateTimeContainer}>
              <Text style={styles.date}>{date + ", "}</Text>
              <Text style={styles.time}>{eventTime}</Text>
            </View> */}
          </View>
          <Text style={styles.eventName}>Puja Bazaar</Text>
          {eventDescription && <Text style={styles.description}>{eventDescription}</Text>}
          {bajaarTimes && <Text style={styles.description}>{bajaarString}</Text>}
          {/* <View style={{ flex: 1 }} /> */}
        </View>
      )}
    </View>
  );
}

export default Details;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
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
});

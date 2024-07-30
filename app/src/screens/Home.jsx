import { db } from '../../../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import Dots from 'react-native-dots-pagination';
import Event from '../components/Event';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


const Home = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonColor, setButtonColor] = useState('#f5f5f5');
  const [activeIndex, setActiveIndex] = useState(0);
  const [pujaDay, setPujaDay] = useState(null);
  const [pujaDates, setPujaDates] = useState({});
  const [pujaEvents, setPujaEvents] = useState([]);
  const [foodEvents, setFoodEvents] = useState([]);
  const [culturalEvents, setCulturalEvents] = useState([]);
  const [bajaarTimes, setBajaarTimes] = useState([]);
  const [bajaarDescription, setBajaarDescription] = useState('');
  const [bajaarMainText1, setBajaarMainText1] = useState('')
  const [bajaarMainText2, setBajaarMainText2] = useState('')
  const [alert, setAlert] = useState('')
  const [alertVisible, setAlertVisible] = useState(true);
  const flatListRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const navigate = useNavigation();


  const closeAlert = () => {
    setAlertVisible(false);
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        const timesDocRef = doc(db, 'HDBS', 'Times');
        const pujaEventsDocRef = doc(db, 'HDBS', 'PujaEvents');
        const foodEventsDocRef = doc(db, 'HDBS', 'FoodService');
        const culturalEventsDocRef = doc(db, 'HDBS', 'CulturalProgram');
        const bajaarRef = doc(db, 'HDBS', 'PujaBajaar');
        const alertRef = doc(db, 'HDBS', 'AlertText')


        const timesDocSnap = await getDoc(timesDocRef);
        const pujaEventsDocSnap = await getDoc(pujaEventsDocRef);
        const foodEventsDocSnap = await getDoc(foodEventsDocRef);
        const culturalEventsDocSnap = await getDoc(culturalEventsDocRef);
        const bajaarSnap = await getDoc(bajaarRef);
        const alertSnap = await getDoc(alertRef)
        setBajaarTimes(bajaarSnap.data().bajaarTimes);
        setBajaarDescription(bajaarSnap.data().description);
        setBajaarMainText1(bajaarSnap.data().mainText1)
        setBajaarMainText2(bajaarSnap.data().mainText2)


        if (timesDocSnap.exists()) {
          const timesData = timesDocSnap.data();
          setPujaDates({
            Mahalaya: timesData.Mahalaya,
            Panchami: timesData.Panchami,
            Saptami: timesData.Saptami,
            Ashtami: timesData.Ashtami,
            Navami: timesData.Navami,
            VijayaDashami: timesData.VijayaDashami,
          });
        } else {
          console.log("Couldn't find the Times document.");
        }


        if (pujaEventsDocSnap.exists()) {
          setPujaEvents(pujaEventsDocSnap.data().events);
        } else {
          console.log("Couldn't find the Puja Events document.");
        }


        if (foodEventsDocSnap.exists()) {
          setFoodEvents(foodEventsDocSnap.data().events);
        } else {
          console.log("Couldn't find the FoodService document.");
        }


        if (culturalEventsDocSnap.exists()) {
          setCulturalEvents(culturalEventsDocSnap.data().events);
        } else {
          console.log("Couldn't find the CulturalProgram document.");
        }


        if (alertSnap.exists()) {
          console.log(alertSnap.data().text)
          setAlert(alertSnap.data().text)
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };


    fetchData();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "HDBS", "AlertText"), (doc) => {
      const alertData = doc.data()
      setAlert(alertData.text)
      setAlertVisible(true)
    });

    return () => unsub()
  }, [])


  useEffect(() => {
    if (pujaDates.Mahalaya) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);


      return () => clearInterval(timer);
    }
  }, [pujaDates]);


  function calculateTimeLeft() {
    if (pujaDates.Mahalaya) {
      const now = new Date();
      let targetDate = null;
      let pujaDayName = null;


      const pujaDays = ['Mahalaya', 'Panchami', 'Saptami', 'Ashtami', 'VijayaDashami', 'Navami'];
      for (const day of pujaDays) {
        const date = new Date(pujaDates[day].seconds * 1000 + pujaDates[day].nanoseconds / 1000000);
        if (now.toDateString() === date.toDateString()) {
          targetDate = date;
          if (day == "VijayaDashami") {
            pujaDayName = 'Bijoya Dashami'
          }
          else {
            pujaDayName = day;
          }
          break;
        } else if (now < date && (!targetDate || date < targetDate)) {
          targetDate = date;
          pujaDayName = null; // Not a puja day, just the next target date
        }
      }


      setPujaDay(pujaDayName);


      const difference = targetDate - now;


      let timeLeft = {};
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }


      return timeLeft;
    } else {
      return {};
    }
  }


  const getNextEvent = (events) => {
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.time.seconds * 1000 + event.time.nanoseconds / 1000000);
      return eventDate > now;
    });
    upcomingEvents.sort((a, b) => new Date(a.time.seconds * 1000 + a.time.nanoseconds / 1000000) - new Date(b.time.seconds * 1000 + b.time.nanoseconds / 1000000));
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };


  const nextPujaEvent = getNextEvent(pujaEvents);
  const nextFoodEvent = getNextEvent(foodEvents);
  const nextCulturalEvent = getNextEvent(culturalEvents);


  const getDateString = (event) => {
    if (event && event.time) {
      const eventDate = new Date(event.time.seconds * 1000 + event.time.nanoseconds / 1000000);
      return eventDate.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '';
  };




  const screenData = [
    {
      image: require('../assets/Durga.jpg'),
      headingText: pujaDay ? `আজ ${pujaDay}` : 'পুজো আসছে!',
      headingSubtext: pujaDay && nextPujaEvent ? `Next Puja Event: ${getDateString(nextPujaEvent)}` : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`,
      mainTextLine1: 'Houston Durga Bari',
      mainTextLine2: 'Welcomes you to Durga Puja 2024',
      isTrivia: false,
      page: 'PujaEvents'
    },
    {
      image: require('../assets/Bhog.png'),
      headingText: pujaDay ? `${pujaDay} ভোজ` : 'পুজোর ভোজ',
      headingSubtext: pujaDay && nextFoodEvent ? `Next Food Event: ${getDateString(nextFoodEvent)}` : 'Puja Feast',
      mainTextLine1: 'Registration Includes',
      mainTextLine2: 'Lunch/Dinner on all Puja Days',
      isTrivia: false,
      page: 'Food'
    },
    {
      image: require('../assets/Cultural.png'),
      headingText: pujaDay ? `${pujaDay} অনুষ্ঠান` : 'পুজোর অনুষ্ঠান',
      headingSubtext: pujaDay && nextCulturalEvent ? `Next Cultural Event: ${getDateString(nextCulturalEvent)}` : 'Cultural Program',
      mainTextLine1: 'Registration Includes',
      mainTextLine2: 'Admissions to all Cultural Programs',
      isTrivia: false,
      page: 'Cultural'
    },
    {
      image: require('../assets/bajaar.png'),
      headingText: 'পুজোর Bazaar',
      headingSubtext: 'Puja Stalls',
      mainTextLine1: 'Come shop for fashion jewelery, indian dresses, and more!',
      mainTextLine2: 'Contact Sujay Kahali to host your stall at Houston Durga Bari! Phone: 404-784-9205',
      isTrivia: false,
      isBajaar: true
    },
    {
      image: require('../assets/Trivia.png'),
      headingText: 'পুজোর Quiz',
      headingSubtext: 'Puja Trivia',
      isTrivia: true,
    },
  ];


  const triviaQuestions = [

    {

      question: 'According to Hindu mythology, who started Durga puja in autumn?',

      options: ['Lord Rama', 'Lord Krishna', 'Lord Brahma', 'Lord Indra'],

      answer: 0,

    },

    {

      question: 'Which of the following names is not a name of Goddess Durga?',

      options: ['Shailaja', 'Gouri', 'Uma', 'Kamala'],

      answer: 3,

    },

    {

      question: 'What Bengali song genre is related to Durgapuja?',

      options: ['Kirtan', 'Agamani', 'Bhatiyali', 'Rabindra Sangeet'],

      answer: 1,

    },

    {

      question: 'Which of the following weapons is not in the hand of Devi Durga?',

      options: ['Trishula', 'Kharga', 'Mushala', 'Vajra'],

      answer: 2,

    },

    {

      question: 'Which of the following Satyajit Ray movie did the idol of Durga play an important role in?',

      options: ['Devi', 'Kanchanjangha', 'Jay baba felunath', 'Aparajita'],

      answer: 2,

    },

    {

      question: 'In what animal form did the demon that Goddess Durga killed appear?',

      options: ['Buffalo', 'Bull', 'Bison', 'Lion'],

      answer: 0,

    },

    {

      question: 'Which of the following names is not a name of Lord Ganesha?',

      options: ['Lambodara', 'Gajanana', 'Vinayaka', 'MadanaMohana'],

      answer: 3,

    },

    {

      question: 'Which of the following phrases is not related to Bengali Durgapuja?',

      options: ['Festival of color', 'UNESCO intangible cultural heritage', 'The Daughter’s Homecoming', 'AkalBodhana'],

      answer: 0,

    },

    {

      question: 'Which of the following names describes Ma Durga as the daughter of mountain?',

      options: ['Ganesh Janani', 'Dashabhuja', 'Bhabani', 'Adrija'],

      answer: 3,

    },

    {

      question: 'What rituals do Bengalis observe to greet each other during Bijaya Dashami?',

      options: ['Kolakuli', 'High five', 'Handshake', 'Take a bow'],

      answer: 0,

    },



    {

      question: 'Traditionally, on which auspicious day does the work of making Durga idol begin?',

      options: ['Mahalaya', 'Rathayatra', 'Janmashtami', 'Bijaya Dashami'],

      answer: 1,

    },

    {

      question: 'What does Durga Puja celebrate?',

      options: ['The victory of Durga over Mahishasura', 'The birth of Lord Krishna', 'The victory of Rama over Ravana', 'The harvest festival'],

      answer: 0,

    },

    {

      question: 'Which flower is commonly used during Durga Puja?',

      options: ['Rose', 'Lotus', 'Marigold', 'Hibiscus'],

      answer: 1,

    },

    {

      question: 'What is the name of the last day of Durga Puja?',

      options: ['Maha Ashtami', 'Maha Saptami', 'Vijaya Dashami', 'Shashti'],

      answer: 2,

    },

  ];


  const handlePress = () => {
    Linking.openURL('https://durgabari.org/puja-2024/registration-donation/');
  };


  const handleAnswer = (index) => {
    setSelectedOption(index);
    if (index === triviaQuestions[currentQuestion].answer) {
      setButtonColor('#4CAF50'); // Green for correct answer
      setTimeout(() => {
        setButtonColor('#f5f5f5');
        if (currentQuestion < triviaQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setCurrentQuestion(0);
        }
        setSelectedOption(null);
      }, 1000);
    } else {
      setButtonColor('#F44336'); // Red for incorrect answer
      setTimeout(() => {
        setButtonColor('#f5f5f5');
        setSelectedOption(null);
      }, 1000);
    }
  };


  const renderPage = ({ item }) => (
    <View style={styles.pageContainer}>
      <Image source={item.image} style={styles.pageImage} />
      <Text style={styles.headingText}>{item.headingText}</Text>
      <Text style={!item.isTrivia ? pujaDay ? styles.pujaHeadingSubtext : styles.headingSubtext : styles.triviaHeadingSubtext}>{item.headingSubtext}</Text>
      {pujaDay && (
        <View>
          {item.page === 'Cultural' && nextCulturalEvent && <Event item={nextCulturalEvent} page={item.page} date={getDateString(nextCulturalEvent)} />}
          {item.page === 'Food' && nextFoodEvent && <Event item={nextFoodEvent} page={item.page} date={getDateString(nextFoodEvent)} />}
          {item.page === 'PujaEvents' && nextPujaEvent && <Event item={nextPujaEvent} page={item.page} date={getDateString(nextPujaEvent)} />}
          {item.page === 'PujaEvents' && <Text style={styles.headingSubtext}>Click on the Puja Events tab to see all events</Text>}
          {item.page === 'Food' && <Text style={styles.headingSubtext}>Click on the Food tab to see all food events</Text>}
          {item.page === 'Cultural' && <Text style={styles.headingSubtext}>Click on the Cultural Program tab to see all program events</Text>}
          {item.isBajaar && <Text style={styles.bajaarMainTextLine1}>{item.mainTextLine1}</Text>}
        </View>
      )}
      {item.isTrivia ? (
        <View style={styles.triviaContainer}>
          <Text style={styles.question}>{triviaQuestions[currentQuestion].question}</Text>
          <View style={styles.optionsContainer}>
            {triviaQuestions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(index)}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: selectedOption === index ? buttonColor : '#ffcccb',
                  },
                ]}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        (!pujaDay && (
          <View>
            {!item.isBajaar && <Text style={item.isBajaar ? styles.bajaarMainTextLine1 : styles.mainText}>{item.mainTextLine1}</Text>}
            {item.isBajaar && <Text style={styles.bajaarMainTextLine1}>{bajaarMainText1}</Text>}
            {item.isBajaar && <Text style={styles.bajaarMainText}>{bajaarMainText2}</Text>}
            {!item.isBajaar && <Text style={item.isBajaar ? styles.bajaarMainText : styles.mainText}>{item.mainTextLine2}</Text>}
          </View>
        ))
      )}


    </View>
  );


  const onViewRef = useRef((viewableItems) => {
    if (viewableItems.viewableItems.length > 0) {
      setActiveIndex(viewableItems.viewableItems[0].index);
    }
  });


  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });


  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          ref={flatListRef}
          data={screenData}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      </ScrollView>
      {alertVisible && (
        <View style={styles.alertContainer}>
          <View style={styles.alertContent}>
            <Feather name='alert-triangle' size={25} color={'black'} style={styles.alertIcon} />
            <Text style={styles.alertText}>{alert}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeAlert}>
              <Feather name='x-circle' size={25} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.dotsContainer}>
        <Dots length={screenData.length} active={activeIndex} activeColor="tomato" />
      </View>
      {activeIndex != 3 && <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Register Now</Text>
      </TouchableOpacity>}
      {activeIndex == 3 && <TouchableOpacity onPress={() => navigate.navigate('Details', { isBajaar: true, bajaarTimes: bajaarTimes, eventDescription: bajaarDescription })} style={styles.button}>
        <Text style={styles.buttonText}>See more</Text>
      </TouchableOpacity>}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#490000', // Dark red background
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  pageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  headingText: {
    fontSize: 35, // Adjusted to fit within screen
    fontWeight: 'bold',
    color: '#fa3737',
    textAlign: 'center',
  },
  triviaHeadingSubtext: {
    fontSize: 18,
    color: '#feb4b4',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingSubtext: {
    fontSize: 18,
    color: '#feb4b4',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  pujaHeadingSubtext: {
    fontSize: 18,
    color: '#feb4b4',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60, // Adjust this value if necessary
    width: '100%',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#feb4b4',
    textAlign: 'center',
    marginBottom: 20,
  },
  bajaarMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#feb4b4',
    textAlign: 'center',
    marginBottom: 20,
  },
  bajaarMainTextLine1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#feb4b4',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#feb4b4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  triviaContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#feb4b4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
    width: '48%', // Adjust to fit two options per row
    alignItems: 'center',
  },
  optionText: {
    fontSize: 13,
    color: 'black',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffc20a',
    paddingVertical: 10,
    zIndex: 1000,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    marginRight: 10,
    marginLeft: 5
  },
  alertText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    marginRight: 5,
    marginLeft: 10
  }
});


export default Home;

import * as React from 'react';
import { Image, StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from './ReviewsScreen'; 
import Sell from './sell'; 
import CreateUserScreen from './opret'; // Ikke færdiggjort
import LoginScreen from './login'; // Ikke færdiggjort
import BrowseScreen from './BrowseScreen'; 
import BookDetail from './BookDetailScreen'; 
import SavedScreen from './SavedScreen'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Konfigurerer stack- og tab-navigatorerne til appens navigation
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


/* 
 * Nedstående funktion bruges til at gemme eller fjerne en bog fra "gemte bøger".
 * Opdaterer AsyncStorage baseret på, om bogen allerede er gemt.
 */
const saveBook = async (book, isSaved) => {
  try {
    const savedBooks = await AsyncStorage.getItem('savedBooks');
    const booksArray = savedBooks ? JSON.parse(savedBooks) : [];

    if (!isSaved) {
      booksArray.push(book);
      await AsyncStorage.setItem('savedBooks', JSON.stringify(booksArray));
      alert('Bog gemt!'); 
    } else {
      const updatedBooksArray = booksArray.filter(b => b.bookTitle !== book.bookTitle);
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updatedBooksArray));
      alert('Bog fjernet fra gemte!'); 
    }
  } catch (error) {
    console.error("Fejl ved gemme af bogen:", error);
  }
};

/*
 * Denne hovedskærm, som viser kategorier og lister med bøger til salg.
 * Henter data fra AsyncStorage ved opstart og hver gang brugeren vender tilbage.
 */

function LocalHomeScreen({ navigation }) {
  const [books, setBooks] = React.useState([]);
  const [savedBooks, setSavedBooks] = React.useState([]);

  const categories = ['Science Fiction', 'Romance', 'Thriller', 'Fantasy', 'Non-fiction'];
  const categoryColors = ['#FF8C00', '#FFA500', '#FF4500', '#FF6347', '#FFB732'];

  React.useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('books');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        } else {
          console.log("Ingen bøger fundet i AsyncStorage.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af bøger:", error);
      }
    };

    const loadSavedBooks = async () => {
      try {
        const storedSavedBooks = await AsyncStorage.getItem('savedBooks');
        if (storedSavedBooks) {
          setSavedBooks(JSON.parse(storedSavedBooks));
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af gemte bøger:", error);
      }
    };

    loadBooks();
    loadSavedBooks();

    // Opdaterer bøgerne når skærmen får fokus
    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
      loadSavedBooks();
    });

    return unsubscribe;
  }, [navigation]);


  // Renderer hvert bogelement i listen
  const renderBookItem = ({ item }) => {
    const isSaved = savedBooks.find(b => b.bookTitle === item.bookTitle);
    return (
      <View style={styles.bookItem}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
        )}
        <View style={styles.bookDescription}>
          <Text style={styles.bookTitle}>{item.bookTitle}</Text>
          <Text>{item.author}</Text>
          <Text>{item.price} DKK</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('BookDetail', { book: item })}
        >
          <Text style={styles.moreButtonText}>Læs mere</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            await saveBook(item, isSaved);
            setSavedBooks(prev => 
              isSaved 
              ? prev.filter(b => b.bookTitle !== item.bookTitle) 
              : [...prev, item]
            );
          }}
        >
          <Text style={styles.saveButtonText}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Renderer banneret med boganbefalinger
const renderRecommendationBanner = (navigation) => (
  <TouchableOpacity 
    style={styles.bannerContainer} 
    onPress={() => navigation.navigate('Reviews')}
  >
    <Text style={styles.bannerText}>📚✨ Book Recommendations from New York Times! ✨📚</Text>
  </TouchableOpacity>
);


  const renderCategoryItem = ({ item, index }) => (
    <View style={[styles.categoryItem, { backgroundColor: categoryColors[index % categoryColors.length] }]} >
      <Text style={styles.categoryText}>{item}</Text>
    </View>
  );

  const navigateToReviews = () => {
    navigation.navigate('Reviews'); // Navigate to ReviewsScreen
  };

  return (
    <ScrollView style={styles.scrollContainer}>
            {/* Hovedbanner og titel */}
      <View style={styles.headerContainer}>
        <Image source={require('./assets/bog.png')} style={styles.reactLogo} />
        <Text style={styles.titleText}>FlipShelf</Text>
      </View>
  
      <View style={styles.stepContainer}>
  <Text style={styles.highlightedSubtitleText}>Del og opdag brugte bøger </Text>
  <Text style={styles.descriptionText}>Find din næste yndlingsbog blandt vores udvalg👇</Text>
</View>
        {/* Valg af kategori */}
      <View style={styles.categoryContainer}>
        <Text style={styles.subtitleText}>Vælg din kategori</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
        <View style={styles.divider} />
  
        {/* Lister alle bøger til salg */}
      <View style={styles.exploreContainer}>
        <Text style={styles.subtitleText}>Udforsk bøger til salg</Text>
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.bookTitle}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />

        {/* Knap til at se alle bøger */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Browse')}  
        >
          <Text style={styles.buttonText}>Se alle bøger</Text>
        </TouchableOpacity>
      </View>
  
      {/* Divider after the book sales section */}
      <View style={styles.divider} />
  
      {renderRecommendationBanner(navigation)}
      </ScrollView>
  );
}  

/* 
 * Tab-navigator til at navigere mellem hovedsektionerne i appen
 * Loginstatus bruges til at betinge visningen af Sælg-fanen.
 */
function TabNavigator({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  /* 
 * Denne Logout funktion virker ikke endnu
 */
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigation.navigate('Login'); 
  };

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    };
    checkLoginStatus();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF5733',
        tabBarStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={LocalHomeScreen}
        options={{
          tabBarLabel: 'Hjem',
          tabBarIcon: ({ color }) => <Icon name="home-outline" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Udforsk Bøger" 
        component={BrowseScreen} 
        options={{
          tabBarLabel: 'Udforsk Bøger',
          tabBarIcon: ({ color }) => <Icon name="book-outline" size={24} color={color} />, // Change icon as needed
        }}
      />
      <Tab.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{
          tabBarLabel: 'Anbefalinger',
          tabBarIcon: ({ color }) => <Icon name="star-outline" size={24} color={color} />,
        }}
      />
      {isLoggedIn && ( 
        <Tab.Screen
          name="Sell"
          component={Sell}
          options={{
            tabBarLabel: 'Sælg',
            tabBarIcon: ({ color }) => <Icon name="cash-outline" size={24} color={color} />,
          }}
        />
      )}
            <Tab.Screen
        name="Saved Screen"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Gemt',
          tabBarIcon: ({ color }) => <Icon name="heart-outline" size={24} color={color} />,
        }}
        />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
<Stack.Navigator initialRouteName="Home">
  <Stack.Screen 
    name="Home" 
    component={TabNavigator} 
    options={{ headerShown: false }} 
  />
  <Stack.Screen 
    name="Browse" 
    component={BrowseScreen} 
    options={{ title: 'Alle Bøger' }} 
  />
  <Stack.Screen 
    name="BookDetail" 
    component={BookDetail} 
  />
  <Stack.Screen 
    name="Login" 
    component={LoginScreen} 
  />
  <Stack.Screen 
  name="Saved" 
  component={SavedScreen} 
  options={{ title: 'Gemte Bøger' }} 
/>
</Stack.Navigator>

    </NavigationContainer>
  );
}


// Definerer stilarter til de forskellige komponenter i appen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    // No need for flexGrow here, just let it scroll
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    justifyContent: 'center', // Placerer logo og titel med plads imellem
  },  
  reactLogo: {
    width: 60,
    height: 80,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Sørg for, at teksten er venstrestillet
  },
  stepContainer: {
    backgroundColor: '#D6A600', // Lys blå baggrundsfarve
    paddingVertical: 90, // Øg den lodrette padding for at gøre banneret højere
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom:30,  
  },
  highlightedSubtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionText: {
    textAlign: 'center',
    color: '#fff',
  },
  categoryContainer: {
    marginBottom: 20,
    width: '100%',
    paddingHorizontal:10,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryItem: {
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exploreContainer: {
    width: '100%',
    padding: 10,
  },
  bookItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    maxWidth: '48%', // Control the width of book items for multiple columns
  },
  bookImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  bookDescription: {
    paddingTop: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF5733',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreButton: {
    backgroundColor: '#C4C3D0',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  moreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerContainer: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerContainer: {
    backgroundColor: '#800080', // Lys blå baggrundsfarve
    paddingVertical: 50, // Øg den lodrette padding for at gøre banneret højere
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  bannerText: {
    fontSize: 20, // Øg skriftstørrelsen for at gøre teksten mere synlig
    fontWeight: 'bold',
    color: '#fff', // Hvid tekstfarve
    textAlign: 'center',
  },
  divider: {
    height: 1, // Højden på divideren
    backgroundColor: '#ccc', // Farven på divideren
    marginVertical: 20, // Margin mellem sektioner
    width: '100%', // Bredde på divideren
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  saveButtonText: {
    fontSize: 24, // Adjust size for visibility
  },
});
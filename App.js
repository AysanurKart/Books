import * as React from 'react';
import { Image, StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from './ReviewsScreen'; // Ensure this imports correctly
import Sell from './sell'; // Ensure this imports correctly
import CreateUserScreen from './opret'; // Ensure this imports correctly
import BrowseScreen from './BrowseScreen'; // Import BrowseScreen
import BookDetail from './BookDetailScreen'; // Import BookDetail
import BookDetail from './login'; // Import BookDetail
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LocalHomeScreen({ navigation }) {
  const categories = ['Fiktion', 'Non-fiktion', 'Børnebøger', 'Klassikere', 'Fantasy'];
  const categoryColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'];
  const [books, setBooks] = React.useState([]);

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

    loadBooks();
  }, []);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('BookDetail', { book: item })} // Navigate to BookDetail with the selected book
    >
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.bookImage} />
      )}
      <View style={styles.bookDescription}>
        <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        <Text>{item.author}</Text>
        <Text>{item.price} DKK</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item, index }) => (
    <View style={[styles.categoryItem, { backgroundColor: categoryColors[index % categoryColors.length] }]} >
      <Text style={styles.categoryText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/bog.png')} style={styles.reactLogo} />
        <Text style={styles.titleText}>FlipShelf</Text>
      </View>

      {/* Knapperne mellem logo og banner */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7} // Set active opacity here
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.buttonText}>Log Ind</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7} // Set active opacity here
          onPress={() => navigation.navigate('opret')}
        >
          <Text style={styles.buttonText}>Opret Bruger</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.highlightedSubtitleText}>Del og opdag brugte bøger</Text>
        <Text style={styles.descriptionText}>Find din næste yndlingsbog blandt vores udvalg</Text>
      </View>

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

<View style={styles.exploreContainer}>
  <Text style={styles.subtitleText}>Udforsk bøger til salg</Text>
  <FlatList
    data={books}
    renderItem={renderBookItem}
    keyExtractor={(item) => item.bookTitle}
    horizontal={false} // Set this to false to make it vertical
    showsVerticalScrollIndicator={false}
    numColumns={1} // Use one column to make it full width
  />
  <TouchableOpacity
    style={styles.button}
    activeOpacity={0.7}
    onPress={() => navigation.navigate('Browse')}
  >
    <Text style={styles.buttonText}>Se alle bøger</Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

// Tab navigator
function TabNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

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
        tabBarActiveTintColor: '#FF5733', // Active tab color
        tabBarStyle: { backgroundColor: '#f5f5f5' }, // Tab bar background color
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
        name="Reviews"
        component={ReviewsScreen}
        options={{
          tabBarLabel: 'Anmeldelser',
          tabBarIcon: ({ color }) => <Icon name="star-outline" size={24} color={color} />,
        }}
      />
      {isLoggedIn ? (
        <Tab.Screen
          name="Sell"
          component={Sell}
          options={{
            tabBarLabel: 'Sælg',
            tabBarIcon: ({ color }) => <Icon name="cash-outline" size={24} color={color} />,
          }}
        />
      ) : null}
      <Tab.Screen
        name="Create User"
        component={CreateUserScreen}
        options={{
          tabBarLabel: 'Bruger',
          tabBarIcon: ({ color }) => <Icon name="person-add-outline" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Opret" component={CreateUserScreen} />
        <Stack.Screen name="Browse" component={BrowseScreen} options={{ title: 'Alle Bøger' }} />
        <Stack.Screen name="BookDetail" component={BookDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  reactLogo: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#C9A0DC',
    width: '100%',
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    alignSelf: 'stretch',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  highlightedSubtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  categoryContainer: {
    marginTop: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    alignSelf: 'stretch',
  },
  exploreContainer: {
    marginTop: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    alignSelf: 'stretch',
  },
  categoryItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    elevation: 2,
    height: 60,
    width: 80,
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    elevation: 2,
    width: '100%',
  },
  bookImage: {
    width: 60,
    height: 90,
    marginRight: 10,
  },
  bookDescription: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: '48%', // Adjust width to fit two buttons
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


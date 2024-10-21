import * as React from 'react';
import { Image, StyleSheet, View, FlatList, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReviewsScreen from './ReviewsScreen'; // Ensure this imports correctly
import Sell from './sell'; // Ensure this imports correctly
import CreateUserScreen from './opret'; // Ensure this imports correctly
import LoginScreen from './login'; // Import your login component
import BrowseScreen from './BrowseScreen'; // Import BrowseScreen
import BookDetail from './BookDetailScreen'; // Import BookDetail
import Icon from 'react-native-vector-icons/Ionicons'; // Import icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LocalHomeScreen({ navigation }) {
  const categories = ['Fiktion', 'Non-fiktion', 'Børnebøger', 'Klassikere', 'Fantasy'];
  const categoryColors = ['#FFA500', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500'];
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Image source={require('./assets/bog.png')} style={styles.reactLogo} />
        <Text style={styles.titleText}>FlipShelf</Text>
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
          numColumns={2} // Set this based on your layout preference
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Browse')}  
        >
          <Text style={styles.buttonText}>Se alle bøger</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Tab navigator
// Tab navigator
function TabNavigator({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false); // Update state to reflect logout
    navigation.navigate('Login'); // Navigate to Login screen after logout
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
        name="Udforsk Bøger" // New Tab Screen for Explore Books
        component={BrowseScreen} // Use BrowseScreen as the component
        options={{
          tabBarLabel: 'Udforsk Bøger',
          tabBarIcon: ({ color }) => <Icon name="book-outline" size={24} color={color} />, // Change icon as needed
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
      {isLoggedIn && ( // Conditionally render the Sell tab
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
  scrollContainer: {
    // No need for flexGrow here, just let it scroll
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    width: '100%',
    justifyContent: 'center', // Placerer logo og titel med plads imellem
  },  
  reactLogo: {
    width: 100,
    height: 100,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left', // Sørg for, at teksten er venstrestillet
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  highlightedSubtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  descriptionText: {
    textAlign: 'center',
    color: '#666',
  },
  categoryContainer: {
    marginBottom: 20,
    width: '100%',
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
});

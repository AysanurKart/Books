import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedScreen = () => {
  const [savedBooks, setSavedBooks] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false); // State to trigger refresh

  React.useEffect(() => {
    const loadSavedBooks = async () => {
      try {
        const savedBooksData = await AsyncStorage.getItem('savedBooks');
        if (savedBooksData) {
          setSavedBooks(JSON.parse(savedBooksData));
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af gemte bøger:", error);
      }
    };

    loadSavedBooks();
  }, [refresh]); // Add refresh as a dependency

  const removeFromSaved = async (bookTitle) => {
    try {
      const savedBooksData = await AsyncStorage.getItem('savedBooks');
      const books = savedBooksData ? JSON.parse(savedBooksData) : [];

      // Filter out the book to be removed
      const updatedBooks = books.filter(book => book.bookTitle !== bookTitle);

      // Update AsyncStorage with the new list
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updatedBooks));

      // Update the state to reflect the removed book
      setRefresh(!refresh); // Toggle refresh state to trigger re-fetch

      Alert.alert('Success', 'Book removed from saved list');
    } catch (error) {
      console.error("Fejl ved fjernelse af bog:", error);
      Alert.alert('Error', 'Could not remove the book');
    }
  };

  const renderSavedBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        <Text>{item.author}</Text>
        <Text>{item.price} DKK</Text>
      </View>
      <Button title="Fjern fra gemte" onPress={() => removeFromSaved(item.bookTitle)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gemte Bøger</Text>
      <FlatList
        data={savedBooks}
        renderItem={renderSavedBookItem}
        keyExtractor={(item) => item.bookTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bookItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SavedScreen;

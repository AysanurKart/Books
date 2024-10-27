import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedScreen = () => {
  // State til at gemme listen af gemte bøger
  const [savedBooks, setSavedBooks] = React.useState([]);
  // State til at styre opdatering af listen, når en bog fjernes
  const [refresh, setRefresh] = React.useState(false); // State til at trigger refresh


  // useEffect-hook til at hente gemte bøger fra AsyncStorage, når komponenten indlæses eller refresh ændrer sig
  React.useEffect(() => {
    const loadSavedBooks = async () => {
      try {
        // Henter listen over gemte bøger fra AsyncStorage
        const savedBooksData = await AsyncStorage.getItem('savedBooks');
        if (savedBooksData) {
          // Opdaterer state med gemte bøger, hvis de findes i AsyncStorage
          setSavedBooks(JSON.parse(savedBooksData));
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af gemte bøger:", error);
      }
    };

    loadSavedBooks();
  }, [refresh]); // refresh som afhængighed sikrer, at listen opdateres, når en bog fjernes


    // Funktion til at fjerne en bog fra den gemte liste baseret på bogens titel
  const removeFromSaved = async (bookTitle) => {
    try {
        // Henter den aktuelle liste af gemte bøger fra AsyncStorage    
      const savedBooksData = await AsyncStorage.getItem('savedBooks');
      const books = savedBooksData ? JSON.parse(savedBooksData) : [];

      // Filtrerer bøger for at fjerne den valgte bog
      const updatedBooks = books.filter(book => book.bookTitle !== bookTitle);

      // Opdaterer AsyncStorage med den nye liste uden den slettede bog
      await AsyncStorage.setItem('savedBooks', JSON.stringify(updatedBooks));

      // Toggler refresh-state for at udløse en ny render og opdatere UI'et
      setRefresh(!refresh); 

      // Viser en besked, når bogen fjernes med succes
      Alert.alert('Success', 'Book removed from saved list');
    } catch (error) {
      console.error("Fejl ved fjernelse af bog:", error);
      Alert.alert('Error', 'Could not remove the book');
    }
  };

    // Renderer hver bog i gemte bøger som en listeitem
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

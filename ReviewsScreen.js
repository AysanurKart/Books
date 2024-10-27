import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Image, ScrollView } from 'react-native';

// New York Times API-nøgle til at hente boganmeldelser
const NYT_API_KEY = 'z4jSQg7oGqsLaA7qpXp2qtnKzaYC34su';

const ReviewsScreen = () => {
// State til opbevaring af bogdata fra API'et
  const [books, setBooks] = useState([]);
// State til håndtering af indlæsningsstatus (viser en loader, mens data hentes)
  const [loading, setLoading] = useState(true);
// State til at gemme fejlbeskeder, hvis datahentning mislykkes
  const [error, setError] = useState(null);
// State til at gemme brugerens søgeterm for filtrering af boglisten
  const [searchTerm, setSearchTerm] = useState('');
// State til at opbevare den filtrerede liste over bøger baseret på søgetermen
  const [filteredBooks, setFilteredBooks] = useState([]);

// useEffect til at hente bogdata fra New York Times API, når komponenten indlæses første gang
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${NYT_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
    
        // Parse JSON-responsen og opdaterer `books` og `filteredBooks` med bogdata
        const data = await response.json();
        setBooks(data.results.books);
        setFilteredBooks(data.results.books);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

    // useEffect til at filtrere bøger baseret på brugerens input i søgefeltet
  useEffect(() => {
    if (searchTerm) {
    // Filtrerer bøger, hvor titlen matcher søgetermen (case-insensitive)
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
    // Hvis søgetermen er tom, vises hele boglisten 
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  // Returnerer en loader, hvis data stadig indlæses
  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  // Returnerer en fejlmeddelelse, hvis datahentningen mislykkes
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('./assets/bog.png')}
          style={styles.logo}
        />
        <Text style={styles.headerText}>FlipShelf</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
       {/* Søgefelt til filtrering af boglisten */}    
        <TextInput
          style={styles.searchInput}
          placeholder="Søg efter bøger..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {/* Liste over bøger (filtreret baseret på søgetermen) */}        
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.primary_isbn10}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>By {item.author}</Text>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  bookItem: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: 'gray',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ReviewsScreen;

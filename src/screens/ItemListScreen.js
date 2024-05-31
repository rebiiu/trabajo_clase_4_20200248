import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';

export default function SpiderManCharacterListScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await fetch('https://akabab.github.io/superhero-api/api/all.json');
      const data = await response.json();
      // Filter characters related to Spider-Man
      const spiderManCharacters = data.filter(character => character.connections.groupAffiliation.includes('Spider-Man') || character.biography.aliases.includes('Spider-Man'));
      setCharacters(spiderManCharacters);
      setLoading(false);
    } catch (error) {
      console.error("Hubo un error obteniendo los personajes", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Image source={{ uri: item.images.md }} style={styles.image} />
        <Text style={styles.description}>Nombre completo: {item.biography.fullName}</Text>
        <Text style={styles.description}>Alineación: {item.biography.alignment}</Text>
        <Text style={styles.description}>Primera aparición: {item.biography.firstAppearance}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={characters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  list: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666666',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
});

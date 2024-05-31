import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';

export default function ItemListScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://swapi.dev/api/people/');
      const data = await response.json();
      setItems(data.results);
      setLoading(false);
    } catch (error) {
      console.error("Hubo un error obteniendo los items", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>Altura: {item.height} cm</Text>
        <Text style={styles.description}>Peso: {item.mass} kg</Text>
        <Text style={styles.description}>Color de cabello: {item.hair_color}</Text>
        <Text style={styles.description}>Color de piel: {item.skin_color}</Text>
        <Text style={styles.description}>Color de ojos: {item.eye_color}</Text>
        <Text style={styles.description}>Año de nacimiento: {item.birth_year}</Text>
        <Text style={styles.description}>Género: {item.gender}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
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
  loading: {
    marginTop: 20,
  },
});

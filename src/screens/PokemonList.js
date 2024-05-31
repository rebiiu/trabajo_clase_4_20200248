import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, ActivityIndicator, Button } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

import PokemonItem from '../components/PokemonItem';

export default function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cantidadPokemon, setCantidadPokemon] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${cantidadPokemon}`);
      const data = await response.json();
      setPokemon(data.results.map((result, index) => ({ ...result, id: index + 1 })));
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Listado de Pokemones usando Fetch</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cantidad de Pokémon"
          keyboardType="numeric"
          value={String(cantidadPokemon)}
          onChangeText={text => setCantidadPokemon(Number(text))}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button
          title="Buscar"
          onPress={fetchData}
          color="#f00"
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#ff0000" />
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={({ item }) => <PokemonItem item={item} />}
          keyExtractor={(item) => item.name}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00796b',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#00796b',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
    width: '30%',
  },
  searchInput: {
    height: 40,
    borderColor: '#00796b',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
    width: '40%',
  },
  list: {
    justifyContent: 'center',
  },
  loading: {
    marginTop: 20,
  },
});


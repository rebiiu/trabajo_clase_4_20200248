import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TextInput, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';

const WIDTH = Dimensions.get('window').width;
const numColumns = 3;

export default function PokemonAxios() {
  const [pokemon, setPokemon] = useState([]);
  const [nPokemon, setNPokemon] = useState(25);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getPokemon(nPokemon);
  }, []);

  const getPokemon = async (nPokemon) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${nPokemon}`);
      const dataPokemon = response.data.results;

      const pokemonDetailsPromises = dataPokemon.map(async (poke) => {
        const pokeDetailsResponse = await axios.get(poke.url);
        return { ...poke, details: pokeDetailsResponse.data };
      });

      const pokemonWithDetails = await Promise.all(pokemonDetailsPromises);
      setPokemon(pokemonWithDetails);
      setLoading(false);
    } catch (error) {
      console.log("Hubo un error listando los pokemones", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text>Número Pokedex: <Text style={styles.number}>{item.details.id}</Text></Text>
        <Image
          style={styles.image}
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.details.id}.png` }}
        />
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>
          Habilidades: {item.details.abilities.map(ability => ability.ability.name).join(', ')}
        </Text>
      </View>
    );
  };

  const filteredPokemon = pokemon.filter((poke) =>
    poke.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Listado de Pokemones usando axios</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cantidad de Pokémon"
          keyboardType="numeric"
          value={String(nPokemon)}
          onChangeText={text => setNPokemon(Number(text))}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button
          title="Buscar"
          onPress={() => getPokemon(nPokemon)}
          color="#f00"
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#ff0000" />
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={renderItem}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 5,
    width: WIDTH / numColumns - 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: 80,
    height: 80,
  },
  number: {
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 20,
  },
});
9
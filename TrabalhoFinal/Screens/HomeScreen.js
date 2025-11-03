import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import { fetchMeals } from '../Services/mealService';

export default function HomeScreen() {
  const [saldo, setSaldo] = useState(0);
  const [quantia, setQuantia] = useState('');
  const [tickets, setTickets] = useState(1);
  const [cardapio, setCardapio] = useState([]);

  const adicionarSaldo = () => {
    const valor = parseFloat(quantia);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }
    setSaldo(saldo + valor);
    setQuantia('');
  };

  useEffect(() => {
    
    fetchMeals().then(meals => setCardapio(meals));

    
    const interval = setInterval(() => {
      Alert.alert('Novo Ticket', 'Um novo ticket foi adicionado!');
      setTickets(prev => prev + 1);
    }, 86400000);

    const resetInterval = setInterval(() => {
      Alert.alert('Tickets redefinidos', 'Os tickets foram redefinidos para 1!');
      setTickets(1);
    }, 86400000);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagem }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardDescription}>{item.descricao.slice(0,100)}…</Text>
      <Text style={styles.cardPrice}>R$ {item.preco}</Text>
      <TouchableOpacity style={styles.cardButton} onPress={() => Alert.alert('Item Selecionado', `Você selecionou: ${item.nome}`)}>
        <Text style={styles.cardButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saldo: R$ {saldo.toFixed(2)}</Text>
      <Text style={styles.title}>Tickets: {tickets}</Text>

      <TextInput
        style={styles.input}
        placeholder="Adicionar saldo"
        keyboardType="numeric"
        value={quantia}
        onChangeText={setQuantia}
      />
      <Button title="Adicionar Saldo" onPress={adicionarSaldo} />

      <Text style={styles.subtitle}>Cardápio</Text>
      <FlatList
        data={cardapio}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.cardapioContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
  cardapioContainer: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width:0, height:2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDescription: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  cardButton: { backgroundColor: '#A4BB49', paddingVertical:10, borderRadius:8, alignItems:'center' },
  cardButtonText: { color:'#fff', fontSize:16, fontWeight:'bold' },
});

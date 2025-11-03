import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';

export default function HomeScreen() {
  const [saldo, setSaldo] = useState(0);
  const [quantia, setQuantia] = useState('');
  const [tickets, setTickets] = useState(1); // Estado para os tickets

  const adicionarSaldo = () => {
    const valor = parseFloat(quantia); // Converte a entrada para número
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }
    setSaldo(saldo + valor); // Adiciona o valor ao saldo atual
    setQuantia(''); // Limpa o campo de entrada
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prevTickets) => {
        console.log('Um ticket foi adicionado! mas essa merdas tem que ser alert depois');
        return prevTickets + 1;
      });
    }, 86400000); // 1 dia

    const resetInterval = setInterval(() => {
      console.log('Os tickets foram redefinidos para 1!');
      setTickets(1); // Redefine os tickets para 1
    }, 86400000); // 1 dia

    // Limpa os intervalos quando o componente é desmontado
    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>
      <Text style={styles.saldoText}>Seu saldo é: R${saldo.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a quantia"
        keyboardType="numeric"
        value={quantia}
        onChangeText={setQuantia}
      />
      <Button title="Adicionar Saldo" onPress={adicionarSaldo} />
      <Text style={styles.ticketsText}>Tickets disponíveis: {tickets}</Text>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  saldoText: { fontSize: 18, marginBottom: 20 },
  ticketsText: { fontSize: 18, marginVertical: 16 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
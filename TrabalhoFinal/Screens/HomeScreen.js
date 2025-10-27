import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';

export default function HomeScreen() {
  const [saldo, setSaldo] = useState(0);
  const [quantia, setQuantia] = useState(''); // Para armazenar a entrada do usuário

  const adicionarSaldo = () => {
    const valor = parseFloat(quantia); // Converte a entrada para número
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }
    setSaldo(saldo + valor); // Adiciona o valor ao saldo atual
    setQuantia(''); // Limpa aentrada
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Home!</Text>
      <Text>Seu saldo é: R${saldo.toFixed(2)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a quantia"
        keyboardType="numeric"
        value={quantia}
        onChangeText={setQuantia}
      />
      <Button title="Adicionar Saldo" onPress={adicionarSaldo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
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
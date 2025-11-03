import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigScreen({ navigation }) {
  const [tema, setTema] = useState('light');
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');

  const salvarDados = async () => {
    if (!nome || !turma) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await AsyncStorage.setItem('nome', nome);
      await AsyncStorage.setItem('turma', turma);
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const alternarTema = () => {
    setTema((prevTema) => (prevTema === 'light' ? 'dark' : 'light'));
  };

  const estilosAtuais =
    tema === 'light'
      ? { backgroundColor: '#F8F9FA', color: '#2D3142' }
      : { backgroundColor: '#1F2937', color: '#F9FAFB' };

  return (
    <View style={[styles.container, { backgroundColor: estilosAtuais.backgroundColor }]}>
      <Text style={[styles.title, { color: estilosAtuais.color }]}>Configurações</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Turma:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua turma"
        value={turma}
        onChangeText={setTurma}
      />

      <Button title="Salvar" onPress={salvarDados} />

      <TouchableOpacity onPress={alternarTema}>
        <Text>Mudar para tema {tema === 'light' ? 'escuro' : 'claro'}</Text>
      </TouchableOpacity>

      <StatusBar style={tema === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 28 },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20, width: '80%' },
});
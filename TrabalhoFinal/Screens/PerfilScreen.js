import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [imagem, setImagem] = useState(null);
  const carregarDados = async () => {
    try {
      const nomeSalvo = await AsyncStorage.getItem('nome');
      const turmaSalva = await AsyncStorage.getItem('turma');
      const imagemSalva = await AsyncStorage.getItem('imagem');
      if (nomeSalvo) setNome(nomeSalvo);
      if (turmaSalva) setTurma(turmaSalva);
      if (imagemSalva) setImagem(imagemSalva);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: imagem || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ71x_K2UcszdyBiq6m5BzXxaCwEgCSc74gsQ&s',
        }}
        style={{ width: 100, height: 100, borderRadius: 100 }}
      />
      <Text>Nome: {nome}</Text>
      <Text>Turma: {turma}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
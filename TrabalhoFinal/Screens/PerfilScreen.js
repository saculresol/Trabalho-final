import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';
import { supabase } from '../Services/supabase';

export default function PerfilScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [imagem, setImagem] = useState(null);

  const { colors, theme } = useTheme();

  const carregarDadosSupabase = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const { data, error } = await supabase
        .from('usuarios')
        .select('nome, turma, imagem')
        .eq('id', Number(userId))
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        return;
      }

      if (data) {
        setNome(data.nome || '');
        setTurma(data.turma || '');
        setImagem(data.imagem || null);

        await AsyncStorage.multiSet([
          ['nome', data.nome || ''],
          ['turma', data.turma || ''],
        ]);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do Supabase:', err);
    }
  };

  const carregarDadosCache = async () => {
    try {
      const nomeCache = await AsyncStorage.getItem('nome');
      const turmaCache = await AsyncStorage.getItem('turma');
      if (nomeCache) setNome(nomeCache);
      if (turmaCache) setTurma(turmaCache);
    } catch (err) {
      console.error('Erro ao carregar dados do cache:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await carregarDadosCache();
      await carregarDadosSupabase();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={{
          uri:
            imagem ||
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ71x_K2UcszdyBiq6m5BzXxaCwEgCSc74gsQ&s',
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={[styles.text, { color: colors.text }]}>Nome: {nome}</Text>
      <Text style={[styles.text, { color: colors.text }]}>Turma: {turma}</Text>
      <Text style={styles.footer}>Versão 0.1.0 • Desenvolvido por Equipe Cantina Lhey</Text>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  image: { width: 100, height: 100, borderRadius: 100, marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 8 },
  footer: { fontSize: 14, color: '#9CA3AF', marginTop: 30, textAlign: 'center' },
});

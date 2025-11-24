import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Context/ThemeContext';

export default function TransacoesScreen() {
  const navigation = useNavigation();
  const [transacoes, setTransacoes] = useState([]);
  const { colors, theme, themeColors } = useTheme();

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    try {
      const data = await AsyncStorage.getItem('transacoes');
      if (data) setTransacoes(JSON.parse(data));
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const limparHistorico = async () => {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja apagar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('transacoes');
            setTransacoes([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.tipo}>
        {item.tipo === 'ticket'
          ? '🎫 Pago com Ticket'
          : `💰 Pago com Saldo (R$ ${item.preco.toFixed(2)})`}
      </Text>
      <Text style={styles.data}>📅 {item.data}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     
      <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={22} color="#fff" />
        <Text style={styles.voltarText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <AntDesign name="profile" size={24} color="#A4BB49" />
        <Text style={[styles.titulo, { color: colors.text }]}>Histórico de Transações</Text>
      </View>

      {transacoes.length === 0 ? (
        <Text style={[styles.vazio, { color: colors.text }]}>Nenhuma transação encontrada</Text>
      ) : (
        <FlatList
          data={transacoes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}

      {transacoes.length > 0 && (
        <TouchableOpacity style={styles.botaoLimpar} onPress={limparHistorico}>
          <AntDesign name="delete" size={18} color="#fff" />
          <Text style={styles.textoBotao}>Limpar Histórico</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  voltarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A4BB49',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  voltarText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  tipo: { fontSize: 14, color: '#555', marginVertical: 5 },
  data: { fontSize: 12, color: '#777' },
  vazio: { textAlign: 'center', marginTop: 50, color: '#888' },
  botaoLimpar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A4BB49',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  lista: { paddingBottom: 20 },
});

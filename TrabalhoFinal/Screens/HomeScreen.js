import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchMeals } from '../Services/mealService';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';
import { supabase } from '../Services/supabaseService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [saldo, setSaldo] = useState(0);
  const [quantia, setQuantia] = useState('');
  const [tickets, setTickets] = useState(0);
  const [cardapio, setCardapio] = useState([]);
  const { colors, theme } = useTheme();

  async function carregarDadosUsuario() {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const { data, error } = await supabase
        .from('usuarios')
        .select('saldo, tickets')
        .eq('id', Number(userId))
        .single();

      if (error) {
        console.log('Erro ao buscar usuário no Supabase:', error);
      } else if (data) {
        setSaldo(Number(data.saldo ?? 0));
        setTickets(Number(data.tickets ?? 0));

        try {
          const raw = await AsyncStorage.getItem('saldosUsuarios');
          const lista = raw ? JSON.parse(raw) : [];
          const index = lista.findIndex(u => u.id === String(userId));
          if (index >= 0) {
            lista[index].saldo = Number(data.saldo ?? 0);
          } else {
            lista.push({ id: String(userId), saldo: Number(data.saldo ?? 0) });
          }
          await AsyncStorage.setItem('saldosUsuarios', JSON.stringify(lista));
        } catch (e) {
          console.log('Erro ao atualizar cache local de saldo:', e);
        }
      }
    } catch (e) {
      console.log('Erro carregarDadosUsuario:', e);
    }
  }

  async function carregarCardapio() {
    try {
      const dadosCardapio = await fetchMeals();
      if (Array.isArray(dadosCardapio)) {
        setCardapio(dadosCardapio);
      } else {
        console.warn('fetchMeals não retornou array:', dadosCardapio);
      }
    } catch (e) {
      console.error('Erro ao carregar cardápio:', e);
    }
  }

  async function irParaPagamento() {
    const valor = parseFloat(quantia);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert('Erro', 'Usuário não identificado.');
      return;
    }

    navigation.navigate('Pagamento', {
      amount: valor,
      userId: Number(userId),
    });

    setQuantia('');
  }

  async function adicionarAoCarrinho(item) {
    try {
      const raw = await AsyncStorage.getItem('carrinho');
      const carrinhoAtual = raw ? JSON.parse(raw) : [];
      carrinhoAtual.push(item);
      await AsyncStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
      Alert.alert('Adicionado ao carrinho', `${item.nome} foi adicionado!`);
    } catch (e) {
      console.error('Erro ao adicionar ao carrinho:', e);
    }
  }

  function gerarSA(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres[indice];
    }
    return resultado;
  }

  async function salvarTransacao(item, tipo) {
    const novaTransacao = {
      nome: item.nome,
      preco: item.preco,
      tipo: tipo,
      data: new Date().toLocaleString(),
    };
    try {
      const raw = await AsyncStorage.getItem('transacoes');
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(novaTransacao);
      await AsyncStorage.setItem('transacoes', JSON.stringify(arr));
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  }

  function ComprandoTicket(item) {
    if (tickets > 0) {
      setTickets(prev => prev - 1);
      salvarTransacao(item, 'ticket');
      Alert.alert('Compra realizada com ticket!', 'Código de autorização: ' + gerarSA(15));
      atualizarTicketsNoSupabase(-1);
    } else {
      Alert.alert('Erro', 'Você não tem tickets suficientes.');
    }
  }

  async function atualizarTicketsNoSupabase(delta) {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;
      const { data, error } = await supabase
        .from('usuarios')
        .select('tickets')
        .eq('id', Number(userId))
        .single();
      if (error) return console.log('Erro ao ler tickets:', error);
      const novo = Number((data?.tickets ?? 0)) + delta;
      await supabase.from('usuarios').update({ tickets: novo }).eq('id', Number(userId));
      setTickets(novo);
    } catch (e) {
      console.log('Erro ao atualizar tickets no supabase:', e);
    }
  }

  useEffect(() => {
    async function carregarDados() {
      await carregarDadosUsuario();
      await carregarCardapio();

      try {
        const ticketsSalvos = await AsyncStorage.getItem('tickets');
        if (ticketsSalvos !== null) {
          setTickets(prev => prev || parseInt(ticketsSalvos));
        }
      } catch (e) {
        console.log('Erro ao carregar tickets cache:', e);
      }
    }

    carregarDados();

    const interval = setInterval(() => {
      setTickets(prev => {
        const novo = prev + 1;
        AsyncStorage.setItem('tickets', novo.toString());
        return novo;
      });
      Alert.alert('Novo Ticket', 'Um novo ticket foi adicionado!');
    }, 86400000);

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDadosUsuario();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tickets', tickets.toString());
  }, [tickets]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagem && <Image source={{ uri: item.imagem }} style={styles.cardImage} />}
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardDescription}>{item.descricao?.slice(0, 100) ?? ''}…</Text>
      <Text style={styles.cardPrice}>R$ {item.preco}</Text>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => adicionarAoCarrinho(item)}
      >
        <Text style={styles.cardButtonText}>Adicionar ao Carrinho</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <TouchableOpacity
          style={styles.transacoesButton}
          onPress={() => navigation.navigate('Transações')}
        >
          <AntDesign name="profile" size={20} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.transacoesButtonText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transacoesButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <AntDesign name="shopping" size={20} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.transacoesButtonText}>Carrinho</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Saldo: R$ {Number(saldo).toFixed(2)}</Text>
      <Text style={[styles.title, { color: colors.text }]}>Tickets: {tickets}</Text>

      <TextInput
        style={[
          styles.input,
          { color: theme === 'dark' ? '#000' : colors.text, backgroundColor: '#ffffff' }
        ]}
        placeholder="Adicionar saldo"
        placeholderTextColor={theme === 'dark' ? '#666' : '#ccc'}
        keyboardType="numeric"
        value={quantia}
        onChangeText={setQuantia}
      />
      <Button title="Adicionar Saldo" onPress={irParaPagamento} />

      <Text style={[styles.subtitle, { color: colors.text }]}>Cardápio</Text>

      {cardapio.length === 0 ? (
        <Text style={{ color: colors.text }}>Carregando cardápio...</Text>
      ) : (
        <FlatList
          data={cardapio}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.cardapioContainer}
        />
      )}

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#A4BB49',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
  },
  cardapioContainer: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDescription: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  cardButton: { backgroundColor: '#A4BB49', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cardButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  transacoesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A4BB49',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  transacoesButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

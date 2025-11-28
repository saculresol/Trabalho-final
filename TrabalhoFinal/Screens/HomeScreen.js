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

  // =============================
  // 📌 CARREGA USUÁRIO (SALDO + TICKETS)
  // =============================
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
        console.log('Erro ao buscar usuário:', error);
        return;
      }

      setSaldo(Number(data.saldo ?? 0));
      setTickets(Number(data.tickets ?? 0));

    } catch (e) {
      console.log('Erro carregarDadosUsuario:', e);
    }
  }

  // =============================
  // 📌 CARREGA CARDÁPIO
  // =============================
  async function carregarCardapio() {
    try {
      const dadosCardapio = await fetchMeals();

      if (Array.isArray(dadosCardapio)) {
        // Filtra itens que NÃO são ticket
        const somenteComidas = dadosCardapio.filter(
          item => (item.tipo?.toLowerCase() || '') !== 'ticket'
        );
        setCardapio(somenteComidas);
      }
    } catch (e) {
      console.error('Erro carregar cardápio:', e);
    }
  }

  // =============================
  // 📌 IR PARA PAGAMENTO
  // =============================
  async function irParaPagamento() {
    const valor = parseFloat(quantia);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) return Alert.alert('Erro', 'Usuário não identificado.');

    navigation.navigate('Pagamento', {
      amount: valor,
      userId: Number(userId),
    });

    setQuantia('');
  }

  // =============================
  // 📌 ADICIONAR AO CARRINHO
  // =============================
  async function adicionarAoCarrinho(item) {
    try {
      const raw = await AsyncStorage.getItem('carrinho');
      const carrinhoAtual = raw ? JSON.parse(raw) : [];
      carrinhoAtual.push(item);
      await AsyncStorage.setItem('carrinho', JSON.stringify(carrinhoAtual));
      Alert.alert('Adicionado ao carrinho', `${item.nome} foi adicionado!`);
    } catch (e) {
      console.error('Erro adicionar ao carrinho:', e);
    }
  }

  // =============================
  // 📌 SALVAR TRANSAÇÃO
  // =============================
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
      console.error('Erro salvar transação:', error);
    }
  }

  // =============================
  // 📌 USAR TICKET PARA COMPRAR
  // =============================
  async function ComprandoTicket(item) {
    if (tickets <= 0) {
      return Alert.alert('Erro', 'Você não tem tickets suficientes.');
    }

    await salvarTransacao(item, 'ticket');
    Alert.alert('Compra realizada com ticket!', 'Código: ' + gerarSA(15));

    await atualizarTicketsNoSupabase(-1);
  }

  // =============================
  // 📌 ATUALIZA TICKET NO SUPABASE
  // =============================
  async function atualizarTicketsNoSupabase(delta) {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const { data, error } = await supabase
        .from('usuarios')
        .select('tickets')
        .eq('id', Number(userId))
        .single();

      if (error || !data) {
        console.log('Erro ao ler tickets:', error);
        return;
      }

      const novoTotal = Number(data.tickets) + delta;
      if (novoTotal < 0) {
        return Alert.alert('Erro', 'Tickets insuficientes!');
      }

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ tickets: novoTotal })
        .eq('id', Number(userId));

      if (updateError) {
        console.log('Erro ao atualizar tickets:', updateError);
        return;
      }

      setTickets(novoTotal);

    } catch (e) {
      console.log('Erro atualizarTicketsNoSupabase:', e);
    }
  }

  // =============================
  // 📌 GERAR CÓDIGO
  // =============================
  function gerarSA(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < tamanho; i++) {
      resultado += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return resultado;
  }

  // =============================
  // 📌 USE EFFECT – CARREGA DADOS
  // =============================
  useEffect(() => {
    carregarDadosUsuario();
    carregarCardapio();

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDadosUsuario();
    });

    return unsubscribe;
  }, []);

  // =============================
  // 📌 RENDER DO CARDÁPIO
  // =============================
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

  // =============================
  // 📌 UI
  // =============================
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Botões topo */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <TouchableOpacity
          style={styles.transacoesButton}
          onPress={() => navigation.navigate('Transações')}
        >
          <AntDesign name="profile" size={20} color="#fff" />
          <Text style={styles.transacoesButtonText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.transacoesButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <AntDesign name="shopping" size={20} color="#fff" />
          <Text style={styles.transacoesButtonText}>Carrinho</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Saldo: R$ {saldo.toFixed(2)}</Text>
      <Text style={[styles.title, { color: colors.text }]}>Tickets: {tickets}</Text>

      <TextInput
        style={[
          styles.input,
          { color: theme === 'dark' ? '#000' : colors.text, backgroundColor: '#ffffff' }
        ]}
        placeholder="Adicionar saldo"
        placeholderTextColor="#666"
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

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

// =============================
// 📌 ESTILOS
// =============================
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
  },
  cardapioContainer: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
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
  },
  transacoesButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
});

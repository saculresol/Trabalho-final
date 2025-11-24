import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fetchMeals } from '../Services/mealService';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';

export default function HomeScreen() {
const navigation = useNavigation();
const [saldo, setSaldo] = useState(0);
const [quantia, setQuantia] = useState('');
const [tickets, setTickets] = useState(1);
const [cardapio, setCardapio] = useState([]);
const { colors, theme } = useTheme();

async function salvarSaldoUsuario(novoSaldo) {
const usuarioId = "usuario_comum";
try {
const raw = await AsyncStorage.getItem("saldosUsuarios");
const lista = raw ? JSON.parse(raw) : [];
const index = lista.findIndex(u => u.id === usuarioId);

  if (index >= 0) {
    lista[index].saldo = novoSaldo;
  } else {
    lista.push({ id: usuarioId, saldo: novoSaldo });
  }

  await AsyncStorage.setItem("saldosUsuarios", JSON.stringify(lista));
} catch (e) {
  console.log("Erro ao salvar saldo do usuário:", e);
}

}

const adicionarSaldo = () => {
const valor = parseFloat(quantia);
if (isNaN(valor) || valor <= 0) {
Alert.alert('Erro', 'Por favor, insira um valor válido.');
return;
}
const novoSaldo = saldo + valor;
setSaldo(novoSaldo);
salvarSaldoUsuario(novoSaldo);
setQuantia('');
};

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
setTickets(tickets - 1);
salvarTransacao(item, 'ticket');
Alert.alert('Compra realizada com ticket!', 'Código de autorização: ' + gerarSA(15));
} else {
Alert.alert('Erro', 'Você não tem tickets suficientes.');
}
}

function ComprandoSaldo(item) {
if (saldo >= item.preco) {
const novoSaldo = saldo - item.preco;
setSaldo(novoSaldo);
salvarSaldoUsuario(novoSaldo);
salvarTransacao(item, 'saldo');
Alert.alert('Compra realizada com saldo!');
} else {
Alert.alert('Erro', 'Saldo insuficiente.');
}
}

useEffect(() => {
async function carregarDados() {
const usuarioId = "usuario_comum";

  try {
    const rawLista = await AsyncStorage.getItem("saldosUsuarios");
    if (rawLista) {
      const lista = JSON.parse(rawLista);
      const usuario = lista.find(u => u.id === usuarioId);
      if (usuario) setSaldo(usuario.saldo);
    }

    const ticketsSalvos = await AsyncStorage.getItem('tickets');
    if (ticketsSalvos !== null) setTickets(parseInt(ticketsSalvos));
  } catch (e) {
    console.log("Erro ao carregar dados:", e);
  }

  try {
    const dadosCardapio = await fetchMeals();
    if (Array.isArray(dadosCardapio)) {
      setCardapio(dadosCardapio);
    } else {
      console.warn("fetchMeals não retornou array:", dadosCardapio);
    }
  } catch (e) {
    console.error("Erro ao carregar cardápio:", e);
  }
}

carregarDados();

const interval = setInterval(() => {
  setTickets(prev => prev + 1);
  Alert.alert('Novo Ticket', 'Um novo ticket foi adicionado!');
}, 86400000);

return () => clearInterval(interval);

}, []);

useEffect(() => {
AsyncStorage.setItem('tickets', tickets.toString());
}, [tickets]);

const renderItem = ({ item }) => ( <View style={styles.card}>
{item.imagem && <Image source={{ uri: item.imagem }} style={styles.cardImage} />} <Text style={styles.cardTitle}>{item.nome}</Text> <Text style={styles.cardDescription}>{item.descricao?.slice(0, 100) ?? ''}…</Text> <Text style={styles.cardPrice}>R$ {item.preco}</Text>

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
<AntDesign name="profile" size={20} color="#fff" style={{ marginRight: 5 }} /> <Text style={styles.transacoesButtonText}>Histórico</Text> </TouchableOpacity>

    <TouchableOpacity
      style={styles.transacoesButton}
      onPress={() => navigation.navigate('Carrinho')}
    >
      <AntDesign name="shoppingcart" size={20} color="#fff" style={{ marginRight: 5 }} />
      <Text style={styles.transacoesButtonText}>Carrinho</Text>
    </TouchableOpacity>
  </View>

  <Text style={[styles.title, { color: colors.text }]}>Saldo: R$ {saldo.toFixed(2)}</Text>
  <Text style={[styles.title, { color: colors.text }]}>Tickets: {tickets}</Text>

  <TextInput
    style={[styles.input, { color: colors.text }]}
    placeholder="Adicionar saldo"
    placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
    keyboardType="numeric"
    value={quantia}
    onChangeText={setQuantia}
  />
  <Button title="Adicionar Saldo" onPress={adicionarSaldo} />

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

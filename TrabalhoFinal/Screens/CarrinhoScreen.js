import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';

export default function CarrinhoScreen({ navigation }) {
  const [carrinho, setCarrinho] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [tickets, setTickets] = useState(0);
  const { colors } = useTheme();

  useEffect(() => {
    carregarCarrinho();
    carregarSaldoETickets();
  }, []);

  async function carregarCarrinho() {
    try {
      const raw = await AsyncStorage.getItem('carrinho');
      const itens = raw ? JSON.parse(raw) : [];
      setCarrinho(itens);
    } catch (e) {
      console.error('Erro ao carregar carrinho:', e);
    }
  }

  async function carregarSaldoETickets() {
    try {
      // Carregar saldo
      const rawSaldos = await AsyncStorage.getItem('saldosUsuarios');
      const lista = rawSaldos ? JSON.parse(rawSaldos) : [];
      const usuario = lista.find(u => u.id === 'usuario_comum');
      if (usuario) setSaldo(Number(usuario.saldo));

      // Carregar tickets
      const rawTickets = await AsyncStorage.getItem('tickets');
      if (rawTickets !== null) setTickets(Number(rawTickets));
    } catch (e) {
      console.error('Erro ao carregar saldo/tickets:', e);
    }
  }

  async function removerDoCarrinho(index) {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    await AsyncStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  }

  // =========================================
  // SALVAR TRANSACAO NO HISTÓRICO
  // =========================================
  async function salvarTransacao(tipo, total) {
    try {
      const novaTransacao = {
        id: Date.now(),
        nome: carrinho.map(item => item.nome).join(", "),
        preco: total,
        tipo: tipo, // 'ticket' ou 'saldo'
        data: new Date().toLocaleString(),
      };

      const raw = await AsyncStorage.getItem("transacoes");
      const lista = raw ? JSON.parse(raw) : [];

      lista.unshift(novaTransacao);

      await AsyncStorage.setItem("transacoes", JSON.stringify(lista));
    } catch (e) {
      console.error("Erro ao salvar transação:", e);
    }
  }

  // =========================================
  // FUNÇÃO DE COMPRA
  // =========================================
  async function comprarCarrinho() {
    if (!carrinho || carrinho.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens antes de comprar.");
      return;
    }

    const total = carrinho.reduce((acc, item) => acc + Number(item.preco || 0), 0);

    Alert.alert(
      "Escolha o método de pagamento",
      `Total: R$ ${total.toFixed(2)}`,
      [
        // PAGAR COM TICKET
        {
          text: "Ticket",
          onPress: async () => {
            const ticketsAtual = Number(tickets || 0);

            if (ticketsAtual >= 1) {
              const novoTickets = ticketsAtual - 1;
              setTickets(novoTickets);
              await AsyncStorage.setItem("tickets", novoTickets.toString());

              await salvarTransacao("ticket", total);

              Alert.alert("Compra realizada!", "Itens comprados usando 1 ticket.");
              limparCarrinho();
            } else {
              Alert.alert("Erro", "Você não possui tickets suficientes.");
            }
          }
        },

        // PAGAR COM SALDO
        {
          text: "Saldo",
          onPress: async () => {
            const saldoAtual = Number(saldo || 0);

            if (saldoAtual >= total) {
              const novoSaldo = saldoAtual - total;
              setSaldo(novoSaldo);

              let lista;
              try {
                const raw = await AsyncStorage.getItem("saldosUsuarios");
                lista = raw ? JSON.parse(raw) : [];
              } catch {
                lista = [];
              }

              const index = lista.findIndex(u => u.id === "usuario_comum");

              if (index >= 0) {
                lista[index].saldo = novoSaldo;
              } else {
                lista.push({ id: "usuario_comum", saldo: novoSaldo });
              }

              await AsyncStorage.setItem("saldosUsuarios", JSON.stringify(lista));

              await salvarTransacao("saldo", total);

              Alert.alert(
                "Compra realizada!",
                `Itens comprados usando saldo.\nSaldo restante: R$ ${novoSaldo.toFixed(2)}`
              );

              limparCarrinho();
            } else {
              Alert.alert("Erro", "Saldo insuficiente.");
            }
          }
        },

        { text: "Cancelar", style: "cancel" }
      ]
    );
  }

  async function limparCarrinho() {
    setCarrinho([]);
    await AsyncStorage.removeItem('carrinho');
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.itemText, { color: colors.text }]}>{item.nome}</Text>
      <Text style={[styles.itemText, { color: colors.text }]}>R$ {item.preco}</Text>

      <TouchableOpacity
        style={styles.removerButton}
        onPress={() => removerDoCarrinho(index)}
      >
        <Text style={{ color: '#fff' }}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
      </TouchableOpacity>

      {carrinho.length === 0 ? (
        <Text style={{ color: colors.text, marginTop: 20 }}>Carrinho vazio</Text>
      ) : (
        <>
          <FlatList
            data={carrinho}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity style={styles.comprarButton} onPress={comprarCarrinho}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Comprar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  goBackButton: {
    backgroundColor: '#A4BB49',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: { fontSize: 16 },
  removerButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  comprarButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

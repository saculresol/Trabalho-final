import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';
import { supabase } from "../Services/supabaseService";

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  const s = String(value).trim().replace(/\s/g, '').replace(',', '.');
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

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
      setCarrinho([]);
    }
  }

  async function carregarSaldoETickets() {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return;

      const { data, error } = await supabase
        .from('usuarios')
        .select('saldo, tickets')
        .eq('id', Number(userId))
        .single();

      if (!error && data) {
        setSaldo(parseNumber(data.saldo));
        setTickets(parseNumber(data.tickets));
      }
    } catch (e) {
      console.error('Erro ao carregar saldo e tickets:', e);
    }
  }

  async function removerDoCarrinho(index) {
    const novo = [...carrinho];
    novo.splice(index, 1);
    setCarrinho(novo);
    await AsyncStorage.setItem('carrinho', JSON.stringify(novo));
  }

  async function salvarTransacao(tipo, total) {
    const novaTransacao = {
      id: Date.now(),
      nome: carrinho.map(i => i.nome).join(", "),
      preco: total,
      tipo,
      data: new Date().toLocaleString()
    };

    const raw = await AsyncStorage.getItem("transacoes");
    const lista = raw ? JSON.parse(raw) : [];
    lista.unshift(novaTransacao);
    await AsyncStorage.setItem("transacoes", JSON.stringify(lista));
  }

  async function atualizarTicketsNoSupabase(delta) {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) return false;

      const { data, error } = await supabase
        .from('usuarios')
        .select('tickets')
        .eq('id', Number(userId))
        .single();

      if (error || !data) return false;

      const novoTotal = parseNumber(data.tickets) + delta;
      if (novoTotal < 0) return false;

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ tickets: novoTotal })
        .eq('id', Number(userId));

      if (updateError) return false;

      setTickets(novoTotal);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function atualizarSaldoNoSupabase(userId, novoSaldo) {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ saldo: novoSaldo })
        .eq("id", Number(userId));

      if (error) return false;
      setSaldo(novoSaldo);
      return true;
    } catch {
      return false;
    }
  }

  async function comprarCarrinho() {
    if (!carrinho.length) {
      Alert.alert("Carrinho vazio", "Adicione itens antes de comprar.");
      return;
    }

    const total = carrinho.reduce((acc, item) => acc + parseNumber(item.preco), 0);
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) return;

    const { data, error } = await supabase
      .from('usuarios')
      .select('saldo, tickets')
      .eq('id', Number(userId))
      .single();

    if (error || !data) {
      Alert.alert("Erro", "Não foi possível carregar saldo ou tickets.");
      return;
    }

    const ticketsAtual = parseNumber(data.tickets);
    const saldoAtual = parseNumber(data.saldo);

    Alert.alert(
      "Escolha o método de pagamento",
      `Total: R$ ${total.toFixed(2)}`,
      [
        {
          text: "Ticket",
          onPress: async () => {
            if (ticketsAtual >= 1) {
              const sucesso = await atualizarTicketsNoSupabase(-1);
              if (!sucesso) {
                Alert.alert("Erro", "Não foi possível usar o ticket.");
                return;
              }
              await salvarTransacao("ticket", total);
              Alert.alert("Compra realizada!", "Itens comprados usando ticket.");
              limparCarrinho();
            } else {
              Alert.alert("Erro", "Você não possui tickets suficientes.");
            }
          }
        },
        {
          text: "Saldo",
          onPress: async () => {
            if (saldoAtual >= total) {
              const novoSaldo = +(saldoAtual - total).toFixed(2);
              const sucesso = await atualizarSaldoNoSupabase(userId, novoSaldo);
              if (!sucesso) {
                Alert.alert("Erro", "Não foi possível atualizar o saldo.");
                return;
              }
              await salvarTransacao("saldo", total);
              Alert.alert("Compra realizada!", `Saldo restante: R$ ${novoSaldo.toFixed(2)}`);
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
      <Text style={[styles.itemText, { color: colors.text }]}>R$ {parseNumber(item.preco).toFixed(2)}</Text>

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

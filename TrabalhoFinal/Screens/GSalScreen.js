import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../Services/supabaseService';

export default function GSalScreen() {
  const [users, setUsers] = useState([]);
  const [valorTickets, setValorTickets] = useState('');
  const [valorSaldo, setValorSaldo] = useState('');

  async function carregarCache() {
    try {
      const cache = await AsyncStorage.getItem('usuarios_cache');
      if (cache) {
        const data = JSON.parse(cache);
        console.log('[cache] carregado', data.length);
        setUsers(data);
      } else {
        console.log('[cache] vazio');
      }
    } catch (err) {
      console.log('[cache] erro ao carregar', err.message);
    }
  }

  async function salvarCache(lista) {
    try {
      await AsyncStorage.setItem('usuarios_cache', JSON.stringify(lista));
      console.log('[cache] salvo com sucesso');
    } catch (err) {
      console.log('[cache] erro ao salvar', err.message);
    }
  }

  async function carregarSupabase() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, tickets, saldo');

      if (error) {
        console.log('[carregarSupabase] erro:', error.message);
        return;
      }

      console.log('[supabase] carregado', data.length);
      setUsers(data);
      salvarCache(data);
    } catch (err) {
      console.log('[carregarSupabase] erro inesperado', err);
    }
  }

  async function atualizarSupabase(id, novoTickets, novoSaldo) {
    console.log('[supabase] iniciando update', id);

    const { error } = await supabase
      .from('usuarios')
      .update({
        tickets: novoTickets,
        saldo: novoSaldo,
      })
      .eq('id', id);

    if (error) {
      console.log('[supabase] erro ao atualizar:', error.message);
      return false;
    }

    console.log('[supabase] atualizado com sucesso');
    return true;
  }

  async function adicionarTickets(userId) {
    if (!valorTickets.trim()) {
      Alert.alert('Erro', 'Digite um valor para os tickets!');
      return;
    }

    const v = parseInt(valorTickets);

    const listaAtualizada = users.map(u => {
      if (u.id === userId) {
        return { ...u, tickets: u.tickets + v };
      }
      return u;
    });

    setUsers(listaAtualizada);
    salvarCache(listaAtualizada);

    const u = listaAtualizada.find(u => u.id === userId);
    await atualizarSupabase(userId, u.tickets, u.saldo);
  }

  async function removerTickets(userId) {
    if (!valorTickets.trim()) {
      Alert.alert('Erro', 'Digite um valor para os tickets!');
      return;
    }

    const v = parseInt(valorTickets);

    const listaAtualizada = users.map(u => {
      if (u.id === userId) {
        return { ...u, tickets: u.tickets - v };
      }
      return u;
    });

    setUsers(listaAtualizada);
    salvarCache(listaAtualizada);

    const u = listaAtualizada.find(u => u.id === userId);
    await atualizarSupabase(userId, u.tickets, u.saldo);
  }

  async function adicionarSaldo(userId) {
    if (!valorSaldo.trim()) {
      Alert.alert('Erro', 'Digite um valor para o saldo!');
      return;
    }

    const v = parseInt(valorSaldo);

    const listaAtualizada = users.map(u => {
      if (u.id === userId) {
        return { ...u, saldo: (u.saldo || 0) + v };
      }
      return u;
    });

    setUsers(listaAtualizada);
    salvarCache(listaAtualizada);

    const u = listaAtualizada.find(u => u.id === userId);
    await atualizarSupabase(userId, u.tickets, u.saldo);
  }

  async function removerSaldo(userId) {
    if (!valorSaldo.trim()) {
      Alert.alert('Erro', 'Digite um valor para o saldo!');
      return;
    }

    const v = parseInt(valorSaldo);

    const listaAtualizada = users.map(u => {
      if (u.id === userId) {
        return { ...u, saldo: (u.saldo || 0) - v };
      }
      return u;
    });

    setUsers(listaAtualizada);
    salvarCache(listaAtualizada);

    const u = listaAtualizada.find(u => u.id === userId);
    await atualizarSupabase(userId, u.tickets, u.saldo);
  }

  useEffect(() => {
    carregarCache();
    setTimeout(() => carregarSupabase(), 500);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerenciar Saldo</Text>

      <Text style={styles.label}>Alterar Tickets</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor para tickets"
        keyboardType="numeric"
        value={valorTickets}
        onChangeText={setValorTickets}
      />

      <Text style={styles.label}>Alterar Saldo</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor para saldo"
        keyboardType="numeric"
        value={valorSaldo}
        onChangeText={setValorSaldo}
      />

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.tickets}>Tickets: {item.tickets}</Text>
            <Text style={styles.tickets}>Saldo: R$ {item.saldo ?? 0}</Text>

            <View style={styles.botoes}>
              <TouchableOpacity style={styles.btnAdd} onPress={() => adicionarTickets(item.id)}>
                <Text style={styles.btnTxt}>+ Tickets</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnRem} onPress={() => removerTickets(item.id)}>
                <Text style={styles.btnTxt}>- Tickets</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.botoes}>
              <TouchableOpacity style={styles.btnAdd} onPress={() => adicionarSaldo(item.id)}>
                <Text style={styles.btnTxt}>+ Saldo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnRem} onPress={() => removerSaldo(item.id)}>
                <Text style={styles.btnTxt}>- Saldo</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8
  },
  userCard: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 10
  },
  nome: { fontSize: 18, fontWeight: 'bold' },
  tickets: { fontSize: 16, marginTop: 5 },
  botoes: { flexDirection: 'row', marginTop: 10, gap: 10 },
  btnAdd: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8
  },
  btnRem: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8
  },
  btnTxt: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

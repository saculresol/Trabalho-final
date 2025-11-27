import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from "../Context/ThemeContext";
import { fetchMeals } from '../Services/mealService';
import { supabase } from '../Services/supabase';

export default function AdminScreen() {
  const { theme, colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [canteenMenu, setCanteenMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('tipo', 'comum');
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error.message);
    }
  };

  const fetchCanteenMenu = async () => {
    try {
      const meals = await fetchMeals();
      setCanteenMenu(meals);
    } catch (error) {
      console.error('Erro ao buscar cardápio da cantina:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUsers();
      await fetchCanteenMenu();
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderUser = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>Nome: {item.nome}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.text }]}>Email: {item.email}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.text }]}>Turma: {item.turma || 'N/A'}</Text>
    </View>
  );

  const renderMenuItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{item.nome}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.text }]}>{item.descricao}</Text>
      <Text style={[styles.cardPrice, { color: colors.primary }]}>R$ {item.preco.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Painel do Administrador</Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Usuários Comuns</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={[styles.emptyMessage, { color: colors.textSecundary }]}>Nenhum usuário encontrado.</Text>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Cardápio da Cantina</Text>
      {canteenMenu.length > 0 ? (
        <FlatList
          data={canteenMenu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMenuItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={[styles.emptyMessage, { color: colors.textSecundary }]}>Nenhum item no cardápio.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'inherit',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
    color: 'inherit',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
});
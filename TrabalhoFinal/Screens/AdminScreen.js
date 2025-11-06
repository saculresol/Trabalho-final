import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import { useContext } from 'react';

export default function AdminScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>
      <Text>Gerencie usuários, tickets e transações aqui.</Text>
    </View>
  );
}
const { theme, toggleTheme } = useContext(ThemeContext);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

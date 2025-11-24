import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../Context/ThemeContext";

export default function AdminScreen() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#000' : '#fff' }
      ]}
    >
      <Text 
        style={[
          styles.title,
          { color: isDark ? '#fff' : '#000' }
        ]}
      >
        Painel do Administrador
      </Text>

      <Text style={{ color: isDark ? '#ccc' : '#333' }}>
        Gerencie usuários, tickets e transações aqui.
      </Text>
    </View>
  );
}

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
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GCScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador do cardápio</Text>
      <Text>Gerencie o cardápio.</Text>
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
  },
});

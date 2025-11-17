import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GCScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador da cantina</Text>
      <Text>Gerencie a cantina aqui.</Text>
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

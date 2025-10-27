import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function ConfigScreen({ navigation }) {
  const irParaTransacoes = () => {
    navigation.navigate('Transacoes'); 
  };

  return (
    <View style={styles.container}>
      <Text>Configurações:</Text>

      <Button title="Ir para Transações" onPress={irParaTransacoes} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

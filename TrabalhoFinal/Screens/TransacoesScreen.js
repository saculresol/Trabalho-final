import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function ConfigScreen({ navigation }) {  
  const irParaConfig = () => {
    navigation.navigate('Configurações');
  };

  return (
    <View style={styles.container}>
      <Text>Transações:</Text>
      
      <Button title="Voltar" onPress={irParaConfig} />

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

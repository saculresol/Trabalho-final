import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ConfigScreen({ navigation }) {
  const [tema, setTema] = useState('light'); // tema inicial

  const irParaTransacoes = () => {
    navigation.navigate('Transacoes');
  };

  const alternarTema = () => {
    setTema((prevTema) => (prevTema === 'light' ? 'dark' : 'light'));
  };

  const estilosAtuais =
    tema === 'light'
      ? { backgroundColor: '#fff', color: '#000' }
      : { backgroundColor: '#000', color: '#fff' };

  return (
    <View style={[styles.container, { backgroundColor: estilosAtuais.backgroundColor }]}>
      <Text style={{ color: estilosAtuais.color }}>Configurações:</Text>

      <Button title="Ir para Transações" onPress={irParaTransacoes} />

      <TouchableOpacity style={styles.botaoTema} onPress={alternarTema}>
        <Text style={{ color: estilosAtuais.color }}>
          Mudar para tema {tema === 'light' ? 'escuro' : 'claro'}
        </Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTema: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});

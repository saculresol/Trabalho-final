import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ConfigScreen({ navigation }) {
  const [tema, setTema] = useState('light'); 

  const irParaTransacoes = () => {
    navigation.navigate('Transacoes');
  };

  const alternarTema = () => {
    setTema((prevTema) => (prevTema === 'light' ? 'dark' : 'light'));
  };

  const estilosAtuais =
    tema === 'light'
      ? { backgroundColor: '#F8F9FA', color: '#2D3142', botaoBg: '#E5E7EB', botaoTexto: '#1F2937' }
      : { backgroundColor: '#1F2937', color: '#F9FAFB', botaoBg: '#374151', botaoTexto: '#F9FAFB' };

  return (
    <View style={[styles.container, { backgroundColor: estilosAtuais.backgroundColor }]}>
      <Text style={[styles.title, { color: estilosAtuais.color }]}>Configurações</Text>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: estilosAtuais.botaoBg }]}
        onPress={irParaTransacoes}
      >
        <Text style={[styles.botaoTexto, { color: estilosAtuais.botaoTexto }]}>
          Ir para Transações
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoTema, { borderColor: estilosAtuais.color }]}
        onPress={alternarTema}
      >
        <Text style={[styles.botaoTemaTexto, { color: estilosAtuais.color }]}>
          Mudar para tema {tema === 'light' ? 'escuro' : 'claro'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: tema === 'light' ? '#9CA3AF' : '#D1D5DB' }]}>
        Versão 1.0.0
      </Text>

      <StatusBar style={tema === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  botao: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
  botaoTema: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  botaoTemaTexto: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    fontSize: 14,
    marginTop: 40,
    textAlign: 'center',
  },
});

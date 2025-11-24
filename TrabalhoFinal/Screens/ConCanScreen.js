import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';

export default function ConCanScreen() {
const { theme, toggleTheme } = useTheme();

const alternarTema = async () => {
toggleTheme(); // alterna tema global
const novoTema = theme === 'light' ? 'dark' : 'light';
await AsyncStorage.setItem('tema', novoTema);
Alert.alert('Sucesso', `Tema alterado para ${novoTema === 'light' ? 'claro' : 'escuro'}!`);
};

const estilosAtuais =
theme === 'light'
? {
backgroundColor: '#F8F9FA',
color: '#2D3142',
botaoBg: '#E5E7EB',
botaoTexto: '#1F2937',
borda: '#D1D5DB',
}
: {
backgroundColor: '#1F2937',
color: '#F9FAFB',
botaoBg: '#374151',
botaoTexto: '#F9FAFB',
borda: '#4B5563',
};

return (
<View style={[styles.container, { backgroundColor: estilosAtuais.backgroundColor }]}>
<Text style={[styles.titulo, { color: estilosAtuais.color }]}>Configurações da Cantina</Text>

  <TouchableOpacity
    style={[styles.botao, { backgroundColor: estilosAtuais.botaoBg, borderColor: estilosAtuais.borda }]}
    onPress={alternarTema}
  >
    <Text style={[styles.botaoTexto, { color: estilosAtuais.botaoTexto }]}>
      Alternar Tema ({theme === 'light' ? 'escuro' : 'claro'})
    </Text>
  </TouchableOpacity>
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
justifyContent: 'center',
alignItems: 'center',
},
titulo: {
fontSize: 22,
fontWeight: '600',
marginBottom: 30,
},
botao: {
width: '80%',
paddingVertical: 14,
borderRadius: 12,
alignItems: 'center',
borderWidth: 1,
},
botaoTexto: {
fontSize: 16,
fontWeight: '600',
},
});

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../Context/ThemeContext';

export default function ConfigScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [tema, setTema] = useState('light');
  const { toggleTheme } = useTheme()
  const salvarDados = async () => {
    if (!nome || !turma) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await AsyncStorage.setItem('nome', nome);
      await AsyncStorage.setItem('turma', turma);
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const selecionarImagem = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permissão necessária', 'Você precisa permitir o acesso à galeria para alterar a imagem.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await AsyncStorage.setItem('imagem', result.assets[0].uri);
        Alert.alert('Sucesso', 'Imagem alterada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao selecionar a imagem:', error);
    }
  };

  const alternarTema = async () => {
    const novoTema = tema === 'light' ? 'dark' : 'light';
    setTema(novoTema);
    toggleTheme();
    await AsyncStorage.setItem('tema', novoTema);
    Alert.alert('Sucesso', `Tema alterado para ${novoTema === 'light' ? 'claro' : 'escuro'}!`);
  };

  const estilosAtuais =
    tema === 'light'
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
      <Text style={[styles.label, { color: estilosAtuais.color }]}>Nome:</Text>
      <TextInput
        style={[styles.input, { color: estilosAtuais.color, borderColor: estilosAtuais.borda }]}
        placeholder="Digite seu nome"
        placeholderTextColor={tema === 'light' ? '#9CA3AF' : '#6B7280'}
        value={nome}
        onChangeText={setNome}
      />

      <Text style={[styles.label, { color: estilosAtuais.color }]}>Turma:</Text>
      <TextInput
        style={[styles.input, { color: estilosAtuais.color, borderColor: estilosAtuais.borda }]}
        placeholder="Digite sua turma"
        placeholderTextColor={tema === 'light' ? '#9CA3AF' : '#6B7280'}
        value={turma}
        onChangeText={setTurma}
      />

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: estilosAtuais.botaoBg, borderColor: estilosAtuais.borda }]}
        onPress={salvarDados}
        activeOpacity={0.8}
      >
        <Text style={[styles.botaoTexto, { color: estilosAtuais.botaoTexto }]}>Salvar Dados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: estilosAtuais.botaoBg, borderColor: estilosAtuais.borda }]}
        onPress={selecionarImagem}
        activeOpacity={0.8}
      >
        <Text style={[styles.botaoTexto, { color: estilosAtuais.botaoTexto }]}>Alterar Imagem</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: estilosAtuais.botaoBg, borderColor: estilosAtuais.borda }]}
        onPress={alternarTema}
        activeOpacity={0.8}
      >
        <Text style={[styles.botaoTexto, { color: estilosAtuais.botaoTexto }]}>
          Mudar para tema {tema === 'light' ? 'escuro' : 'claro'}
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
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  botao: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
});
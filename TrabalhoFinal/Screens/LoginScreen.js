import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { loginUsuario } from '../Services/userService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !senha) {
      setError('Preencha todos os campos.');
      return;
    }

    if (senha.trim().length === 0) {
      setError('A senha não pode conter apenas espaços em branco.');
      return;
    }

    try {
      const usuario = await loginUsuario(email, senha);

      Alert.alert('Bem-vindo', usuario.nome);

      if (usuario.tipo === 'admin') {
        navigation.navigate('Admin');
      } else {
        navigation.navigate('AppDrawer', {
          screen: 'HomeTabs',
          params: { screen: 'Home' },
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} color="#1E90FF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F2F4F7', // fundo leve e moderno
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
});

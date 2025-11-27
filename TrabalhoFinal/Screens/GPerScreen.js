import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, Alert, StyleSheet } from 'react-native';
import { supabase } from '../Services/supabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../Context/ThemeContext';

export default function GerenciarUsuariosScreen() {
  const { colors, theme } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [saldo, setSaldo] = useState('');

  async function carregarUsuarios() {
    const { data, error } = await supabase.from('usuarios').select('*').eq('tipo', 'comum');
    if (!error) setUsuarios(data);
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  function abrirModal(u) {
    setUsuarioEditando(u);
    setNome(u.nome);
    setTurma(u.turma ?? '');
    setSaldo(String(u.saldo ?? 0));
    setModalVisible(true);
  }

  async function salvarAlteracoes() {
    if (!usuarioEditando) return;

    const { error } = await supabase
      .from('usuarios')
      .update({
        nome,
        turma,
        saldo: Number(saldo),
        ativo: usuarioEditando.ativo,
      })
      .eq('id', usuarioEditando.id);

    if (error) {
      Alert.alert('Erro ao salvar alterações');
      return;
    }

    const userIdCache = await AsyncStorage.getItem('user_id');
    if (userIdCache && Number(userIdCache) === usuarioEditando.id) {
      await AsyncStorage.multiSet([
        ['nome', nome],
        ['turma', turma],
      ]);
    }

    setModalVisible(false);
    carregarUsuarios();
  }

  async function alternarAtivo() {
    const novoStatus = !usuarioEditando.ativo;
    setUsuarioEditando({ ...usuarioEditando, ativo: novoStatus });

    const { error } = await supabase
      .from('usuarios')
      .update({ ativo: novoStatus })
      .eq('id', usuarioEditando.id);

    if (error) {
      Alert.alert('Erro ao mudar status');
      return;
    }

    carregarUsuarios();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Gerenciar Usuários</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: "black",
                borderWidth: 1
              }
            ]}
            onPress={() => abrirModal(item)}
          >
            <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
            <Text style={[styles.turma, { color: colors.text }]}>{item.turma ?? 'Sem turma'}</Text>
            <Text style={{ color: colors.text }}>Status: {item.ativo ? 'Ativo' : 'Inativo'}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View
          style={[
            styles.modal,
            { backgroundColor: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)" }
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme === "dark" ? "#000" : colors.card }
            ]}
          >
            <Text style={[styles.modalTitulo, { color: colors.text }]}>Editar Usuário</Text>

            <TextInput
              value={nome}
              onChangeText={setNome}
              style={[
                styles.input,
                {
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                  color: colors.text,
                  borderColor: "black",
                  borderWidth: 1
                },
              ]}
              placeholder="Nome"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            />

            <TextInput
              value={turma}
              onChangeText={setTurma}
              style={[
                styles.input,
                {
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                  color: colors.text,
                  borderColor: "black",
                  borderWidth: 1
                },
              ]}
              placeholder="Turma"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            />

            <TextInput
              value={saldo}
              onChangeText={setSaldo}
              style={[
                styles.input,
                {
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                  color: colors.text,
                  borderColor: "black",
                  borderWidth: 1
                },
              ]}
              placeholder="Saldo"
              keyboardType="numeric"
              placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
            />

            <TouchableOpacity
              style={{
                marginTop: 10,
                paddingVertical: 10,
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 6,
                alignItems: "center"
              }}
              onPress={alternarAtivo}
            >
              <Text
                style={{
                  color: theme === "dark" ? "#fff" : (usuarioEditando?.ativo ? colors.danger : colors.success),
                  fontSize: 16,
                  fontWeight: "700"
                }}
              >
                {usuarioEditando?.ativo ? "DESATIVAR" : "REATIVAR"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.salvar,
                {
                  backgroundColor: theme === "dark" ? "#4CAF50" : colors.primary,
                  borderWidth: theme === "dark" ? 1 : 0,
                  borderColor: theme === "dark" ? "black" : "transparent"
                }
              ]}
              onPress={salvarAlteracoes}
            >
              <Text style={[styles.textoSalvar, { color: "#fff" }]}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 10,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 6,
                alignItems: "center",
                backgroundColor: theme === "dark" ? "#333" : "#fff"
              }}
            >
              <Text
                style={{
                  color: theme === "dark" ? "#fff" : colors.danger,
                  fontSize: 16,
                  fontWeight: "600"
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  nome: { fontSize: 18, fontWeight: 'bold' },
  turma: { fontSize: 15, marginBottom: 5 },
  modal: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 20, borderRadius: 15 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { padding: 10, borderRadius: 10, marginBottom: 10 },
  salvar: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  textoSalvar: { fontWeight: 'bold' },
});

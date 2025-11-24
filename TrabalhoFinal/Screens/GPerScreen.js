import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,TouchableOpacity,Modal,TextInput,StyleSheet,Alert,} from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { supabase } from '../Services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GPerScreen() {
  const { colors } = useTheme();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaTurma, setNovaTurma] = useState('');

  const carregarUsuarios = async () => {
    setCarregando(true);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao carregar usuários:', error);
        Alert.alert('Erro', 'Não foi possível carregar os usuários.');
        setUsuarios([]);
        setCarregando(false);
        return;
      }

      const somenteNormais = (data || []).filter(u => u.tipo !== 'admin');
      setUsuarios(somenteNormais);
    } catch (err) {
      console.error('Erro inesperado ao carregar usuários:', err);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const abrirEdicao = (usuario) => {
    setUsuarioSelecionado(usuario);
    setNovoNome(usuario.nome || '');
    setNovaTurma(usuario.turma || '');
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!usuarioSelecionado) return;

    if (!novoNome.trim()) {
      Alert.alert('Atenção', 'Nome não pode ficar vazio.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({ nome: novoNome.trim(), turma: novaTurma.trim() })
        .eq('id', usuarioSelecionado.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        Alert.alert('Erro', 'Não foi possível salvar as alterações no banco.');
        return;
      }

      setUsuarios(prev =>
        prev.map(u => (u.id === data.id ? { ...u, ...data } : u))
      );

      try {
        const userIdLocal = await AsyncStorage.getItem('user_id'); 
        const usuarioUserId = data.user_id || data.userId || null;

        if (userIdLocal && usuarioUserId && userIdLocal === usuarioUserId) {
          await AsyncStorage.multiSet([
            ['nome', data.nome || ''],
            ['turma', data.turma || ''],
          ]);
        }
      } catch (asErr) {
        console.warn('Falha ao atualizar AsyncStorage (não bloqueante):', asErr);
      }

      Alert.alert('Sucesso', 'Usuário atualizado com sucesso.');
      setModalVisible(false);
      setUsuarioSelecionado(null);
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações.');
    }
  };

  const resetarSenha = async () => {
    if (!usuarioSelecionado) return;
    try {
      const userId = usuarioSelecionado.user_id || usuarioSelecionado.userId;
      if (!userId) {
        Alert.alert('Erro', 'Não foi possível identificar o usuário no auth.');
        return;
      }

      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: '123456',
      });

      if (error) {
        console.error('Erro ao resetar senha:', error);
        Alert.alert('Erro', 'Não foi possível resetar a senha.');
        return;
      }

      Alert.alert('Sucesso', 'Senha resetada para: 123456');
    } catch (err) {
      console.error('Erro inesperado ao resetar senha:', err);
      Alert.alert('Erro', 'Ocorreu um erro inesperado ao resetar a senha.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>
        Gerenciamento de Usuários
      </Text>

      {carregando ? (
        <Text style={{ color: colors.text }}>Carregando...</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => abrirEdicao(item)}
            >
              <View style={styles.cardLinha}>
                <View>
                  <Text style={[styles.nome, { color: colors.text }]}>
                    {item.nome}
                  </Text>
                  <Text style={{ color: colors.textSecundary }}>
                    Turma: {item.turma}
                  </Text>
                </View>

                <Text style={[styles.btnEditarTexto, { color: colors.primary }]}>
                  Editar
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Editar Usuário</Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Nome"
              placeholderTextColor="#777"
            />

            <Text style={styles.label}>Turma</Text>
            <TextInput
              style={styles.input}
              value={novaTurma}
              onChangeText={setNovaTurma}
              placeholder="Turma"
              placeholderTextColor="#777"
            />

            <TouchableOpacity style={styles.btnSalvar} onPress={salvarEdicao}>
              <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnResetar} onPress={resetarSenha}>
              <Text style={styles.btnResetarText}>Resetar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nome: {
    fontSize: 18,
    fontWeight: '600',
  },

  btnEditarTexto: {
    fontSize: 15,
    fontWeight: '700',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 25,
  },

  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 25,

    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },

  label: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 5,
    fontWeight: '600',
    color: '#000',
  },

  input: {
    padding: 14,
    borderRadius: 10,
    fontSize: 16,

    backgroundColor: '#F2F2F2',
    color: '#000',

    borderWidth: 1,
    borderColor: '#C8C8C8',
  },

  btnSalvar: {
    backgroundColor: '#1e88e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  btnSalvarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },

  btnResetar: {
    backgroundColor: '#d90429',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  btnResetarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },

  fechar: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
});

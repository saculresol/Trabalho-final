import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, FlatList, Modal } from "react-native";
import { listarUsuarios, updateUserBalance, updateUserTickets } from '../Services/userService';

export default function AdminGerenciarScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

  const [alterarSaldo, setAlterarSaldo] = useState("");
  const [alterarTickets, setAlterarTickets] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await listarUsuarios();

        const filtrados = data.filter(u => u.tipo !== "admin");

        setUsuarios(filtrados);
      } catch (err) {
        console.log("Erro ao buscar usuários:", err);
      }
    }
    load();
  }, []);

  function abrirModal(user) {
    setSelecionado(user);
    setAlterarSaldo("");
    setAlterarTickets("");
    setModalVisible(true);
  }

  function fecharModal() {
    setModalVisible(false);
    setSelecionado(null);
  }

  async function aplicarSaldo(valorDigitado) {
    const valor = parseFloat(valorDigitado);
    if (isNaN(valor)) return Alert.alert("Erro", "Digite um valor válido");

    const novoSaldo = (selecionado.saldo || 0) + valor;

    try {
      await updateUserBalance(selecionado.id, novoSaldo);

      Alert.alert("Sucesso", "Saldo atualizado!");

      setUsuarios(prev =>
        prev.map(u => u.id === selecionado.id ? { ...u, saldo: novoSaldo } : u)
      );

      fecharModal(); 
    } catch {
      Alert.alert("Erro", "Falha ao atualizar saldo");
    }
  }

  async function aplicarTickets(valorDigitado) {
    const valor = parseFloat(valorDigitado);
    if (isNaN(valor)) return Alert.alert("Erro", "Digite um número válido");

    const novosTickets = (selecionado.tickets || 0) + valor;

    try {
      await updateUserTickets(selecionado.id, novosTickets);

      Alert.alert("Sucesso", "Tickets atualizados!");

      setUsuarios(prev =>
        prev.map(u => u.id === selecionado.id ? { ...u, tickets: novosTickets } : u)
      );

      fecharModal(); 
    } catch {
      Alert.alert("Erro", "Falha ao atualizar tickets");
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.userCard} onPress={() => abrirModal(item)}>
      <Text style={styles.userName}>{item.nome}</Text>
      <Text>Saldo: R$ {item.saldo || 0}</Text>
      <Text>Tickets: {item.tickets || 0}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Usuários</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {selecionado && (
              <>
                <Text style={styles.modalTitle}>Gerenciando {selecionado.nome}</Text>

                <Text style={styles.label}>Saldo atual: R$ {selecionado.saldo}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adicionar/remover saldo"
                  keyboardType="numeric"
                  value={alterarSaldo}
                  onChangeText={setAlterarSaldo}
                />

                <View style={styles.row}>
                  <TouchableOpacity style={styles.addButton} onPress={() => aplicarSaldo(alterarSaldo)}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeButton} onPress={() => aplicarSaldo(-Math.abs(alterarSaldo))}>
                    <Text style={styles.buttonText}>Remover</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Tickets atuais: {selecionado.tickets}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adicionar/remover tickets"
                  keyboardType="numeric"
                  value={alterarTickets}
                  onChangeText={setAlterarTickets}
                />

                <View style={styles.row}>
                  <TouchableOpacity style={styles.addButton} onPress={() => aplicarTickets(alterarTickets)}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeButton} onPress={() => aplicarTickets(-Math.abs(alterarTickets))}>
                    <Text style={styles.buttonText}>Remover</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={fecharModal}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  userCard: {
    backgroundColor: "#e6e6e6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: { fontSize: 18, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    elevation: 10
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  label: { fontSize: 16, marginTop: 10 },

  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    marginRight: 5,
    borderRadius: 8,
    alignItems: "center",
  },

  removeButton: {
    flex: 1,
    backgroundColor: "#E53935",
    padding: 12,
    marginLeft: 5,
    borderRadius: 8,
    alignItems: "center",
  },

  closeButton: {
    backgroundColor: "#555",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },
});

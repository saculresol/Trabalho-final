import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { fetchMeals } from "../Services/mealService";

export default function AdminGerenciarCardapioScreen() {
  const [itensAtivos, setItensAtivos] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [itemsDesativados, setItensDesativados] = useState([]);

  useEffect(() => {
    async function carregar() {
      const pratos = await fetchMeals(true); // Busca a lista COMPLETA da API
      setItensAtivos(pratos);
    }
    carregar();
  }, []);

  const desativarItem = (item) => {
    setItensAtivos((prev) => prev.filter((i) => i.id !== item.id));
    setItensDesativados((prev) => [...prev, item]);
  };

  const ativarItem = (item) => {
    setItensDesativados((prev) => prev.filter((i) => i.id !== item.id));
    setItensAtivos((prev) => [...prev, item]);
  };

  const adicionarItemManual = () => {
    if (!novoItem.trim() || !novoPreco.trim()) return;

    const item = {
      id: Date.now().toString(),
      nome: novoItem,
      descricao: "Item adicionado manualmente",
      imagem: "https://via.placeholder.com/100",
      preco: Number(novoPreco),
    };

    setItensAtivos((prev) => [...prev, item]);
    setNovoItem("");
    setNovoPreco("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerenciar Cardápio</Text>

      {/* FORMULÁRIO */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nome do novo item"
          value={novoItem}
          onChangeText={setNovoItem}
        />
        <TextInput
          style={[styles.input, { width: 90 }]}
          placeholder="Preço"
          keyboardType="numeric"
          value={novoPreco}
          onChangeText={setNovoPreco}
        />
        <TouchableOpacity style={styles.btnAdd} onPress={adicionarItemManual}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* SCROLL ÚNICO */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ATIVOS */}
        <Text style={styles.subtitulo}>Itens Ativos</Text>

        {itensAtivos.map((item) => (
          <View key={item.id} style={styles.card}>
            {item.imagem && <Image source={{ uri: item.imagem }} style={styles.img} />}

            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.desc}>{item.descricao?.slice(0, 50)}...</Text>
              <Text style={styles.preco}>R$ {item.preco}</Text>
            </View>

            <TouchableOpacity onPress={() => desativarItem(item)}>
              <Text style={styles.desativar}>Desativar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* DESATIVADOS */}
        <Text style={styles.subtitulo}>Itens Desativados</Text>

        {itemsDesativados.map((item) => (
          <View key={item.id} style={styles.cardDesativado}>
            <Text style={styles.nome}>{item.nome}</Text>

            <TouchableOpacity onPress={() => ativarItem(item)}>
              <Text style={styles.ativar}>Ativar</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  subtitulo: { fontSize: 18, marginVertical: 10, fontWeight: "600" },

  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },

  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  btnAdd: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  btnText: { color: "#fff", fontWeight: "bold" },

  card: {
    flexDirection: "row",
    backgroundColor: "#e8ffe8",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  img: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },

  nome: { fontSize: 16, fontWeight: "bold" },
  desc: { fontSize: 12, opacity: 0.7 },
  preco: { marginTop: 5, fontWeight: "bold" },

  desativar: { color: "red", fontWeight: "bold" },

  cardDesativado: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ffe8e8",
    marginVertical: 5,
    borderRadius: 10,
  },

  ativar: { color: "green", fontWeight: "bold" },
});

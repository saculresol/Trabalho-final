import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { fetchMeals } from "../Services/mealService";
import { useTheme } from "../Context/ThemeContext";

export default function AdminGerenciarCardapioScreen() {
  const { theme } = useTheme();

  const [itensAtivos, setItensAtivos] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [itensDesativados, setItensDesativados] = useState([]);

  useEffect(() => {
    async function carregar() {
      const pratos = await fetchMeals(true);
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <Text style={[styles.titulo, { color: theme.text }]}>Gerenciar Cardápio</Text>

      {/* FORMULÁRIO */}
      <View style={styles.row}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Nome do novo item"
          placeholderTextColor={theme.placeholder}
          value={novoItem}
          onChangeText={setNovoItem}
        />

        <TextInput
          style={[
            styles.input,
            {
              width: 90,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="Preço"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          value={novoPreco}
          onChangeText={setNovoPreco}
        />

        <TouchableOpacity
          style={[
            styles.btnAdd,
            {
              backgroundColor: theme.success,
            },
          ]}
          onPress={adicionarItemManual}
        >
          <Text style={[styles.btnText, { color: theme.textButton || "#fff" }]}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={[styles.subtitulo, { color: theme.text }]}>Itens Ativos</Text>

        {itensAtivos.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {item.imagem && <Image source={{ uri: item.imagem }} style={styles.img} />}

            <View style={{ flex: 1 }}>
              <Text style={[styles.nome, { color: theme.text }]}>{item.nome}</Text>
              <Text style={[styles.desc, { color: theme.text }]}>{item.descricao?.slice(0, 50)}...</Text>
              <Text style={[styles.preco, { color: theme.text }]}>R$ {item.preco}</Text>
            </View>

            <TouchableOpacity onPress={() => desativarItem(item)}>
              <Text style={[styles.desativar, { color: theme.danger }]}>Desativar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.subtitulo, { color: theme.text }]}>Itens Desativados</Text>

        {itensDesativados.map((item) => (
          <View
            key={item.id}
            style={[
              styles.cardDesativado,
              {
                backgroundColor: theme.cardDesativado,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.nome, { color: theme.text }]}>{item.nome}</Text>

            <TouchableOpacity onPress={() => ativarItem(item)}>
              <Text style={[styles.ativar, { color: theme.success }]}>Ativar</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  btnAdd: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
  },

  btnText: {
    fontWeight: "bold",
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },

  card: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },

  cardDesativado: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },

  img: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },

  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },

  desc: {
    fontSize: 14,
    marginVertical: 3,
  },

  preco: {
    fontSize: 16,
    fontWeight: "bold",
  },

  desativar: {
    fontWeight: "bold",
  },

  ativar: {
    fontWeight: "bold",
  },
});

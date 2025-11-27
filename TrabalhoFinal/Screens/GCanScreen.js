import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchMeals } from "../Services/mealService";
import { useTheme } from "../Context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminGerenciarCardapioScreen() {
  const { colors, theme } = useTheme(); // <- agora pega TEMA também

  const [itensAtivos, setItensAtivos] = useState([]);
  const [itensDesativados, setItensDesativados] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    async function carregar() {
      const pratosAsync = await AsyncStorage.getItem("itensAtivos");
      const desativadosAsync = await AsyncStorage.getItem("itensDesativados");
      if (pratosAsync) setItensAtivos(JSON.parse(pratosAsync));
      if (desativadosAsync) setItensDesativados(JSON.parse(desativadosAsync));
      const pratosAPI = await fetchMeals(true);
      setItensAtivos((prev) => [...pratosAPI, ...prev]);
    }
    carregar();
  }, []);

  const salvarAsync = async (ativos, desativados) => {
    await AsyncStorage.setItem("itensAtivos", JSON.stringify(ativos));
    await AsyncStorage.setItem("itensDesativados", JSON.stringify(desativados));
  };

  const desativarItem = (item) => {
    const novosAtivos = itensAtivos.filter((i) => i.id !== item.id);
    const novosDesativados = [...itensDesativados, item];
    setItensAtivos(novosAtivos);
    setItensDesativados(novosDesativados);
    salvarAsync(novosAtivos, novosDesativados);
  };

  const ativarItem = (item) => {
    const novosDesativados = itensDesativados.filter((i) => i.id !== item.id);
    const novosAtivos = [...itensAtivos, item];
    setItensDesativados(novosDesativados);
    setItensAtivos(novosAtivos);
    salvarAsync(novosAtivos, novosDesativados);
  };

  const escolherImagem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImagem(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const adicionarItemManual = () => {
    if (!novoItem.trim() || !novoPreco.trim() || !novaDescricao.trim()) {
      Alert.alert("Erro", "Nome, preço e descrição são obrigatórios.");
      return;
    }

    const item = {
      id: Date.now().toString(),
      nome: novoItem,
      descricao: novaDescricao,
      imagem: imagem || "https://via.placeholder.com/100",
      preco: Number(novoPreco),
    };

    const novosAtivos = [...itensAtivos, item];
    setItensAtivos(novosAtivos);
    salvarAsync(novosAtivos, itensDesativados);

    setNovoItem("");
    setNovaDescricao("");
    setNovoPreco("");
    setImagem(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.titulo, { color: colors.text }]}>Gerenciar Cardápio</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 2, borderColor: colors.secondary, color: colors.text, backgroundColor: colors.input }]}
          placeholder="Nome do novo item"
          placeholderTextColor={theme === "dark" ? "#fff" : colors.placeholder}
          value={novoItem}
          onChangeText={setNovoItem}
        />

        <TextInput
          style={[styles.input, { width: 90, borderColor: colors.secondary, color: colors.text, backgroundColor: colors.input }]}
          placeholder="Preço"
          placeholderTextColor={theme === "dark" ? "#fff" : colors.placeholder}
          keyboardType="numeric"
          value={novoPreco}
          onChangeText={setNovoPreco}
        />
      </View>

      <TextInput
        style={[styles.input, { borderColor: colors.secondary, color: colors.text, backgroundColor: colors.input }]}
        placeholder="Descrição"
        placeholderTextColor={theme === "dark" ? "#fff" : colors.placeholder}
        value={novaDescricao}
        onChangeText={setNovaDescricao}
      />

      <TouchableOpacity style={[styles.btnAdd, { backgroundColor: colors.primary }]} onPress={escolherImagem}>
        <Text style={[styles.btnText, { color: colors.textButton || "#fff" }]}>Escolher Imagem</Text>
      </TouchableOpacity>

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      <TouchableOpacity style={[styles.btnAdd, { backgroundColor: colors.primary }]} onPress={adicionarItemManual}>
        <Text style={[styles.btnText, { color: colors.textButton || "#fff" }]}>Adicionar Item</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
        <Text style={[styles.subtitulo, { color: colors.text }]}>Itens Ativos</Text>

        {itensAtivos.map((item) => (
          <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.secondary }]}>
            {item.imagem && <Image source={{ uri: item.imagem }} style={styles.img} />}
            <View style={{ flex: 1 }}>
              <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
              <Text style={[styles.desc, { color: colors.text }]}>{item.descricao}</Text>
              <Text style={[styles.preco, { color: colors.text }]}>R$ {item.preco}</Text>
            </View>
            <TouchableOpacity
              style={[styles.btnAdd, { backgroundColor: colors.danger }]}
              onPress={() => desativarItem(item)}
            >
              <Text style={[styles.btnText, { color: colors.textButton || "#fff" }]}>Desativar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.subtitulo, { color: colors.text }]}>Itens Desativados</Text>
        {itensDesativados.map((item) => (
          <View key={item.id} style={[styles.cardDesativado, { backgroundColor: colors.cardDesativado, borderColor: colors.secondary }]}>
            <Text style={[styles.nome, { color: colors.text }]}>{item.nome}</Text>
            <TouchableOpacity
              style={[styles.btnAdd, { backgroundColor: colors.success }]}
              onPress={() => ativarItem(item)}
            >
              <Text style={[styles.btnText, { color: colors.textButton || "#fff" }]}>Ativar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 16 },
  btnAdd: { padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  btnText: { fontWeight: "bold" },
  subtitulo: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  card: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  cardDesativado: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  img: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  nome: { fontSize: 17, fontWeight: "bold" },
  desc: { fontSize: 14, marginVertical: 4 },
  preco: { fontSize: 15, fontWeight: "600" },
  preview: { width: "100%", height: 140, borderRadius: 10, marginBottom: 10 },
});

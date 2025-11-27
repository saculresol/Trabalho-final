import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../Services/supabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentScreen({ route, navigation }) {
  const { amount, userId } = route.params ?? {};
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState(null);

  if (!amount || !userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dados inválidos para pagamento.</Text>
      </View>
    );
  }

  function gerarPixSimulado() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 25; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return 'PIX-' + code;
  }

  async function simularPagamento() {
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1200));

      if (method === 'pix') {
        const code = gerarPixSimulado();
        setPixCode(code);
        setLoading(false);
        return;
      }

      if (method === 'card') {
        await creditarSaldoNoSupabase(amount, userId);
        Alert.alert('Pagamento aprovado', `Valor R$ ${amount.toFixed(2)} creditado no seu saldo.`);
        navigation.goBack();
      }
    } catch (e) {
      console.log('Erro simular pagamento:', e);
      Alert.alert('Erro', 'Falha ao processar pagamento simulado.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmarPixPago() {
    if (!pixCode) {
      Alert.alert('Aviso', 'Gere o código PIX primeiro.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
      await creditarSaldoNoSupabase(amount, userId);

      Alert.alert('PIX confirmado', `Valor R$ ${amount.toFixed(2)} creditado no seu saldo.`);
      navigation.goBack();
    } catch (e) {
      console.log('Erro confirmar pix:', e);
      Alert.alert('Erro', 'Não foi possível confirmar o PIX.');
    } finally {
      setLoading(false);
    }
  }

  async function creditarSaldoNoSupabase(valor, userIdParam) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('saldo')
      .eq('id', Number(userIdParam))
      .single();

    if (error) {
      throw error;
    }

    const novoSaldo = Number((data?.saldo ?? 0)) + Number(valor);

    const { error: upError } = await supabase
      .from('usuarios')
      .update({ saldo: novoSaldo })
      .eq('id', Number(userIdParam));

    if (upError) throw upError;

    try {
      const raw = await AsyncStorage.getItem('saldosUsuarios');
      const lista = raw ? JSON.parse(raw) : [];
      const idx = lista.findIndex(u => u.id === String(userIdParam));
      if (idx >= 0) {
        lista[idx].saldo = novoSaldo;
      } else {
        lista.push({ id: String(userIdParam), saldo: novoSaldo });
      }
      await AsyncStorage.setItem('saldosUsuarios', JSON.stringify(lista));
    } catch (e) {
      console.log('Erro ao atualizar cache local após pagamento:', e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento - R$ {Number(amount).toFixed(2)}</Text>

      <Text style={styles.subtitle}>Escolha a forma de pagamento</Text>

      <TouchableOpacity
        style={[styles.option, method === 'card' ? styles.optionActive : null]}
        onPress={() => setMethod('card')}
      >
        <Text style={styles.optionText}>Cartão (simulação)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, method === 'pix' ? styles.optionActive : null]}
        onPress={() => setMethod('pix')}
      >
        <Text style={styles.optionText}>PIX (simulação)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.payButton} onPress={simularPagamento}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payText}>Gerar / Pagar</Text>}
      </TouchableOpacity>

      {pixCode ? (
        <>
          <View style={styles.pixBox}>
            <Text style={styles.pixLabel}>PIX gerado (simulado):</Text>
            <Text selectable style={styles.pixCode}>{pixCode}</Text>
          </View>

          <TouchableOpacity style={styles.confirmPix} onPress={confirmarPixPago}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmPixText}>Já paguei (simular confirmação)</Text>}
          </TouchableOpacity>
        </>
      ) : null}

      <TouchableOpacity style={styles.cancel} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 12 },
  option: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginBottom: 10,
  },
  optionActive: { backgroundColor: '#A4BB49' },
  optionText: { fontWeight: '600', color: '#111' },
  payButton: {
    backgroundColor: '#0066ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  payText: { color: '#fff', fontWeight: 'bold' },
  pixBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  pixLabel: { fontWeight: '600', marginBottom: 8 },
  pixCode: { fontSize: 16, color: '#333' },
  confirmPix: {
    marginTop: 12,
    backgroundColor: '#2a9d8f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmPixText: { color: '#fff', fontWeight: 'bold' },
  cancel: { marginTop: 16, alignItems: 'center' },
  cancelText: { color: '#c00', fontWeight: 'bold' },
});

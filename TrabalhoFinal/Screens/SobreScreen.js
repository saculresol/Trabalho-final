import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import { useContext } from 'react';
export default function TransacoesScreen() {  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Sobre o App Cantina Lhey</Text>
        
        <Text style={styles.text}>
          Nosso app foi criado para ajudar no gerenciamento de cantinas escolares. 
          Nele teremos o cardápio informando os lanches que a instituição vende.
        </Text>

        <Text style={styles.text}>
          Cada aluno tem direito a um ticket diário. Caso o aluno queira comer mais, 
          ele pode adicionar mais saldo à sua conta com um valor desejado.
        </Text>

        <Text style={styles.footer}>Versão 0.1.0 • Desenvolvido por Equipe Cantina Lhey</Text>
      </ScrollView>
    </View>
  );
}
const { theme, toggleTheme } = useContext(ThemeContext);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3142',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 12,
  },
  footer: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 30,
    textAlign: 'center',
  },
});

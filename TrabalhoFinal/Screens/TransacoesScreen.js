import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ThemeContext } from '../Context/ThemeContext';
import { useContext } from 'react';

export default function ConfigScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Transações:</Text>

      <Button title="Voltar" onPress={() => navigation.goBack()} />

      <StatusBar style="auto" />
    </View>
  );
}
const { theme, toggleTheme } = useContext(ThemeContext);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { View } from "react-native-web";
import { useTheme } from "../Context/ThemeContext";

export default function ConCanScreen() {
  const { theme, toggleTheme } = useTheme();
  
  const alternarTema = async () => {
    toggleTheme(); // alterna tema global
    await AsyncStorage.setItem('tema', theme === 'light' ? 'dark' : 'light');
    Alert.alert('Sucesso', `Tema alterado para ${theme === 'light' ? 'escuro' : 'claro'}!`);
  };
  
  const estilosAtuais = theme === 'light' ? {
    backgroundColor: '#F8F9FA',
    color: '#2D3142',
    botaoBg: '#E5E7EB',
    botaoTexto: '#1F2937',
    borda: '#D1D5DB',
  } :
    {
      backgroundColor: '#1F2937',
      color: '#F9FAFB',
      botaoBg: '#374151',
      botaoTexto: '#F9FAFB',
      borda: '#4B5563',
    };

    return(
      <View>
        <Text>Socorro</Text>
      </View>
    )
}
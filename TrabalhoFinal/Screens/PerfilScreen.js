import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function TransacoesScreen() {  
  return (
    <View style={styles.container}>
       <Image source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ71x_K2UcszdyBiq6m5BzXxaCwEgCSc74gsQ&s'}}
       style={{ width: 100, height: 100, borderRadius:100 }}></Image>
      <Text>Nome:</Text>
      <Text>Turma:</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

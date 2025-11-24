import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'; // 👈 adicionado
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';

import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import PerfilScreen from './Screens/PerfilScreen';
import ConfigScreen from './Screens/ConfigScreen';
import SobreScreen from './Screens/SobreScreen';
import TransacoesScreen from './Screens/TransacoesScreen';
import AdminScreen from './Screens/AdminScreen'
import ConCanScreen from './Screens/ConCanScreen';
import GcanScreen from './Screens/GCanScreen';
import GPerScreen from './Screens/GPerScreen';
import GSalScreen from './Screens/GSalScreen';
import { ThemeProvider, useTheme } from './Context/ThemeContext'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: '#999',
        tabBarActiveTintColor: '#000',
      }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Configuracoes"
        component={ConfigScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AdminHome"
        component={AdminScreen}
        options={{
          tabBarLabel: "Admin",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ConCan"
        component={ConCanScreen}
        options={{
          tabBarLabel: "Configuração Cantina",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="tool" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: '#A4BB49',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="Home-drawer"
        component={HomeTabs}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ drawerLabel: 'Perfil do aluno' }}
      />
      <Drawer.Screen
        name="Sobre"
        component={SobreScreen}
        options={{ drawerLabel: 'Sobre' }}
      />
    </Drawer.Navigator>
  );
}

function AdminDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ drawerLabel: "Painel Admin" }}
      />
      
      <Drawer.Screen
        name="Gcan"
        component={GcanScreen}
        options={{ drawerLabel: "Gerenciar Cardápio" }}
      />

      <Drawer.Screen
        name="GPer"
        component={GPerScreen}
        options={{ drawerLabel: "Gerenciar Pessoas" }}
      />

      <Drawer.Screen
        name="GSal"
        component={GSalScreen}
        options={{ drawerLabel: "Gerenciar Saldo" }}
      />
    </Drawer.Navigator>
  );
}

function AppContent() {
  const { theme } = useTheme(); 
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme; 

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppDrawer"
          component={AppDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transações"
          component={TransacoesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
         name="Admin"
         component={AdminScreen}
         options={{ headerShown: false }}
        />

       <Stack.Screen
        name="AdminDrawer"
        component={AdminDrawer}
        options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent /> 
    </ThemeProvider>
  );
}

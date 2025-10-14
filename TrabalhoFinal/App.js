import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';

import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import CantinaScreen from './Screens/CantinaScreen';
import TransacoesScreen from './Screens/TransacoesScreen';
import ConfigScreen from './Screens/ConfigScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#A4BB49',
        tabBarInactiveTintColor: '#999',
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
        name="Cantina"
        component={CantinaScreen}
        options={{
          tabBarLabel: 'Cardápio',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" color={color} size={size} />
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
        name="HomeTabs"
        component={HomeTabs}
        options={{ drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Transacoes"
        component={TransacoesScreen}
        options={{ drawerLabel: 'Transações' }}
      />
      <Drawer.Screen
        name="Config"
        component={ConfigScreen}
        options={{ drawerLabel: 'Configurações' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@usuarios";

export async function loadAllLocalUsers() {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveAllLocalUsers(lista) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export async function updateLocalUser(id, newData) {
  const users = await loadAllLocalUsers();
  const updated = users.map(u => u.id === id ? { ...u, ...newData } : u);
  await saveAllLocalUsers(updated);
  return updated.find(u => u.id === id);
}

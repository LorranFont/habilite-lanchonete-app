import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";

type User = { nome: string; email: string; senha: string };

export function MenuScreen({ navigation }: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync("user");
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch {}
      }
    })();
  }, []);

  async function handleLogout() {
    await SecureStore.deleteItemAsync("user");
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  return (
    <View className="flex-1 bg-gray-50 px-5 py-10">
      <Text className="text-2xl font-extrabold text-habilite-primary mb-2">🍔 Menu</Text>
      {user && (
        <View className="mb-6">
          <Text className="text-base text-gray-700">Bem-vindo, <Text className="font-semibold">{user.nome}</Text>!</Text>
          <Text className="text-gray-500">{user.email}</Text>
        </View>
      )}

      <Pressable
        onPress={handleLogout}
        className="bg-habilite-accent rounded-2xl px-5 py-3 self-start active:opacity-80"
      >
        <Text className="text-white font-bold">Sair</Text>
      </Pressable>
    </View>
  );
}

export default MenuScreen;
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>🍔 Menu</Text>
      {user && (
        <>
          <Text>Bem-vindo, {user.nome}!</Text>
          <Text>{user.email}</Text>
        </>
      )}
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}

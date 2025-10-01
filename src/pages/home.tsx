import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";

export function HomeScreen({ navigation }: any) {
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync("user");
      navigation.reset({
        index: 0,
        routes: [{ name: stored ? "Menu" : "Login" }],
      });
    })();
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

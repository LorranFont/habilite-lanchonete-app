import { useEffect } from "react";
import { View, Text } from "react-native";

export function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: "Menu" }] });
    }, 900);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#731906]">
      <Text className="text-white text-2xl font-extrabold">Habilite Lanchonete</Text>
      <Text className="text-white/80 mt-1">carregando seu cardápio...</Text>
    </View>
  );
}

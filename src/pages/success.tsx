import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export function SuccessScreen({ route, navigation }: any) {
  const { orderId } = route.params ?? {};
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 items-center justify-center px-8 bg-gray-50">
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
        }}
        className="w-20 h-20 rounded-full bg-habilite-accent items-center justify-center mb-4"
      >
        <Ionicons name="checkmark" size={44} color="#fff" />
      </Animated.View>

      <Text className="text-2xl font-extrabold text-habilite-primary">
        Pedido confirmado!
      </Text>
      {!!orderId && (
        <Text className="mt-2 text-gray-500">Código do pedido: {orderId}</Text>
      )}

      <Pressable
        onPress={() => navigation.reset({ index: 0, routes: [{ name: "Menu" }] })}
        className="mt-8 px-5 py-3 rounded-2xl bg-habilite-accent active:opacity-90"
      >
        <Text className="text-white font-bold">Voltar ao cardápio</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Orders")}
        className="mt-3 px-5 py-3 rounded-2xl border border-gray-300 bg-white active:opacity-80"
      >
        <Text className="text-habilite-primary font-semibold">Ver meus pedidos</Text>
      </Pressable>
    </View>
  );
}

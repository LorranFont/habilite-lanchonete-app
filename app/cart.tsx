import React from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../src/context/cart";
import { Card, Button } from "../src/components/ui";

const HEADER_H = 110;
const HEADER_BG = "rgb(115, 25, 6)"; // #731906

export function CartScreen({ navigation }: any) {
  const { items, totalQty, totalPrice, inc, dec, remove, clear } = useCart();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header curvado */}
      <View
        style={{
          height: HEADER_H,
          paddingTop: 40,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: HEADER_BG,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 10,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 rounded-2xl bg-white/20 active:opacity-80"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>

          <Text className="text-white font-extrabold text-lg">Meu carrinho</Text>

          <Pressable
            onPress={() => navigation.navigate("Menu")}
            className="p-2 rounded-2xl bg-white active:opacity-90"
          >
            <Ionicons name="restaurant" size={18} color="#e11d48" />
          </Pressable>
        </View>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 px-4" style={{ paddingTop: HEADER_H + 8, paddingBottom: 16 }}>
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 text-lg">🛒 Seu carrinho está vazio.</Text>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <Card key={String(item.id)} className="mb-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500">R$ {item.price.toFixed(2)}</Text>
                  </View>

                  <View className="flex-row items-center">
                    <Pressable
                      onPress={() => dec(String(item.id))}
                      className="px-3 py-2 rounded-2xl bg-gray-200 active:opacity-80 mr-2"
                    >
                      <Text className="text-lg">−</Text>
                    </Pressable>
                    <Text className="w-6 text-center font-semibold">{item.quantity}</Text>
                    <Pressable
                      onPress={() => inc(String(item.id))}
                      className="px-3 py-2 rounded-2xl bg-gray-200 active:opacity-80 ml-2"
                    >
                      <Text className="text-lg">＋</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => remove(String(item.id))}
                      className="ml-3 px-3 py-2 rounded-2xl bg-red-500 active:opacity-80"
                    >
                      <Text className="text-white font-semibold">Remover</Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            ))}

            <Card className="mt-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold">
                  Total ({totalQty} {totalQty === 1 ? "item" : "itens"})
                </Text>
                <Text className="text-lg font-extrabold">R$ {totalPrice.toFixed(2)}</Text>
              </View>

              <Button
                title="Finalizar pedido"
                className="mt-3"
                onPress={() => navigation.navigate("Checkout")}
              />

              <Button
                title="Limpar carrinho"
                variant="outline"
                className="mt-2"
                onPress={clear}
              />
            </Card>
          </>
        )}
      </View>
    </View>
  );
}

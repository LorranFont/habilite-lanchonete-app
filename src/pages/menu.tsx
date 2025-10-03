import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Card } from "../components/ui";

type Product = { id: string; nome: string; preco: number };

const MOCK: Product[] = [
  { id: "1", nome: "Hambúrguer", preco: 25.0 },
  { id: "2", nome: "Pizza", preco: 30.0 },
  { id: "3", nome: "Salada", preco: 15.0 },
  { id: "4", nome: "Batata Frita", preco: 10.0 },
  { id: "5", nome: "Refrigerante", preco: 5.0 },
];

export function MenuScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    setTimeout(() => setProducts(MOCK), 1200);
  }, []);

  if (!products) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#e11d48" />
        <Text className="mt-3 text-gray-500">Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4 pt-8">
      <Text className="text-2xl font-bold mb-4 text-rose-600">🍔 Cardápio</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  {item.nome}
                </Text>
                <Text className="text-gray-500">
                  R$ {item.preco.toFixed(2)}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate("Carrinho", { product: item })
                }
                className="bg-rose-600 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold">Adicionar</Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

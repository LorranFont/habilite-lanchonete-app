import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from "../components/ui";
import { useCart } from "../context/cart";

// Mantém id como string no mock e converte pra number ao enviar pro contexto
type Row = { id: string; nome: string; preco: number; imagem?: string; categoria?: string };

const MOCK: Row[] = [
  { id: "1", nome: "Hambúrguer Clássico", preco: 25.9, imagem: "", categoria: "Lanches" },
  { id: "2", nome: "Batata Frita", preco: 12.0, imagem: "", categoria: "Acompanhamentos" },
  { id: "3", nome: "Refrigerante Lata", preco: 6.5, imagem: "", categoria: "Bebidas" },
  { id: "4", nome: "Cheeseburger", preco: 28.0, imagem: "", categoria: "Lanches" },
  { id: "5", nome: "Suco Natural", preco: 9.9, imagem: "", categoria: "Bebidas" },
];

export function MenuScreen({ navigation }: any) {
  const [products, setProducts] = useState<Row[] | null>(null);
  const { addItem, totalQty } = useCart();

  useEffect(() => {
    const t = setTimeout(() => setProducts(MOCK), 700);
    return () => clearTimeout(t);
  }, []);

  if (!products) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#e11d48" />
        <Text className="mt-3 text-gray-500">Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View className="px-4 pt-10 pb-4 flex-row items-center justify-between bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Autoescola Habilite</Text>
          <Text className="text-2xl font-extrabold text-habilite-primary">Cardápio</Text>
        </View>

        {/* Carrinho com badge */}
        <Pressable
          onPress={() => navigation.navigate("Cart")}
          className="relative p-2 rounded-2xl bg-habilite-accent active:opacity-90"
        >
          <Ionicons name="cart" size={22} color="#fff" />
          {totalQty > 0 && (
            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full px-2 py-0.5">
              <Text className="text-habilite-accent text-xs font-extrabold">{totalQty}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* LISTA */}
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        data={products}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Card className="overflow-hidden">
            <View className="flex-row gap-3">
              {/* thumb */}
              <View className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200">
                <Image
                  source={{ uri: item.imagem || "" }}
                  className="w-full h-full"
                />
              </View>

              {/* infos */}
              <View className="flex-1 justify-between">
                {item.categoria ? (
                  <Text className="text-[11px] text-gray-500">{item.categoria}</Text>
                ) : null}
                <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
                  {item.nome}
                </Text>
                <Text className="text-habilite-accent font-extrabold">R$ {item.preco.toFixed(2)}</Text>
              </View>

              {/* ação */}
              <View className="justify-center">
                <Pressable
                  onPress={() =>
                    addItem({
                      id: Number(item.id),
                      name: item.nome,
                      price: item.preco,
                      image: item.imagem || "",
                      quantity: 1,
                      category: item.categoria || "",
                    })
                  }
                  className="w-10 h-10 rounded-2xl bg-habilite-accent items-center justify-center active:opacity-90"
                >
                  <Ionicons name="add" size={22} color="black" />
                </Pressable>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

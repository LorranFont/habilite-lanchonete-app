import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { Card, Button } from "../components/ui";
import { useCart } from "../context/cart";

//mock pode usar id string; aqui eu converto pra number ao enviar pro contexto
type Row = { id: string; nome: string; preco: number };

const MOCK: Row[] = [
  { id: "1", nome: "Hambúrguer", preco: 25.0 },
  { id: "2", nome: "Pizza", preco: 30.0 },
  { id: "3", nome: "Salada", preco: 15.0 },
  { id: "4", nome: "Batata Frita", preco: 10.0 },
  { id: "5", nome: "Refrigerante", preco: 5.0 },
];

export function MenuScreen({ navigation }: any) {
  const [products, setProducts] = useState<Row[] | null>(null);
  const { addItem, totalQty } = useCart(); // usa addItem e totalQty do contexto

  useEffect(() => {
    const t = setTimeout(() => setProducts(MOCK), 800);
    return () => clearTimeout(t);
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
    <View className="flex-1 bg-gray-50 px-4 pt-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-habilite-primary">🍔 Cardápio</Text>
        <Pressable
          onPress={() => navigation.navigate("Cart")}  // nome da rota igual ao App.tsx
          className="px-3 py-2 rounded-xl bg-habilite-accent active:opacity-90"
        >
          <Text className="text-black font-bold">Carrinho ({totalQty})</Text>
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-800">{item.nome}</Text>
                <Text className="text-gray-500">R$ {item.preco.toFixed(2)}</Text>
              </View>

              <Button
                title="Adicionar"
                className="w-32"
                onPress={() => {
                  // chama o contexto com o shape que ele espera (id:number, name, price)
                  addItem({
                    id: Number(item.id),
                    name: item.nome,
                    price: item.preco,
                    image: "",
                    quantity: 1, // o reducer ignora e controla internamente
                    category: "",
                  });
                  //confirmar clique
                  Alert.alert("Adicionado", `${item.nome} foi para o carrinho ✅`);
                }}
              />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

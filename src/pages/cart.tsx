import { View, Text, Pressable, FlatList } from "react-native";
import { useCart } from "../context/cart";
import { Card, Button } from "../components/ui";
import { brl } from "../utils/money";
import { Ionicons } from "@expo/vector-icons";

export function CartScreen({ navigation }: { navigation: any }) {
  const { items, totalQty, totalPrice, inc, dec, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-gray-500 text-lg text-center">
          🛒 Seu carrinho está vazio.
        </Text>
        <Button
          title="Voltar ao cardápio"
          onPress={() => navigation.navigate("Menu")}
          className="mt-6 w-full"
        />
      </View>
    );
  }

  return (
    
    <View className="flex-1 bg-gray-50 px-4 pt-8">
      <Text className="text-2xl font-bold text-habilite-primary mb-4"> 
        Carrinho
      </Text>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <Card className="mb-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-gray-500">
                  {brl(item.price)} • qtd: {item.quantity}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => dec(String(item.id))}
                  className="px-3 py-2 rounded-xl bg-gray-200"
                >
                  <Text className="text-lg">−</Text>
                </Pressable>
                <Pressable
                  onPress={() => inc(String(item.id))}
                  className="px-3 py-2 rounded-xl bg-gray-200"
                >
                  <Text className="text-lg">＋</Text>
                </Pressable>
                <Pressable
                  onPress={() => remove(String(item.id))}
                  className="px-3 py-2 rounded-xl bg-red-500 active:opacity-80"
                >
                  <Text className="text-white font-semibold">Remover</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        )}
      />

      <Card className="mt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold">
            Total ({totalQty} itens)
          </Text>
          <Text className="text-lg font-extrabold">{brl(totalPrice)}</Text>
        </View>

        <Button
          title="Finalizar pedido"
          className="mt-4 w-full"
          onPress={() => {
            navigation.navigate("Checkout");
          }}
        />

        <Button
          title="Limpar carrinho"
          variant="outline"
          className="mt-3 w-full"
          onPress={clear}
        />
      </Card>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { getOrders, Order, updateOrderStatus, OrderStatus } from "../utils/orders";
import { Card } from "../components/ui";
import { brl } from "../utils/money";

function StatusChip({ status }: { status: OrderStatus }) {
  const styles =
    status === "aguardando"
      ? { wrap: "bg-yellow-100 border-yellow-300", text: "text-yellow-800" }
      : status === "preparo"
      ? { wrap: "bg-blue-100 border-blue-300", text: "text-blue-800" }
      : { wrap: "bg-green-100 border-green-300", text: "text-green-800" };

  const label =
    status === "aguardando" ? "Aguardando"
    : status === "preparo"  ? "Em preparo"
    : "Entregue";

  return (
    <View className={`px-2 py-1 rounded-xl border ${styles.wrap}`}>
      <Text className={`text-xs font-semibold ${styles.text}`}>{label}</Text>
    </View>
  );
}

export function OrdersScreen() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  async function reload() {
    const all = await getOrders();
    setOrders(all);
  }

  useEffect(() => {
    reload();
  }, []);

  if (!orders) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">Carregando...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-gray-500 text-center">
          Você ainda não tem pedidos.
        </Text>
      </View>
    );
  }

  //ações para simular avanço de status
  async function setStatus(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    await reload();
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-8">
      <Text className="text-2xl font-bold text-habilite-primary mb-4">Meus pedidos</Text>

      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Card>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-semibold">{item.id}</Text>
                  <StatusChip status={item.status} />
                </View>
                <Text className="text-gray-500">
                  {new Date(item.createdAt).toLocaleString()} • {item.payment.toUpperCase()}
                </Text>
                <Text className="text-gray-600 mt-1" numberOfLines={1}>
                  {item.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </Text>
              </View>

              <Text className="text-habilite-accent font-extrabold">
                {brl(item.total)}
              </Text>
            </View>

            {/* Ações de simulação (remova quando integrar a API) */}
            <View className="flex-row gap-2 mt-3">
              <Pressable
                onPress={() => setStatus(item.id, "aguardando")}
                className="px-3 py-2 rounded-xl border border-gray-300 bg-white active:opacity-80"
              >
                <Text className="text-gray-700 text-xs font-semibold">Aguardando</Text>
              </Pressable>
              <Pressable
                onPress={() => setStatus(item.id, "preparo")}
                className="px-3 py-2 rounded-xl border border-blue-300 bg-blue-50 active:opacity-80"
              >
                <Text className="text-blue-700 text-xs font-semibold">Em preparo</Text>
              </Pressable>
              <Pressable
                onPress={() => setStatus(item.id, "entregue")}
                className="px-3 py-2 rounded-xl border border-green-300 bg-green-50 active:opacity-80"
              >
                <Text className="text-green-700 text-xs font-semibold">Entregue</Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

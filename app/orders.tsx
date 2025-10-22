import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button } from "../src/components/ui";
import { getOrders } from "../src/utils/orders";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Payment = "pix" | "dinheiro" | "cartao";

type Order = {
  id: string;
  createdAt: number;
  customer: string;
  payment: Payment;
  total: number;
  items: OrderItem[];
  note?: string;
  status?: string | null;
};

// Paleta Habilite
const BRAND = {
  primary: "#731906",
  accent: "#da0000",
  peach:  "#FFDFB2",
};

type Status = "aguardando" | "preparando" | "finalizado";
type StatusInfo = { label: string; bg: string; fg: string };

const STATUS_STYLES: Record<Status, StatusInfo> = {
  aguardando: { label: "Aguardando", bg: "#FFDFB2", fg: "#731906" },
  preparando: { label: "Preparando", bg: "#FFE0E0", fg: "#DA0000" },
  finalizado: { label: "Finalizado", bg: "#E6F5E6", fg: "#166534" },
};

function normalizeStatus(s?: string | null): Status {
  if (!s) return "aguardando";
  const v = s.toLowerCase().trim();
  if (["lido", "novo", "recebido", "pendente"].includes(v)) return "aguardando";
  if (["processo", "em processo", "preparo", "preparando", "andamento"].includes(v)) return "preparando";
  if (["finalizado", "pronto", "concluido", "concluído"].includes(v)) return "finalizado";
  return "aguardando";
}

function formatBRL(n: number) {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  } catch {
    return `R$ ${n.toFixed(2)}`.replace(".", ",");
  }
}

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getOrders();
      const safe: Order[] = Array.isArray(list) ? list : [];
      const withStatus = safe.map(o => ({ ...o, status: normalizeStatus(o.status) }));
      setOrders([...withStatus].reverse()); // mais recentes primeiro
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View
        style={{
          backgroundColor: BRAND.primary,
          paddingHorizontal: 16,
          paddingTop: 44, // deixa respirando sob a status bar
          paddingBottom: 14,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="p-2 rounded-2xl bg-white/15 active:opacity-80"
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>

          <Text className="text-white text-xl font-extrabold">Meus pedidos</Text>

          <Pressable
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "Menu" }] })}
            className="px-3 py-2 rounded-2xl bg-white active:opacity-90"
          >
            <Text style={{ color: BRAND.accent }} className="font-bold">Menu</Text>
          </Pressable>
        </View>
      </View>

      {/* LISTA */}
      {loading && orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Carregando seus pedidos…</Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500 text-center">
            Você ainda não fez nenhum pedido.
          </Text>
          <Button
            title="Ir ao cardápio"
            className="mt-4"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "Menu" }] })}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          data={orders}
          keyExtractor={(o) => o.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => {
            const st = STATUS_STYLES[normalizeStatus(item.status)];
            return (
              <Card>
                {/* Topo: ID + Data + Status */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm text-gray-500">#{item.id}</Text>
                    <Text className="text-gray-400 text-xs">{formatDate(item.createdAt)}</Text>
                  </View>

                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: st.bg }}>
                    <Text className="text-xs font-bold" style={{ color: st.fg }}>
                      {st.label}
                    </Text>
                  </View>
                </View>

                {/* Itens */}
                <View className="mt-3">
                  {item.items.map((it) => (
                    <View
                      key={`${item.id}-${it.id}`}
                      className="flex-row items-center justify-between mb-1"
                    >
                      <Text className="text-gray-800">
                        {it.quantity}× {it.name}
                      </Text>
                      <Text className="text-gray-600">
                        {formatBRL(it.price * it.quantity)}
                      </Text>
                    </View>
                  ))}
                </View>

                {!!item.note && (
                  <View className="mt-2">
                    <Text className="text-xs text-gray-500">Obs.: {item.note}</Text>
                  </View>
                )}

                {/* Total */}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <Text className="font-semibold">Total</Text>
                  <Text className="font-extrabold">{formatBRL(item.total)}</Text>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

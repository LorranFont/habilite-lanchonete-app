import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Card, Button } from "../components/ui";
import { useCart } from "../context/cart";
import { brl } from "../utils/money";
import { getMenuCategories, MENU_ITEMS, MenuItem } from "../utils/menu";

type StoredUser = {
  nome: string;
  email: string;
};

export function MenuScreen({ navigation }: any) {
  const { addItem, totalQty, clear } = useCart();
  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    ReturnType<typeof getMenuCategories>[number]
  >("todos");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAllProducts(MENU_ITEMS);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const raw = await SecureStore.getItemAsync("user");
          if (!isActive) return;
          if (raw) {
            const stored: StoredUser = JSON.parse(raw);
            setUserName(stored.nome);
          } else {
            setUserName(null);
          }
        } catch (error) {
          setUserName(null);
        }
      })();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const categories = useMemo(
    () => getMenuCategories(allProducts),
    [allProducts]
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allProducts.filter((item) => {
      const matchesCategory =
        selectedCategory === "todos" || item.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, search, selectedCategory]);

  const handleAddToCart = useCallback(
    (product: MenuItem) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? "",
        quantity: 1,
        category: product.category,
      });

      Alert.alert(
        "Adicionado",
        `${product.name} foi adicionado ao carrinho ✅`
      );
    },
    [addItem]
  );

  const handleLogout = useCallback(() => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("user");
          clear();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  }, [clear, navigation]);

  if (loading) {
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
        <View>
          <Text className="text-sm text-gray-500">Bem-vindo{userName ? "," : ""}</Text>
          <Text className="text-2xl font-bold text-habilite-primary">
            {userName ?? "Aluno Habilite"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => navigation.navigate("Cart")}
            className="px-3 py-2 rounded-xl bg-habilite-accent active:opacity-90"
          >
            <Text className="text-black font-bold">Carrinho ({totalQty})</Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white active:opacity-80"
          >
            <Text className="text-sm font-semibold text-habilite-primary">
              Sair
            </Text>
          </Pressable>
        </View>
      </View>

      <Card className="mb-4">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por lanche, bebida ou sobremesa"
          placeholderTextColor="#9CA3AF"
          className="border border-gray-300 rounded-2xl px-4 py-3 bg-white"
        />
        <View className="flex-row flex-wrap gap-2 mt-4">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl border ${
                  isActive
                    ? "bg-habilite-accent border-habilite-accent"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <Text
                  className={
                    isActive
                      ? "text-black font-semibold"
                      : "text-gray-600 font-medium"
                  }
                >
                  {category === "todos"
                    ? "Todos"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {filtered.length === 0 ? (
        <Card className="items-center">
          <Text className="text-gray-500 text-center">
            Não encontramos itens com esses filtros. Tente outra busca.
          </Text>
        </Card>
      ) : (
        <View className="pb-10">
          {filtered.map((item) => (
            <Card key={item.id} className="mb-3">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 mt-1">{item.description}</Text>
                  <Text className="text-habilite-primary font-bold mt-2">
                    {brl(item.price)}
                  </Text>
                </View>
                <Button
                  title="Adicionar"
                  className="w-32"
                  onPress={() => handleAddToCart(item)}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

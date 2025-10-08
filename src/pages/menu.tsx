import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import { Card, Button } from "../components/ui";
import { useCart } from "../context/cart";
import { brl } from "../utils/money";
import { getMenuCategories, MENU_ITEMS, MenuItem } from "../utils/menu";

type StoredUser = { nome: string; email: string };

export function MenuScreen({ navigation }: any) {
  const { addItem, totalQty, clear } = useCart();

  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ReturnType<typeof getMenuCategories>[number]>("todos");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  // simula “carregar do servidor”
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAllProducts(MENU_ITEMS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  // pega o nome salvo (SecureStore) quando a tela volta ao foco
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
        } catch {
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
    const q = search.trim().toLowerCase();
    return allProducts.filter((item) => {
      const matchesCategory =
        selectedCategory === "todos" || item.category === selectedCategory;
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, search, selectedCategory]);

  const handleAddToCart = useCallback(
    (product: MenuItem) => {
      addItem({
        id: product.id, // MenuItem.id já é number no util
        name: product.name,
        price: product.price,
        image: product.image ?? "",
        quantity: 1,
        category: product.category,
      });
      Alert.alert("Adicionado", `${product.name} foi para o carrinho ✅`);
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
    <Text className="text-xs text-gray-500">
      Bem-vindo{userName ? "," : ""}
    </Text>
    <Text className="text-2xl font-extrabold text-habilite-primary">
      {userName ?? "Aluno Habilite"}
    </Text>
  </View>

  <View className="flex-row items-center gap-2">
    {/* Meus Pedidos */}
    <Pressable
      onPress={() => navigation.navigate("Orders")}
      className="p-2 rounded-2xl border border-gray-300 bg-white active:opacity-80"
    >
      <Ionicons name="document-text-outline" size={20} color="#111827" />
    </Pressable>

    {/* Carrinho */}
    <Pressable
      onPress={() => navigation.navigate("Cart")}
      className="relative p-2 rounded-2xl bg-habilite-accent active:opacity-90"
    >
      <Ionicons name="cart" size={22} color="#black" />
      {totalQty > 0 && (
        <View className="absolute -top-1 -right-1 bg-white rounded-full px-2 py-0.5">
          <Text className="text-habilite-accent text-xs font-extrabold">
            {totalQty}
          </Text>
        </View>
      )}
    </Pressable>
  </View>
</View>

      {/* Busca e categorias */}
      <View className="px-4 mt-3">
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
                      : "bg-white border-gray-300"
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

        {/* Lista de itens */}
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
                  {/* thumb opcional */}
                  {item.image ? (
                    <View className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 mr-3">
                      <Image
                        source={{
                          uri:
                            item.image?.trim() ||
                            "https://picsum.photos/seed/food/200/200",
                        }}
                        className="w-full h-full"
                      />
                    </View>
                  ) : null}

                  <View className="flex-1 pr-3">
                    <Text className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </Text>
                    {!!item.description && (
                      <Text className="text-gray-500 mt-1" numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
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
    </View>
  );
}

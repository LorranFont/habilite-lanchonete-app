import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Card, Button } from "../src/components/ui";
import { useCart } from "../src/context/cart";
import { brl } from "../src/utils/money";
import { getMenuCategories, MENU_ITEMS, MenuItem } from "../src/utils/menu";
import { ProductSheet } from "../src/components/ui/ProductSheet";


const HEADER_MAX = 120;
const HEADER_MIN = 90;
const HEADER_DELTA = HEADER_MAX - HEADER_MIN;

type StoredUser = { nome: string; email: string };

export function MenuScreen({ navigation }: any) {
  const { addItem, totalQty, clear, totalPrice } = useCart();

  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ReturnType<typeof getMenuCategories>[number]>("todos");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelected] = useState<MenuItem | null>(null);
  const openSheet = (item: MenuItem) => {
    setSelected(item);
    setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;

  const [barVisible, setBarVisible] = useState(false);
  const [lastAdded, setLastAdded] = useState<{ name: string; qty: number } | null>(null);
  const barY = useRef(new Animated.Value(100)).current;

  function bumpBadge() {
    Animated.sequence([
      Animated.timing(badgeScale, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  }

  function showBar(name: string, qty: number) {
    setLastAdded({ name, qty });
    setBarVisible(true);
    Animated.timing(barY, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }
  function hideBar() {
    Animated.timing(barY, { toValue: 100, duration: 180, useNativeDriver: true }).start(() => {
      setBarVisible(false);
      setLastAdded(null);
    });
  }

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
    (product: MenuItem, qty: number = 1) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image ?? "",
        quantity: 1,
        category: product.category,
      }, qty);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      bumpBadge();
      showBar(product.name, qty);
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_DELTA],
    outputRange: [HEADER_MAX, HEADER_MIN],
    extrapolate: "clamp",
  });
  const titleSize = scrollY.interpolate({
    inputRange: [0, HEADER_DELTA],
    outputRange: [22, 18],
    extrapolate: "clamp",
  });
  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_DELTA],
    outputRange: [0, 0.12],
    extrapolate: "clamp",
  });
  const headerBg = "rgb(115, 25, 6)";

  return (
    <View className="flex-1 bg-gray-50">
      <Animated.View
        style={{
          height: headerHeight,
          paddingHorizontal: 16,
          paddingTop: 40,
          paddingBottom: 12,
          backgroundColor: headerBg,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          shadowColor: "#000",
          shadowOpacity: (shadowOpacity as unknown as number) || 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/90 text-xs">
              Bem-vindo{userName ? "," : ""}
            </Text>
            <Animated.Text
              style={{ fontSize: titleSize, fontWeight: "800", color: "white" }}
            >
              {userName ?? "Aluno Habilite"}
            </Animated.Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => navigation.navigate("Orders")}
              className="p-2 rounded-2xl bg-white/20 active:opacity-80"
            >
              <Ionicons name="document-text-outline" size={20} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Cart")}
              className="relative p-2 rounded-2xl bg-white active:opacity-90"
            >
              <Ionicons name="cart" size={22} color="#e11d48" />
              {totalQty > 0 && (
                <Animated.View
                  style={{
                    transform: [{ scale: badgeScale }],
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor: "#da0000",
                    borderRadius: 9999,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                  }}
                >
                  <Text className="text-white text-xs font-extrabold">
                    {totalQty}
                  </Text>
                </Animated.View>
              )}
            </Pressable>

            <Pressable
              onPress={handleLogout}
              className="p-2 rounded-2xl bg-white/20 active:opacity-80"
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      <Animated.FlatList
        contentContainerStyle={{
          paddingTop: HEADER_MAX + 16,
          paddingHorizontal: 16,
          paddingBottom: 120,
        }}
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View className="h-3" />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <Card className="overflow-hidden">
            <Pressable
              onPress={() => openSheet(item)}
              className="flex-row gap-3"
            >
              {item.image ? (
                <View className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 mr-1.5">
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
                <Text
                  className="text-base font-semibold text-gray-800"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {!!item.description && (
                  <Text className="text-gray-500 mt-1" numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <Text className="text-habilite-primary font-extrabold mt-2">
                  {brl(item.price)}
                </Text>
              </View>

              <View className="justify-center">
                <Button
                  title="Adicionar"
                  className="px-4"
                  onPress={() => handleAddToCart(item, 1)}
                />
              </View>
            </Pressable>
          </Card>
        )}
        ListHeaderComponent={
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
                          : "text-habilite-primary"
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
        }
      />

      {barVisible && (
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 16,
            transform: [{ translateY: barY }],
          }}
        >
          <View className="mx-4 rounded-2xl bg-white border border-gray-200 shadow-lg p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm text-gray-500">
                  {lastAdded
                    ? `${lastAdded.qty}× ${lastAdded.name} adicionado`
                    : "Item adicionado"}
                </Text>
                <Text className="text-base font-extrabold text-habilite-primary">
                  Subtotal: {brl(totalPrice)}
                </Text>
              </View>

              <Pressable
                onPress={() => navigation.navigate("Cart")}
                className="px-4 py-3 rounded-2xl bg-habilite-accent active:opacity-90 mr-2"
              >
                <Text className="text-white font-bold">Ver carrinho</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Checkout")}
                className="px-4 py-3 rounded-2xl border border-gray-300 bg-white active:opacity-80"
              >
                <Text className="text-habilite-primary font-semibold">
                  Finalizar
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={hideBar}
              className="self-center mt-2 active:opacity-70"
            >
              <Text className="text-xs text-gray-400">Ocultar</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <ProductSheet
        visible={sheetOpen}
        item={selectedItem}
        onClose={closeSheet}
        onAdd={(quantity) => {
          if (selectedItem) {
            handleAddToCart(selectedItem, quantity);
            closeSheet();
          }
        }}
      />
    </View>
  );
}

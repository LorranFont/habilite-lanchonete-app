import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { Card, Button } from "../components/ui";
import { useCart } from "../context/cart";
import { brl } from "../utils/money";
import { getMenuCategories, MENU_ITEMS, MenuItem } from "../utils/menu";
import { ProductSheet } from "../components/ui/ProductSheet";

const HEADER_MAX = 120;
const HEADER_MIN = 90;
const HEADER_DELTA = HEADER_MAX - HEADER_MIN;

type StoredUser = { nome: string; email: string };

export function MenuScreen({ navigation }: any) {
  const { addItem, totalQty, clear } = useCart();

  const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<ReturnType<typeof getMenuCategories>[number]>("todos");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  // bottom sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelected] = useState<MenuItem | null>(null);
  const openSheet = (item: MenuItem) => {
    setSelected(item);
    setSheetOpen(true);
  };
  const closeSheet = () => setSheetOpen(false);

  // header anim
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const categories = useMemo(() => getMenuCategories(allProducts), [allProducts]);

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
        quantity: qty,
        category: product.category,
      });
      // Alerta só quando veio do botão rápido (não do sheet, que já fecha)
      if (qty === 1) {
        Alert.alert("Adicionado", `${product.name} foi para o carrinho ✅`);
      }
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

  // interpolations
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
  //cor DO HEADER
  const headerBg = "rgb(115, 25, 6)";

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER FIXO POR CIMA */}
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
                <View className="absolute -top-1 -right-1 bg-[#da0000] rounded-full px-2 py-0.5">
                  <Text className="text-white text-xs font-extrabold">
                    {totalQty}
                  </Text>
                </View>
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

      {/* LISTA DE ITEMS */}
      <Animated.FlatList
        contentContainerStyle={{
          paddingTop: HEADER_MAX + 16,
          paddingHorizontal: 16,
          paddingBottom: 32,
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
            <Pressable onPress={() => openSheet(item)} className="flex-row gap-3">
              {item.image ? (
                <View className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-200 mr-1.5">
                  <Image
                    source={{ uri: item.image?.trim() || "https://picsum.photos/seed/food/200/200" }}
                    className="w-full h-full"
                  />
                </View>
              ) : null}

              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
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
                        isActive ? "text-black font-semibold" : "text-habilite-primary"
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
        ListEmptyComponent={
          <Card className="items-center">
            <Text className="text-gray-500 text-center">
              Não encontramos itens com esses filtros. Tente outra busca.
            </Text>
          </Card>
        }
      />

      {/*RENDERIZA O BOTTOM SHEET */}
      <ProductSheet
        visible={sheetOpen}
        item={selectedItem}
        onClose={closeSheet}
        onAdd={(quantity) => selectedItem && handleAddToCart(selectedItem, quantity)}
      />
    </View>
  );
}

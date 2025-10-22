import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useCart } from "../src/context/cart";
import { Card, Button, Field } from "../src/components/ui";
import { brl } from "../src/utils/money";
import { genOrderId, saveOrder } from "../src/utils/orders";

// Paleta Habilite
const BRAND = {
  primary: "#731906", // vinho/terracota escuro
  accent:  "#da0000", // vermelho/coral
  peach:   "#FFDFB2", // suave
  pink:    "#FF8282",
  light:   "#FFCCCC",
};

type PaymentMethod = "pix" | "dinheiro" | "cartao";

export function CheckoutScreen({ navigation }: any) {
  const { items, totalQty, totalPrice, clear } = useCart();
  const [nome, setNome] = useState("");
  const [observacao, setObservacao] = useState("");
  const [pagamento, setPagamento] = useState<PaymentMethod | null>(null);
  const [enviando, setEnviando] = useState(false);

  function validate() {
    if (items.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione itens antes de finalizar.");
      return false;
    }
    if (!nome.trim()) {
      Alert.alert("Informe seu nome");
      return false;
    }
    if (!pagamento) {
      Alert.alert("Escolha um método de pagamento");
      return false;
    }
    return true;
  }

  async function handleConfirm() {
    if (!validate()) return;

    try {
      setEnviando(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const orderId = genOrderId();
      await saveOrder({
        id: orderId,
        createdAt: Date.now(),
        customer: nome.trim(),
        payment: pagamento!,
        total: totalPrice,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        note: observacao || undefined,
      });

      clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "Success", params: { orderId } }],
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* HEADER */}
      <View
        style={{
          backgroundColor: BRAND.primary,
          paddingHorizontal: 16,
          paddingTop: 44,
          paddingBottom: 14,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => navigation.goBack()}
            className="px-3 py-2 rounded-2xl bg-white/15 active:opacity-80"
          >
            <Text className="text-white font-semibold">Voltar</Text>
          </Pressable>
          <Text className="text-white text-xl font-extrabold">
            Finalizar pedido
          </Text>
          <View style={{ width: 64 }} />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Resumo do pedido */}
        <Card className="mb-4">
          <Text className="text-gray-700 font-semibold mb-3">Resumo</Text>
          {items.map((it) => (
            <View
              key={String(it.id)}
              className="flex-row items-center justify-between mb-2"
            >
              <Text className="text-gray-800">
                {it.quantity}× {it.name}
              </Text>
              <Text className="text-gray-600">
                {brl(it.price * it.quantity)}
              </Text>
            </View>
          ))}

          <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-gray-200">
            <Text className="font-semibold">Total ({totalQty} itens)</Text>
            <Text className="text-lg font-extrabold">{brl(totalPrice)}</Text>
          </View>
        </Card>

        {/* Dados do cliente */}
        <Card className="mb-4">
          <Text className="text-gray-700 font-semibold mb-3">
            Dados e observações
          </Text>

          <Field label="Seu nome">
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex.: Lorran"
              className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
            />
          </Field>

          <Field label="Observações (opcional)">
            <TextInput
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Ex.: Sem glúten, pouco gelo…"
              className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
            />
          </Field>
        </Card>

        {/* Pagamento (chips coloridos) */}
        <Card className="mb-2">
          <Text className="text-gray-700 font-semibold mb-3">
            Forma de pagamento
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {([
              { key: "pix",        label: "PIX",       bg: BRAND.accent, text: "#fff",    border: BRAND.accent },
              { key: "dinheiro",   label: "DINHEIRO",  bg: BRAND.pink,   text: "#fff",    border: BRAND.pink },
              { key: "cartao",     label: "CARTÃO",    bg: BRAND.light,  text: "#731906", border: BRAND.light },
            ] as const).map(({ key, label, bg, text, border }) => {
              const active = pagamento === (key as PaymentMethod);
              return (
                <Pressable
                  key={key}
                  onPress={() => setPagamento(key as PaymentMethod)}
                  className="px-4 py-2 rounded-2xl border"
                  style={{
                    backgroundColor: active ? bg : "#fff",
                    borderColor: active ? border : "#D1D5DB",
                  }}
                >
                  <Text
                    style={{
                      color: active ? text : "#111827",
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            title={enviando ? "Enviando..." : "Confirmar pedido"}
            onPress={handleConfirm}
            className="mt-4 w-full"
            loading={enviando}
            disabled={items.length === 0}
          />

          <Button
            title="Voltar ao carrinho"
            variant="outline"
            className="mt-3 w-full"
            onPress={() => navigation.goBack()}
          />
        </Card>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}

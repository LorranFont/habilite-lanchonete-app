import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCart } from "../context/cart";
import { Card, Button, Field, Title, Subtitle } from "../components/ui";
import { brl } from "../utils/money";

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
    if (!observacao.trim()) {
      Alert.alert("Informe uma observação");
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

      await new Promise((resolve) => setTimeout(resolve, 900));

      clear();
      Alert.alert("Pedido enviado 🎉", "Seu pedido foi recebido!", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Menu" }] }),
        },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-8">
      <View className="mb-4">
        <Title>Finalizar pedido</Title>
        <Subtitle>Revise seus itens e preencha os dados</Subtitle>
      </View>

      <Card className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3">Resumo do pedido</Text>
        {items.map((it) => (
          <View
            key={String(it.id)}
            className="flex-row items-center justify-between mb-2"
          >
            <Text className="text-gray-800">{it.quantity}× {it.name}</Text>
            <Text className="text-gray-600">{brl(it.price * it.quantity)}</Text>
          </View>
        ))}
        <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-gray-200">
          <Text className="font-semibold">Total ({totalQty} itens)</Text>
          <Text className="font-extrabold">{brl(totalPrice)}</Text>
        </View>
      </Card>

      <Card className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3">Dados do cliente e observações</Text>
        <Field label="Seu nome">
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Lorran"
            className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
          />
        </Field>

        <Field label="Observações">
          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Ex.: Sem glúten"
            className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
          />
        </Field>
      </Card>

      <Card>
        <Text className="text-gray-700 font-semibold mb-3">
          Forma de pagamento
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {(["pix", "dinheiro", "cartao"] as const).map((opt) => {
            const isActive = pagamento === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => setPagamento(opt)}
                className={`px-4 py-2 rounded-2xl border ${
                  isActive
                    ? "bg-habilite-accent border-habilite-accent"
                    : "bg- border-gray-300"
                }`}
              >
                <Text
                  className={
                    isActive
                      ? "text-black font-semibold"
                      : "text-habilite-primary"
                  }
                >
                  {opt.toUpperCase()}
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

      <View className="h-8" />
    </ScrollView>
  );
}

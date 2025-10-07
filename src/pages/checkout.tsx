import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useCart } from "../context/cart";
import { Card, Button, Field, Title, Subtitle } from "../components/ui";
import { brl } from "../utils/money";

export function CheckoutScreen({ navigation }: any) {
  const { items, totalQty, totalPrice, clear } = useCart();
  const [nome, setNome] = useState("");
  const [mesa, setMesa] = useState("");
  const [pagamento, setPagamento] = useState<"pix" | "dinheiro" | "cartao" | null>(null);
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
    if (!mesa.trim()) {
      Alert.alert("Informe o número da mesa / turma");
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

      //Aqui entraria a chamada de API real (POST pedido)

      // Simulação
      await new Promise((r) => setTimeout(r, 900));

      clear(); // limpa carrinho
      Alert.alert("Pedido enviado 🎉", "Seu pedido foi recebido!", [
        { text: "OK", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Menu" }] }) },
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

    //Resumo
      <Card className="mb-4">
        {items.map((it) => (
          <View key={String(it.id)} className="flex-row items-center justify-between mb-2">
            <Text className="text-gray-800">{it.quantity}× {it.name}</Text>
            <Text className="text-gray-600">{brl(it.price * it.quantity)}</Text>
          </View>
        ))}
        <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-gray-200">
          <Text className="font-semibold">Total ({totalQty} itens)</Text>
          <Text className="font-extrabold">{brl(totalPrice)}</Text>
        </View>
      </Card>

      //Dados do cliente 
      <Card className="mb-4">
        <Field label="Seu nome">
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex.: Lorran"
            className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
          />
        </Field>

        <Field label="Mesa / Turma">
          <TextInput
            value={mesa}
            onChangeText={setMesa}
            placeholder="Ex.: Mesa 4"
            className="border rounded-2xl px-4 py-3 bg-white border-gray-300"
          />
        </Field>
      </Card>

        //Pagamento
      <Card>
        <Text className="text-gray-700 mb-3">Forma de pagamento</Text>
        <View className="flex-row gap-2">
          {(["pix", "dinheiro", "cartao"] as const).map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setPagamento(opt)}
              className={`px-4 py-2 rounded-2xl border ${
                pagamento === opt ? "bg-habilite-accent border-habilite-accent" : "bg-white border-gray-300"
              }`}
            >
              <Text className={pagamento === opt ? "text-white font-semibold" : "text-habilite-primary"}>
                {opt.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          title={enviando ? "Enviando..." : "Confirmar pedido"}
          onPress={handleConfirm}
          className="mt-4"
          Loading={enviando}
        />

        <Button
          title="Voltar ao carrinho"
          variant="outline"
          className="mt-2"
          onPress={() => navigation.goBack()}
        />
      </Card>

      <View className="h-8" />
    </ScrollView>
  );
}

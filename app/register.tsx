import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Card, Field, Button } from "../src/components/ui";

const BRAND = {
  primary: "#731906",
  accent: "#da0000",
};

export default function Register({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string; cep?: string }>({});

  const headerY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.spring(headerY, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
  }, [headerY]);

  function validate() {
    const e: typeof erros = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório.";
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email inválido.";
    if (!senha.trim()) e.senha = "Senha é obrigatória.";
    else if (senha.length < 6) e.senha = "A senha deve ter pelo menos 6 caracteres.";
    if (!cep.trim()) e.cep = "CEP é obrigatório.";
    else if (!/^\d{5}-?\d{3}$/.test(cep.trim())) e.cep = "CEP inválido (formato: 12345-678).";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Persiste o usuário localmente para o fluxo de login
      const user = { nome: nome.trim(), email: email.trim().toLowerCase(), senha };
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      alert("Cadastro realizado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao criar conta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: "height" })}
      keyboardVerticalOffset={80}
      className="flex-1 bg-gray-50"
    >
      {/* Header curvado */}
      <Animated.View
        style={{
          transform: [{ translateY: headerY }],
          backgroundColor: BRAND.primary,
          paddingHorizontal: 20,
          paddingTop: 48,
          paddingBottom: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text className="text-white/90 text-xs">Bora começar 🚀</Text>
        <Text className="text-white text-2xl font-extrabold mt-1">Criar conta</Text>
      </Animated.View>

      <View className="flex-1 px-5 pt-6">
        <Card className="p-5">
          <Field label="Nome" error={erros.nome}>
            <TextInput
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (erros.nome) setErros((e) => ({ ...e, nome: undefined }));
              }}
              placeholder="Seu nome completo"
              className={`border rounded-2xl px-4 py-3 bg-white ${erros.nome ? "border-red-500" : "border-gray-300"}`}
            />
          </Field>

          <Field label="E-mail" error={erros.email}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (erros.email) setErros((e) => ({ ...e, email: undefined }));
              }}
              placeholder="voce@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className={`border rounded-2xl px-4 py-3 bg-white ${erros.email ? "border-red-500" : "border-gray-300"}`}
            />
          </Field>

          <Field label="Senha" error={erros.senha}>
            <View className={`flex-row items-center rounded-2xl px-4 border bg-white ${erros.senha ? "border-red-500" : "border-gray-300"}`}>
              <TextInput
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  if (erros.senha) setErros((e) => ({ ...e, senha: undefined }));
                }}
                placeholder="••••••••"
                secureTextEntry={!showPwd}
                className="flex-1 py-3"
              />
              <Pressable onPress={() => setShowPwd((s) => !s)} className="pl-3 py-2 active:opacity-80">
                <Text style={{ color: BRAND.accent }} className="font-semibold">
                  {showPwd ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </Field>

          <Field label="CEP" error={erros.cep}>
            <TextInput
              value={cep}
              onChangeText={(t) => {
                setCep(t);
                if (erros.cep) setErros((e) => ({ ...e, cep: undefined }));
              }}
              placeholder="12345-678"
              keyboardType="numeric"
              maxLength={9}
              className={`border rounded-2xl px-4 py-3 bg-white ${erros.cep ? "border-red-500" : "border-gray-300"}`}
            />
          </Field>

          <Button
            title={submitting ? "Criando..." : "Criar conta"}
            onPress={handleRegister}
            loading={submitting}
            className="mt-2"
          />

          <Pressable
            onPress={() => navigation.navigate("Login")}
            className="mt-3 rounded-2xl px-4 py-3 items-center border border-gray-300 active:opacity-80"
          >
            <Text className="text-gray-800 font-semibold">Já tenho conta</Text>
          </Pressable>
        </Card>

        <View className="mt-8 items-center">
          <Text className="text-gray-400 text-xs">Autoescola Habilite • Lanchonete</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

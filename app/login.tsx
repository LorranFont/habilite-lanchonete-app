import React, { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Animated } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Field, Card, Button } from "../src/components/ui";

const BRAND = { primary: "#731906", accent: "#da0000" };

type StoredUser = { nome: string; email: string; senha: string };

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const headerY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.spring(headerY, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
  }, []);

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email inválido.";
    if (!senha.trim()) e.senha = "Senha é obrigatória.";
    else if (senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const raw = await SecureStore.getItemAsync("user");
      if (!raw) {
        alert("Nenhum cadastro encontrado. Crie sua conta.");
        navigation.navigate("Register");
        return;
      }
      const saved: StoredUser = JSON.parse(raw);
      const ok = saved.email.trim().toLowerCase() === email.trim().toLowerCase() && saved.senha === senha;
      if (!ok) {
        alert("Credenciais inválidas. Confira seu e-mail e senha.");
        return;
      }
      await SecureStore.setItemAsync("user", JSON.stringify(saved));
      navigation.reset({ index: 0, routes: [{ name: "Menu" }] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: "height" })} keyboardVerticalOffset={80} className="flex-1 bg-gray-50">
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
        <Text className="text-white/90 text-xs">Bem-vindo de volta 👋</Text>
        <Text className="text-white text-2xl font-extrabold mt-1">Acesse sua conta</Text>
      </Animated.View>

      <View className="flex-1 px-5 pt-6">
        <Card className="p-5">
          <Field label="E-mail" error={errors.email}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              placeholder="voce@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className={`border rounded-2xl px-4 py-3 bg-white ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
          </Field>
          <Field label="Senha" error={errors.senha}>
            <View className={`flex-row items-center rounded-2xl px-4 border bg-white ${errors.senha ? "border-red-500" : "border-gray-300"}`}>
              <TextInput
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  if (errors.senha) setErrors((e) => ({ ...e, senha: undefined }));
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
          <Button title={submitting ? "Entrando..." : "Entrar"} onPress={handleLogin} loading={submitting} className="mt-2" />
          <Pressable onPress={() => navigation.navigate("Register")} className="mt-3 rounded-2xl px-4 py-3 items-center border border-gray-300 active:opacity-80">
            <Text className="text-gray-800 font-semibold">Criar conta</Text>
          </Pressable>
        </Card>
        <View className="mt-8 items-center">
          <Text className="text-gray-400 text-xs">Autoescola Habilite • Lanchonete</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

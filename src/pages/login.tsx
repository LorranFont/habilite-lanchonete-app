import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Card, Field, Button, Title, Subtitle } from "../components/ui";

type StoredUser = { nome: string; email: string; senha: string };

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Email inválido.";

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
        Alert.alert("Nenhum cadastro", "Crie sua conta para continuar.", [
          { text: "Cadastrar", onPress: () => navigation.navigate("Register") },
        ]);
        return;
      }

      const saved: StoredUser = JSON.parse(raw);
      const ok =
        saved.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        saved.senha === senha;

      if (!ok) {
        Alert.alert("Credenciais inválidas", "Confira seu e-mail e senha.");
        return;
      }

      await SecureStore.setItemAsync("user", JSON.stringify(saved));
      navigation.reset({ index: 0, routes: [{ name: "Menu" }] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      className="flex-1 bg-gray-50"
    >
      {/* Header simples com marca */}
      <View className="px-6 pt-16">
        <Title>Bem-vindo 👋</Title>
        <Subtitle>Acesse sua conta da lanchonete Habilite</Subtitle>
      </View>

      <View className="px-6 mt-6">
        <Card>
          {/* E-mail */}
          <Field label="E-mail" error={errors.email}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Field>

          {/* Senha */}
          <Field label="Senha" error={errors.senha}>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-white ${
                errors.senha ? "border-red-500" : "border-gray-300"
              }`}
            >
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
              <Pressable
                onPress={() => setShowPwd((s) => !s)}
                className="pl-3 py-2 active:opacity-80"
              >
                <Text className="text-habilite-accent font-semibold">
                  {showPwd ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </Field>

          {/* Ações */}
          <Pressable
            onPress={() => Alert.alert("Calma 😅", "Funcionalidade em breve.")}
            className="self-end mt-1"
          >
            <Text className="text-xs text-gray-500 underline">
              Esqueci minha senha
            </Text>
          </Pressable>

          <Button
            title={submitting ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            loading={submitting}
            className="mt-4 w-full"
          />

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-3 text-gray-400 text-xs">ou</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={() => navigation.navigate("Register")}
            className="w-full"
          />
        </Card>

        <View className="mt-8 items-center">
          <Text className="text-gray-400 text-xs">
            Autoescola Habilite • Lanchonete
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

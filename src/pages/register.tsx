import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Field, Card, Button } from "../components/ui";

// Paleta Habilite
const BRAND = {
  primary: "#731906",
  accent:  "#da0000",
};

type StoredUser = { nome: string; email: string; senha: string };

export function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmar?: string;
  }>({});

  // animação do header
  const headerY = React.useRef(new Animated.Value(20)).current;
  React.useEffect(() => {
    Animated.spring(headerY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, []);

  function validate() {
    const e: typeof errors = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório.";
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Email inválido.";
    if (!senha.trim()) e.senha = "Senha é obrigatória.";
    else if (senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    if (!confirmar.trim()) e.confirmar = "Confirmação é obrigatória.";
    else if (confirmar !== senha) e.confirmar = "As senhas não coincidem.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function checkEmailExists(emailCheck: string) {
    const raw = await SecureStore.getItemAsync("user");
    if (!raw) return false;
    try {
      const saved: StoredUser = JSON.parse(raw);
      return (
        saved.email.trim().toLowerCase() === emailCheck.trim().toLowerCase()
      );
    } catch {
      return false;
    }
  }

  async function handleRegister() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (await checkEmailExists(email)) {
        alert("Este e-mail já está cadastrado. Tente outro.");
        return;
      }
      const user: StoredUser = { nome, email, senha };
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: "Menu" }] });
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
        <Text className="text-white text-2xl font-extrabold mt-1">
          Criar conta
        </Text>
      </Animated.View>

      {/* Corpo */}
      <View className="flex-1 px-5 pt-6">
        <Card className="p-5">
          {/* Nome */}
          <Field label="Nome" error={errors.nome}>
            <TextInput
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (errors.nome) setErrors((e) => ({ ...e, nome: undefined }));
              }}
              placeholder="Seu nome"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                errors.nome ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Field>

          {/* Email */}
          <Field label="E-mail" error={errors.email}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="voce@email.com"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Field>

          {/* Senha */}
          <Field label="Senha" error={errors.senha}>
            <View
              className={`flex-row items-center rounded-2xl px-4 border bg-white ${
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
                <Text style={{ color: BRAND.accent }} className="font-semibold">
                  {showPwd ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </Field>

          {/* Confirmar senha */}
          <Field label="Confirmar senha" error={errors.confirmar}>
            <View
              className={`flex-row items-center rounded-2xl px-4 border bg-white ${
                errors.confirmar ? "border-red-500" : "border-gray-300"
              }`}
            >
              <TextInput
                value={confirmar}
                onChangeText={(t) => {
                  setConfirmar(t);
                  if (errors.confirmar)
                    setErrors((e) => ({ ...e, confirmar: undefined }));
                }}
                placeholder="••••••••"
                secureTextEntry={!showPwd2}
                className="flex-1 py-3"
              />
              <Pressable
                onPress={() => setShowPwd2((s) => !s)}
                className="pl-3 py-2 active:opacity-80"
              >
                <Text style={{ color: BRAND.accent }} className="font-semibold">
                  {showPwd2 ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </Field>

          {/* Botões */}
          <Button
            title={submitting ? "Criando..." : "Criar conta"}
            onPress={handleRegister}
            loading={submitting}
            className="mt-2"
          />

          <Pressable
            onPress={() => navigation.goBack()}
            className="mt-3 rounded-2xl px-4 py-3 items-center border border-gray-300 active:opacity-80"
          >
            <Text className="text-gray-800 font-semibold">Voltar ao login</Text>
          </Pressable>
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

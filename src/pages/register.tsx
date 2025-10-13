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

  async function emailExists() {
    const raw = await SecureStore.getItemAsync("user");
    if (!raw) return false;
    const saved: StoredUser = JSON.parse(raw);
    return saved.email.trim().toLowerCase() === email.trim().toLowerCase();
  }

  async function handleRegister() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (await emailExists()) {
        Alert.alert("Email já cadastrado", "Tente outro email.");
        return;
      }

      const user: StoredUser = { nome, email, senha };
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      Alert.alert("Conta criada 🎉", "Cadastro realizado com sucesso!");

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
      <View className="px-6 pt-16">
        <Title>Criar conta</Title>
        <Subtitle>Preencha seus dados para começar a pedir 🍔</Subtitle>
      </View>

      <View className="px-6 mt-6">
        <Card>
          <Field label="Nome completo" error={errors.nome}>
            <TextInput
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (errors.nome) setErrors((e) => ({ ...e, nome: undefined }));
              }}
              placeholder="Ex.: Lorran"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                errors.nome ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Field>

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
              className={`border rounded-2xl px-4 py-3 bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          </Field>

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

          <Field label="Confirmar senha" error={errors.confirmar}>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-white ${
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
                <Text className="text-habilite-accent font-semibold">
                  {showPwd2 ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>
          </Field>

          <Button
            title={submitting ? "Criando..." : "Criar conta"}
            onPress={handleRegister}
            loading={submitting}
            className="mt-4 w-full"
          />

          <Button
            title="Já tenho conta"
            variant="outline"
            onPress={() => navigation.navigate("Login")}
            className="mt-3 w-full"
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

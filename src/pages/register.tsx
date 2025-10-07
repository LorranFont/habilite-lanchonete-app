import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import {
  Field,
  Title,
  Subtitle,
  Button,
  Card,
  Caption,
} from "../components/ui";

type StoredUser = { nome: string; email: string; senha: string };

export function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [erros, setErros] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
    confirmar?: string;
  }>({});

  function validate() {
    const e: typeof erros = {};
    if (!nome.trim()) e.nome = "Informe seu nome.";
    if (!email.trim()) e.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "E-mail inválido.";
    if (!senha.trim()) e.senha = "Crie uma senha.";
    else if (senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    if (!confirmar.trim()) e.confirmar = "Confirme a senha.";
    else if (confirmar !== senha) e.confirmar = "As senhas não conferem.";
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const raw = await SecureStore.getItemAsync("user");
      if (raw) {
        const saved: StoredUser = JSON.parse(raw);
        if (saved.email.trim().toLowerCase() === email.trim().toLowerCase()) {
          Alert.alert("Email já cadastrado.", "Tente outro email.");
          return;
        }
      }

      const user: StoredUser = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
      };
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      Alert.alert("Cadastro realizado com sucesso!");
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
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="mb-10">
          <Title>Criar conta ✍️</Title>
          <Subtitle>Cadastre-se para pedir na lanchonete Habilite</Subtitle>
        </View>

        <Card>
          <Field label="Nome" error={erros.nome}>
            <TextInput
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (erros.nome) setErros((p) => ({ ...p, nome: undefined }));
              }}
              placeholder="Seu nome completo"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                erros.nome
                  ? "border-red-500"
                  : "border-gray-300 focus:border-habilite-accent"
              }`}
            />
          </Field>

          <Field label="E-mail" error={erros.email}>
            <TextInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (erros.email) setErros((p) => ({ ...p, email: undefined }));
              }}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className={`border rounded-2xl px-4 py-3 bg-white ${
                erros.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-habilite-accent"
              }`}
            />
          </Field>

          <Field label="Senha" error={erros.senha}>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-white ${
                erros.senha ? "border-red-500" : "border-gray-300"
              }`}
            >
              <TextInput
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  if (erros.senha)
                    setErros((p) => ({ ...p, senha: undefined }));
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

          <Field label="Confirmar senha" error={erros.confirmar}>
            <View
              className={`flex-row items-center border rounded-2xl px-4 bg-white ${
                erros.confirmar ? "border-red-500" : "border-gray-300"
              }`}
            >
              <TextInput
                value={confirmar}
                onChangeText={(t) => {
                  setConfirmar(t);
                  if (erros.confirmar)
                    setErros((p) => ({ ...p, confirmar: undefined }));
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
            title={submitting ? "Salvando..." : "Criar conta"}
            loading={submitting}
            onPress={handleRegister}
            className="mt-2 w-full"
          />

          <Button
            title="Já tem conta? Entrar"
            variant="outline"
            onPress={() => navigation.navigate("Login")}
            className="mt-3 w-full"
          />
        </Card>

        <View className="mt-8 items-center">
          <Caption>Autoescola Habilite • Lanchonete</Caption>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;

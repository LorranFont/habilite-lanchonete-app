import { useState } from "react";
import { View, Text, Button, Alert, TextInput, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

type StoreUser = {
  nome: string;
  email: string;
  senha: string;
};

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!email || !senha) {
      return Alert.alert("Por favor, preencha todos os campos.");
    }
    const raw = await SecureStore.getItemAsync("user");

    if (!raw) {
      return Alert.alert(
        "Nenhum usuário cadastrado",
        "Por favor, cadastre-se primeiro.",
        [
          {
            text: "Cadastrar",
            onPress: () => navigation.navigate("Register"),
          },
        ]
      );
    }

    const user: StoreUser = JSON.parse(raw);

    if (user.email !== email || user.senha !== senha) {
      return Alert.alert("Email ou senha incorretos.");
    }

    await SecureStore.setItemAsync("user", JSON.stringify(user));
    navigation.reset({
      index: 0,
      routes: [{ name: "Carrinho" }],
    });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Login</Text>

      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text>Senha:</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite sua senha"
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleLogin} />

      <View style={{ marginTop: 12 }} />
      <Button
        title="Não tem conta? Cadastre-se"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});

import { useState } from "react";
import { View, Text, Button, Alert, TextInput, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

export function RegisterScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      return Alert.alert("Ops", "Preencha todos os campos");
    }

    const user = { nome, email, senha };

    await SecureStore.setItemAsync("user", JSON.stringify(user));
    Alert.alert("Cadastro realizado com sucesso!");

    navigation.reset({
      index: 0,
      routes: [{ name: "Menu" }],
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Registro do Aluno
      </Text>

      <Text>Nome:</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
        style={styles.input}
      />

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

      <Button title="Salvar Registro" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});

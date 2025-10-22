import React, { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Animated, Easing, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import * as SecureStore from "expo-secure-store";

const BRAND = {
  primary: "#731906",
  accent:  "#da0000",
  peach:   "#FFDFB2",
};

const MIN_SPLASH_MS = 1200;

export default function Index({ navigation }: any) {

  const fadeIn  = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const bounce  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [fadeIn, bounce]);

  useEffect(() => {
    const start = Date.now();
    const elapsed = () => Date.now() - start;
    const wait = () => Math.max(0, MIN_SPLASH_MS - elapsed());

    const timeout = setTimeout(() => {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      });
    }, wait());

    return () => clearTimeout(timeout);
  }, [fadeOut]);

  const scale = bounce.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.07],
  });

  return (
    <LinearGradient
      colors={[BRAND.primary, BRAND.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: Animated.multiply(fadeIn, fadeOut),
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale }],
            width: 110,
            height: 110,
            borderRadius: 28,
            backgroundColor: "rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 28 }}>H</Text>
        </Animated.View>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800" }}>
          Habilite Lanchonete
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 6, fontSize: 13 }}>
          Saúde • Confiança • Evolução
        </Text>
        <View style={{ alignItems: "center", marginTop: 24 }}>
          <ActivityIndicator size="small" color={BRAND.peach} />
          <Text style={{ color: "rgba(255,255,255,0.8)", marginTop: 8, fontSize: 12 }}>
            preparando seu cardápio…
          </Text>
        </View>
      </Animated.View>
      <View
        style={{
          paddingBottom: 24,
          paddingTop: 12,
          alignItems: "center",
          opacity: 0.9,
        }}
      >
        <View
          style={{
            width: 90,
            height: 4,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />
      </View>
    </LinearGradient>
  );
}

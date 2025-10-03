import React, { ReactNode } from "react";
import { Text } from "react-native";

export function Title({ children }: { children: ReactNode }) {
  return <Text className="text-3xl font-extrabold text-habilite-primary">{children}</Text>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text className="text-gray-500 mt-1">{children}</Text>;
}

export function Caption({ children }: { children: ReactNode }) {
  return <Text className="text-gray-400 text-xs">{children}</Text>;
}

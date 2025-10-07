import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-semibold mb-2">{label}</Text>
      {children}
      {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
    </View>
  );
}

export default Field;

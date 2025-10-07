import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "outline";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const isDisabled = loading || disabled;

  const base =
    "rounded-2xl px-4 py-3 border active:opacity-80 items-center justify-center";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: isDisabled
      ? "bg-gray-300 border-gray-300"
      : "bg-habilite-accent border-habilite-accent",
    outline: "bg-white border-gray-300",
  };

  const textStyles: Record<ButtonVariant, string> = {
    primary: "text-black font-bold",
    outline: "text-habilite-primary font-semibold",
  };

  return (
    <Pressable
      className={`${base} ${variantStyles[variant]} ${className}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#111827" : "#000"} />
      ) : (
        <Text className={textStyles[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}

export default Button;

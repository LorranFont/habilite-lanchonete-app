import { ReactNode } from "react";
import { View } from "react-native";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </View>
  );
}

export default Card;

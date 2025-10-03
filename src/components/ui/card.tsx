import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </View>
  );
}

export default Card;

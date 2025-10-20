import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from "react-native";
import { MenuItem } from "../../utils/menu";
import { Button } from "./../ui";
import { brl } from "../../utils/money";

type Props = {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (qty: number) => void;
};

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = Math.min(480, SCREEN_H * 0.5); // altura máxima da folha
const OPEN_Y = 0;                                // totalmente aberta
const CLOSED_Y = SHEET_H + 10;                        // fora da tela
const CLOSE_THRESHOLD = SHEET_H * 0.35;          // arrastou mais que isso → fecha

export function ProductSheet({ visible, item, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const translateY = useRef(new Animated.Value(CLOSED_Y)).current; // começa fechado
  const backdrop = useRef(new Animated.Value(0)).current;           // 0 = invisível, 1 = visível

  // pan de arrastar
  const pan = useRef(new Animated.Value(0)).current;
  const dragY = useRef(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset(dragY.current);
          pan.setValue(0);
        },
        onPanResponderMove: (_evt, gesture) => {
          // só arrasta pra baixo (dy > 0)
          const next = Math.max(0, gesture.dy);
          pan.setValue(next);
        },
        onPanResponderRelease: (_evt, gesture) => {
          pan.flattenOffset();
          const finalY = gesture.dy;
          const shouldClose = finalY > CLOSE_THRESHOLD || gesture.vy > 1.2;
          if (shouldClose) {
            // fecha
            Animated.parallel([
              Animated.timing(backdrop, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
              }),
              Animated.spring(translateY, {
                toValue: CLOSED_Y,
                useNativeDriver: true,
                overshootClamping: true,
                bounciness: 0,
              }),
            ]).start(() => {
              dragY.current = 0;
              pan.setValue(0);
              onClose();
            });
          } else {
            // volta pra aberta
            Animated.spring(translateY, {
              toValue: OPEN_Y,
              useNativeDriver: true,
              bounciness: 6,
            }).start(() => {
              dragY.current = 0;
              pan.setValue(0);
            });
          }
        },
      }),
    [backdrop, onClose, pan, translateY]
  );

  // posição efetiva = translateY + pan (arraste)
  const sheetY = Animated.add(translateY, pan).interpolate({
    inputRange: [0, CLOSED_Y],
    outputRange: [0, CLOSED_Y],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (visible && item) {
      setQty(1);
      dragY.current = 0;
      pan.setValue(0);
      // abre com spring + fade no backdrop
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: OPEN_Y,
          useNativeDriver: true,
          bounciness: 6,
        }),
      ]).start();
    } else {
      // ao fechar por prop
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: CLOSED_Y,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dragY.current = 0;
        pan.setValue(0);
      });
    }
  }, [visible, item, backdrop, translateY, pan]);

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          opacity: backdrop,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -40,
          transform: [{ translateY: sheetY }],
        }}
      >
        <View
          className="bg-white rounded-t-3xl p-5 border-t border-gray-100"
          style={{
            height: SHEET_H,
            paddingBottom: Platform.OS === "ios" ? 24 : 12,
          }}
        >
          {/* puxador */}
          <View className="items-center mb-2">
            <View className="w-12 h-1.5 rounded-full bg-gray-300" />
          </View>

          {/* header com imagem */}
          <View className="flex-row gap-3">
            <View className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200">
              <Image
                source={{
                  uri:
                    item.image?.trim() ||
                    "https://picsum.photos/seed/food/300/300",
                }}
                className="w-full h-full"
              />
            </View>

            <View className="flex-1">
              <Text
                className="text-lg font-extrabold text-habilite-primary"
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text className="text-gray-500 mt-1">
                {item.category ? `${item.category} • ` : ""}
                {brl(item.price)}
              </Text>
            </View>
          </View>

          {/* descrição */}
          {!!item.description && (
            <Text className="text-gray-600 mt-4">{item.description}</Text>
          )}

          {/* quantidade */}
          <View className="flex-row items-center justify-between mt-14">
            <Text className="text-gray-700 font-semibold">Quantidade</Text>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-2xl bg-gray-200 items-center justify-center active:opacity-80"
              >
                <Text className="text-lg">−</Text>
              </Pressable>
              <Text className="w-8 text-center font-bold text-lg">{qty}</Text>
              <Pressable
                onPress={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-2xl bg-gray-200 items-center justify-center active:opacity-80"
              >
                <Text className="text-lg">＋</Text>
              </Pressable>
            </View>
          </View>

          {/* ações */}
          <View className="mt-5 flex-row  items-center">
            <Text className="text-xl font-extrabold text-habilite-primary">
              {brl(item.price * qty)}
            </Text>

            <View className="flex-1" />
            <Button
              title="Adicionar"
              className="flex-1"
              onPress={() => {
                onAdd(qty);
              }}
            />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/pages/home";
import { LoginScreen } from "./src/pages/login";
import { RegisterScreen } from "./src/pages/register";
import { MenuScreen } from "./src/pages/menu";
import { CartScreen } from "./src/pages/cart";
import { CheckoutScreen } from "./src/pages/checkout";
import { SuccessScreen } from "./src/pages/success";
import { OrdersScreen } from "./src/pages/orders";
import { CartProvider } from "./src/context/cart";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Menu: undefined;
  Cart: undefined;
  Checkout: undefined;
  Success: { orderId?: string } | undefined;
  Orders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right", // transição padrão
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          {/* Telas modais (subindo de baixo) */}
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{ presentation: "containedModal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen
            name="Success"
            component={SuccessScreen}
            options={{ presentation: "containedModal", animation: "fade" }}
          />
          <Stack.Screen name="Orders" component={OrdersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

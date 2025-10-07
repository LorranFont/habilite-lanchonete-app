import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

export type CartItem = Product & { quantity: number };

type CartState = { items: Record<string, CartItem> };

type Action =
  | { type: "add"; payload: Product }
  | { type: "inc"; payload: { id: string } }
  | { type: "dec"; payload: { id: string } }
  | { type: "remove"; payload: { id: string } }
  | { type: "clear" };

const CartContext = createContext<{
  items: CartItem[];
  totalQty: number;
  totalPrice: number;
  addItem: (p: Product) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
} | null>(null);

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const p = action.payload;
      const key = String(p.id);
      const existing = state.items[key];
      const qty = existing ? existing.quantity + 1 : 1;
      return { items: { ...state.items, [key]: { ...p, quantity: qty } } };
    }
    case "inc": {
      const { id } = action.payload;
      const it = state.items[id];
      if (!it) return state;
      return { items: { ...state.items, [id]: { ...it, quantity: it.quantity + 1 } } };
    }
    case "dec": {
      const { id } = action.payload;
      const it = state.items[id];
      if (!it) return state;
      const next = it.quantity - 1;
      if (next <= 0) {
        const { [id]: _drop, ...rest } = state.items;
        return { items: rest };
      }
      return { items: { ...state.items, [id]: { ...it, quantity: next } } };
    }
    case "remove": {
      const { id } = action.payload;
      const { [id]: _drop, ...rest } = state.items;
      return { items: rest };
    }
    case "clear":
      return { items: {} };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: {} });

  const api = useMemo(() => {
    const items = Object.values(state.items);
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      items,
      totalQty,
      totalPrice,
      addItem: (p: Product) => dispatch({ type: "add", payload: p }),
      inc: (id: string) => dispatch({ type: "inc", payload: { id } }),
      dec: (id: string) => dispatch({ type: "dec", payload: { id } }),
      remove: (id: string) => dispatch({ type: "remove", payload: { id } }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider />");
  return ctx;
}

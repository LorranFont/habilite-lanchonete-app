import * as SecureStore from "expo-secure-store";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "lido" | "processo" | "finalizado";

export type Order = {
  id: string;
  createdAt: number;
  customer: string;
  total: number;
  payment: "pix" | "dinheiro" | "cartao";
  items: OrderItem[];
  note?: string;
  status?: OrderStatus;
};

const ORDERS_KEY = "orders";

/** Gera um ID curto e único pro pedido */
export function genOrderId(): string {
  const rand = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${Date.now().toString().slice(-6)}-${rand}`;
}

/** Lê todos os pedidos armazenados */
export async function getOrders(): Promise<Order[]> {
  try {
    const raw = await SecureStore.getItemAsync(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    // garante array válido
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Salva (acrescenta) um novo pedido ao armazenamento */
export async function saveOrder(order: Order): Promise<void> {
  const all = await getOrders();
  all.push(order);
  await SecureStore.setItemAsync(ORDERS_KEY, JSON.stringify(all));
}

/** Atualiza o status de um pedido */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const all = await getOrders();
  const idx = all.findIndex((o) => o.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    await SecureStore.setItemAsync(ORDERS_KEY, JSON.stringify(all));
  }
}

/** (Opcional) Limpa todos os pedidos — útil em testes */
export async function clearOrders() {
  await SecureStore.deleteItemAsync(ORDERS_KEY);
}

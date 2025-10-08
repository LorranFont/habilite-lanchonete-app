import * as SecureStore from "expo-secure-store";

export type OrderStatus = "aguardando" | "preparo" | "entregue";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: number;
  customer: string;
  payment: "pix" | "dinheiro" | "cartao";
  total: number;
  items: OrderItem[];
  note?: string;
  status: OrderStatus;    
};

const KEY = "orders";

export async function getOrders(): Promise<Order[]> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw) as Order[];
    // retrocompatibilidade: se não tiver status, marca "aguardando"
    return arr.map(o => ({ ...o, status: (o as any).status ?? "aguardando" }));
  } catch {
    return [];
  }
}

export async function saveOrder(o: Order) {
  const all = await getOrders();
  all.unshift(o);
  await SecureStore.setItemAsync(KEY, JSON.stringify(all));
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const all = await getOrders();
  const idx = all.findIndex(o => o.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], status };
  await SecureStore.setItemAsync(KEY, JSON.stringify(all));
}

export function genOrderId() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  return `HAB-${stamp}`;
}

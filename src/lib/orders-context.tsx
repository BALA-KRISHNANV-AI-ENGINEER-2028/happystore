import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type OrderStatus = "placed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
}

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  method: "delivery" | "pickup";
  address?: string;
  placedAt: string; // ISO timestamp
  etaMinutes: number;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt" | "status">) => Order;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
}

const STORAGE_KEY = "happystore-orders";
const OrdersContext = createContext<OrdersContextValue | null>(null);

function seedOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "ES-10482",
      shopId: "corner-market",
      shopName: "Corner Market",
      items: [
        { productId: "milk-1gal", name: "Organic Whole Milk, 1 Gal", price: 4.29, quantity: 1 },
        { productId: "eggs-dozen", name: "Cage-Free Eggs, Dozen", price: 5.49, quantity: 1 },
        { productId: "sourdough-loaf", name: "Sea Salt Sourdough", price: 5.0, quantity: 2 },
      ],
      subtotal: 19.78,
      deliveryFee: 0,
      tax: 1.58,
      total: 21.36,
      status: "on_the_way",
      method: "delivery",
      address: "214 Maple Street, Springfield",
      placedAt: new Date(now - 1000 * 60 * 22).toISOString(),
      etaMinutes: 8,
    },
    {
      id: "ES-10471",
      shopId: "green-leaf-pharmacy",
      shopName: "Green Leaf Pharmacy",
      items: [
        { productId: "allergy-relief", name: "Allergy Relief, 30ct", price: 12.99, quantity: 1 },
        { productId: "vitamin-d3", name: "Vitamin D3, 90ct", price: 9.49, quantity: 1 },
      ],
      subtotal: 22.48,
      deliveryFee: 3.99,
      tax: 1.8,
      total: 28.27,
      status: "delivered",
      method: "delivery",
      address: "214 Maple Street, Springfield",
      placedAt: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
      etaMinutes: 0,
    },
    {
      id: "ES-10460",
      shopId: "rivera-bakery",
      shopName: "Rivera Bakery",
      items: [
        { productId: "sourdough-loaf", name: "Sourdough Loaf", price: 6.5, quantity: 1 },
        { productId: "croissant-4pk", name: "Croissant, 4-pack", price: 7.2, quantity: 1 },
      ],
      subtotal: 13.7,
      deliveryFee: 0,
      tax: 1.1,
      total: 14.8,
      status: "cancelled",
      method: "pickup",
      placedAt: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString(),
      etaMinutes: 0,
    },
  ];
}

function readStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    // fall through to seed
  }
  return seedOrders();
}

let orderCounter = 10483;

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(readStoredOrders);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((input: Omit<Order, "id" | "placedAt" | "status">) => {
    const order: Order = {
      ...input,
      id: `ES-${orderCounter++}`,
      status: "placed",
      placedAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    return order;
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const cancelOrder = useCallback((id: string) => {
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  }, []);

  const value = useMemo(
    () => ({ orders, addOrder, getOrder, cancelOrder }),
    [orders, addOrder, getOrder, cancelOrder],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}

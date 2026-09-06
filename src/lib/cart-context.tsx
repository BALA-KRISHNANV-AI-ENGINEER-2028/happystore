import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  shopId: string;
  shopName: string;
  price: number;
  unit?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const STORAGE_KEY = "happystore-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);
      if (existing) {
        return current.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...current, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((i) => i.productId !== productId)
        : current.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function groupCartByShop(items: CartItem[]) {
  const groups = new Map<string, { shopName: string; items: CartItem[] }>();
  for (const item of items) {
    const group = groups.get(item.shopId);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(item.shopId, { shopName: item.shopName, items: [item] });
    }
  }
  return Array.from(groups.entries()).map(([shopId, group]) => ({ shopId, ...group }));
}

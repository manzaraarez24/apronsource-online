import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

export interface CartItem {
    product: Product;
    quantity: number;
    size?: string;
}

// The same product in two sizes is two separate cart lines
export const getCartKey = (item: { product: Product; size?: string }) => `${item.product.id}::${item.size || ""}`;

export const WHOLESALE_MIN_QTY = 50;
const minQtyFor = (product: Product) => (product.salesType === "Wholesale" ? WHOLESALE_MIN_QTY : 1);

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, qty?: number, size?: string) => void;
    updateCartQty: (cartKey: string, qty: number) => void;
    removeFromCart: (cartKey: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "zarrks_cart";

const loadCart = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        // Drop anything malformed (e.g. from an older version of the site)
        return Array.isArray(parsed)
            ? parsed.filter((i) => i && i.product && i.product.id !== undefined && Number(i.quantity) > 0)
            : [];
    } catch {
        return [];
    }
};

const saveCart = (cart: CartItem[]) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
        // localStorage full or unavailable
    }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(loadCart);

    // Persist to localStorage on every change
    useEffect(() => {
        saveCart(cart);
    }, [cart]);

    // The cart stores a copy of each product from when it was added. Keep it in step with the
    // live catalogue so customers can't check out at an old price or buy a removed product.
    const { products: liveProducts, isLive } = useProducts();
    useEffect(() => {
        if (!isLive) return; // demo fallback (offline/empty DB) — don't touch the cart
        setCart((prev) => {
            let changed = false;
            const next = prev.flatMap((item) => {
                const live = liveProducts.find((p) => String(p.id) === String(item.product.id));
                if (!live || live.status === "draft" || live.status === "deleted") {
                    changed = true;
                    return [];
                }
                if (live !== item.product && JSON.stringify(live) !== JSON.stringify(item.product)) {
                    changed = true;
                    return [{ ...item, product: live }];
                }
                return [item];
            });
            return changed ? next : prev;
        });
    }, [liveProducts, isLive]);

    const addToCart = (product: Product, qty = 1, size?: string) => {
        const finalQty = Math.max(minQtyFor(product), Math.floor(qty) || 0);
        const key = getCartKey({ product, size });

        setCart((prev) => {
            const existing = prev.find((i) => getCartKey(i) === key);
            if (existing) {
                return prev.map((i) =>
                    getCartKey(i) === key ? { ...i, product, quantity: i.quantity + finalQty } : i
                );
            }
            return [...prev, { product, quantity: finalQty, size }];
        });
    };

    const updateCartQty = (cartKey: string, qty: number) => {
        setCart((prev) =>
            prev.flatMap((i) => {
                if (getCartKey(i) !== cartKey) return [i];
                if (qty <= 0) return [];
                // Wholesale lines can't drop below the minimum order quantity
                return [{ ...i, quantity: Math.max(minQtyFor(i.product), Math.floor(qty)) }];
            })
        );
    };

    const removeFromCart = (cartKey: string) => {
        setCart((prev) => prev.filter((i) => getCartKey(i) !== cartKey));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
};

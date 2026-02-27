import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    updateCartQty: (productId: number | string, qty: number) => void;
    removeFromCart: (productId: number | string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "zarrks_cart";

const loadCart = (): CartItem[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
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

    const addToCart = (product: Product, qty = 1) => {
        // If wholesale quick-add with default qty 1, bump to minimum 50
        const finalQty = product.salesType === "Wholesale" && qty === 1 ? 50 : qty;

        setCart((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + finalQty } : i
                );
            }
            return [...prev, { product, quantity: finalQty }];
        });
    };

    const updateCartQty = (productId: number | string, qty: number) => {
        if (qty <= 0) {
            setCart((prev) => prev.filter((i) => i.product.id !== productId));
            return;
        }
        setCart((prev) =>
            prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
        );
    };

    const removeFromCart = (productId: number | string) => {
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
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

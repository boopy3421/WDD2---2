import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'wdd2_cart';

const getInitialCart = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(getInitialCart);

    const saveCart = (nextItems) => {
        setItems(nextItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    };

    const addToCart = (product) => {
        const existing = items.find((item) => item._id === product._id);
        if (existing) {
            const updated = items.map((item) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
            saveCart(updated);
            return;
        }

        saveCart([...items, { ...product, quantity: 1 }]);
    };

    const updateQuantity = (productId, quantity) => {
        const normalizedQty = Math.max(1, Number(quantity) || 1);
        const updated = items.map((item) =>
            item._id === productId ? { ...item, quantity: normalizedQty } : item
        );
        saveCart(updated);
    };

    const removeFromCart = (productId) => {
        saveCart(items.filter((item) => item._id !== productId));
    };

    const clearCart = () => {
        saveCart([]);
    };

    const totalPrice = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const totalItems = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            totalPrice,
            totalItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
        }),
        [items, totalPrice, totalItems]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

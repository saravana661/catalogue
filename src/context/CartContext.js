import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
  };

  const updatePrefs = (id, field, value) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, p) => sum + p.qty, 0);

  const cartTotal = cart.reduce(
    (sum, p) => sum + parseFloat(p.rate || 0) * p.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        updatePrefs,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
import React, { createContext, useState, useContext, useEffect } from "react";
import { persistItems } from "../utils/storage";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("wishlistItems");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist([]);
      }
    }
  }, []);

  useEffect(() => {
    persistItems("wishlistItems", wishlist);
  }, [wishlist]);

  const isLiked = (id) => wishlist.some((p) => p.id === id);

  const toggleLike = (item) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === item.id)
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item]
    );
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, isLiked, toggleLike, wishlistCount }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
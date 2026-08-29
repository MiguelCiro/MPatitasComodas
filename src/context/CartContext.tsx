import { createContext } from "react";

import { Product } from "@/types/product";

export type CartItem = Product & {
  color: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    product: Product,
    color: string,
    quantity?: number
  ) => void;

  removeFromCart: (
    id: number,
    color: string
  ) => void;

  increaseQuantity: (
    id: number,
    color: string
  ) => void;

  decreaseQuantity: (
    id: number,
    color: string
  ) => void;

  clearCart: () => void;

  totalItems: number;

  subtotal: number;

  isCartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;
};

export const CartContext =
  createContext<CartContextType>({
    cart: [],

    addToCart: () => {},

    removeFromCart: () => {},

    increaseQuantity: () => {},

    decreaseQuantity: () => {},

    clearCart: () => {},

    totalItems: 0,

    subtotal: 0,

    isCartOpen: false,

    openCart: () => {},

    closeCart: () => {},
  });
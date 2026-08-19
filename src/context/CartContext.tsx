import { createContext } from "react";

import { Product } from "@/types/product";

export type CartItem = Product & {
  size: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    product: Product,
    size: number,
    quantity?: number
  ) => void;

  removeFromCart: (
    id: number,
    size: number
  ) => void;

  increaseQuantity: (
    id: number,
    size: number
  ) => void;

  decreaseQuantity: (
    id: number,
    size: number
  ) => void;

  clearCart: () => void;

  totalItems: number;

  subtotal: number;

  isCartOpen: boolean;

  openCart: () => void;

  closeCart: () => void;
};

export const CartContext = createContext<CartContextType>({
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
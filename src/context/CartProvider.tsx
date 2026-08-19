"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CartContext,
  CartItem,
} from "./CartContext";

import { Product } from "@/types/product";

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // =====================================
  // Cargar carrito
  // =====================================

  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // =====================================
  // Guardar carrito
  // =====================================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // =====================================
  // Drawer
  // =====================================

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  // =====================================
  // Agregar producto
  // =====================================

  function addToCart(
  product: Product,
  size: number,
  quantity: number = 1
) {
  if (!size) {
    alert("Selecciona una talla.");
    return;
  }

  if (quantity < 1) {
    return;
  }

  setCart((currentCart) => {
    const existingProduct = currentCart.find(
      (item) =>
        item.id === product.id &&
        item.size === size
    );

    if (existingProduct) {
      const newQuantity =
        existingProduct.quantity + quantity;

      if (newQuantity > product.stock) {
        alert(
          `Solo hay ${product.stock} unidades disponibles.`
        );

        return currentCart;
      }

      return currentCart.map((item) =>
        item.id === product.id &&
        item.size === size
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      );
    }

    if (quantity > product.stock) {
      alert(
        `Solo hay ${product.stock} unidades disponibles.`
      );

      return currentCart;
    }

    return [
      ...currentCart,
      {
        ...product,
        size,
        quantity,
      },
    ];
  });

  openCart();
}

  // =====================================
  // Eliminar producto
  // =====================================

  function removeFromCart(
    id: number,
    size: number
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  }

  // =====================================
  // Aumentar cantidad
  // =====================================

  function increaseQuantity(
    id: number,
    size: number
  ) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id === id &&
          item.size === size
        ) {
          if (
            item.quantity >= item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity:
              item.quantity + 1,
          };
        }

        return item;
      })
    );
  }

  // =====================================
  // Disminuir cantidad
  // =====================================

  function decreaseQuantity(
    id: number,
    size: number
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id &&
          item.size === size
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  }

  // =====================================
  // Vaciar carrito
  // =====================================

  function clearCart() {
    setCart([]);
  }

  // =====================================
  // Total de productos
  // =====================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );
  }, [cart]);

  // =====================================
  // Subtotal
  // =====================================

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc +
        item.price * item.quantity,
      0
    );
  }, [cart]);

  // =====================================
  // Provider
  // =====================================

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        totalItems,

        subtotal,

        isCartOpen,

        openCart,

        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
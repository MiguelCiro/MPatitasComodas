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
  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // =====================================
  // CARGAR CARRITO
  // =====================================

  useEffect(() => {
    const savedCart =
      localStorage.getItem("cart");

    if (!savedCart) {
      return;
    }

    try {
      const parsedCart =
        JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      }
    } catch (error) {
      console.error(
        "Error cargando carrito:",
        error
      );

      localStorage.removeItem("cart");
    }
  }, []);

  // =====================================
  // GUARDAR CARRITO
  // =====================================

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // =====================================
  // ABRIR CARRITO
  // =====================================

  function openCart() {
    setIsCartOpen(true);
  }

  // =====================================
  // CERRAR CARRITO
  // =====================================

  function closeCart() {
    setIsCartOpen(false);
  }

  // =====================================
  // AGREGAR AL CARRITO
  // =====================================

  function addToCart(
    product: Product,
    color: string,
    quantity: number = 1
  ) {
    if (!color) {
      alert("Selecciona un color.");
      return;
    }

    if (quantity < 1) {
      return;
    }

    if (product.stock <= 0) {
      alert(
        "Este producto está agotado."
      );

      return;
    }

    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) =>
            item.id === product.id &&
            item.color === color
        );

      // =================================
      // YA EXISTE EL PRODUCTO + COLOR
      // =================================

      if (existingProduct) {
        const newQuantity =
          existingProduct.quantity +
          quantity;

        if (
          newQuantity >
          product.stock
        ) {
          alert(
            `Solo hay ${product.stock} unidades disponibles.`
          );

          return currentCart;
        }

        return currentCart.map(
          (item) =>
            item.id === product.id &&
            item.color === color
              ? {
                  ...item,

                  // IMPORTANTE:
                  // conservamos la imagen
                  // del color seleccionado.
                  image: product.image,

                  quantity: newQuantity,
                }
              : item
        );
      }

      // =================================
      // NUEVO PRODUCTO
      // =================================

      if (
        quantity >
        product.stock
      ) {
        alert(
          `Solo hay ${product.stock} unidades disponibles.`
        );

        return currentCart;
      }

      const newItem: CartItem = {
        ...product,

        // La imagen que llega aquí ya es
        // la imagen correspondiente al color.
        image: product.image,

        color,

        quantity,
      };

      return [
        ...currentCart,
        newItem,
      ];
    });

    openCart();
  }

  // =====================================
  // ELIMINAR PRODUCTO
  // =====================================

  function removeFromCart(
    id: number,
    color: string
  ) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            item.id === id &&
            item.color === color
          )
      )
    );
  }

  // =====================================
  // AUMENTAR CANTIDAD
  // =====================================

  function increaseQuantity(
    id: number,
    color: string
  ) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id !== id ||
          item.color !== color
        ) {
          return item;
        }

        if (
          item.quantity >=
          item.stock
        ) {
          return item;
        }

        return {
          ...item,

          quantity:
            item.quantity + 1,
        };
      })
    );
  }

  // =====================================
  // DISMINUIR CANTIDAD
  // =====================================

  function decreaseQuantity(
    id: number,
    color: string
  ) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (
            item.id === id &&
            item.color === color
          ) {
            return {
              ...item,

              quantity:
                item.quantity - 1,
            };
          }

          return item;
        })
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  // =====================================
  // VACIAR CARRITO
  // =====================================

  function clearCart() {
    setCart([]);
  }

  // =====================================
  // TOTAL DE PRODUCTOS
  // =====================================

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  // =====================================
  // SUBTOTAL
  // =====================================

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );
  }, [cart]);

  // =====================================
  // PROVIDER
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
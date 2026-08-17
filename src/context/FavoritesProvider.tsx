"use client";

import {
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/product";

import { FavoritesContext } from "./FavoritesContext";

const STORAGE_KEY = "kickdistrict-favorites";

export default function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  const [loaded, setLoaded] = useState(false);

  /*
   * Cargar favoritos desde localStorage
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Error cargando favoritos:",
        error
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  /*
   * Guardar favoritos
   */
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        "Error guardando favoritos:",
        error
      );
    }
  }, [favorites, loaded]);

  /*
   * Comprobar si un producto es favorito
   */
  function isFavorite(id: number) {
    return favorites.some(
      (product) => product.id === id
    );
  }

  /*
   * Agregar / quitar favorito
   */
  function toggleFavorite(product: Product) {
    setFavorites((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== product.id
        );
      }

      return [...current, product];
    });
  }

  /*
   * Eliminar un favorito
   */
  function removeFavorite(id: number) {
    setFavorites((current) =>
      current.filter(
        (product) => product.id !== id
      )
    );
  }

  /*
   * Eliminar todos
   */
  function clearFavorites() {
    setFavorites([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
import { createContext } from "react";

import { Product } from "@/types/product";

type FavoritesContextType = {
  favorites: Product[];

  isFavorite: (id: number) => boolean;

  toggleFavorite: (product: Product) => void;

  removeFavorite: (id: number) => void;

  clearFavorites: () => void;
};

export const FavoritesContext =
  createContext<FavoritesContextType>({
    favorites: [],

    isFavorite: () => false,

    toggleFavorite: () => {},

    removeFavorite: () => {},

    clearFavorites: () => {},
  });
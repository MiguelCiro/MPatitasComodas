"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <div className="mt-10">

      <h3 className="mb-4 text-lg font-bold">
        Cantidad
      </h3>

      <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-300">

        <button
          onClick={onDecrease}
          className="flex h-14 w-14 items-center justify-center hover:bg-gray-100"
        >
          <Minus size={18} />
        </button>

        <span className="flex h-14 w-16 items-center justify-center border-x border-gray-300 text-lg font-bold">
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          className="flex h-14 w-14 items-center justify-center hover:bg-gray-100"
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  );
}
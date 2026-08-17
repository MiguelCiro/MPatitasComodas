"use client";

type Props = {
  sizes: number[];
  selectedSize: number | null;
  onSelect: (size: number) => void;
};

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: Props) {
  return (
    <div className="mt-10">

      <h3 className="mb-4 text-lg font-bold">
        Selecciona tu talla
      </h3>

      <div className="flex flex-wrap gap-4">

        {(sizes ?? []).map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`h-14 w-14 rounded-xl border-2 font-semibold transition ${
              selectedSize === size
                ? "border-black bg-black text-white"
                : "border-gray-300 hover:border-black"
            }`}
          >
            {size}
          </button>

        ))}

      </div>

    </div>
  );
}
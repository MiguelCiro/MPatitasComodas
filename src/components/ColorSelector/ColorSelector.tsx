"use client";

type Props = {
  colors: string[];
  selectedColor: string | null;
  onSelect: (color: string) => void;
};

export default function ColorSelector({
  colors,
  selectedColor,
  onSelect,
}: Props) {
  return (
    <div className="mt-10">

      <h3 className="mb-4 text-lg font-bold">
        Selecciona el color
      </h3>

      <div className="flex flex-wrap gap-3">

        {(colors ?? []).map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`rounded-xl border-2 px-5 py-3 font-semibold capitalize transition ${
              selectedColor === color
                ? "border-black bg-black text-white"
                : "border-gray-300 hover:border-black"
            }`}
          >
            {color}
          </button>
        ))}

      </div>

    </div>
  );
}
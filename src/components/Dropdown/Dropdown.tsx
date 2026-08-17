"use client";

import Link from "next/link";

type Props = {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
};

export default function Dropdown({
  title,
  items,
}: Props) {
  return (
    <div className="group relative">
      {/* TÍTULO */}
      <button
        type="button"
        className="py-8 font-semibold transition hover:text-red-600"
      >
        {title}
      </button>

      {/* DROPDOWN */}
      <div className="invisible absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 translate-y-2 rounded-2xl border border-gray-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-xl px-4 py-3 font-medium transition hover:bg-gray-100 hover:text-red-600"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const cards = [
  {
    title: "Ventas",
    value: "$12.450.000",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Pedidos",
    value: "42",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Productos",
    value: "28",
    icon: Package,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Clientes",
    value: "115",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function DashboardCards() {
  return (
    <>
      <div className="mb-10">

        <h1 className="text-4xl font-black">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Bienvenido nuevamente 👋
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}
              >

                <Icon size={28} />

              </div>

              <p className="text-gray-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {card.value}
              </h2>

            </div>

          );

        })}

      </div>
    </>
  );
}
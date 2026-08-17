import Container from "@/components/Container/Container";

const categories = [
  {
    title: "Hombre",
    subtitle: "Nike, Jordan, Adidas",
    emoji: "👟",
  },
  {
    title: "Mujer",
    subtitle: "Los últimos lanzamientos",
    emoji: "✨",
  },
  {
    title: "Ofertas",
    subtitle: "Hasta 40% OFF",
    emoji: "🏷️",
  },
  {
    title: "Nuevos",
    subtitle: "Colección 2026",
    emoji: "🔥",
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">

      <Container>

        <h2 className="text-5xl font-black text-center">
          Compra por categoría
        </h2>

        <p className="mt-4 text-center text-gray-500">
          Encuentra exactamente lo que estás buscando.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {categories.map((category) => (

            <div
              key={category.title}
              className="group cursor-pointer rounded-3xl border border-gray-200 bg-gray-50 p-10 transition duration-300 hover:-translate-y-2 hover:border-black hover:shadow-2xl"
            >

              <div className="text-6xl">
                {category.emoji}
              </div>

              <h3 className="mt-8 text-3xl font-bold">
                {category.title}
              </h3>

              <p className="mt-3 text-gray-500">
                {category.subtitle}
              </p>

            </div>

          ))}

        </div>

      </Container>
    </section>
  );
}
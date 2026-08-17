import Container from "@/components/Container/Container";

const brands = [
  "Nike",
  "Jordan",
  "Adidas",
  "New Balance",
  "Puma",
  "Converse",
  "Asics",
  "Reebok",
];

export default function Brands() {
  return (
    <section className="border-y border-gray-200 bg-white py-12">
      <Container>

        <h2 className="mb-10 text-center text-2xl font-bold">
          Trabajamos con las mejores marcas
        </h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">

          {brands.map((brand) => (
            <div
              key={brand}
              className="flex h-20 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-lg font-bold transition hover:-translate-y-1 hover:border-black hover:bg-white"
            >
              {brand}
            </div>
          ))}

        </div>

      </Container>
    </section>
  );
}
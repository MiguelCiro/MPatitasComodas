import Image from "next/image";
import Container from "@/components/Container/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-3xl" />

      <Container>

        <div className="grid items-center gap-16 py-20 lg:min-h-[85vh] lg:grid-cols-2">

          {/* Texto */}

          <div>

            <span className="text-sm font-semibold uppercase tracking-[4px] text-red-600">

              Premium Sneakers • Envíos a toda Colombia

            </span>

            <h1 className="mt-6 text-5xl font-black leading-none text-gray-900 sm:text-6xl xl:text-7xl">

              Sneakers que
              <br />
              marcan la
              <br />
              diferencia.

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-gray-600">

              Nike, Jordan, Adidas, New Balance y más.

              <br />

              Modelos seleccionados para quienes buscan
              comodidad, calidad y estilo.

            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <button
                className="rounded-2xl bg-black px-10 py-5 text-lg font-bold text-white transition hover:bg-red-600"
              >
                Explorar colección
              </button>

              <button
                className="rounded-2xl border border-gray-300 px-10 py-5 text-lg font-bold transition hover:border-red-600 hover:text-red-600"
              >
                Ver novedades
              </button>

            </div>

          </div>

          {/* Imagen */}

          <div className="relative flex justify-center">

            <Image
              src="/images/sneakers/hero-shoe.jpg"
              alt="Air Jordan"
              width={760}
              height={760}
              priority
              className="drop-shadow-[0_35px_45px_rgba(0,0,0,.25)] transition duration-700 hover:-translate-y-4 hover:scale-105"
            />

          </div>

        </div>

      </Container>

    </section>
  );
}
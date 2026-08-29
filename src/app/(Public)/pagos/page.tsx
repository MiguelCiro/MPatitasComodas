import {
  Banknote,
  CheckCircle2,
  CreditCard,
  PackageCheck,
} from "lucide-react";

export default function PagosPage() {
  return (
    <main className="bg-gray-50">

      {/* HERO */}

      <section className="bg-black px-6 py-20 text-white sm:py-24">

        <div className="mx-auto max-w-5xl text-center">

          <p className="font-bold uppercase tracking-[0.2em] text-red-500">
            MPatitas Cómodas
          </p>

          <h1 className="mt-5 text-4xl font-black sm:text-6xl">
            Métodos de pago
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Elige la opción que sea más cómoda
            para realizar tu pedido.
          </p>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">

        <div className="grid gap-8 lg:grid-cols-2">

          {/* TRANSFERENCIA */}

          <article className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

              <CreditCard size={28} />

            </div>

            <h2 className="mt-6 text-3xl font-black">
              Transferencia
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Puedes seleccionar transferencia
              como método de pago al finalizar
              tu pedido.
            </p>

            <div className="mt-7 space-y-4">

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Realiza tu pedido desde nuestra
                  página web.
                </p>

              </div>

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Nuestro equipo confirmará la
                  disponibilidad de los productos.
                </p>

              </div>

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Te proporcionaremos la información
                  necesaria para realizar el pago.
                </p>

              </div>

            </div>

          </article>

          {/* CONTRAENTREGA */}

          <article className="rounded-3xl bg-white p-7 shadow-sm sm:p-10">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">

              <Banknote size={28} />

            </div>

            <h2 className="mt-6 text-3xl font-black">
              Pago contraentrega
            </h2>

            <p className="mt-4 leading-8 text-gray-600">
              Realiza tu pedido y paga al momento
              de recibirlo, de acuerdo con la
              disponibilidad y cobertura del envío.
            </p>

            <div className="mt-7 space-y-4">

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Realiza tu pedido seleccionando
                  pago contraentrega.
                </p>

              </div>

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Confirmaremos la disponibilidad
                  y los datos de entrega.
                </p>

              </div>

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-gray-600">
                  Paga cuando recibas tu pedido,
                  según las condiciones acordadas.
                </p>

              </div>

            </div>

          </article>

        </div>

        {/* AVISO */}

        <div className="mt-10 flex gap-4 rounded-3xl bg-black p-7 text-white sm:p-8">

          <PackageCheck
            size={30}
            className="shrink-0 text-red-500"
          />

          <div>

            <h2 className="text-xl font-black">
              Confirmación del pedido
            </h2>

            <p className="mt-2 leading-7 text-gray-400">
              Todos los pedidos realizados en
              MPatitas Cómodas están sujetos a la
              confirmación de disponibilidad de los
              productos y a la validación de la
              información proporcionada por el
              cliente.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}
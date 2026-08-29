import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

type Props = {
  searchParams: Promise<{
    id?: string;
    payment?: string;
  }>;
};

export default async function SuccessPage({
  searchParams,
}: Props) {
  const {
    id,
    payment,
  } = await searchParams;

  const isTransfer =
    payment === "transfer";

  const isCashOnDelivery =
    payment === "cash_on_delivery";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-5 sm:p-8">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

          <CheckCircle2
            size={50}
            className="text-green-600"
          />

        </div>

        <h1 className="mt-8 text-3xl font-black sm:text-5xl">
          ¡Pedido realizado!
        </h1>

        <p className="mt-4 text-lg leading-7 text-gray-500">
          Hemos recibido correctamente tu
          solicitud de pedido.
        </p>

        {id && (

          <div className="mt-8 rounded-2xl bg-gray-100 p-6">

            <p className="text-sm text-gray-500">
              Número de pedido
            </p>

            <p className="mt-2 text-3xl font-black">
              #{id}
            </p>

          </div>

        )}

        {isTransfer && (

          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-left">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">

                <CreditCard size={22} />

              </div>

              <div>

                <h2 className="font-black">
                  Pago por transferencia
                </h2>

                <p className="text-sm text-gray-500">
                  Método seleccionado
                </p>

              </div>

            </div>

            <p className="mt-5 leading-7 text-gray-600">
              Nos comunicaremos contigo para
              confirmar tu pedido y proporcionarte
              la información necesaria para realizar
              la transferencia.
            </p>

          </div>

        )}

        {isCashOnDelivery && (

          <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-left">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">

                <Banknote size={22} />

              </div>

              <div>

                <h2 className="font-black">
                  Pago contraentrega
                </h2>

                <p className="text-sm text-gray-500">
                  Método seleccionado
                </p>

              </div>

            </div>

            <p className="mt-5 leading-7 text-gray-600">
              Nos comunicaremos contigo para
              confirmar la disponibilidad y coordinar
              la entrega de tu pedido.
            </p>

          </div>

        )}

        <p className="mt-8 leading-7 text-gray-600">
          Recuerda que todos los pedidos están
          sujetos a confirmación de disponibilidad.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-black px-8 py-4 font-bold text-white transition hover:bg-red-600"
        >

          <ArrowLeft size={20} />

          Volver al inicio

        </Link>

      </div>

    </main>
  );
}
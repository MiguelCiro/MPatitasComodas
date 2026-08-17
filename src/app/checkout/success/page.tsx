import Link from "next/link";

type Props = {
  searchParams: {
    id?: string;
  };
};

export default function SuccessPage({
  searchParams,
}: Props) {

  return (

    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

          <span className="text-5xl">

            ✅

          </span>

        </div>

        <h1 className="mt-8 text-4xl font-black">

          ¡Pedido realizado!

        </h1>

        <p className="mt-4 text-gray-500">

          Hemos recibido tu pedido correctamente.

        </p>

        {searchParams.id && (

          <div className="mt-8 rounded-2xl bg-gray-100 p-6">

            <p className="text-sm text-gray-500">

              Número de pedido

            </p>

            <p className="mt-2 text-3xl font-black">

              #{searchParams.id}

            </p>

          </div>

        )}

        <p className="mt-8 leading-7 text-gray-600">

          Muy pronto nos comunicaremos contigo para confirmar
          la disponibilidad de los productos y continuar con el
          proceso de compra.

        </p>

        <Link
          href="/"
          className="mt-10 inline-flex rounded-2xl bg-black px-10 py-4 font-bold text-white transition hover:bg-red-600"
        >

          Volver al inicio

        </Link>

      </div>

    </main>

  );

}
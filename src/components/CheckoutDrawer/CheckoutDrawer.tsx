"use client";

import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CheckoutDrawer({
  open,
  onClose,
}: Props) {

  const router = useRouter();

  function handleCheckout() {

    onClose();

    router.push("/checkout");

  }

  return (

    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 transition ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Drawer */}

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-md flex-col bg-white transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">

          <h2 className="text-4xl font-black">

            Finalizar compra

          </h2>

          <p className="mt-5 text-gray-500 leading-7">

            Hemos preparado una nueva experiencia
            de compra mucho más cómoda.

            <br />
            <br />

            Al continuar accederás al checkout
            donde podrás revisar tu pedido,
            ingresar tu información y realizar
            el pago de forma segura.

          </p>

        </div>

        <div className="border-t p-6">

          <button
            onClick={handleCheckout}
            className="w-full rounded-xl bg-black py-4 text-lg font-bold text-white transition hover:bg-red-600"
          >

            Ir al Checkout

          </button>

          <button
            onClick={onClose}
            className="mt-3 w-full rounded-xl border border-gray-300 py-4 font-semibold transition hover:bg-gray-100"
          >

            Seguir comprando

          </button>

        </div>

      </aside>

    </>

  );

}
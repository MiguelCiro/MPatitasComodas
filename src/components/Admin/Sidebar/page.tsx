import Sidebar from "@/components/Admin/Sidebar/Sidebar";
import DashboardCards from "@/components/Admin/Dashboard/DashboardCards";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      <div className="flex">

        {/* Sidebar */}

        <Sidebar />

        {/* Contenido */}

        <section className="flex-1 p-10">

          <DashboardCards />

          {/* Pedidos recientes */}

          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-black">

                  Pedidos recientes

                </h2>

                <p className="mt-1 text-gray-500">

                  Últimas compras realizadas.

                </p>

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b text-left text-gray-500">

                    <th className="pb-4">
                      Cliente
                    </th>

                    <th className="pb-4">
                      Producto
                    </th>

                    <th className="pb-4">
                      Estado
                    </th>

                    <th className="pb-4">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="border-b">

                    <td className="py-5">
                      Miguel Ciro
                    </td>

                    <td>
                      Adidas Samba
                    </td>

                    <td>

                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                        Pendiente

                      </span>

                    </td>

                    <td>

                      $349.900

                    </td>

                  </tr>

                  <tr className="border-b">

                    <td className="py-5">
                      Juan Pérez
                    </td>

                    <td>
                      Nike Dunk
                    </td>

                    <td>

                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                        Pagado

                      </span>

                    </td>

                    <td>

                      $599.900

                    </td>

                  </tr>

                  <tr>

                    <td className="py-5">
                      Laura Gómez
                    </td>

                    <td>
                      Jordan 1 Low
                    </td>

                    <td>

                      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">

                        Enviado

                      </span>

                    </td>

                    <td>

                      $799.900

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
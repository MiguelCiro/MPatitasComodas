"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
    Eye,
    Search,
} from "lucide-react";

import { getOrders } from "@/services/order.service";

export default function OrdersPage() {

    const [orders, setOrders] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    useEffect(() => {

        async function loadOrders() {

            const data = await getOrders();

            setOrders(data);

        }

        loadOrders();

    }, []);

    const filteredOrders = orders.filter((order) =>

        order.customer_name
            .toLowerCase()
            .includes(search.toLowerCase())

        ||

        order.city
            .toLowerCase()
            .includes(search.toLowerCase())

        ||

        String(order.id).includes(search)

    );

    return (

        <>

            {/* =============================== */}
            {/* ENCABEZADO */}
            {/* =============================== */}

            <div className="mb-10 flex items-center justify-between">

                <div>

                    <h1 className="text-5xl font-black">

                        Pedidos

                    </h1>

                    <p className="mt-2 text-gray-500">

                        Gestiona todos los pedidos de la tienda.

                    </p>

                </div>

            </div>


            {/* =============================== */}
            {/* BUSCADOR */}
            {/* =============================== */}

            <div className="relative mb-8">

                <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Buscar por cliente, ciudad o pedido..."
                    className="w-full rounded-2xl border bg-white py-4 pl-12 pr-4 outline-none focus:border-black"
                />

            </div>


            {/* =============================== */}
            {/* TABLA */}
            {/* =============================== */}

            <div className="rounded-3xl bg-white shadow-sm">

                {/* 
                    Este contenedor permite desplazamiento
                    horizontal en dispositivos pequeños.
                */}

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead>

                            <tr className="border-b bg-gray-50 text-left text-sm uppercase tracking-wide text-gray-500">

                                <th className="px-6 py-5">

                                    Pedido

                                </th>

                                <th className="px-6 py-5">

                                    Cliente

                                </th>

                                <th className="px-6 py-5">

                                    Ciudad

                                </th>

                                <th className="px-6 py-5">

                                    Total

                                </th>

                                <th className="px-6 py-5">

                                    Estado

                                </th>

                                <th className="px-6 py-5 text-center">

                                    Acción

                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredOrders.map((order) => (

                                <tr
                                    key={order.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="px-6 py-5 font-bold">

                                        #{order.id}

                                    </td>


                                    <td className="px-6 py-5">

                                        {order.customer_name}

                                    </td>


                                    <td className="px-6 py-5">

                                        {order.city}

                                    </td>


                                    <td className="px-6 py-5 font-semibold">

                                        $
                                        {Number(order.total).toLocaleString(
                                            "es-CO"
                                        )}

                                    </td>


                                    <td className="px-6 py-5">

                                        <span className="whitespace-nowrap rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">

                                            {order.status}

                                        </span>

                                    </td>


                                    <td className="px-6 py-5 text-center">

                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-flex rounded-xl bg-black p-3 text-white transition hover:bg-red-600"
                                            title="Ver pedido"
                                        >

                                            <Eye size={18} />

                                        </Link>

                                    </td>

                                </tr>

                            ))}


                            {filteredOrders.length === 0 && (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="px-6 py-10 text-center text-gray-500"
                                    >

                                        No se encontraron pedidos.

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}
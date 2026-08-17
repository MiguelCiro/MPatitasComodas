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

            {/* Buscador */}

            <div className="mb-8 relative">

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

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                <table className="w-full">

                    <thead>

                        <tr className="border-b bg-gray-50 text-left text-sm uppercase tracking-wide text-gray-500">

                            <th className="px-6 py-5">

                                Pedido

                            </th>

                            <th>

                                Cliente

                            </th>

                            <th>

                                Ciudad

                            </th>

                            <th>

                                Total

                            </th>

                            <th>

                                Estado

                            </th>

                            <th className="text-center">

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

                                <td>

                                    {order.customer_name}

                                </td>

                                <td>

                                    {order.city}

                                </td>

                                <td className="font-semibold">

                                    ${Number(order.total).toLocaleString("es-CO")}

                                </td>

                                <td>

                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">

                                        {order.status}

                                    </span>

                                </td>

                                <td className="text-center">

                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="inline-flex rounded-xl bg-black p-3 text-white transition hover:bg-red-600"
                                    >

                                        <Eye size={18} />

                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </>

    );

}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Lock, Mail } from "lucide-react";

import { auth } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await auth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error de login:", error);

      setError("Correo o contraseña incorrectos.");
      setLoading(false);

      return;
    }

    // Login correcto
    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black">
            Mpatitas Comodas
          </h1>

          <p className="mt-2 text-gray-500">
            Panel Administrativo
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6"
        >

          {/* CORREO */}
          <div>
            <label className="mb-2 block font-semibold">
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@email.com"
                required
                className="w-full rounded-2xl border border-gray-300 py-4 pl-12 pr-4 outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="mb-2 block font-semibold">
              Contraseña
            </label>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full rounded-2xl border border-gray-300 py-4 pl-12 pr-4 outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-4 text-lg font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

        </form>
      </div>
    </main>
  );
}
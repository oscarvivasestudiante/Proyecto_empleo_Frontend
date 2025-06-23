"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    // phone eliminado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validación simple en frontend
    if (!form.fullName || !form.email || !form.password) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "No se pudo registrar el usuario");
        setLoading(false);
        return;
      }

      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError("Error al registrar. Intenta con otro correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      {/* Logo y título */}
      <div className="flex flex-col items-center mb-8">
        <span className="text-4xl font-extrabold text-blue-700 drop-shadow mb-2">
          Empleos<span className="text-blue-400">NG</span>
        </span>
        <h2 className="text-2xl font-bold text-blue-700">Crea tu cuenta</h2>
        <p className="text-gray-500 mt-1 text-center max-w-xs">
          Regístrate para encontrar y postularte a los mejores empleos.
        </p>
      </div>
      {/* Card de registro */}
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 border border-blue-100">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Nombre</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50 placeholder:text-blue-300"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50 placeholder:text-blue-300"
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-50 placeholder:text-blue-300"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
          {success && <div className="text-green-600 text-center font-semibold">{success}</div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-semibold">
              Inicia sesión
            </a>
          </span>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-10 text-gray-400 text-xs text-center">
        © {new Date().getFullYear()} EmpleosNG. Todos los derechos reservados.
      </footer>
    </main>
  );
}
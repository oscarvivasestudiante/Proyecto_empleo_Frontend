"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      console.log("Respuesta completa:", data);

      // Extraer roles del token JWT
      const token = data.token;
      let roles: string[] = [];

      if (token) {
        localStorage.setItem("token", token); // <-- Guarda el token aquí
        const decoded: any = jwtDecode(token);
        // Ajusta esto según cómo guardes los roles en el payload del JWT
        if (typeof decoded.roles === "string") {
          roles = decoded.roles
            .replace(/[{}"]/g, "")
            .split(",")
            .map((r: string) => r.trim())
            .filter((r: string) => r.length > 0);
        } else if (Array.isArray(decoded.roles)) {
          roles = decoded.roles;
        }
      }

      console.log("Roles extraídos del token:", roles);

      if (roles.includes("empleador")) {
        router.push("/dashboard");
      } else if (roles.includes("empleado")) {
        router.push("/home");
      } else {
        setError("Rol de usuario no válido");
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos");
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
        <h2 className="text-2xl font-bold text-blue-700">Bienvenido de nuevo</h2>
        <p className="text-gray-500 mt-1 text-center max-w-xs">
          Ingresa tus credenciales para acceder a tu cuenta y encontrar el trabajo ideal.
        </p>
      </div>
      {/* Card de login */}
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-10 border border-blue-100">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
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
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
          {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:underline font-semibold bg-transparent border-none cursor-pointer"
            >
              Regístrate
            </button>
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
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, LogOut, MailOpen } from "lucide-react";

export default function EmployerDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center px-4">
      {/* Header */}
      <nav className="w-full flex justify-between items-center py-5 px-4 md:px-10 bg-white/90 shadow-md fixed top-0 left-0 z-20 backdrop-blur border-b border-blue-100">
        <span className="text-3xl font-extrabold text-blue-700 drop-shadow-sm">
          Empleos<span className="text-blue-500">NG</span>
        </span>
        <div className="flex gap-4 items-center">
          <a
            href="/jobs"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
          >
            Publicar Vacante
          </a>
          <a
            href="/aplicaciones"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
          >
            Postulaciones
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Bienvenida */}
      <section className="w-full max-w-4xl text-center mt-32 mb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          ¡Bienvenido, Empleador!
        </h1>
        <p className="text-lg text-gray-600 md:text-xl">
          Administra tus vacantes y revisa las postulaciones fácilmente.
        </p>
      </section>

      {/* Acciones rápidas */}
      <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 px-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-xl transition">
          <Briefcase size={40} className="text-blue-600 mb-3" />
          <h2 className="text-xl font-bold text-blue-700 mb-2">Publicar Vacante</h2>
          <p className="text-gray-500 text-center mb-4 text-sm">
            Crea nuevas oportunidades laborales y alcanza a más talentos.
          </p>
          <a
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
          >
            Crear vacante
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 hover:shadow-xl transition">
          <MailOpen size={40} className="text-blue-600 mb-3" />
          <h2 className="text-xl font-bold text-blue-700 mb-2">Postulaciones</h2>
          <p className="text-gray-500 text-center mb-4 text-sm">
            Consulta quiénes han aplicado a tus ofertas activas.
          </p>
          <a
            href="/aplicaciones"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition"
          >
            Ver postulaciones
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto mb-6 text-gray-400 text-xs">
        © {new Date().getFullYear()} EmpleosNG. Todos los derechos reservados.
      </footer>
    </main>
  );
}

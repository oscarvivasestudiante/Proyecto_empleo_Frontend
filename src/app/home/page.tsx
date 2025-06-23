"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Job {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function Home() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:4000/jobs");
        if (!res.ok) throw new Error("Error al cargar trabajos");
        const data = await res.json();
        // Obtener los últimos 3 trabajos (del final del array)
        const lastThree = data.slice(-3).reverse();
        setJobs(lastThree);
      } catch (error) {
        console.error(error);
      }
    }

    fetchJobs();
  }, []);

  useEffect(() => {
    function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      } else {
        setUser({ id: 1, name: "Usuario", email: "user@example.com" });
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600">Verificando sesión...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-4">
      {/* Navbar/Header */}
      <nav className="w-full flex justify-between items-center py-6 px-2 md:px-8 bg-white/80 shadow-md fixed top-0 left-0 z-20 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-blue-700 drop-shadow">
            Empleos<span className="text-blue-400">NG</span>
          </span>
        </div>
        <div className="flex gap-4">
          <a
            href="/list_jobs"
            className="text-blue-700 font-medium hover:text-blue-900 transition"
          >
            Empleos
          </a>

          {user ? (
            <button
              onClick={() => router.push("/perfil")}
              className="ml-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
            >
              PERFIL
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full max-w-4xl flex flex-col items-center mt-32 mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-4 drop-shadow-lg text-center">
          Encuentra el trabajo de tus sueños en{" "}
          <span className="text-blue-400">EmpleosNG</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl">
          Somos la plataforma líder para conectar talento con oportunidades
          laborales en tu región. ¡Da el siguiente paso en tu carrera
          profesional!
        </p>
      </header>

      {/* Search Bar */}
      <section className="w-full max-w-2xl flex flex-col items-center mb-10">
        <form className="w-full flex gap-2 shadow-lg rounded-lg bg-white/90 p-2">
          <input
            type="text"
            placeholder="¿Qué empleo buscas?"
            className="flex-1 px-4 py-3 rounded-l-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-semibold transition"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* Últimos 3 trabajos */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            No hay trabajos disponibles.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-blue-50 hover:shadow-2xl transition"
            >
              {job.imageUrl && (
                <img
                  src={`http://localhost:4000${job.imageUrl}`}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}
              <h2 className="text-xl font-bold text-blue-700">{job.title}</h2>
              <p className="text-gray-700 mt-2 line-clamp-3">
                {job.description || "Sin descripción"}
              </p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                onClick={() => router.push(`/job_details?id=${job.id}`)}
              >
                Ver más
              </button>
            </div>
          ))
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 text-gray-400 text-sm">
        © {new Date().getFullYear()} EmpleosNG. Todos los derechos reservados.
      </footer>
    </main>
  );
}

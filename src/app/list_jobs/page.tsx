"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function EmpleosPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:4000/jobs");
        if (!res.ok) throw new Error("Error al cargar empleos");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError("No se pudieron cargar los empleos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();

    // Verifica si hay usuario logueado
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.id) {
        setUser({
          id: decoded.id,
          name: decoded.name || "Usuario",
          email: decoded.email || "no-email@example.com",
        });
      }
    }
  }, []);

  if (loading) return <p className="p-6 text-center">Cargando empleos...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (jobs.length === 0) return <p className="p-6 text-center">No hay empleos disponibles.</p>;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-10">
        <h1
          className="text-2xl font-bold text-blue-700 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Empleos<span className="text-blue-400">NG</span>
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-700 font-medium transition"
          >
            Volver al Home
          </button>
          {user && (
            <button
              onClick={() => router.push("/perfil")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm transition"
            >
              PERFIL
            </button>
          )}
        </div>
      </nav>

      {/* Espacio para evitar que el contenido se oculte tras el nav fijo */}
      <div className="h-20" />

      {/* Empleos */}
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Empleos disponibles</h2>

      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col"
          >
            {job.imageUrl && (
              <img
                src={`http://localhost:4000${job.imageUrl}`}
                alt={job.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-blue-800 mb-2">{job.title}</h3>
            <p className="text-gray-700 flex-grow line-clamp-4">
              {job.description || "Sin descripción disponible"}
            </p>
            <button
              onClick={() => router.push(`/job_details?id=${job.id}`)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 transition"
            >
              Ver más
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

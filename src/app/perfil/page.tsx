"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Aplicacion {
  id: number;
  createdAt?: string;
  status: "pending" | "approved" | "rejected";
  job: {
    id: number;
    title: string;
  };
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function PerfilUsuarioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de autenticación.");
      setUser(null);
      setLoadingApps(false);
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded) {
      setError("Token inválido.");
      setUser(null);
      setLoadingApps(false);
      return;
    }

    const userFromToken: User = {
      id: decoded.id,
      name: decoded.name || "Usuario",
      email: decoded.email || "no-email@example.com",
    };
    setUser(userFromToken);
  }, []);

  useEffect(() => {
    async function fetchAplicaciones() {
      if (!user) {
        setLoadingApps(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/aplicaciones/usuario/${user.id}`);
        if (!res.ok) throw new Error("Error al cargar aplicaciones");
        const data = await res.json();
        setAplicaciones(data);
      } catch (err) {
        setError("No se pudieron cargar las aplicaciones.");
        console.error(err);
      } finally {
        setLoadingApps(false);
      }
    }

    fetchAplicaciones();
  }, [user]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function goHome() {
    router.push("/");
  }

  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!user) return <p className="p-4">No se encontró información del usuario.</p>;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md backdrop-blur z-30">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-blue-700">Perfil de Usuario</h1>
          <div className="flex gap-3">
            <button
              onClick={goHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
              aria-label="Ir al inicio"
            >
              Inicio
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded font-semibold transition"
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-28 p-6 bg-gray-50">
        <section className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md flex flex-col items-center gap-4">
          {/* Icono de perfil SVG */}
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center shadow-lg border-4 border-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A7.966 7.966 0 0112 15a7.966 7.966 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.071 19.071a9 9 0 10-14.142 0"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-blue-700">{user.name}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
        </section>

        <section className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-10">
          <h3 className="text-3xl font-semibold mb-6 border-b border-gray-200 pb-2">Tus Aplicaciones</h3>

          {loadingApps ? (
            <p className="text-center text-gray-500">Cargando aplicaciones...</p>
          ) : aplicaciones.length === 0 ? (
            <p className="text-center text-gray-500">No tienes aplicaciones registradas.</p>
          ) : (
            <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold uppercase tracking-wide">Trabajo</th>
                  <th className="py-3 px-6 text-left font-semibold uppercase tracking-wide">Estado</th>
                  <th className="py-3 px-6 text-left font-semibold uppercase tracking-wide">Fecha de publicación</th>
                </tr>
              </thead>
              <tbody>
                {aplicaciones.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b last:border-none hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="py-4 px-6 text-gray-800 font-medium">{app.job.title}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "approved"
                            ? "bg-green-200 text-green-800"
                            : app.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
}

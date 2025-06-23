"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // <-- Importamos useRouter

interface Aplicacion {
  id: number;
  createdAt?: string;
  status: "pending" | "approved" | "rejected";
  job: {
    id: number;
    title: string;
  };
  worker: {
    id: number;
    name: string;
    email?: string;
  };
}

export default function AplicacionesPage() {
  const [aplicaciones, setAplicaciones] = useState<Aplicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();  // <-- Inicializamos router

  useEffect(() => {
    async function fetchAplicaciones() {
      try {
        const res = await fetch("http://localhost:4000/aplicaciones");
        if (!res.ok) throw new Error("Error al cargar las aplicaciones");
        const data = await res.json();
        setAplicaciones(data);
      } catch (err) {
        setError("No se pudieron cargar las aplicaciones.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAplicaciones();
  }, []);

  async function cambiarEstado(
    id: number,
    nuevoEstado: "approved" | "rejected" | "pending"
  ) {
    try {
      const res = await fetch(`http://localhost:4000/aplicaciones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar el estado");

      const updatedApp: Aplicacion = await res.json();

      setAplicaciones((prev) =>
        prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado.");
    }
  }

  function EstadoBadge({ status }: { status: Aplicacion["status"] }) {
    const base =
      "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ";
    switch (status) {
      case "approved":
        return <span className={base + "bg-green-100 text-green-800"}>Aprobado</span>;
      case "pending":
        return <span className={base + "bg-yellow-100 text-yellow-800"}>Pendiente</span>;
      case "rejected":
        return <span className={base + "bg-red-100 text-red-800"}>Rechazado</span>;
      default:
        return <span className={base + "bg-gray-100 text-gray-600"}>{status}</span>;
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        
        {/* Botón para ir al dashboard */}
        <button
          onClick={() => router.push("/dashboard")}  // Cambia la ruta si es otra
          className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Ir al Dashboard
        </button>

        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 drop-shadow-md">
          Aplicaciones de Usuarios
        </h1>

        {loading && <p className="text-blue-600 font-semibold">Cargando...</p>}
        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {!loading && aplicaciones.length === 0 && (
          <p className="text-gray-500 italic">No hay aplicaciones registradas.</p>
        )}

        {!loading && aplicaciones.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-blue-200 shadow-sm">
            <table className="min-w-full text-sm text-left table-auto border-collapse">
              <thead className="bg-blue-100 text-blue-900 select-none">
                <tr>
                  <th className="py-3 px-6 border-b border-blue-300">#</th>
                  <th className="py-3 px-6 border-b border-blue-300">Trabajo</th>
                  <th className="py-3 px-6 border-b border-blue-300">Usuario</th>
                  <th className="py-3 px-6 border-b border-blue-300">Correo</th>
                  <th className="py-3 px-6 border-b border-blue-300">Fecha Aplicación</th>
                  <th className="py-3 px-6 border-b border-blue-300">Estado</th>
                  <th className="py-3 px-6 border-b border-blue-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aplicaciones.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <td className="py-3 px-6 border-b border-blue-200 font-medium">{i + 1}</td>
                    <td className="py-3 px-6 border-b border-blue-200">
                      {a.job?.title || `Trabajo #${a.job?.id}`}
                    </td>
                    <td className="py-3 px-6 border-b border-blue-200">
                      {a.worker?.name || `Usuario #${a.worker?.id}`}
                    </td>
                    <td className="py-3 px-6 border-b border-blue-200 text-gray-600 truncate max-w-xs">
                      {a.worker?.email || "—"}
                    </td>
                    <td className="py-3 px-6 border-b border-blue-200 whitespace-nowrap">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-6 border-b border-blue-200">
                      <EstadoBadge status={a.status} />
                    </td>
                    <td className="py-3 px-6 border-b border-blue-200 space-x-3">
                      <button
                        onClick={() => cambiarEstado(a.id, "approved")}
                        disabled={a.status === "approved"}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold px-4 py-1 rounded-lg shadow-md transition"
                        title="Aprobar aplicación"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => cambiarEstado(a.id, "rejected")}
                        disabled={a.status === "rejected"}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold px-4 py-1 rounded-lg shadow-md transition"
                        title="Rechazar aplicación"
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
// Este código es una página de Next.js que muestra una lista de aplicaciones de usuarios a trabajos.
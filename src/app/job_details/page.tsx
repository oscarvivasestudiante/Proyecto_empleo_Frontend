"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, Home, UserCircle } from "lucide-react";

interface JwtPayload {
  id?: number;
  roles?: string[];
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export default function JobDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("id");

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [workerId, setWorkerId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = decodeJwtPayload(token || "");
    if (decoded?.id) {
      setWorkerId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (!jobId) return;

    async function fetchJob() {
      try {
        const res = await fetch(`http://localhost:4000/jobs/${jobId}`);
        const data = await res.json();
        setJob(data);
      } catch {
        setMessage("No se pudo cargar el trabajo.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    if (!jobId || !workerId) return;

    async function checkIfApplied() {
      try {
        const res = await fetch(`http://localhost:4000/aplicaciones/check?jobId=${jobId}&workerId=${workerId}`);
        const data = await res.json();
        if (res.ok && data.aplicado) {
          setHasApplied(true);
          setMessage("Ya aplicaste a este trabajo.");
        }
      } catch {
        console.error("Error verificando si ya aplicó.");
      }
    }

    checkIfApplied();
  }, [jobId, workerId]);

  async function handleApply() {
    if (hasApplied) {
      setMessage("Ya aplicaste a este trabajo.");
      return;
    }

    setApplying(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:4000/aplicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: Number(jobId), workerId }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("¡Aplicaste con éxito! Redirigiendo al perfil...");
        setTimeout(() => router.push("/perfil"), 1500);
      } else {
        setMessage(result.message || "Error al aplicar.");
      }
    } catch {
      setMessage("Error al aplicar.");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-white">
        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-500 font-medium">Trabajo no disponible.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 relative px-4 pt-24 pb-16 flex justify-center items-start overflow-hidden">
      {/* Header elegante */}
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-800">Detalles del Trabajo</h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <Home className="w-5 h-5" /> Inicio
          </button>
          <button
            onClick={() => router.push("/perfil")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
          >
            <UserCircle className="w-5 h-5" /> Perfil
          </button>
        </div>
      </header>

      {/* Fondo con decoración sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_50%)] opacity-40 z-0" />

      {/* Tarjeta */}
      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-lg border border-blue-100 rounded-2xl shadow-xl p-6">
        {job.imageUrl && (
          <img
            src={`http://localhost:4000${job.imageUrl}`}
            alt={job.title}
            className="w-full h-48 object-cover rounded-xl mb-4 shadow"
          />
        )}
        <h1 className="text-2xl font-bold text-blue-800 mb-2">{job.title}</h1>
        <p className="text-gray-700 text-sm mb-4 whitespace-pre-line">{job.description || "Este empleo no tiene una descripción detallada."}</p>
        <p className="text-xs text-gray-500 mb-6">
          Publicado el{" "}
          {new Date(job.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <button
          onClick={handleApply}
          disabled={applying || hasApplied}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium py-3 rounded-lg shadow-md transition disabled:opacity-50"
        >
          {applying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Aplicando...
            </>
          ) : hasApplied ? (
            "Ya aplicaste"
          ) : (
            <>
              <CheckCircle className="w-4 h-4" /> Aplicar
            </>
          )}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("éxito") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}

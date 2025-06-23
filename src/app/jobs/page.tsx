"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Upload, Briefcase, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    employerId: "",
    title: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setForm((prev) => ({
          ...prev,
          employerId: decoded.id ? String(decoded.id) : "",
        }));
      } catch (e) {
        setError("Token inválido");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("employerId", form.employerId);
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear el trabajo");
      setSuccess("✅ Trabajo creado exitosamente");
      setForm({ employerId: form.employerId, title: "", description: "" });
      setImage(null);

      router.push("/dashboard");
    } catch (err) {
      setError("❌ No se pudo crear el trabajo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 flex items-center gap-2">
            <Briefcase size={30} /> Publicar Trabajo
          </h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Dashboard
          </button>
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <input type="hidden" name="employerId" value={form.employerId} />

          <div>
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <FileText size={16} />
              Título del trabajo
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Ej: Desarrollador Frontend"
              className="w-full mt-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe las responsabilidades, requisitos, beneficios, etc."
              className="w-full mt-1 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Upload size={16} />
              Imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
          >
            {loading ? "Publicando..." : "Publicar trabajo"}
          </button>

          {success && (
            <div className="text-green-600 text-center font-medium mt-2 animate-pulse">
              {success}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center font-medium mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
